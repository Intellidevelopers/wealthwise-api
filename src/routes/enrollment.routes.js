/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Manage course enrollments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         student:
 *           type: string
 *         course:
 *           type: string
 *         paid:
 *           type: boolean
 *         accessGranted:
 *           type: boolean
 */

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll the authenticated user in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 enrollment:
 *                   $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Already enrolled
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/enrollments/my-courses:
 *   get:
 *     summary: Get all courses the authenticated user is enrolled in
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/enrollments/{courseId}:
 *   get:
 *     summary: Check if user is enrolled in a specific course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrollment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollment:
 *                   $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Not enrolled in this course
 */


const express = require('express');
const router = express.Router();

const {
  enrollInCourse,
  checkEnrollmentStatus,
  getEnrolledCourses
} = require('../controllers/enrollment.controller');

const { authenticate } = require('../middleware/auth.middleware'); // ✅ FIXED

// 📌 Enroll in a course (POST)
router.post('/', authenticate, enrollInCourse);

// ✅ Put static route BEFORE the dynamic one
router.get('/my-courses', authenticate, getEnrolledCourses);

// 📌 Dynamic route (must come last)
router.get('/:courseId', authenticate, checkEnrollmentStatus);

module.exports = router;
