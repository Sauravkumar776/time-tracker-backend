import { Request, Response } from 'express';
import { TimeEntry } from '../models/TimeEntry';
import { logger } from '../utils/logger';

export const timeEntryController = {
  // Create a new time entry
  create: async (req: Request, res: Response) => {
    try {
      const timeEntry = new TimeEntry({
        ...req.body,
        user: req.user._id
      });
      await timeEntry.save();
      res.status(201).json(timeEntry);
    } catch (error) {
      logger.error('Error creating time entry:', error);
      res.status(400).json({ message: 'Error creating time entry' });
    }
  },

  // Get all time entries for a user
  getUserEntries: async (req: Request, res: Response) => {
    try {
      const timeEntries = await TimeEntry.find({ user: req.user._id })
        .populate('project', 'name')
        .sort('-startTime');
      res.json(timeEntries);
    } catch (error) {
      logger.error('Error fetching time entries:', error);
      res.status(500).json({ message: 'Error fetching time entries' });
    }
  },

  // Update a time entry
  update: async (req: Request, res: Response) => {
    try {
      const timeEntry = await TimeEntry.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
      );
      if (!timeEntry) {
        return res.status(404).json({ message: 'Time entry not found' });
      }
      res.json(timeEntry);
    } catch (error) {
      logger.error('Error updating time entry:', error);
      res.status(400).json({ message: 'Error updating time entry' });
    }
  },

  // Stop time tracking
  stop: async (req: Request, res: Response) => {
    try {
      const timeEntry = await TimeEntry.findOne({
        _id: req.params.id,
        user: req.user._id,
        status: 'ongoing'
      });

      if (!timeEntry) {
        return res.status(404).json({ message: 'Active time entry not found' });
      }

      timeEntry.endTime = new Date();
      timeEntry.status = 'completed';
      await timeEntry.save();

      res.json(timeEntry);
    } catch (error) {
      logger.error('Error stopping time entry:', error);
      res.status(400).json({ message: 'Error stopping time entry' });
    }
  },

  // Delete a time entry
  delete: async (req: Request, res: Response) => {
    try {
      const timeEntry = await TimeEntry.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });
      if (!timeEntry) {
        return res.status(404).json({ message: 'Time entry not found' });
      }
      res.json({ message: 'Time entry deleted' });
    } catch (error) {
      logger.error('Error deleting time entry:', error);
      res.status(500).json({ message: 'Error deleting time entry' });
    }
  }
};