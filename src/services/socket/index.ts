import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../../utils/logger';
import { redisClient, REDIS_KEYS } from '../../config/redis';
import { handleTaskEvents } from './handlers/taskHandler';
import { handleTimeTrackingEvents } from './handlers/timeTrackingHandler';
import { handleTeamEvents } from './handlers/teamHandler';

let io: Server;

export const initializeSocketIO = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Handle authentication
    socket.on('authenticate', async (token) => {
      try {
        // Verify token and attach user data to socket
        // Implementation depends on your auth strategy
      } catch (error) {
        socket.disconnect();
      }
    });

    // Initialize event handlers
    handleTaskEvents(io, socket);
    handleTimeTrackingEvents(io, socket);
    handleTeamEvents(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};