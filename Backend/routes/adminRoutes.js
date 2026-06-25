/**
 * Admin route definitions.
 *
 * Exposes public authentication routes and protected admin management routes.
 */
const express = require('express');
const Router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Public authentication routes
Router.post('/login', adminController.alogin);
Router.post('/signup', adminController.asignup);

// Protected admin management routes
Router.get('/stats', adminAuth, adminController.getStats);
Router.get('/users', adminAuth, adminController.getUsers);
Router.get('/user/:id', adminAuth, adminController.getUserById);
Router.get('/user/:id/bookings', adminAuth, adminController.getUserBookings);
Router.put('/user/:id', adminAuth, adminController.updateUser);
Router.delete('/user/:id', adminAuth, adminController.deleteUser);

Router.post('/chargestation', adminAuth, adminController.chargeStation);
Router.get('/chargestations', adminAuth, adminController.getChargeStations);
Router.get('/chargestation/:id', adminAuth, adminController.chargestationById);
Router.put('/chargestation/:id', adminAuth, adminController.updateChargestation);
Router.delete('/chargestation/:id', adminAuth, adminController.deleteChargestation);

Router.get('/bookings', adminAuth, adminController.getAllBookings);

module.exports = Router;