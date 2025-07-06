const User = require('../models/user.model');
const Course = require('../models/course.model');
const Category = require('../models/category.model');
const Enrollment = require('../models/enrollment.model');
const Notification = require('../models/notification.model');
const Activity = require('../models/activity.model');

// 📊 DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();

    res.json({ totalUsers, totalInstructors, totalStudents, totalCourses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
};

// 👨‍🏫 INSTRUCTORS
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'Instructor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🎓 STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📚 COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'firstName lastName email')
      .populate('category', 'title'); // 👈 Populate only the title of the category

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗂️ CATEGORIES
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const category = new Category({
      title,
      description,
      image,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔔 NOTIFICATIONS
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName email')
      .populate('recipients', 'firstName lastName email');

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { title, message, recipientIds = [], isGlobal = false } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'Sender not identified' });
    }

    const notification = new Notification({
      title,
      message,
      sender: req.user._id, // 👈 required field
      recipients: [],        // 👈 no specific recipients
      isGlobal: true         // 👈 mark as global
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
};

// 📘 ENROLLMENTS
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title');

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('instructor', 'firstName lastName')
      .populate('student', 'firstName lastName');

    const formatted = activities.map((activity) => {
      const user = activity.student || activity.instructor;
      const role = activity.student ? 'Student' : 'Instructor';
      const name = user ? `${user.firstName} ${user.lastName}` : 'Unknown';

      return {
        name,
        role,
        action: activity.message,
        type: activity.type,
        time: activity.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities', details: err.message });
  }
};