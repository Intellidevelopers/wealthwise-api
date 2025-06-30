const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');

const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  getStudentSubmissions
} = require('../controllers/quize.controller');

// Instructor routes
router.post('/', protect, createQuiz); // Create quiz

// Student routes
router.get('/course/:courseId', protect, getQuizByCourse); // Get quiz for enrolled course
router.post('/:quizId/submit', protect, submitQuiz); // Submit quiz
router.get('/submissions', protect, getStudentSubmissions); // Optional: get all submissions

module.exports = router;
