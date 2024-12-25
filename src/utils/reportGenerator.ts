import { TimeEntry } from '../models/TimeEntry';
import { Screenshot } from '../models/Screenshot';
import { Report } from '../models/Report';
import { logger } from './logger';

interface ReportResult {
  url: string;
  metrics: {
    totalHours: number;
    totalTasks: number;
    averageActivityLevel: number;
  };
}

export const generateReport = async (reportId: any): Promise<ReportResult> => {
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Fetch time entries
    const timeEntries = await TimeEntry.find({
      user: report.user,
      ...(report.project && { project: report.project }),
      startTime: { 
        $gte: report.dateRange.startDate,
        $lte: report.dateRange.endDate
      }
    });

    // Calculate metrics
    const totalHours = timeEntries.reduce((acc, entry) => {
      if (entry.duration) {
        return acc + (entry.duration / 3600); // Convert seconds to hours
      }
      return acc;
    }, 0);

    // Get screenshots and calculate average activity
    const screenshots = await Screenshot.find({
      timeEntry: { $in: timeEntries.map(entry => entry._id) }
    });

    const averageActivityLevel = screenshots.length > 0
      ? screenshots.reduce((acc, shot) => acc + shot.activityLevel, 0) / screenshots.length
      : 0;

    const metrics = {
      totalHours: Math.round(totalHours * 100) / 100,
      totalTasks: timeEntries.length,
      averageActivityLevel: Math.round(averageActivityLevel)
    };

    // Generate report file (implementation depends on format)
    const url = `https://storage.example.com/reports/${reportId}.${report.format}`;

    return { url, metrics };
  } catch (error) {
    logger.error('Report generation error:', error);
    throw error;
  }
};