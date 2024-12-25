import mongoose, { Document, Schema } from 'mongoose';

export interface IScreenshot extends Document {
  timeEntry: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  imageUrl: string;
  timestamp: Date;
  activityLevel: number;
  metadata?: {
    windowTitle?: string;
    application?: string;
  };
}

const screenshotSchema = new Schema<IScreenshot>({
  timeEntry: {
    type: Schema.Types.ObjectId,
    ref: 'TimeEntry',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  activityLevel: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  metadata: {
    windowTitle: String,
    application: String
  }
}, {
  timestamps: true
});

export const Screenshot = mongoose.model<IScreenshot>('Screenshot', screenshotSchema);