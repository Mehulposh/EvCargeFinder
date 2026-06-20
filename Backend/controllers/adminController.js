const Admin = require('../models/AdminSchema');   
const User = require('../models/UserSchema')
const ChargingStation = require('../models/ChargeStation')

const alogin = (req, resp) => {  
    const { email, password } = req.body;   
    Admin.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    return resp.json({ Status: "Success", user: { id:user.id,name: user.name, email: user.email } })
                } else {
                    resp.json("login fail")
                }
            } else {
                resp.json("no user")
            }
        })
  }

const asignup = (req, resp) => {
    const { name, email, password } = req.body;
    Admin.findOne({ email: email })
        .then(use => {
            if (use) {
                resp.json("Already have an account")
            } else {
                Admin.create({ email: email, name: name, password: password })
                    .then(result => resp.json("  Account Created"))
                    .catch(err => resp.json(err))
            }    
        }).catch(err => resp.json("failed "))
  }

const getUsers =(req,res)=>{
    User.find()
    .then((user)=>{
           res.status(200).json(user)
    })
    .catch((err)=>{
        console.log(err);
    })
 }

 const getUserById =   async (req, res) => {
     const { id } = req.params;
   
     try {
       const user= await User.findById(id);
       res.json(user);
     } catch (error) {
       console.error('Error fetching USer by ID:', error);
       res.status(500).send('Internal Server Error');
     }
   }

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating User:', error);
      res.status(500).send('Internal Server Error');
    }
  }

const deleteUser = (req, res) => {
    const { id } = req.params; // Corrected line

    User.deleteOne({ _id: id }) // Use _id for MongoDB
        .then(() => {
            res.send('Deleted');
        })
        .catch(() => {
            res.send('Failed to delete');
        });
}

const chargeStation = async (req, res) => {
    try {
      const newChargeStation = new ChargingStation(req.body);
      await newChargeStation.save();
      res.status(201).json(newChargeStation);
    } catch (error) {
      console.error('Error creating charge station:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

const chargestationById =  async (req, res) => {
    const { id } = req.params;
    try {
      const chargeStation = await ChargingStation.findById(id);
      res.json(chargeStation);
    } catch (error) {
      console.error('Error fetching charge station by ID:', error);
      res.status(500).send('Internal Server Error');
    }
  }

const updatechargestation =async (req, res) => {
    const { id } = req.params;
    try {
      const updatedStation = await ChargingStation.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedStation);
    } catch (error) {
      console.error('Error updating charge station:', error);
      res.status(500).send('Internal Server Error');
    }
  }

const deleteChargestation =  (req, res) => {
    const { id } = req.params; // Corrected line

    ChargingStation.deleteOne({ _id: id }) // Use _id for MongoDB
        .then(() => {
            res.send('Deleted');
        })
        .catch(() => {
            res.send('Failed to delete');
        });
}

module.exports = {alogin,asignup,getUsers,getUserById,updateUser,deleteUser,chargeStation,
                  chargestationById,updatechargestation,deleteChargestation}