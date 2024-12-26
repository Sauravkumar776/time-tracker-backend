// import { Server, Socket } from 'socket.io';
// import { logger } from '../../../utils/logger';
// import { redisClient, REDIS_KEYS } from '../../../config/redis';

// export const handleTeamEvents = (io: Server, socket: Socket) => {
//   // Handle team presence
//   socket.on('team:join', async (teamId: string) => {
//     try {
//       socket.join(`team:${teamId}`);
      
//       // Update team presence in Redis
//       await redisClient.sadd(REDIS_KEYS.TEAM_PRESENCE(teamId), socket.id);
      
//       // Broadcast to team members
//       io.to(`team:${teamId}`).emit('team:memberJoined', {
//         userId: socket.data.userId,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error('Error handling team join:', error);
//     }
//   });

//   socket.on('team:leave', async (teamId: string) => {
//     try {
//       socket.leave(`team:${teamId}`);
//       await redisClient.srem(REDIS_KEYS.TEAM_PRESENCE(teamId), socket.id);
      
//       io.to(`team:${teamId}`).emit('team:memberLeft', {
//         userId: socket.data.userId,
//         timestamp: new Date()
//       });
//     } catch (error) {
//       logger.error('Error handling team leave:', error);
//     }
//   });
// };