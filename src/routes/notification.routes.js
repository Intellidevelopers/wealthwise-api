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