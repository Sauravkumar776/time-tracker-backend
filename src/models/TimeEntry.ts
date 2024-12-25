import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeEntry extends Document {
  user: Schema.Types.ObjectId;
  project: Schema.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  description: string;
  tags?: string[];
  status: 'ongoing' | 'completed' | 'paused';
}

const timeEntrySchema = new Schema<ITimeEntry>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'paused'],
    default: 'ongoing'
  }
}, {
  timestamps: true
});

timeEntrySchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000);
  }
  next();
});

export const TimeEntry = mongoose.model<ITimeEntry>('TimeEntry', timeEntrySchema);