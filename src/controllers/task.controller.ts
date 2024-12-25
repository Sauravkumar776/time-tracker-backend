import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { TimeEntry } from '../models/TimeEntry';
import { logger } from '../utils/logger';
import { validateTask } from '../utils/validators';

export const taskController = {
  create: async (req: Request, res: Response) => {
    try {
      const { error } = validateTask(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const task = new Task({
        ...req.body,
        assignee: req.body.assignee || req.user._id
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      logger.error('Error creating task:', error);
      res.status(400).json({ message: 'Error creating task' });
    }
  },

  getProjectTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId })
        .populate('assignee', 'firstName lastName email')
        .populate('team', 'name color');
      res.json(tasks);
    } catch (error) {
      logger.error('Error fetching project tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  },

  getUserTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ assignee: req.user._id })
        .populate('project', 'name')
        .populate('team', 'name color');
      res.json(tasks);
    } catch (error) {
      logger.error('Error fetching user tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { error } = validateTask(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Update actual hours if task is completed
      if (task.status === 'completed') {
        const timeEntries = await TimeEntry.find({ task: task._id });
        const totalHours = timeEntries.reduce((acc, entry) => {
          return acc + (entry.duration || 0) / 3600; // Convert seconds to hours
        }, 0);
        task.actualHours = totalHours;
        await task.save();
      }

      res.json(task);
    } catch (error) {
      logger.error('Error updating task:', error);
      res.status(400).json({ message: 'Error updating task' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      logger.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task' });
    }
  }
};