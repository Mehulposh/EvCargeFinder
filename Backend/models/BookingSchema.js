const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // User info
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phno: {
    type: String,
    required: true
  },

  // Station info
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargeStation',
    required: true
  },
  stationName: {
    type: String,
    required: true
  },
  address: {
    district: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
    street_address: String
  },

  // Slot info
  date: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  time: {
    type: String, // "HH:MM"
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  }

}, { timestamps: true });

// Compound index to prevent double-booking same station + date + time
bookingSchema.index({ stationId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);