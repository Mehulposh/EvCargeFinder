const mongoose = require('mongoose');

const chargeStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address_components: {
    district: String,
    street_address: String,
    city: String,
    zipcode: String,
    state: String,
    country: String
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  phone_number: String,
  opening_hours: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  review_count: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ChargeStation', chargeStationSchema);