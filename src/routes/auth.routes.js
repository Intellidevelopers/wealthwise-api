const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
const upload = require('../middleware/cloudinaryUpload.middleware'); // or multer if using local storage

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);

// 👇 update route to support avatar upload
router.put('/profile', protect, upload.single('avatar'), authController.updateProfile);

router.post('/logout', protect, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.showResetForm);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
