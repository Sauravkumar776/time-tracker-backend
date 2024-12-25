import Joi from 'joi';
import { ReportType, ReportFormat } from '@/services/report/types';

const reportTypes: ReportType[] = ['daily', 'weekly', 'monthly', 'custom'];
const reportFormats: ReportFormat[] = ['pdf', 'csv', 'excel'];

export const validateRegistration = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    company: Joi.string().optional()
  });
  return schema.validate(data);
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

export const validateProject = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    color: Joi.string().optional(),
    client: Joi.string().optional(),
    hourlyRate: Joi.number().min(0).optional(),
    budget: Joi.number().min(0).optional(),
    status: Joi.string().valid('active', 'completed', 'archived'),
    startDate: Joi.date().optional()
  });
  return schema.validate(data);
};

export const validateTask = (data: any) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    project: Joi.string().required(),
    assignee: Joi.string().optional(),
    team: Joi.string().optional(),
    status: Joi.string().valid('todo', 'in_progress', 'review', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date().optional(),
    estimatedHours: Joi.number().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  });
  return schema.validate(data);
};

export const validateTeam = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    members: Joi.array().items(Joi.string()).required(),
    company: Joi.string().required(),
    color: Joi.string().optional()
  });
  return schema.validate(data);
};

export const validateReportRequest = (data: any) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...reportTypes)
      .required(),
    format: Joi.string()
      .valid(...reportFormats)
      .required(),
    dateRange: Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date()
        .min(Joi.ref('startDate'))
        .required()
    }).required(),
    filters: Joi.object({
      projects: Joi.array().items(Joi.string()),
      teams: Joi.array().items(Joi.string()),
      users: Joi.array().items(Joi.string()),
      tasks: Joi.array().items(Joi.string())
    }).optional(),
    includeInactive: Joi.boolean().default(false),
    groupBy: Joi.string().valid('user', 'project', 'team', 'task').optional()
  });

  return schema.validate(data);
};