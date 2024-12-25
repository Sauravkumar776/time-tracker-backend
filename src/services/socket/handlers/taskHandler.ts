import { Server, Socket } from 'socket.io';
import { logger } from '../../../utils/logger';
import { redisClient } from '../../../config/redis';

export const handleTaskEvents = (io: Server, socket: Socket) => {
  // Join task room
  socket.on('task:join', (taskId: string) => {
    socket.join(`task:${taskId}`);
  });

  // Handle task updates
  socket.on('task:update', async (data) => {
    try {
      const { taskId, update } = data;
      io.to(`task:${taskId}`).emit('task:updated', update);
      
      // Store notification in Redis
      await redisClient.lpush('notifications:tasks', JSON.stringify({
        taskId,
        update,
        timestamp: new Date()
      }));
    } catch (error) {
      logger.error('Error handling task update:', error);
    }
  });
};