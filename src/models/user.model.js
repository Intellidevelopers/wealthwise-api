const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  resetToken: String,
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  resetTokenExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
