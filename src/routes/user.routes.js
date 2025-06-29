// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');

router.get('/:id', protect, getUserById);

module.exports = router;
