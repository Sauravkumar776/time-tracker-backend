// import { Request, Response } from 'express';
// import { Report } from '../models/Report';
// import { TimeEntry } from '../models/TimeEntry';
// import { Screenshot } from '../models/Screenshot';
// import { logger } from '../utils/logger';
// import { generateReport } from '../utils/reportGenerator';
// import { validateReportRequest } from '../utils/validators';

// export const reportController = {
//   generate: async (req: Request, res: Response) => {
//     try {
//       const { error } = validateReportRequest(req.body);
//       if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//       }

//       const { type, dateRange, projectId, format } = req.body;

//       // Create report record
//       const report = new Report({
//         user: req.user._id,
//         project: projectId,
//         type,
//         dateRange,
//         format,
//         status: 'pending'
//       });

//       await report.save();

//       // Generate report asynchronously
//       // generateReport(report._id)
//       //   .then(async (result) => {
//       //     await Report.findByIdAndUpdate(report._id, {
//       //       status: 'generated',
//       //       downloadUrl: result.url,
//       //       metrics: result.metrics
//       //     });
//       //   })
//       //   .catch(async (error) => {
//       //     logger.error('Report generation failed:', error);
//       //     await Report.findByIdAndUpdate(report._id, { status: 'failed' });
//       //   });

//       res.status(202).json({
//         message: 'Report generation started',
//         reportId: report._id
//       });
//     } catch (error) {
//       logger.error('Error initiating report:', error);
//       res.status(500).json({ message: 'Error initiating report generation' });
//     }
//   },

//   getStatus: async (req: Request, res: Response) => {
//     try {
//       const report = await Report.findOne({
//         _id: req.params.id,
//         user: req.user._id
//       });

//       if (!report) {
//         return res.status(404).json({ message: 'Report not found' });
//       }

//       res.json(report);
//     } catch (error) {
//       logger.error('Error fetching report status:', error);
//       res.status(500).json({ message: 'Error fetching report status' });
//     }
//   },

//   getUserReports: async (req: Request, res: Response) => {
//     try {
//       const reports = await Report.find({
//         user: req.user._id
//       })
//         .sort('-createdAt')
//         .populate('project', 'name');
      
//       res.json(reports);
//     } catch (error) {
//       logger.error('Error fetching user reports:', error);
//       res.status(500).json({ message: 'Error fetching reports' });
//     }
//   }
// };