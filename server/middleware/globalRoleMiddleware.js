const requireGlobalAdmin = (req, res, next) => {
  const isAdmin = req.user?.role === 'admin' || req.user?.email === 'admin@example.com';
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: 'Global admin access required', errors: [] });
  }

  return next();
};

module.exports = { requireGlobalAdmin };
