const Course = require('../models/course.model');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;
    const course = await Course.create({ title, description, price, thumbnail });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;
    const updated = await Course.update(
      { title, description, price, thumbnail },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Course updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
