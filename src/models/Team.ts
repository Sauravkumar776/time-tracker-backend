import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: Schema.Types.ObjectId[]; // Array of User references
  manager: Schema.Types.ObjectId; // Reference to the User model who manages the team
  company: string; // Company the team belongs to
  color: string; // Color associated with the team
}

const teamSchema = new Schema<ITeam>(
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
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Every team should have at least one member
      },
    ],
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: '#FFFFFF', // Default to white if no color is specified
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model<ITeam>('Team', teamSchema);
