// controllers/lesson.controller.js
const Lesson = require('../models/lesson.model');
const Course = require('../models/course.model');

exports.addLesson = async (req, res) => {
  try {
    const instructor = req.user;
    const { courseId } = req.params;
    const { title, description, duration } = req.body;

    if (instructor.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can add lessons.' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Video upload failed or missing.' });
    }

    const lesson = new Lesson({
      title,
      description,
      duration,
      video: req.file.path,
      course: course._id,
    });

    await lesson.save();

    res.status(201).json({ message: 'Lesson added successfully', lesson });
  } catch (err) {
    console.error('Add Lesson Error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId });

    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ message: 'No lessons found for this course.' });
    }

    res.status(200).json({ lessons });
  } catch (err) {
    console.error('Get Lessons Error:', err);
    res.status(500).json({ error: err.message });
  }
};


// Total lessons in the system
exports.getTotalLessonsCount = async (req, res) => {
  try {
    const count = await Lesson.countDocuments();
    res.status(200).json({ totalLessons: count });
  } catch (error) {
    console.error('Error getting total lessons count:', error);
    res.status(500).json({ message: 'Failed to get lessons count' });
  }
};

// Optional: Lessons count for a specific course
exports.getLessonCountByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const count = await Lesson.countDocuments({ course: courseId });
    res.status(200).json({ totalLessons: count });
  } catch (error) {
    console.error('Error getting lesson count by course:', error);
    res.status(500).json({ message: 'Failed to get lesson count' });
  }
};
