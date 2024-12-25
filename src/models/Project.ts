import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  client?: string;
  budget?: number;
  hourlyRate: number;
  status: 'active' | 'completed' | 'archived';
  members: Schema.Types.ObjectId[];
  manager: Schema.Types.ObjectId;
  company: string;
  teamId: Schema.Types.ObjectId; // Added
  color: string; // Added
  currency: string;
  startDate: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    client: {
      type: String,
      trim: true,
    },
    budget: {
        type: Number,
        min: 0,
    },
    currency: {
      type: String,
      default: 'USD'
    },
    hourlyRate: {
      type: Number,
      min: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team', // References a Team model
    },
    color: {
      type: String,
      default: '#FFFFFF', // Default to white if no color is specified
    },
    startDate: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
