const express = require('express');
const router = express.Router();

const {
  enrollInCourse,
  checkEnrollmentStatus,
  getEnrolledCourses
} = require('../controllers/enrollment.controller');

const protect = require('../middleware/auth.middleware');

// 📌 Enroll in a course (POST)
router.post('/', protect, enrollInCourse);

// ✅ Put static route BEFORE the dynamic one
router.get('/my-courses', protect, getEnrolledCourses);

// 📌 Dynamic route (must come last)
router.get('/:courseId', protect, checkEnrollmentStatus);

module.exports = router;
