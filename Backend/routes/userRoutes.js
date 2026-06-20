const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
Router.post('/login', userController.ulogin);
Router.post('/signup', userController.usignup);
Router.get('/chargestations', userController.getChargestations);

// Get booked slots for a station on a date (public — needed before login to browse)
Router.get('/slots/:stationId', userController.getBookedSlots);

// Protected routes — require JWT
Router.post('/booking', auth, userController.userBooking);
Router.get('/mybookings', auth, userController.myBookings);
Router.patch('/booking/:id/cancel', auth, userController.cancelBooking);

// Admin can also call this
Router.get('/bookings', auth, userController.bookings);

module.exports = Router;