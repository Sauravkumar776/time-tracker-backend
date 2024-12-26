import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  company?: string;
  avatar?: string;
  preferences?: {
    timeZone: string;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  activityLogs?: { action: string; timestamp: Date }[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const preferencesSchema = new Schema({
  timeZone: { type: String, default: 'UTC' },
  notifications: { type: Boolean, default: true },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
}, { _id: false });

const activityLogSchema = new Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['admin', 'user', 'manager'], default: 'user' },
  company: { type: String, trim: true },
  avatar: { type: String, trim: true },
  preferences: preferencesSchema,
  activityLogs: [activityLogSchema],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
