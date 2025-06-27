const Course = require('../models/course.model');

// Create a new course
// Create course (instructor only)
exports.createCourse = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses.' });
    }

    const { title, duration, description, price, thumbnail, video, category } = req.body;

    const course = new Course({
      title,
      duration,
      description,
      price,
      thumbnail,
      video,
      category, // ✅ include this
      instructor: user._id
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get all courses (with instructor name)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'firstName lastName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one course (with instructor)
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: restrict update to the instructor who created it
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Optional: verify instructor owns the course
    if (req.user.role !== 'admin' && !course.instructor.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Not your course.' });
    }

    const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Optional: restrict delete to instructor or admin
    if (req.user.role !== 'admin' && !course.instructor.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Not your course.' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

