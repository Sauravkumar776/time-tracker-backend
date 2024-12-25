import { Request, Response } from 'express';
import { TimeTrackingService } from '../services/tracking/timeTracking.service';
import { logger } from '../utils/logger';

const timeTrackingService = new TimeTrackingService();

export const timeTrackingController = {
  start: async (req: Request, res: Response) => {
    try {
      const timeEntry = await timeTrackingService.startTracking(
        req.user._id,
        req.body
      );
      res.status(201).json(timeEntry);
    } catch (error: any) {
      logger.error('Error in start tracking controller:', error);
      res.status(400).json({ message: error.message });
    }
  },

  stop: async (req: Request, res: Response) => {
    try {
      const timeEntry = await timeTrackingService.stopTracking(req.user._id);
      res.json(timeEntry);
    } catch (error: any) {
      logger.error('Error in stop tracking controller:', error);
      res.status(400).json({ message: error.message });
    }
  },

  getActiveUsers: async (req: Request, res: Response) => {
    try {
      const activeUsers = await timeTrackingService.getActiveUsers();
      res.json(activeUsers);
    } catch (error) {
      logger.error('Error getting active users:', error);
      res.status(500).json({ message: 'Error fetching active users' });
    }
  }
};