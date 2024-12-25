// import express from 'express';
// import { reportController } from '../controllers/report.controller';
// import { protect, authorize } from '../middleware/auth';
// import { validateRequest } from '../middleware/validateRequest';
// import { validateReportRequest } from '../utils/validators';

// const router = express.Router();

// router.use(protect);

// // Generate reports
// router.post('/', 
//   validateRequest(validateReportRequest), 
//   reportController.generate
// );

// router.get('/user', reportController.getUserReports);
// router.get('/:id', reportController.getStatus);

// // Team reports (requires manager/admin)
// router.get('/team/:teamId', 
//   authorize('manager', 'admin'), 
//   reportController.getTeamReport
// );

// // Project reports
// router.get('/project/:projectId', 
//   authorize('manager', 'admin'), 
//   reportController.getProjectReport
// );

// // Export reports
// router.get('/:id/export/:format', reportController.exportReport);

// export default router;