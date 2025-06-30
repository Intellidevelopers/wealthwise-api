const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,  // ✅ Normalize
    trim: true        // ✅ Remove whitespace
  },
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'instructor'
  },
  resetToken: String,
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  resetTokenExpires: Date,

  // 👇 Profile fields
  bio: { type: String, default: '' },
  specialization: { type: String, default: '' },
  avatar: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
