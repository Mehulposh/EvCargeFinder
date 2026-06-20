const express = require('express')
const Router = express.Router()
const userController = require( '../controllers/userController')

Router.post('/login',userController.ulogin)
Router.post('/signup',userController.usignup)
Router.get('/chargestations',userController.getChargestations)
Router.post('/userbooking',userController.userBooking)
Router.get('/bookings',userController.bookings)
Router.get('/userbookings/:userId',userController.bookingsById)

module.exports=Router