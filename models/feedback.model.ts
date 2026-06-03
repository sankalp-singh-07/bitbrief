import { Schema, model, models } from 'mongoose';

export interface IFeedback {
  userId: string;
  rating: number; // 1-5
  liked: string;
  improved: string;
  bugs?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  liked: { type: String, required: true },
  improved: { type: String, required: true },
  bugs: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Feedback = models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);
