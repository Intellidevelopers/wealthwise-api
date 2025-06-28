const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'instructor' },
  resetToken: String,
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  resetTokenExpires: Date,

  // 👇 New fields for profile
  bio: { type: String, default: '' },
  specialization: { type: String, default: '' },
  avatar: { type: String, default: '' } // store image URL from cloudinary/multer
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
