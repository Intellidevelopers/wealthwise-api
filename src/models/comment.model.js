// // File: src/models/comment.model.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const User = require('./user.model');
// const Lesson = require('./lesson.model');

// const Comment = sequelize.define('Comment', {
//   content: { type: DataTypes.TEXT, allowNull: false },
//   userId: { type: DataTypes.INTEGER, allowNull: false },
//   lessonId: { type: DataTypes.INTEGER, allowNull: false },
// });

// User.hasMany(Comment, { foreignKey: 'userId' });
// Lesson.hasMany(Comment, { foreignKey: 'lessonId' });
// Comment.belongsTo(User, { foreignKey: 'userId' });
// Comment.belongsTo(Lesson, { foreignKey: 'lessonId' });

// module.exports = Comment;