const express = require('express');
const router = express.Router();
const Call = require('../models/call.model');
const { authenticate } = require('../middleware/auth.middleware');

// Get user's call history
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const calls = await Call.find({
      $or: [{ callerId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });

    res.status(200).json(calls);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch call history' });
  }
});

module.exports = router;
