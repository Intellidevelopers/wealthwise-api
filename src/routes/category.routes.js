const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');

// Public
router.get('/', categoryController.getCategories);
router.get('/:id/courses', categoryController.getCoursesByCategory);

// Admin only
router.post('/', auth, restrictTo('admin'), categoryController.createCategory);
router.put('/:id', auth, restrictTo('admin'), categoryController.updateCategory);
router.delete('/:id', auth, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;
