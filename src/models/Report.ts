import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  user: Schema.Types.ObjectId;
  project?: Schema.Types.ObjectId;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    totalHours: number;
    totalTasks: number;
    averageActivityLevel: number;
  };
  status: 'generated' | 'pending' | 'failed';
  format: 'pdf' | 'csv' | 'excel';
  downloadUrl?: string;
}

const reportSchema = new Schema<IReport>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    required: true
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  metrics: {
    totalHours: {
      type: Number,
      required: true
    },
    totalTasks: {
      type: Number,
      required: true
    },
    averageActivityLevel: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['generated', 'pending', 'failed'],
    default: 'pending'
  },
  format: {
    type: String,
    enum: ['pdf', 'csv', 'excel'],
    default: 'pdf'
  },
  downloadUrl: String
}, {
  timestamps: true
});

export const Report = mongoose.model<IReport>('Report', reportSchema);