import express from 'express';
import { taskController } from '../controllers/task.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', taskController.create);
router.get('/project/:projectId', taskController.getProjectTasks);
router.get('/user', taskController.getUserTasks);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;