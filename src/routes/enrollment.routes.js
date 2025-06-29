const express = require('express');
const router = express.Router();

const {
  enrollInCourse,
  checkEnrollmentStatus,
} = require('../controllers/enrollment.controller');

// ✅ Make sure this import is present
const protect = require('../middleware/auth.middleware');

// 📌 Enroll in a course (POST)
router.post('/', protect, enrollInCourse);

// 📌 Check if user is enrolled (GET)
router.get('/:courseId', protect, checkEnrollmentStatus);

module.exports = router;
