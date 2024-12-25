import { Company } from '../models/Company';
import { Subscription } from '../models/Subscription';
import { logger } from '../utils/logger';

const PLAN_FEATURES = {
  free: ['basic_tracking', 'simple_reports'],
  basic: ['basic_tracking', 'simple_reports', 'screenshots'],
  professional: ['basic_tracking', 'advanced_reports', 'screenshots', 'activity_monitoring', 'integrations'],
  enterprise: ['basic_tracking', 'advanced_reports', 'screenshots', 'activity_monitoring', 'integrations', 'api_access', 'custom_features']
};

const PLAN_LIMITS = {
  free: { users: 5, projects: 3, storage: 1 }, // storage in GB
  basic: { users: 20, projects: 10, storage: 5 },
  professional: { users: 100, projects: 50, storage: 25 },
  enterprise: { users: 1000, projects: 500, storage: 100 }
};

export const subscriptionService = {
  async upgradePlan(companyId: string, newPlan: string): Promise<void> {
    try {
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      const subscription = await Subscription.findOne({ company: companyId, status: 'active' });
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Update subscription
      subscription.plan = newPlan;
      subscription.features = PLAN_FEATURES[newPlan];
      subscription.maxUsers = PLAN_LIMITS[newPlan].users;

      // Update company features based on new plan
      company.features = {
        screenshots: newPlan !== 'free',
        activityTracking: ['professional', 'enterprise'].includes(newPlan),
        projectBudgeting: ['professional', 'enterprise'].includes(newPlan),
        apiAccess: newPlan === 'enterprise',
        customReports: ['professional', 'enterprise'].includes(newPlan)
      };

      await Promise.all([
        subscription.save(),
        company.save()
      ]);
    } catch (error) {
      logger.error('Plan upgrade failed:', error);
      throw error;
    }
  }
};