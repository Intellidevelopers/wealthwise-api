/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Manage courses (create, update, get, delete)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: string
 *         video:
 *           type: string
 *         thumbnail:
 *           type: string
 *         category:
 *           type: string
 *         instructor:
 *           type: string
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A course object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course for instructors
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, price, duration, video, category, thumbnail]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               video:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Missing required fields or thumbnail
 *       403:
 *         description: Only instructors can create courses
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               video:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Access denied. Not your course.
 *       404:
 *         description: Course not found
 */


const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authenticate } = require('../middleware/auth.middleware'); // ✅ FIXED
const upload = require('../middleware/cloudinaryUpload.middleware');

// CREATE course
router.post(
  '/',
  authenticate,
  upload.single('thumbnail'),
  courseController.createCourse
);

// UPDATE course with image upload
router.put(
  '/:id',
  authenticate,
  upload.single('thumbnail'),
  courseController.updateCourse
);

// GET all & single course
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// DELETE course
router.delete('/:id', authenticate, courseController.deleteCourse);

module.exports = router;
