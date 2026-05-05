const pool = require('../config/db');

const listProjects = async (req, res, next) => {
  try {
    let rows;

    if (req.user.role === 'admin') {
      [rows] = await pool.query(
        `SELECT DISTINCT p.* FROM projects p
         LEFT JOIN project_members pm ON pm.project_id = p.id
         WHERE p.owner_id = ? OR pm.user_id = ?
         ORDER BY p.created_at DESC`,
        [req.user.id, req.user.id]
      );
    } else {
      [rows] = await pool.query(
        `SELECT DISTINCT p.* FROM projects p
         INNER JOIN tasks t ON t.project_id = p.id
         INNER JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = ?
         WHERE t.assignee_id = ?
         ORDER BY p.created_at DESC`,
        [req.user.id, req.user.id]
      );
    }

    return res.status(200).json({ success: true, message: 'Projects fetched', data: rows });
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { name, description, members = [] } = req.body;
    const [project] = await conn.query('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)', [
      name,
      description || null,
      req.user.id,
    ]);

    await conn.query('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)', [
      project.insertId,
      req.user.id,
      'admin',
    ]);

    if (members.length) {
      const cleaned = members
        .map((member) => ({
          email: String(member.email || '').trim().toLowerCase(),
          role: member.role === 'admin' ? 'admin' : 'member',
        }))
        .filter((member) => member.email && member.email !== req.user.email);

      for (const member of cleaned) {
        const [userRows] = await conn.query('SELECT id FROM users WHERE email = ? LIMIT 1', [member.email]);
        if (!userRows.length) {
          await conn.rollback();
          return res.status(404).json({
            success: false,
            message: `User with email ${member.email} not found`,
            errors: [{ field: 'members', message: `User ${member.email} not found` }],
          });
        }

        await conn.query(
          'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)',
          [project.insertId, userRows[0].id, member.role]
        );
      }
    }

    await conn.commit();
    return res.status(201).json({
      success: true,
      message: 'Project created',
      data: { id: project.insertId, name, description, owner_id: req.user.id },
    });
  } catch (error) {
    await conn.rollback();
    return next(error);
  } finally {
    conn.release();
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);

    const [projectRows] = await pool.query('SELECT * FROM projects WHERE id = ? LIMIT 1', [projectId]);
    if (!projectRows.length) {
      return res.status(404).json({ success: false, message: 'Project not found', errors: [] });
    }

    if (req.user.role !== 'admin') {
      const [assignedRows] = await pool.query(
        'SELECT id FROM tasks WHERE project_id = ? AND assignee_id = ? LIMIT 1',
        [projectId, req.user.id]
      );

      if (!assignedRows.length) {
        return res.status(403).json({ success: false, message: 'Members can only access projects with assigned tasks', errors: [] });
      }
    }

    const [memberRows] = await pool.query(
      `SELECT pm.user_id, pm.role, pm.joined_at, u.name, u.email
       FROM project_members pm
       JOIN users u ON u.id = pm.user_id
       WHERE pm.project_id = ?`,
      [projectId]
    );

    return res.status(200).json({
      success: true,
      message: 'Project details fetched',
      data: { ...projectRows[0], members: memberRows },
    });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description || null, req.params.id]);
    return res.status(200).json({ success: true, message: 'Project updated', data: null });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    return res.status(200).json({ success: true, message: 'Project deleted', data: null });
  } catch (error) {
    return next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const [users] = await pool.query('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [email]);

    if (!users.length) {
      return res.status(404).json({ success: false, message: 'User not found', errors: [] });
    }

    const user = users[0];
    await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)',
      [req.params.id, user.id, role]
    );

    return res.status(201).json({ success: true, message: 'Member added/updated', data: { ...user, role } });
  } catch (error) {
    return next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [req.params.id, req.params.userId]);
    return res.status(200).json({ success: true, message: 'Member removed', data: null });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listProjects, createProject, getProjectById, updateProject, deleteProject, addMember, removeMember };
