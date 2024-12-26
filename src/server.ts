import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
// import { initializeSocketIO } from './services/socket';
import authRoutes from './routes/auth.routes';
import timeEntryRoutes from './routes/timeEntry.routes';
import projectRoutes from './routes/project.routes';
import screenshotRoutes from './routes/screenshot.routes';
// import reportRoutes from './routes/report.routes';
import taskRoutes from './routes/task.routes';
import teamRoutes from './routes/team.routes';
// import timeTrackingRoutes from './routes/timeTracking.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
// initializeSocketIO(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/screenshots', screenshotRoutes);
// app.use('/api/reports', reportRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
// app.use('/api/tracking', timeTrackingRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Connect to database and start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});