export type NotificationType = 'idle_alert' | 'daily_summary' | 'subscription_alert';

export interface NotificationPayload {
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
  variables: string[];
}