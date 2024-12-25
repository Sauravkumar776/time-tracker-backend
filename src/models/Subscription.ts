import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  company: Schema.Types.ObjectId;
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  features: string[];
  pricePerUser: number;
  maxUsers: number;
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'past_due';
  startDate: Date;
  endDate: Date;
  paymentMethod: {
    type: string;
    last4: string;
  };
}

const subscriptionSchema = new Schema<ISubscription>({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'professional', 'enterprise'],
    required: true
  },
  features: [{
    type: String
  }],
  pricePerUser: {
    type: Number,
    required: true
  },
  maxUsers: {
    type: Number,
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'past_due'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: {
      type: String,
      required: true
    },
    last4: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});