import { Schema, model, models } from 'mongoose';

export interface IUser {
  clerkId: string;
  email: string;
  name?: string;
  plan: 'FREE' | 'PRO';
  createdAt: Date;
  subscriptionStart?: Date;
  subscriptionExpiry?: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  plan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' },
  createdAt: { type: Date, default: Date.now },
  subscriptionStart: { type: Date },
  subscriptionExpiry: { type: Date },
});

export const User = models.User || model<IUser>('User', UserSchema);
