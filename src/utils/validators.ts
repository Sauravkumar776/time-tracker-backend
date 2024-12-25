import Joi from 'joi';

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