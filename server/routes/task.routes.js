const express = require('express');
const controller = require('../controllers/task.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../validators/handleValidation');
const { taskValidation, taskQueryValidation } = require('../validators/task.validators');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware, roleMiddleware('member'));

router.get('/', taskQueryValidation, handleValidation, controller.listTasks);
router.post('/', roleMiddleware('admin'), taskValidation, handleValidation, controller.createTask);
router.get('/:taskId', controller.getTaskById);
router.put('/:taskId', roleMiddleware('admin'), taskValidation, handleValidation, controller.updateTask);
router.patch('/:taskId/status', controller.patchTaskStatus);
router.delete('/:taskId', roleMiddleware('admin'), controller.deleteTask);

module.exports = router;
