import { Request, Response } from 'express';
import { Team } from '../models/Team';
import { logger } from '../utils/logger';
import { validateTeam } from '../utils/validators';

export const teamController = {
  create: async (req: Request, res: Response) => {
    try {
      const { error } = validateTeam(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const team = new Team({
        ...req.body,
        manager: req.user._id,
        members: [...new Set([...req.body.members, req.user._id])] // Ensure manager is a member
      });

      await team.save();
      res.status(201).json(team);
    } catch (error) {
      logger.error('Error creating team:', error);
      res.status(400).json({ message: 'Error creating team' });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const teams = await Team.find({
        $or: [
          { manager: req.user._id },
          { members: req.user._id }
        ]
      })
        .populate('manager', 'firstName lastName email')
        .populate('members', 'firstName lastName email');
      res.json(teams);
    } catch (error) {
      logger.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Error fetching teams' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { error } = validateTeam(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const team = await Team.findOneAndUpdate(
        { _id: req.params.id, manager: req.user._id },
        { ...req.body, members: [...new Set([...req.body.members, req.user._id])] },
        { new: true }
      );

      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      res.json(team);
    } catch (error) {
      logger.error('Error updating team:', error);
      res.status(400).json({ message: 'Error updating team' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const team = await Team.findOneAndDelete({
        _id: req.params.id,
        manager: req.user._id
      });

      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      logger.error('Error deleting team:', error);
      res.status(500).json({ message: 'Error deleting team' });
    }
  }
};