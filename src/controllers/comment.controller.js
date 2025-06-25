// // File: src/controllers/comment.controller.js
// const Comment = require('../models/comment.model');

// exports.addComment = async (req, res) => {
//   const { lessonId, content } = req.body;
//   try {
//     const comment = await Comment.create({ content, lessonId, userId: req.user.id });
//     res.status(201).json(comment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getCommentsByLesson = async (req, res) => {
//   try {
//     const comments = await Comment.findAll({
//       where: { lessonId: req.params.lessonId },
//       include: ['User'],
//       order: [['createdAt', 'DESC']]
//     });
//     res.json(comments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };