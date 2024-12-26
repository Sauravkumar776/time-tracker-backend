import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeTrackingSession extends Document {
    user: mongoose.Types.ObjectId;
    project: string;
    startTime: Date;
    endTime?: Date;
    screenshots?: string[];
    websitesVisited?: { url: string; duration: number }[];
  }
  
  const timeTrackingSessionSchema = new Schema<ITimeTrackingSession>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    screenshots: [String],
    websitesVisited: [
      {
        url: { type: String, required: true, trim: true },
        duration: { type: Number, required: true },
      },
    ],
  }, {
    timestamps: true,
  });
  
  export const TimeTrackingSession = mongoose.model<ITimeTrackingSession>('TimeTrackingSession', timeTrackingSessionSchema);
  