const pool = require('../config/db');

const listTasks = async (req, res, next) => {
  try {
    const { status, priority, assignee_id } = req.query;
    const where = ['t.project_id = ?'];
    const values = [req.params.projectId];

    if (status) {
      where.push('t.status = ?');
      values.push(status);
    }

    if (priority) {
      where.push('t.priority = ?');
      values.push(priority);
    }

    if (assignee_id) {
      where.push('t.assignee_id = ?');
      values.push(Number(assignee_id));
    }

    if (req.user.role !== 'admin') {
      where.push('t.assignee_id = ?');
      values.push(req.user.id);
    }

    const [rows] = await pool.query(
      `SELECT t.*, u.name AS assignee_name, u.email AS assignee_email
       FROM tasks t
       LEFT JOIN users u ON u.id = t.assignee_id
       WHERE ${where.join(' AND ')}
       ORDER BY t.updated_at DESC`,
      values
    );

    return res.status(200).json({ success: true, message: 'Tasks fetched', data: rows });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignee_id, due_date } = req.body;
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, status || 'todo', priority || 'medium', req.params.projectId, assignee_id || null, due_date || null]
    );

    return res.status(201).json({ success: true, message: 'Task created', data: { id: result.insertId } });
  } catch (error) {
    return next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND project_id = ? LIMIT 1', [req.params.taskId, req.params.projectId]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Task not found', errors: [] });
    }

    if (req.user.role !== 'admin' && rows[0].assignee_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Members can only access assigned tasks', errors: [] });
    }

    return res.status(200).json({ success: true, message: 'Task fetched', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignee_id, due_date } = req.body;
    await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, assignee_id = ?, due_date = ?
       WHERE id = ? AND project_id = ?`,
      [title, description || null, status, priority, assignee_id || null, due_date || null, req.params.taskId, req.params.projectId]
    );

    return res.status(200).json({ success: true, message: 'Task updated', data: null });
  } catch (error) {
    return next(error);
  }
};

const patchTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const [taskRows] = await pool.query('SELECT assignee_id FROM tasks WHERE id = ? AND project_id = ? LIMIT 1', [
      req.params.taskId,
      req.params.projectId,
    ]);

    if (!taskRows.length) {
      return res.status(404).json({ success: false, message: 'Task not found', errors: [] });
    }

    const isAssigned = taskRows[0].assignee_id === req.user.id;
    if (req.projectRole !== 'admin' && !isAssigned) {
      return res.status(403).json({ success: false, message: 'Forbidden to update this task status', errors: [] });
    }

    await pool.query('UPDATE tasks SET status = ? WHERE id = ? AND project_id = ?', [status, req.params.taskId, req.params.projectId]);
    return res.status(200).json({ success: true, message: 'Task status updated', data: null });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ? AND project_id = ?', [req.params.taskId, req.params.projectId]);
    return res.status(200).json({ success: true, message: 'Task deleted', data: null });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listTasks, createTask, getTaskById, updateTask, patchTaskStatus, deleteTask };
