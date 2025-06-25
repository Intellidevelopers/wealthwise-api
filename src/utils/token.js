const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generates a JWT token for a user
 * @param {string} userId - User ID
 * @param {string} role - User role (optional, default: 'user')
 * @returns {string} JWT token
 */
exports.generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
