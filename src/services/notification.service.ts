import { User } from '../models/User';
import { Company } from '../models/Company';
import { logger } from '../utils/logger';
import { EmailService } from './email.service';
import { NotificationType, NotificationPayload } from '../types/notification.types';

export class NotificationService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async sendNotification(
    userId: string, 
    type: NotificationType, 
    payload: NotificationPayload
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      switch (type) {
        case 'idle_alert':
          await this.handleIdleAlert(user, payload);
          break;
        case 'daily_summary':
          await this.handleDailySummary(user, payload);
          break;
        case 'subscription_alert':
          await this.handleSubscriptionAlert(user, payload);
          break;
        default:
          logger.warn(`Unhandled notification type: ${type}`);
      }
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  private async handleIdleAlert(user: any, payload: NotificationPayload): Promise<void> {
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Inactivity Alert',
      template: 'idle_alert',
      data: payload
    });
  }

  private async handleDailySummary(user: any, payload: NotificationPayload): Promise<void> {
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Daily Activity Summary',
      template: 'daily_summary',
      data: payload
    });
  }

  private async handleSubscriptionAlert(user: any, payload: NotificationPayload): Promise<void> {
    const company = await Company.findById(user.company);
    if (!company) {
      throw new Error('Company not found');
    }

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Subscription Update Required',
      template: 'subscription_alert',
      data: { ...payload, company: company.name }
    });
  }
}