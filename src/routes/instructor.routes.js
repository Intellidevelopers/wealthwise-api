/**
 * @swagger
 * tags:
 *   name: Instructor
 *   description: Instructor dashboard and course management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InstructorStats:
 *       type: object
 *       properties:
 *         totalCourses:
 *           type: number
 *         totalStudents:
 *           type: number
 *         totalEarnings:
 *           type: number
 *         totalEnrollments:
 *           type: number
 *         recentCourses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseSummary'

 *     InstructorActivity:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         message:
 *           type: string
 *         type:
 *           type: string
 *         student:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time

 *     CourseSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         students:
 *           type: number

 *     EnrolledStudent:
 *       type: object
 *       properties:
 *         studentId:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         courseTitle:
 *           type: string
 *         enrolledAt:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * /api/instructor/stats:
 *   get:
 *     summary: Get instructor dashboard statistics
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourses:
 *                   type: number
 *                 totalStudents:
 *                   type: number
 *                 totalEarnings:
 *                   type: number
 *                 totalEnrollments:
 *                   type: number
 *                 recentCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/instructor/activities:
 *   get:
 *     summary: Get instructor recent activities
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent instructor activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/instructor/courses:
 *   get:
 *     summary: Get instructor’s courses with student count
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructor's courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   students:
 *                     type: number
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/instructor/enrolled-students:
 *   get:
 *     summary: Get students enrolled in instructor’s courses
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   courseTitle:
 *                     type: string
 *                   enrolledAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Access denied
 */


const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware'); // ✅ FIXED
const roleMiddleware = require('../middleware/role.middleware');
const {
  getInstructorStats,
  getInstructorActivities,
  getInstructorCourses,
  getEnrolledStudents,
  deleteInstructorAccount
} = require('../controllers/instructor.controller');

// Instructor dashboard stats
router.get('/stats', authenticate, roleMiddleware('instructor'), getInstructorStats);

// Instructor recent activities
router.get('/activities', authenticate, roleMiddleware('instructor'), getInstructorActivities);

// Instructor courses
router.get('/courses', authenticate, roleMiddleware('instructor'), getInstructorCourses);

// Enrolled students in instructor's courses
router.get('/enrolled-students', authenticate, roleMiddleware('instructor'), getEnrolledStudents);
// DELETE /api/instructor/delete-account
router.delete('/delete-account', authenticate, deleteInstructorAccount);

module.exports = router;



