const express = require('express');
const controller = require('../controllers/project.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { requireGlobalAdmin } = require('../middleware/globalRoleMiddleware');
const handleValidation = require('../validators/handleValidation');
const { projectValidation, memberValidation } = require('../validators/project.validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', controller.listProjects);
router.post('/', requireGlobalAdmin, projectValidation, handleValidation, controller.createProject);
router.get('/:id', roleMiddleware('member'), controller.getProjectById);
router.put('/:id', roleMiddleware('admin'), projectValidation, handleValidation, controller.updateProject);
router.delete('/:id', roleMiddleware('admin'), controller.deleteProject);
router.post('/:id/members', roleMiddleware('admin'), memberValidation, handleValidation, controller.addMember);
router.delete('/:id/members/:userId', roleMiddleware('admin'), controller.removeMember);

module.exports = router;
