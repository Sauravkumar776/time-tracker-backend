import express from 'express';
import { projectController } from '../controllers/project.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', authorize('manager', 'admin', 'user'), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.put('/:id', authorize('manager', 'admin'), projectController.update);
router.post('/:id/members', authorize('manager', 'admin'), projectController.addMember);
router.delete('/:id/members/:userId', authorize('manager', 'admin'), projectController.removeMember);

export default router;