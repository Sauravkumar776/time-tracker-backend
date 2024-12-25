import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  project: Schema.Types.ObjectId;
  assignee: Schema.Types.ObjectId;
  team?: Schema.Types.ObjectId;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: Date,
  estimatedHours: Number,
  actualHours: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export const Task = mongoose.model<ITask>('Task', taskSchema);