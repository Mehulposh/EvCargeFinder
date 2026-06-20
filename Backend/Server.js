const express = require('express');
const cors = require('cors');
require('./db/config');
const app = express();
const PORT = process.env.PORT || 7000;
const ChargingStation = require('./models/ChargeStation');
const Admin = require('./models/AdminSchema');   
const User = require('./models/UserSchema');
const Booking =require('./models/BookingSchema')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')


app.use(cors({
    origin : ["http://localhost:5174"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}   ));
app.use(express.json());    
app.use(adminRoutes,userRoutes)

 //  Admin  //
// Login
// app.post('/alogin', )
  
  // Register Api
  // app.post('/asignup', )

//  app.get('/users',) 

//  app.get('/user/:id',); 

  // app.put('/updateuser/:id', );

//  app.delete('/userdelete/:id', );

//  app.post('/chargestations', );

  // app.get('/chargestations/:id',); 

  // app.put('/updatechargestation/:id', );
  

  // app.delete('/stationdelete/:id',);





//   User //
// login
// app.post('/login',)
    
//  app.post('/signup', )
  
// app.get('/chargestations',);

// app.post('/userbooking',);

// app.get('/bookings',)  

// app.get('/userbookings/:userId',)  
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});