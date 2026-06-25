/**
 * User route definitions.
 *
 * Exposes public authentication and station lookup routes,
 * plus protected booking and user booking routes.
 */
const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public authentication and station lookup routes
Router.post('/login', userController.ulogin);
Router.post('/signup', userController.usignup);
Router.get('/chargestations', userController.getChargestations);

// Public slot lookup route required for scheduling availability checks
Router.get('/slots/:stationId', userController.getBookedSlots);

// Protected booking routes require a valid JWT
Router.post('/booking', auth, userController.userBooking);
Router.get('/mybookings', auth, userController.myBookings);
Router.patch('/booking/:id/cancel', auth, userController.cancelBooking);

// Booking listing route also available to admins via auth middleware
Router.get('/bookings', auth, userController.bookings);

module.exports = Router;