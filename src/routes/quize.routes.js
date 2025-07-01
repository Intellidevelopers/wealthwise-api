/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management and submissions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         course:
 *           type: string
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     Submission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         quiz:
 *           type: string
 *         student:
 *           type: string
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *               selected:
 *                 type: string
 *               correct:
 *                 type: boolean
 *         score:
 *           type: number
 */

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz (Instructor only)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [course, questions]
 *             properties:
 *               course:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     answer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /api/quizzes/course/{courseId}:
 *   get:
 *     summary: Get quiz by course ID (Enrolled students only)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz data without answers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /api/quizzes/{quizId}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Quiz submitted and scored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 score:
 *                   type: number
 *                 total:
 *                   type: number
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /api/quizzes/submissions:
 *   get:
 *     summary: Get all quiz submissions by student
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 */


const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');

const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  getStudentSubmissions
} = require('../controllers/quize.controller');

// Instructor routes
router.post('/', protect, createQuiz); // Create quiz

// Student routes
router.get('/course/:courseId', protect, getQuizByCourse); // Get quiz for enrolled course
router.post('/:quizId/submit', protect, submitQuiz); // Submit quiz
router.get('/submissions', protect, getStudentSubmissions); // Optional: get all submissions

module.exports = router;
