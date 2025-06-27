// routes/course.routes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/cloudinaryUpload.middleware'); // ✅ renamed for clarity

router.post(
  '/',
  authMiddleware,
  upload.single('thumbnail'), // 🖼️ Upload thumbnail to Cloudinary
  courseController.createCourse
);

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);

module.exports = router;
