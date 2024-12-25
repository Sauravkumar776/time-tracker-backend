import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rl:', // Redis key prefix
    }),
    windowMs,
    max,
    message: {
      error: 'Too many requests, please try again later.',
      retryAfter: windowMs / 1000
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};