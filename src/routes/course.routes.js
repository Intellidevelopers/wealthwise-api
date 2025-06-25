// const express = require('express');
// const router = express.Router();
// const CourseController = require('../controllers/course.controller');

// /**
//  * @swagger
//  * tags:
//  *   name: Courses
//  *   description: Course management
//  */

// /**
//  * @swagger
//  * /api/courses:
//  *   post:
//  *     summary: Create a new course
//  *     tags: [Courses]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [title, description]
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Course created successfully
//  *       500:
//  *         description: Server error
//  */
// router.post('/', CourseController.createCourse);

// /**
//  * @swagger
//  * /api/courses:
//  *   get:
//  *     summary: Get all courses
//  *     tags: [Courses]
//  *     responses:
//  *       200:
//  *         description: List of all courses
//  *       500:
//  *         description: Server error
//  */
// router.get('/', CourseController.getCourses);

// /**
//  * @swagger
//  * /api/courses/{id}:
//  *   get:
//  *     summary: Get a single course by ID
//  *     tags: [Courses]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: integer
//  *         required: true
//  *         description: ID of the course
//  *     responses:
//  *       200:
//  *         description: Course found
//  *       404:
//  *         description: Course not found
//  */
// router.get('/:id', CourseController.getCourse);

// /**
//  * @swagger
//  * /api/courses/{id}:
//  *   put:
//  *     summary: Update a course by ID
//  *     tags: [Courses]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: integer
//  *         required: true
//  *         description: ID of the course
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Course updated
//  *       404:
//  *         description: Course not found
//  */
// router.put('/:id', CourseController.updateCourse);

// /**
//  * @swagger
//  * /api/courses/{id}:
//  *   delete:
//  *     summary: Delete a course by ID
//  *     tags: [Courses]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: integer
//  *         required: true
//  *         description: ID of the course
//  *     responses:
//  *       200:
//  *         description: Course deleted
//  *       404:
//  *         description: Course not found
//  */
// router.delete('/:id', CourseController.deleteCourse);

// module.exports = router;
