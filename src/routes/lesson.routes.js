// // File: src/routes/lesson.routes.js
// const express = require('express');
// const router = express.Router();
// const LessonController = require('../controllers/lesson.controller');
// const { protect } = require('../middleware/auth.middleware');
// const upload = require('../middleware/upload.middleware');

// router.post('/', protect, upload.single('file'), LessonController.createLesson);
// router.get('/:courseId', LessonController.getLessons);

// module.exports = router;