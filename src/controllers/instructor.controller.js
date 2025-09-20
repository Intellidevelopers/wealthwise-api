const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const Activity = require('../models/activity.model');
const User = require('../models/user.model'); // Ensure this is imported



exports.getInstructorStats = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Forbidden. Instructors only.' });
    }

    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map(course => course._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    const totalStudents = new Set(enrollments.map(enr => enr.student.toString())).size;

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalEarnings: enrollments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0),
      totalEnrollments: enrollments.length,
      recentCourses: courses.slice(-5).reverse(), // optional
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getInstructorActivities = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const activities = await Activity.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .populate('student', 'firstName lastName') // for displaying student info
      .limit(20);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load activities' });
  }
};


// GET /api/courses (for instructors)
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get courses by this instructor
    const courses = await Course.find({ instructor: instructorId }).lean();

    // For each course, count enrolled students
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const studentsCount = await Enrollment.countDocuments({ course: course._id });
        return {
          ...course,
          students: studentsCount, // 👈 attach to response
        };
      })
    );

    res.json(enrichedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch instructor courses' });
  }
};



// GET /api/instructor/enrolled-students
exports.getEnrolledStudents = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied. Instructors only.' });
    }

    const instructorId = req.user._id;

    // Get all courses owned by this instructor
    const courses = await Course.find({ instructor: instructorId }).select('_id');

    const courseIds = courses.map(course => course._id);

    // Get all enrollments for these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'firstName lastName email')
      .populate('course', 'title');

    // Format response
    const students = enrollments.map(enr => ({
      studentId: enr.student._id,
      firstName: enr.student.firstName,
      lastName: enr.student.lastName,
      email: enr.student.email,
      courseTitle: enr.course.title,
      enrolledAt: enr.createdAt,
    }));

    res.json(students);
  } catch (err) {
    console.error('Failed to fetch enrolled students:', err);
    res.status(500).json({ message: 'Server error while fetching enrolled students.' });
  }
};

// DELETE /api/instructor/delete-account
exports.deleteInstructorAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Forbidden. Instructors only.' });
    }

    // 1️⃣ Delete courses created by this instructor
    const courses = await Course.find({ instructor: userId });
    const courseIds = courses.map(course => course._id);

    await Course.deleteMany({ instructor: userId });

    // 2️⃣ Delete enrollments associated with these courses
    await Enrollment.deleteMany({ course: { $in: courseIds } });

    // 3️⃣ Delete instructor activities
    await Activity.deleteMany({ instructor: userId });

    // 4️⃣ Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Instructor account and all related data have been deleted.' });
  } catch (err) {
    console.error('Error deleting instructor account:', err);
    res.status(500).json({ message: 'Server error while deleting account.' });
  }
};
