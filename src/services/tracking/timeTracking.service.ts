import { redisClient, REDIS_KEYS } from '../../config/redis';
import { TimeEntry } from '../../models/TimeEntry';
import {Task} from '../../models/Task';
import { logger } from '../../utils/logger';

export class TimeTrackingService {
  async startTracking(userId: string, data: {
    projectId: string;
    taskId?: string;
    description: string;
  }) {
    try {
      const userKey = REDIS_KEYS.USER_TRACKING(userId);
      
      // Check if user is already tracking
      const activeSession = await redisClient.get(userKey);
      if (activeSession) {
        throw new Error('User already has an active tracking session');
      }

      const timeEntry = new TimeEntry({
        user: userId,
        project: data.projectId,
        task: data.taskId,
        description: data.description,
        startTime: new Date(),
        status: 'ongoing'
      });

      await timeEntry.save();

      // Store active session in Redis
      await redisClient.set(userKey, JSON.stringify({
        timeEntryId: timeEntry._id,
        startTime: timeEntry.startTime,
        projectId: data.projectId,
        taskId: data.taskId
      }));

      // Add to active sessions set
      await redisClient.sadd(REDIS_KEYS.ACTIVE_SESSIONS, userId);

      return timeEntry;
    } catch (error) {
      logger.error('Error starting time tracking:', error);
      throw error;
    }
  }

  async stopTracking(userId: string) {
    try {
      const userKey = REDIS_KEYS.USER_TRACKING(userId);
      const sessionData = await redisClient.get(userKey);

      if (!sessionData) {
        throw new Error('No active tracking session found');
      }

      const { timeEntryId, taskId } = JSON.parse(sessionData);

      const timeEntry = await TimeEntry.findById(timeEntryId);
      if (!timeEntry) {
        throw new Error('Time entry not found');
      }

      timeEntry.endTime = new Date();
      timeEntry.status = 'completed';
      await timeEntry.save();

      // Update task actual hours if task exists
      if (taskId) {
        await this.updateTaskHours(taskId);
      }

      // Clear Redis data
      await Promise.all([
        redisClient.del(userKey),
        redisClient.srem(REDIS_KEYS.ACTIVE_SESSIONS, userId)
      ]);

      return timeEntry;
    } catch (error) {
      logger.error('Error stopping time tracking:', error);
      throw error;
    }
  }

  private async updateTaskHours(taskId: string) {
    const task = await Task.findById(taskId);
    if (task) {
      const timeEntries = await TimeEntry.find({ task: taskId });
      const totalHours = timeEntries.reduce((acc, entry) => {
        return acc + (entry.duration || 0) / 3600;
      }, 0);
      
      task.actualHours = totalHours;
      await task.save();
    }
  }

  async getActiveUsers() {
    try {
      const activeUsers = await redisClient.smembers(REDIS_KEYS.ACTIVE_SESSIONS);
      return activeUsers;
    } catch (error) {
      logger.error('Error getting active users:', error);
      throw error;
    }
  }
}