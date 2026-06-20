const express = require('express');
const Router = express.Router()
const adminController = require('../controllers/adminController')

Router.post('/alogin',adminController.alogin)
Router.post('/asignup',adminController.asignup)
Router.get('/users',adminController.getUsers)
Router.get('/user/:id',adminController.getUserById)
Router.put('/userdelete/:id',adminController.updateUser)
Router.delete('/userdelete/:id',adminController.deleteUser)
Router.post('/chargestations',adminController.chargeStation)
Router.get('/chargestations/:id',adminController.chargestationById)
Router.put('/updatechargestation/:id',adminController.updatechargestation)
Router.delete('/stationdelete/:id',adminController.deleteChargestation)

module.exports=Router