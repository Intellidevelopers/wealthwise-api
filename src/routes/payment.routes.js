/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Handle payment integration via Flutterwave
 */

/**
 * @swagger
 * /api/payments/flutterwave/initiate:
 *   post:
 *     summary: Initiate payment via Flutterwave
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, email, fullName, courseId]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10000
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               courseId:
 *                 type: string
 *                 example: "64f124b7e78b5a09d8049cde"
 *               customizationTitle:
 *                 type: string
 *                 example: "Advanced JavaScript Course"
 *     responses:
 *       200:
 *         description: Payment URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                   example: "https://checkout.flutterwave.com/v3/hosted/pay/abc123"
 *       500:
 *         description: Payment initialization failed
 */


const express = require('express');
const router = express.Router();
const { initiateFlutterwavePayment } = require('../controllers/payment.controller');

router.post('/flutterwave/initiate', initiateFlutterwavePayment);

module.exports = router;
