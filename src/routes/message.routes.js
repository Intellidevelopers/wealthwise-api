const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const protect = require('../middleware/auth.middleware');

router.post('/conversations', protect, messageController.createOrGetConversation);
router.get('/conversations', protect, messageController.getUserConversations);
router.get('/conversations/:id/messages', protect, messageController.getMessages);
router.post('/conversations/:id/messages', protect, messageController.sendMessage);

module.exports = router;
