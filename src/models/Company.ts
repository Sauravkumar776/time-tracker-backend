import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  settings: {
    screenshotInterval: number;
    trackingMode: 'strict' | 'flexible';
    minimumActivityThreshold: number;
    workingHours: {
      start: string;
      end: string;
    };
  };
  features: {
    screenshots: boolean;
    activityTracking: boolean;
    projectBudgeting: boolean;
    apiAccess: boolean;
    customReports: boolean;
  };
  billing: {
    plan: string;
    seats: number;
    billingCycle: 'monthly' | 'annual';
  };
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    required: true
  },
  settings: {
    screenshotInterval: {
      type: Number,
      default: 10 // minutes
    },
    trackingMode: {
      type: String,
      enum: ['strict', 'flexible'],
      default: 'flexible'
    },
    minimumActivityThreshold: {
      type: Number,
      default: 30 // percentage
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '17:00'
      }
    }
  },
  features: {
    screenshots: {
      type: Boolean,
      default: false
    },
    activityTracking: {
      type: Boolean,
      default: false
    },
    projectBudgeting: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    customReports: {
      type: Boolean,
      default: false
    }
  },
  billing: {
    plan: {
      type: String,
      required: true
    },
    seats: {
      type: Number,
      required: true
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      required: true
    }
  }
}, {
  timestamps: true
});