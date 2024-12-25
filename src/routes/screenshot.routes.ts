import express from 'express';
import { screenshotController } from '../controllers/screenshot.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', screenshotController.create);
router.get('/time-entry/:timeEntryId', screenshotController.getByTimeEntry);

export default router;