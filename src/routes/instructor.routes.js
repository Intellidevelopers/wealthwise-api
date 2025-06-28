const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { getInstructorStats, getInstructorActivities } = require('../controllers/instructor.controller');
// src/routes/course.routes.js or instructor.routes.js
const { getInstructorCourses } = require('../controllers/instructor.controller');
const instructorController = require('../controllers/instructor.controller');

// Instructor dashboard stats
router.get('/stats', authMiddleware, roleMiddleware('instructor'), getInstructorStats);
// Instructor recent activities
router.get('/activities', authMiddleware, roleMiddleware('instructor'), getInstructorActivities);
router.get('/courses', authMiddleware, roleMiddleware('instructor'), getInstructorCourses);
router.get('/enrolled-students', authMiddleware, roleMiddleware('instructor'), instructorController.getEnrolledStudents);



module.exports = router;


