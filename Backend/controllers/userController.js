/**
 * User controller module.
 *
 * Handles user authentication, charging station lookup, booking creation,
 * booking retrieval, cancellation, and scheduled booking completion logic.
 */
const User = require('../models/UserSchema');
const ChargingStation = require('../models/ChargeStation');
const Booking = require('../models/BookingSchema');
const { signToken } = require('../helper/jwtSign.js');

/**
 * Authenticate a user and return a JWT token.
 *
 * @route POST /api/user/login
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const ulogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid password.' });

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Register a new user account and return authentication details.
 *
 * @route POST /api/user/signup
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const usignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: 'Account already exists with this email.' });

    const user = await User.create({ name, email, password });
    const token = signToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Fetch all available charging stations.
 *
 * @route GET /api/user/chargestations
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getChargestations = async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.status(200).json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve booked time slots for a station on a given date.
 *
 * @route GET /api/user/slots/:stationId
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getBookedSlots = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { date } = req.query;

    if (!date)
      return res.status(400).json({ message: 'Date query param is required.' });

    const bookings = await Booking.find({
      stationId,
      date,
      status: { $ne: 'cancelled' }
    }).select('time -_id');

    const bookedTimes = bookings.map((b) => b.time);
    res.json({ bookedSlots: bookedTimes });
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Create a booking for the authenticated user.
 *
 * @route POST /api/user/booking
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const userBooking = async (req, res) => {
  try {
    const { stationId, stationName, phno, date, time, address } = req.body;

    // req.user is set by auth middleware
    const userId = req.user.id;
    const userName = req.user.name;
    const email = req.user.email;

    if (!stationId || !date || !time || !phno)
      return res.status(400).json({ message: 'stationId, date, time and phno are required.' });

    // Ensure the slot is still available
    const conflict = await Booking.findOne({
      stationId,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (conflict)
      return res.status(409).json({ message: 'This slot is already booked. Please choose another time.' });

    const newBooking = await Booking.create({
      userId,
      userName,
      email,
      phno,
      stationId,
      stationName,
      date,
      time,
      address,
      status: 'upcoming'
    });

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — race condition guard
      return res.status(409).json({ message: 'This slot was just taken. Please choose another time.' });
    }
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve all bookings for admin-style access.
 *
 * @route GET /api/user/bookings
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const bookings = async (req, res) => {
  try {
    const data = await Booking.find()
      .populate('stationId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve the authenticated user's own bookings.
 * Also auto-completes any past upcoming bookings before returning results.
 *
 * @route GET /api/user/mybookings
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const myBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Auto-complete any past upcoming bookings first
    await autoCompletePastBookings(userId);
    
    const data = await Booking.find({ userId })
      .populate('stationId', 'name address_components phone_number')
      .sort({ date: -1, time: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Cancel a booking owned by the authenticated user.
 *
 * @route PATCH /api/user/booking/:id/cancel
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ message: 'Booking not found.' });

    // Only the owner can cancel
    if (booking.userId.toString() !== userId)
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });

    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Booking is already cancelled.' });

    if (booking.status === 'completed')
      return res.status(400).json({ message: 'Cannot cancel a completed booking.' });

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Mark past upcoming bookings as completed for a specific user.
 *
 * @param {string} userId - The ID of the user whose bookings should be updated.
 * @returns {Promise<void>}
 */
const autoCompletePastBookings = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    await Booking.updateMany(
      { userId, date: { $lt: today }, status: 'upcoming' },
      { $set: { status: 'completed' } }
    );
  } catch (err) {
    console.error('Auto-complete error:', err);
  }
};

module.exports = {
  ulogin,
  usignup,
  getChargestations,
  getBookedSlots,
  userBooking,
  bookings,
  myBookings,
  cancelBooking,
  autoCompletePastBookings
};