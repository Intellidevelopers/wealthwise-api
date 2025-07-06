/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and management endpoints
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get overall dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 */

/**
 * @swagger
 * /api/admin/instructors:
 *   get:
 *     summary: Get all instructors
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructors
 * 
 * /api/admin/instructors/{id}:
 *   delete:
 *     summary: Delete instructor by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor deleted
 */

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 * 
 * /api/admin/students/{id}:
 *   delete:
 *     summary: Delete student by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted
 */

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 * 
 * /api/admin/courses/{id}:
 *   delete:
 *     summary: Delete course by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 * 
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Category created Successfully
 */


/**
 * @swagger
 * /api/notifications/global:
 *   get:
 *     summary: Get all notifications
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 * 
 *   post:
 *     summary: Send a new notification
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, message]
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification sent
 */

/**
 * @swagger
 * /api/admin/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */


const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Protect all admin routes
router.use(authenticate, isAdmin);

// Dashboard stats
router.get('/dashboard', admin.getDashboardStats);

// Instructors
router.get('/instructors', admin.getAllInstructors);
router.delete('/instructors/:id', admin.deleteInstructor);

// Students
router.get('/students', admin.getAllStudents);
router.delete('/students/:id', admin.deleteStudent);

// Courses
router.get('/courses', admin.getAllCourses);
router.delete('/courses/:id', admin.deleteCourse);

// Categories
router.get('/categories', admin.getAllCategories);
router.post('/categories', admin.createCategory);
router.delete('/categories/:id', admin.deleteCategory);

// Notifications
router.get('/notifications', admin.getAllNotifications);
router.post('/notifications', admin.sendNotification);

// Enrollments
router.get('/enrollments', admin.getAllEnrollments);
router.get('/dashboard/activities', admin.getRecentActivities);

module.exports = router;
