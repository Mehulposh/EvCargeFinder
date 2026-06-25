/**
 * Admin controller module.
 *
 * Contains admin authentication and management handlers for users,
 * charging stations, bookings, and dashboard statistics.
 */
const Admin = require('../models/AdminSchema');
const User = require('../models/UserSchema');
const ChargingStation = require('../models/ChargeStation');
const Booking = require('../models/BookingSchema');
const { signTokenAdmin } = require('../helper/jwtSign');

/**
 * Authenticate an admin and return a signed JWT.
 *
 * @route POST /api/admin/login
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const alogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin)
      return res.status(404).json({ message: 'Admin not found.' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid password.' });

    const token = signTokenAdmin(admin);

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Register a new admin account and return authentication details.
 *
 * @route POST /api/admin/signup
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const asignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: 'Admin account already exists.' });

    const admin = await Admin.create({ name, email, password });
    const token = signTokenAdmin(admin);

    res.status(201).json({
      message: 'Admin account created',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin signup error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Retrieve all users, excluding password fields.
 *
 * @route GET /api/admin/users
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve a specific user by ID.
 *
 * @route GET /api/admin/user/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve all bookings for a specific user.
 *
 * @route GET /api/admin/user/:id/bookings
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate('stationId', 'name')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Update a user by ID using the request body.
 *
 * @route PUT /api/admin/user/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Delete a user and all associated bookings.
 *
 * @route DELETE /api/admin/user/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete their bookings.
    await Booking.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

/**
 * Create a new charging station.
 *
 * @route POST /api/admin/chargestation
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const chargeStation = async (req, res) => {
  try {
    const station = await ChargingStation.create(req.body);
    res.status(201).json(station);
  } catch (err) {
    console.error('Create station error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve all charging stations.
 *
 * @route GET /api/admin/chargestations
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getChargeStations = async (req, res) => {
  try {
    const stations = await ChargingStation.find().sort({ createdAt: -1 });
    res.json(stations);
  } catch (err) {
    console.error('Get stations error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve a charging station by ID.
 *
 * @route GET /api/admin/chargestation/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const chargestationById = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) return res.status(404).json({ message: 'Station not found.' });
    res.json(station);
  } catch (err) {
    console.error('Get station by ID error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Update a charging station by ID.
 *
 * @route PUT /api/admin/chargestation/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const updateChargestation = async (req, res) => {
  try {
    const updated = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update station error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Delete a charging station by ID.
 *
 * @route DELETE /api/admin/chargestation/:id
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const deleteChargestation = async (req, res) => {
  try {
    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Station deleted.' });
  } catch (err) {
    console.error('Delete station error:', err);
    res.status(500).json({ message: 'Failed to delete station.' });
  }
};

/**
 * Retrieve all bookings, including user and station details.
 *
 * @route GET /api/admin/bookings
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('stationId', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Retrieve dashboard statistics for admin view.
 *
 * @route GET /api/admin/stats
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getStats = async (req, res) => {
  try {
    const [userCount, stationCount, bookingCount, recentBookings] = await Promise.all([
      User.countDocuments(),
      ChargingStation.countDocuments(),
      Booking.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.find({ status: 'upcoming' })
        .populate('userId', 'name')
        .populate('stationId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({ userCount, stationCount, bookingCount, recentBookings });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  alogin,
  asignup,
  getUsers,
  getUserById,
  getUserBookings,
  updateUser,
  deleteUser,
  chargeStation,
  getChargeStations,
  chargestationById,
  updateChargestation,
  deleteChargestation,
  getAllBookings,
  getStats
};