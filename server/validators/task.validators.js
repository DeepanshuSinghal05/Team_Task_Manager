const { body, query } = require('express-validator');

const taskValidation = [
  body('title').trim().notEmpty().isLength({ max: 200 }).withMessage('Title is required and max 200 chars'),
  body('status').optional().isIn(['todo', 'in_progress', 'in_review', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be valid')
    .custom((value) => {
      const input = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (input < today) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
];

const taskQueryValidation = [
  query('status').optional().isIn(['todo', 'in_progress', 'in_review', 'done']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('assignee_id').optional().isInt({ min: 1 }),
];

module.exports = { taskValidation, taskQueryValidation };
