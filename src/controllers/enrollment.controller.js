const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

exports.enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId).populate('instructor');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = await Enrollment.findOne({ student: studentId, course: courseId });
    if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled in course' });

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      paid: true,
      accessGranted: true
    });

    // Log instructor activity
    await Activity.create({
      instructor: course.instructor._id,
      message: `New student enrolled in "${course.title}"`,
      type: 'enrollment',
      student: studentId
    });

    // Notify instructor
    await Notification.create({
      sender: studentId,
      recipients: [course.instructor._id],
      title: 'New Enrollment',
      message: `A student enrolled in your course "${course.title}"`
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Enrollment failed' });
  }
};