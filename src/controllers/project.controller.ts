import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { logger } from '../utils/logger';
import { validateProject } from '../utils/validators';

export const projectController = {
  create: async (req: Request, res: Response) => {
    try {
      const { error } = validateProject(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const project = new Project({
        ...req.body,
        manager: req.user._id
      });
      await project.save();

      
      res.status(201).json(project);
    } catch (error) {
      logger.error('Error creating project:', error);
      res.status(400).json({ message: 'Error creating project' });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: req.user._id },
          { members: req.user._id }
        ]
      }).populate('manager', 'firstName lastName email');
      res.json(projects);
    } catch (error) {
      logger.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects' });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        $or: [
          { manager: req.user._id },
          { members: req.user._id }
        ]
      }).populate('members', 'firstName lastName email');

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      logger.error('Error fetching project:', error);
      res.status(500).json({ message: 'Error fetching project' });
    }
  },

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
      res.status(400).json({ message: 'Error updating project' });
    }
  },

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
      res.status(400).json({ message: 'Error adding member' });
    }
  },

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
      res.status(400).json({ message: 'Error removing member' });
    }
  }
};