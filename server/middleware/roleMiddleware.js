const pool = require('../config/db');

const roleMiddleware = (requiredRole = 'member') => {
  return async (req, res, next) => {
    const projectId = Number(req.params.id || req.params.projectId);

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project id is required', errors: [] });
    }

    try {
      const [rows] = await pool.query(
        `SELECT role FROM project_members WHERE project_id = ? AND user_id = ? LIMIT 1`,
        [projectId, req.user.id]
      );

      if (!rows.length) {
        return res.status(403).json({ success: false, message: 'Access denied', errors: [] });
      }

      const role = rows[0].role;
      if (requiredRole === 'admin' && role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin role required', errors: [] });
      }

      req.projectRole = role;
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = roleMiddleware;
