/**
 * JWT signing helper functions.
 *
 * Provides reusable methods for creating user and admin JWTs.
 */
const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for a regular user.
 *
 * @param {Object} user - User document.
 * @param {import('mongoose').Types.ObjectId} user._id - User id.
 * @param {string} user.name - User name.
 * @param {string} user.email - User email.
 * @returns {string} Signed JWT token.
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Sign a JWT for an admin user.
 *
 * @param {Object} admin - Admin document.
 * @param {import('mongoose').Types.ObjectId} admin._id - Admin id.
 * @param {string} admin.name - Admin name.
 * @param {string} admin.email - Admin email.
 * @returns {string} Signed JWT token.
 */
const signTokenAdmin = (admin) => {
  return jwt.sign(
    { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  signToken,
  signTokenAdmin
};