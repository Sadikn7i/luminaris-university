const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — please log in',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied — admin only',
    });
  }

  next();
};

module.exports = { adminOnly };