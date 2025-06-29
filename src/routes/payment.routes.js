const express = require('express');
const router = express.Router();
const { initiateFlutterwavePayment } = require('../controllers/payment.controller');

router.post('/flutterwave/initiate', initiateFlutterwavePayment);

module.exports = router;
