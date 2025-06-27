const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware'); // ✅ Add this
const {
  sendGlobalNotification,
  sendNotificationToAllStudents, // ✅ Correct function name
  getUserNotifications
} = require('../controllers/notification.controller');

// Admin sends notification to everyone
router.post('/global', authMiddleware, roleMiddleware('admin'), sendGlobalNotification);

// Instructor sends notification to all students
router.post('/students/global', authMiddleware, roleMiddleware('instructor'), sendNotificationToAllStudents);

// Any user fetches their own notifications
router.get('/', authMiddleware, getUserNotifications);

module.exports = router;
