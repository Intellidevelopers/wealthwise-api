// File: src/models/lesson.model.js (update)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./course.model');

const Lesson = sequelize.define('Lesson', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  fileUrl: DataTypes.STRING,
  courseId: { type: DataTypes.INTEGER, references: { model: 'Courses', key: 'id' } },
});

Course.hasMany(Lesson, { foreignKey: 'courseId' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Lesson;