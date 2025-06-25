// File: src/controllers/lesson.controller.js
const Lesson = require('../models/lesson.model');

exports.createLesson = async (req, res) => {
  const { title, content, courseId } = req.body;
  const filePath = req.file ? req.file.path : null;
  try {
    const lesson = await Lesson.create({ title, content, courseId, fileUrl: filePath });
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll({ where: { courseId: req.params.courseId } });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};