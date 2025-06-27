const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Admin sends to all
exports.sendGlobalNotification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only.' });
    }

    const { title, message } = req.body;
    const users = await User.find({ role: { $in: ['student', 'instructor'] } }, '_id');
    const recipientIds = users.map(u => u._id);

    const notification = new Notification({
      sender: req.user._id,
      recipients: recipientIds,
      title,
      message,
      isGlobal: true,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification sent to all users.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Instructor sends to students

exports.sendNotificationToAllStudents = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Instructors only.' });
    }

    const { title, message } = req.body;

    // Find all students
    const students = await User.find({ role: 'student' }).select('_id');
    const studentIds = students.map(student => student._id);

    const notification = new Notification({
      sender: req.user._id,
      recipients: studentIds,
      title,
      message,
    });

    await notification.save();

    res.status(201).json({ message: 'Notification sent to all students.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipients: req.user._id
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Fetch recent notifications sent by instructor
exports.getSentNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Instructors only.' });
    }

    const notifications = await Notification.find({ sender: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10); // Fetch the 10 most recent

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};