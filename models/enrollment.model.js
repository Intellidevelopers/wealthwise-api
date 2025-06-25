// // File: src/models/enrollment.model.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const User = require('./user.model');
// const Course = require('./course.model');

// const Enrollment = sequelize.define('Enrollment', {
//   userId: { type: DataTypes.INTEGER, allowNull: false },
//   courseId: { type: DataTypes.INTEGER, allowNull: false },
// }, {
//   indexes: [{ unique: true, fields: ['userId', 'courseId'] }]
// });

// User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
// Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });

// module.exports = Enrollment;