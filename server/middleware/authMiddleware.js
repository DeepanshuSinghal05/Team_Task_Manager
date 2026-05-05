const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  let token = null;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized', errors: [] });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
    if (!decoded?.id || !decoded?.email) {
      throw new Error('Invalid token payload');
    }
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token', errors: [] });
  }
};

module.exports = authMiddleware;
