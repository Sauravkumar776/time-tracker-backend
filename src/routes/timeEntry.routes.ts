import express from 'express';
import { timeEntryController } from '../controllers/timeEntry.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', timeEntryController.create);
router.get('/user', timeEntryController.getUserEntries);
router.put('/:id', timeEntryController.update);
router.put('/:id/stop', timeEntryController.stop);
router.delete('/:id', timeEntryController.delete);

export default router;