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

const { authenticate } = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const {
  sendGlobalNotification,
  sendNotificationToAllStudents,
  getUserNotifications,
  getSentNotifications
} = require('../controllers/notification.controller');

router.post('/global', authenticate, roleMiddleware('admin'), sendGlobalNotification);
router.post('/students/global', authenticate, roleMiddleware('instructor'), sendNotificationToAllStudents);
router.get('/', authenticate, getUserNotifications);
router.get('/sent', authenticate, roleMiddleware('instructor'), getSentNotifications);

module.exports = router;
