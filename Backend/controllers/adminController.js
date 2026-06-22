const Admin = require('../models/AdminSchema');
const User = require('../models/UserSchema');
const ChargingStation = require('../models/ChargeStation');
const Booking = require('../models/BookingSchema');
const {signTokenAdmin} = require('../helper/jwtSign')


// POST /api/admin/login
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

// POST /api/admin/signup
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

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/admin/user/:id
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

// GET /api/admin/user/:id/bookings
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

// PUT /api/admin/user/:id
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

// DELETE /api/admin/user/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete their bookings
    await Booking.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

// POST /api/admin/chargestation
const chargeStation = async (req, res) => {
  try {
    const station = await ChargingStation.create(req.body);
    res.status(201).json(station);
  } catch (err) {
    console.error('Create station error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/admin/chargestations
const getChargeStations = async (req, res) => {
  try {
    const stations = await ChargingStation.find().sort({ createdAt: -1 });
    res.json(stations);
  } catch (err) {
    console.error('Get stations error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/admin/chargestation/:id
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

// PUT /api/admin/chargestation/:id
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

// DELETE /api/admin/chargestation/:id
const deleteChargestation = async (req, res) => {
  try {
    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Station deleted.' });
  } catch (err) {
    console.error('Delete station error:', err);
    res.status(500).json({ message: 'Failed to delete station.' });
  }
};

// GET /api/admin/bookings
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

// GET /api/admin/stats
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