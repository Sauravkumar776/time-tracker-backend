// import { Server, Socket } from 'socket.io';
// import { logger } from '../../../utils/logger';
// import { redisClient, REDIS_KEYS } from '../../../config/redis';

// export const handleTimeTrackingEvents = (io: Server, socket: Socket) => {
//   socket.on('tracking:start', async (data) => {
//     try {
//       const { userId, projectId, taskId } = data;
      
//       // Update Redis with active session
//       await redisClient.set(
//         REDIS_KEYS.USER_TRACKING(userId),
//         JSON.stringify({ projectId, taskId, startTime: new Date() })
//       );

//       // Notify team members
//       io.to(`project:${projectId}`).emit('tracking:started', {
//         userId,
//         projectId,
//         taskId
//       });
//     } catch (error) {
//       logger.error('Error handling tracking start:', error);
//     }
//   });

//   socket.on('tracking:stop', async (data) => {
//     try {
//       const { userId, projectId } = data;
      
//       // Clear Redis tracking data
//       await redisClient.del(REDIS_KEYS.USER_TRACKING(userId));

//       // Notify team members
//       io.to(`project:${projectId}`).emit('tracking:stopped', {
//         userId,
//         projectId
//       });
//     } catch (error) {
//       logger.error('Error handling tracking stop:', error);
//     }
//   });
// };