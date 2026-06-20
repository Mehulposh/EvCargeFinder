const User = require('../models/UserSchema')
const ChargingStation = require('../models/ChargeStation')
const Booking = require('../models/BookingSchema')

const ulogin =  (req, res) => {
    const { email, password } = req.body;
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    if (user.password === password) {
                        return res.json({ Status: "Success", user: { id: user.id, name: user.name, email: user.email } })
                    }
                    else {
                        res.json("Invalid Password")
                    }
                }
                else {
                    res.json("User not found")
                }
            })
    }

const usignup = (req, resp) => {
        const { name, email, password } = req.body;
        User.findOne({ email: email })
            .then(use => {
                if (use) {
                    resp.json("Already have an account")
                } else {
                    User.create({ email: email, name: name, password: password })
                        .then(result => resp.json("  Account Created"))
                        .catch(err => resp.json(err))
                }
            }).catch(err => resp.json("failed "))
    }

const getChargestations =  (req, res) => {
    ChargingStation.find()       
        .then((data) => {
            res.status(200).json(data);
        })
        .catch(() => {
            console.log("Error in getting data");
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

const userBooking =  async (req, res) => {
    try {
      const {
        name,
        email,
        phno, 
        date,
        time,
        userId, 
        userName,
        address:{
            district,
            city,
            state,
            country,
            zipcode,
            street_address
        }} = req.body;

        
      const newBooking = new  Booking({  name,email,phno,date,time,userId,userName,address:{district,city,state,country,zipcode,street_address}});
      await newBooking.save();
      res.status(201).json({ message: 'Booking successful' });
    } catch (error) {
      console.error('Error booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

const bookings = (req,res)=>{
    Booking.find()
    .then((data)=>{
      res.status(200).json(data)  
    })
    .catch(()=>{           
        console.log("error")
    })
}

const bookingsById = (req,res)=>{
    const userId =req.params.id;
    Booking.find(userId)
    .then((data)=>{
      res.status(200).json(data)  
    })
    .catch(()=>{           
        console.log("error")
    })
}

module.exports = {ulogin,usignup,getChargestations,userBooking,bookings,bookingsById}