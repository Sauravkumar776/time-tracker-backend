import Redis from 'ioredis';
import { logger } from '../utils/logger';

export const redisClient = new Redis('process.env.REDIS_URL');

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

export const REDIS_KEYS = {
  ACTIVE_SESSIONS: 'active_sessions',
  USER_TRACKING: (userId: string) => `tracking:${userId}`,
  PROJECT_ANALYTICS: (projectId: string) => `project:analytics:${projectId}`,
  TEAM_PRESENCE: (teamId: string) => `team:presence:${teamId}`
};