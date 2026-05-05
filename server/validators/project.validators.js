const { body } = require('express-validator');

const projectValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 150 }).withMessage('Project name must be 2-150 chars'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*.email').optional().isEmail().withMessage('Member email must be valid'),
  body('members.*.role').optional().isIn(['admin', 'member']).withMessage('Member role must be admin or member'),
];

const memberValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['admin', 'member']).withMessage('Role must be admin or member'),
];

module.exports = { projectValidation, memberValidation };
