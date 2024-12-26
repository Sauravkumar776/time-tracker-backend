import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { TimeEntry } from '../models/TimeEntry'; // Assuming TimeEntry model for time tracking
import { logger } from '../utils/logger';
import { validateProject, validateTimeEntry } from '../utils/validators';

export const projectController = {
  // Create a new project
  create: async (req: Request, res: Response) => {
    try {
      const { error } = validateProject(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const project = new Project({
        ...req.body,
        manager: req.user._id,
      });
      await project.save();

      res.status(201).json(project);
    } catch (error) {
      logger.error('Error creating project:', error);
      res.status(500).json({ message: 'Error creating project' });
    }
  },

  // Get all projects for the authenticated user
  getAll: async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: req.user._id },
          { members: req.user._id },
        ],
      }).populate('manager', 'firstName lastName email');

      res.json(projects);
    } catch (error) {
      logger.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects' });
    }
  },

  // Get project by ID with time tracking details
  getById: async (req: Request, res: Response) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        $or: [
          { manager: req.user._id },
          { members: req.user._id },
        ],
      })
        .populate('members', 'firstName lastName email')
        .lean();

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const timeEntries = await TimeEntry.find({ projectId: project._id });
      res.json({ ...project, timeEntries });
    } catch (error) {
      logger.error('Error fetching project:', error);
      res.status(500).json({ message: 'Error fetching project' });
    }
  },

  // Update a project
  update: async (req: Request, res: Response) => {
    try {
      const { error } = validateProject(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, manager: req.user._id },
        req.body,
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      logger.error('Error updating project:', error);
      res.status(500).json({ message: 'Error updating project' });
    }
  },

  // Add a member to a project
  addMember: async (req: Request, res: Response) => {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, manager: req.user._id },
        { $addToSet: { members: req.body.userId } },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      logger.error('Error adding member:', error);
      res.status(500).json({ message: 'Error adding member' });
    }
  },

  // Remove a member from a project
  removeMember: async (req: Request, res: Response) => {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, manager: req.user._id },
        { $pull: { members: req.params.userId } },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      logger.error('Error removing member:', error);
      res.status(500).json({ message: 'Error removing member' });
    }
  },

  // Log time entries for a project
  logTime: async (req: Request, res: Response) => {
    try {
      const { error } = validateTimeEntry(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const project = await Project.findById(req.body.projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (!project.members.includes(req.user._id) && project.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to log time for this project' });
      }

      const timeEntry = new TimeEntry({
        ...req.body,
        userId: req.user._id,
      });
      await timeEntry.save();

      res.status(201).json(timeEntry);
    } catch (error) {
      logger.error('Error logging time entry:', error);
      res.status(500).json({ message: 'Error logging time entry' });
    }
  },
};