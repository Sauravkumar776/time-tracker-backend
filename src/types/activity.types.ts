export interface ActivityMetrics {
  averageActivity: number;
  activeTime: number;
  idleTime: number;
  idlePeriods: Array<{
    start: Date;
    end: Date;
  }>;
  isProductiveSession: boolean;
}

export interface ActivitySettings {
  minimumThreshold: number;
  idleTimeout: number;
  trackingMode: 'strict' | 'flexible';
}

export interface ActivityReport {
  userId: string;
  date: Date;
  metrics: ActivityMetrics;
  screenshots: Array<{
    timestamp: Date;
    activityLevel: number;
  }>;
}