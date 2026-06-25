/**
 * Admin schema definition.
 *
 * Defines admin credentials and password hashing logic for admin accounts.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

/**
 * Hash the admin password before saving the document.
 *
 * This ensures plain passwords are never stored in the database.
 */
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare a candidate password with the stored hash.
 *
 * @param {string} candidatePassword - The password to verify.
 * @returns {Promise<boolean>} True if the password matches.
 */
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);