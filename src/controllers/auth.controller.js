const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const sendEmail = require('../utils/mailer');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../utils/token');


exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role,
      otp,
      otpExpires
    });

    const welcomePath = path.join(__dirname, '../templates/welcome.html');
    let welcomeHTML = fs.readFileSync(welcomePath, 'utf8');
    welcomeHTML = welcomeHTML.replace('{{name}}', firstName);

    const otpTemplatePath = path.join(__dirname, '../templates/otp.html');
    let otpHTML = fs.readFileSync(otpTemplatePath, 'utf8');
    otpHTML = otpHTML.replace('{{name}}', firstName).replace('{{otp}}', otp);

    await sendEmail(normalizedEmail, 'Welcome to WealthWise', welcomeHTML);
    await sendEmail(normalizedEmail, 'Your WealthWise OTP Code', otpHTML);

    res.status(201).json({
      message: 'Signup successful. OTP sent to email for verification.',
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const token = generateToken(user._id, user.role);

    const loginPath = path.join(__dirname, '../templates/login-notify.html');
    let loginHTML = fs.readFileSync(loginPath, 'utf8');
    loginHTML = loginHTML.replace('{{name}}', user.firstName);

    await sendEmail(email, 'New Login Alert - WealthWise', loginHTML);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = Date.now() + 3600000;
  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;
  await user.save();

  const resetUrl = `https://wealthwise-instructor.vercel.app/reset-password?token=${resetToken}`;


  // Read template file
  const templatePath = path.join(__dirname, '../templates/reset-password.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // Inject values
  html = html.replace('{{name}}', user.firstName);
  html = html.replace('{{resetUrl}}', resetUrl);

  await sendEmail(user.email, 'Reset Your WealthWise Password', html);
  res.json({ message: 'Password reset link sent' });
};


exports.resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  res.json({ message: 'Password has been reset' });
};


exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
};


// Controller example
exports.updateProfile = async (req, res) => {
  try {
    console.log('req.file:', req.file); // 🕵️ This will show Cloudinary upload results
    console.log('req.body:', req.body); // 🕵️ Check if all fields including names are there

    const { firstName, lastName, phone, bio, specialization } = req.body;

    const updates = {
      firstName,
      lastName,
      phone,
      bio,
      specialization,
    };

    if (req.file?.path) {
      updates.avatar = req.file.path;
    } else {
      console.warn('No file uploaded or file.path missing');
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update error:', err); // 💥 Backend error log
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};



exports.logout = async (req, res) => {
  res.json({ message: 'Logged out' });
};


exports.showResetForm = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Invalid or missing token.');
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Reset Password</title>
        <style>
          body { font-family: Arial; padding: 2rem; }
          input { display: block; margin: 1rem 0; padding: 0.5rem; width: 100%; max-width: 300px; }
          button { padding: 0.5rem 1rem; }
        </style>
      </head>
      <body>
        <h2>Reset Your Password</h2>
        <input type="password" id="password" placeholder="New Password" required />
        <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
        <button onclick="submitReset()">Reset Password</button>

        <script>
          function submitReset() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const token = new URLSearchParams(window.location.search).get('token');

            if (!password || !confirmPassword) {
              alert('All fields are required.');
              return;
            }

            if (password !== confirmPassword) {
              alert('Passwords do not match.');
              return;
            }

            fetch('https://wealthwise-api.onrender.com/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, password, confirmPassword })
            })
              .then(res => res.json())
              .then(data => {
                alert(data.message || 'Password reset completed.');
              })
              .catch(err => {
                console.error(err);
                alert('Something went wrong.');
              });
          }
        </script>
      </body>
    </html>
  `);
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpires ||
    Date.now() > user.otpExpires
  ) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otp = null;
  user.otpExpires = null;
  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: 'OTP verified successfully' });
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // (Optional) Send farewell email
    const goodbyePath = path.join(__dirname, '../templates/goodbye.html');
    if (fs.existsSync(goodbyePath)) {
      let goodbyeHTML = fs.readFileSync(goodbyePath, 'utf8');
      goodbyeHTML = goodbyeHTML.replace('{{name}}', user.firstName);
      await sendEmail(user.email, 'Account Deleted - WealthWise', goodbyeHTML);
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};
