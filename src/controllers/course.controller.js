const Course = require('../models/course.model');

// Create a new course
// controllers/course.controller.js
exports.createCourse = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses.' });
    }

    const { title, duration, description, price, video, category } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Thumbnail image is required.' });
    }

    const course = new Course({
      title,
      duration,
      description,
      price,
      thumbnail: req.file.path, // ✅ Cloudinary URL
      video,
      category,
      instructor: user._id,
    });

    await course.save();

    res.status(201).json(course);
  } catch (err) {
    console.error('Create Course Error:', err);
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
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, price, duration, video, category } = req.body;

    course.title = title;
    course.description = description;
    course.price = price;
    course.duration = duration;
    course.video = video;
    course.category = category;

    if (req.file) {
      course.thumbnail = req.file.path; // ✅ From cloudinaryUpload.middleware
    }

    await course.save();

    res.json({ message: 'Course updated', course });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Delete a course
exports. = req.params;

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

