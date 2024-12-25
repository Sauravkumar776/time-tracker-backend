import { TimeEntry } from '../models/TimeEntry';
import { Screenshot } from '../models/Screenshot';
import { logger } from '../utils/logger';
import { ActivityMetrics } from '../types/activity.types';

export class ActivityService {
  private static readonly ACTIVITY_THRESHOLD = 30; // percentage
  private static readonly IDLE_TIMEOUT = 300000; // 5 minutes in milliseconds

  async calculateActivityMetrics(timeEntryId: string): Promise<ActivityMetrics> {
    try {
      const timeEntry = await TimeEntry.findById(timeEntryId);
      if (!timeEntry) {
        throw new Error('Time entry not found');
      }

      const screenshots = await Screenshot.find({ timeEntry: timeEntryId });
      
      const totalActivity = screenshots.reduce((sum, shot) => sum + shot.activityLevel, 0);
      const averageActivity = screenshots.length > 0 ? totalActivity / screenshots.length : 0;
      
      const idlePeriods = this.calculateIdlePeriods(screenshots);
      
      return {
        averageActivity,
        activeTime: timeEntry.duration || 0,
        idleTime: idlePeriods.totalIdleTime,
        idlePeriods: idlePeriods.periods,
        isProductiveSession: averageActivity >= ActivityService.ACTIVITY_THRESHOLD
      };
    } catch (error) {
      logger.error('Error calculating activity metrics:', error);
      throw error;
    }
  }

  private calculateIdlePeriods(screenshots: any[]): { 
    totalIdleTime: number;
    periods: Array<{ start: Date; end: Date }>;
  } {
    const periods: Array<{ start: Date; end: Date }> = [];
    let totalIdleTime = 0;

    for (let i = 1; i < screenshots.length; i++) {
      const timeDiff = screenshots[i].timestamp.getTime() - 
                      screenshots[i-1].timestamp.getTime();
      
      if (timeDiff > ActivityService.IDLE_TIMEOUT) {
        periods.push({
          start: screenshots[i-1].timestamp,
          end: screenshots[i].timestamp
        });
        totalIdleTime += timeDiff;
      }
    }

    return { totalIdleTime, periods };
  }
}