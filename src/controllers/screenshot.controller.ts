import { Request, Response } from 'express';
import { Screenshot } from '../models/Screenshot';
import { TimeEntry } from '../models/TimeEntry';
import { logger } from '../utils/logger';

export const screenshotController = {
  create: async (req: Request, res: Response) => {
    try {
      const { timeEntryId, imageUrl, activityLevel, metadata } = req.body;

      // Verify time entry exists and belongs to user
      const timeEntry = await TimeEntry.findOne({
        _id: timeEntryId,
        user: req.user._id,
        status: 'ongoing'
      });

      if (!timeEntry) {
        return res.status(404).json({ message: 'Active time entry not found' });
      }

      const screenshot = new Screenshot({
        timeEntry: timeEntryId,
        user: req.user._id,
        imageUrl,
        activityLevel,
        metadata
      });

      await screenshot.save();
      res.status(201).json(screenshot);
    } catch (error) {
      logger.error('Error creating screenshot:', error);
      res.status(400).json({ message: 'Error creating screenshot' });
    }
  },

  getByTimeEntry: async (req: Request, res: Response) => {
    try {
      const screenshots = await Screenshot.find({
        timeEntry: req.params.timeEntryId,
        user: req.user._id
      }).sort('-timestamp');
      res.json(screenshots);
    } catch (error) {
      logger.error('Error fetching screenshots:', error);
      res.status(500).json({ message: 'Error fetching screenshots' });
    }
  }
};