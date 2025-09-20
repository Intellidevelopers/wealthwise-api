// routes/instructorSettings.routes.js
const express = require('express');
const router = express.Router();
const {
  getInstructorSettings,
  updateInstructorSettings,
} = require('../controllers/instructorSettings.controller');
const { authenticate } = require('../middleware/auth.middleware'); // your auth middleware

router.get('/', authenticate, getInstructorSettings);
router.put('/', authenticate, updateInstructorSettings);

module.exports = router;
