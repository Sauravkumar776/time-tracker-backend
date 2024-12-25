import { Schema } from 'mongoose';

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ReportFormat = 'pdf' | 'csv' | 'excel';

export interface ReportMetrics {
  totalHours: number;
  totalTasks: number;
  averageActivityLevel: number;
  taskBreakdown: {
    completed: number;
    inProgress: number;
    pending: number;
  };
  teamPerformance?: {
    teamId: Schema.Types.ObjectId;
    totalHours: number;
    completedTasks: number;
  }[];
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  projects?: string[];
  teams?: string[];
  users?: string[];
  tasks?: string[];
}