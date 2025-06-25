// File: src/models/user.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
  role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), defaultValue: 'student' },
  resetToken: DataTypes.STRING,
  resetTokenExpires: DataTypes.DATE
});

module.exports = User;