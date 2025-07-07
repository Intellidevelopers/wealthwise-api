// src/routes/lesson.routes.js
const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lesson.controller');
const { authenticate } = require('../middleware/auth.middleware'); // ✅
const uploadVideo = require('../middleware/video.middleware'); // multer instance

console.log('uploadVideo:', typeof uploadVideo);             // function
console.log('uploadVideo.single:', typeof uploadVideo.single); // function
console.log('addLesson:', typeof lessonController.addLesson); // function
console.log('protect:', typeof protect); // ✅ must log: function

router.post(
  '/:courseId',
  authenticate, // ✅ correct middleware function
  uploadVideo.single('video'),
  lessonController.addLesson
);

// routes/lesson.routes.js
router.get('/:courseId', lessonController.getLessonsByCourse);
// Get total number of all lessons
router.get('/count', authenticate, lessonController.getTotalLessonsCount);

// Get number of lessons by course ID
router.get('/count/:courseId', authenticate, lessonController.getLessonCountByCourse);


module.exports = router;
