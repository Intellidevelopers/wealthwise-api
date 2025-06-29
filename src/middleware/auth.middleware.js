const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('🔐 JWT Decoded:', decoded); // ✅ Add this
    const user = await User.findById(decoded.id); // MongoDB method

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('✅ Authenticated User ID:', user._id.toString()); // ✅ Add this

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Auth Middleware Error:', err); // ✅ Add this
    res.status(403).json({ message: 'Forbidden' });
  }
};
