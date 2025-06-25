// File: src/controllers/auth.controller.js
const Op = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const sendEmail = require('../utils/mailer');



exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, phone, password: hashedPassword, role });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({
  token,
  user: {
    id: user.id,
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({
  token,
  user: {
    id: user.id,
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
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = Date.now() + 3600000; // 1 hour
  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;
  await user.save();

  const resetUrl = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}`;
  await sendEmail(user.email, 'Password Reset', `Reset your password using this link: ${resetUrl}`);
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
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() }
    }
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
  const user = await User.findByPk(req.user.id);
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  await User.update({ firstName, lastName, phone }, { where: { id: req.user.id } });
  res.json({ message: 'Profile updated' });
};

exports.logout = async (req, res) => {
  // Token is handled on client; optionally implement blacklist logic here
  res.json({ message: 'Logged out' });
};

// src/controllers/auth.controller.js
// src/controllers/auth.controller.js
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

            fetch('/api/auth/reset-password', {
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

