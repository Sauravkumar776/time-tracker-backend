import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { EmailTemplate } from '../types/notification.types';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail({
    to,
    subject,
    template,
    data
  }: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html: await this.renderTemplate(template, data)
      });
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  private async renderTemplate(templateName: string, data: any): Promise<string> {
    // In production, implement proper template rendering
    // This is a basic implementation
    const templates: Record<string, EmailTemplate> = {
      idle_alert: {
        name: 'idle_alert',
        subject: 'Inactivity Alert',
        body: 'You have been inactive for {{duration}} minutes.',
        variables: ['duration']
      },
      daily_summary: {
        name: 'daily_summary',
        subject: 'Daily Summary',
        body: 'Your productivity today: {{productivity}}%',
        variables: ['productivity']
      },
      subscription_alert: {
        name: 'subscription_alert',
        subject: 'Subscription Update',
        body: 'Your subscription needs attention for {{company}}',
        variables: ['company']
      }
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    let html = template.body;
    template.variables.forEach(variable => {
      html = html.replace(`{{${variable}}}`, data[variable]);
    });

    return html;
  }
}