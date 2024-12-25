import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: Schema.Types.ObjectId[];
  manager: Schema.Types.ObjectId;
  company: string;
  color: string;
}

const teamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#FFFFFF'
  }
}, {
  timestamps: true
});

export const Team = mongoose.model<ITeam>('Team', teamSchema);