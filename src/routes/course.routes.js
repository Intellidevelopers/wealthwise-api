const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/cloudinaryUpload.middleware'); // ✅ renamed for clarity

// CREATE course
// CREATE course
router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  courseController.createCourse
);


// UPDATE course with image upload
router.put(
  '/:id',
  authMiddleware,
  upload.single('thumbnail'), // ✅ Handles image updates
  courseController.updateCourse
);

// GET all & single course
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// DELETE course
router.delete('/:id', authMiddleware, courseController.deleteCourse);

module.exports = router;
