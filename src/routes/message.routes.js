/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging system between users
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         conversation:
 *           type: string
 *         sender:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             avatar:
 *               type: string
 *         receiver:
 *           type: string
 *         text:
 *           type: string
 *         isRead:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time

 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         participant:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             avatar:
 *               type: string
 *         updatedAt:
 *           type: string
 *           format: date-time

 *     UnreadCount:
 *       type: object
 *       properties:
 *         conversationId:
 *           type: string
 *         count:
 *           type: number
 */


/**
 * @swagger
 * /api/messages/conversations:
 *   post:
 *     summary: Create or get a conversation with a user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation created or fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'

 *   get:
 *     summary: Get all conversations of the logged-in user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'

 * /api/messages/conversations/{id}/messages:
 *   get:
 *     summary: Get all messages in a conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'

 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Conversation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'

 * /api/messages/unread-counts:
 *   get:
 *     summary: Get unread message counts for all conversations
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread message counts per conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UnreadCount'

 * /api/messages/recent-unread:
 *   get:
 *     summary: Get recent unread messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent unread messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */


const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const protect = require('../middleware/auth.middleware');

router.post('/conversations', protect, messageController.createOrGetConversation);
router.get('/conversations', protect, messageController.getUserConversations);
router.get('/conversations/:id/messages', protect, messageController.getMessages);
router.post('/conversations/:id/messages', protect, messageController.sendMessage);
router.get('/unread-counts', protect, messageController.getUnreadCounts);
router.get('/recent-unread', protect, messageController.getRecentUnreadMessages);




module.exports = router;
