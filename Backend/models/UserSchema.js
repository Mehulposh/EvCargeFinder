/**
 * User schema definition.
 *
 * Stores user credentials and provides password hashing plus comparison logic.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
 * Hash the user password before saving.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare a candidate password with the stored hash.
 *
 * @param {string} candidatePassword - Password to compare.
 * @returns {Promise<boolean>} True if the password matches.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);