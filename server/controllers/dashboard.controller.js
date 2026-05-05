const pool = require('../config/db');

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [[projectCount]] = await pool.query(
      `SELECT COUNT(DISTINCT p.id) AS total_projects
       FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id
       WHERE p.owner_id = ? OR pm.user_id = ?`,
      [userId, userId]
    );

    const [[assignedCount]] = await pool.query('SELECT COUNT(*) AS total_assigned_tasks FROM tasks WHERE assignee_id = ?', [userId]);

    const [statusRows] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM tasks
       WHERE assignee_id = ?
       GROUP BY status`,
      [userId]
    );

    const [overdueRows] = await pool.query(
      `SELECT * FROM tasks
       WHERE assignee_id = ? AND due_date < CURDATE() AND status != 'done'
       ORDER BY due_date ASC`,
      [userId]
    );

    const [recentRows] = await pool.query(
      `SELECT t.* FROM tasks t
       JOIN projects p ON p.id = t.project_id
       LEFT JOIN project_members pm ON pm.project_id = p.id
       WHERE p.owner_id = ? OR pm.user_id = ?
       GROUP BY t.id
       ORDER BY t.updated_at DESC
       LIMIT 5`,
      [userId, userId]
    );

    const grouped = { todo: 0, in_progress: 0, in_review: 0, done: 0 };
    statusRows.forEach((item) => {
      grouped[item.status] = item.count;
    });

    return res.status(200).json({
      success: true,
      message: 'Dashboard data fetched',
      data: {
        total_projects: projectCount.total_projects,
        total_assigned_tasks: assignedCount.total_assigned_tasks,
        tasks_by_status: grouped,
        overdue_tasks: overdueRows,
        recent_tasks: recentRows,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboard };
