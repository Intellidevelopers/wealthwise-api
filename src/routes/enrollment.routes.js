// src/routes/enrollment.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { enrollInCourse } = require('../controllers/enrollment.controller');

router.post('/', auth, enrollInCourse); // This is required!

module.exports = router;
