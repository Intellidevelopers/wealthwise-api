/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage and send user notifications
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         sender:
 *           type: string
 *         recipients:
 *           type: array
 *           items:
 *             type: string
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         isGlobal:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * /api/notifications/global:
 *   post:
 *     summary: Send a global notification (admin only)
 *     tags: [Notifications]
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
 *         description: Notification sent to all users
 *       403:
 *         description: Admins only

 * /api/notifications/students/global:
 *   post:
 *     summary: Send a notification to all students (instructor only)
 *     tags: [Notifications]
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
 *         description: Notification sent to all students
 *       403:
 *         description: Instructors only

 * /api/notifications:
 *   get:
 *     summary: Get notifications for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'

 * /api/notifications/sent:
 *   get:
 *     summary: Get notifications sent by instructor
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       403:
 *         description: Instructors only
 */


const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware'); // ✅ Add this
const {
  sendGlobalNotification,
  sendNotificationToAllStudents, // ✅ Correct function name
  getUserNotifications,
  getSentNotifications
} = require('../controllers/notification.controller');

// Admin sends notification to everyone
router.post('/global', authMiddleware, roleMiddleware('admin'), sendGlobalNotification);

// Instructor sends notification to all students
router.post('/students/global', authMiddleware, roleMiddleware('instructor'), sendNotificationToAllStudents);

// Any user fetches their own notifications
router.get('/', authMiddleware, getUserNotifications);

// New route for instructor to fetch recent sent notifications
router.get('/sent', authMiddleware, roleMiddleware('instructor'), getSentNotifications);

module.exports = router;