const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const signToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(name || '').trim();
    const normalizedPassword = String(password || '');
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);

    if (existing.length) {
      return res.status(400).json({ success: false, message: 'Email already in use', errors: [] });
    }

    const hash = await bcrypt.hash(normalizedPassword, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      normalizedName,
      normalizedEmail,
      hash,
      'member',
    ]);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: result.insertId, name: normalizedName, email: normalizedEmail, role: 'member' },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', errors: [] });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(normalizedPassword, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', errors: [] });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res) => res.status(200).json({ success: true, message: 'Logout successful', data: null });

const me = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found', errors: [] });
    }

    return res.status(200).json({ success: true, message: 'Profile fetched', data: rows[0] });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, logout, me };
