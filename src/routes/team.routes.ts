import express from 'express';
import { teamController } from '../controllers/team.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', authorize('manager', 'admin'), teamController.create);
router.get('/', teamController.getAll);
router.put('/:id', authorize('manager', 'admin'), teamController.update);
router.delete('/:id', authorize('manager', 'admin'), teamController.delete);

export default router;