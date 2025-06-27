module.exports = (requiredRole) => (req, res, next) => {
  if (!req.user || req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Forbidden. ' + requiredRole + 's only.' });
  }
  next();
};
