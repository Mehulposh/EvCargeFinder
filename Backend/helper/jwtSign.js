const jwt = require('jsonwebtoken');

// Helper: sign JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper: sign admin JWT
const signTokenAdmin = (admin) => {
  return jwt.sign(
    { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
module.exports ={
    signToken,
    signTokenAdmin
}