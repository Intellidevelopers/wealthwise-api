const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user' });
    }

    req.user = user; // ✅ Attach full user to req
    next();
  } catch (err) {
    console.error('❌ Authentication error:', err.message);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

// ✅ Middleware to restrict to admin role only
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin
};
