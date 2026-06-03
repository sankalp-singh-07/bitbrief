import { Schema, model, models } from 'mongoose';

export interface INewsletter {
  userId: string;
  title: string;
  date: string;
  subtitle: string;
  mainStory: {
    headline: string;
    content: string;
  };
  articles: Array<{
    title: string;
    content: string;
  }>;
  quickStats: Array<{
    metric: string;
    value: string;
    change: string;
  }>;
  proInsights?: Array<{
    title: string;
    content: string;
    isLocked: boolean;
  }>;
  selectedCoins: string[];
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  subtitle: { type: String, required: true },
  mainStory: {
    headline: { type: String, required: true },
    content: { type: String, required: true },
  },
  articles: [{
    title: { type: String },
    content: { type: String },
  }],
  quickStats: [{
    metric: { type: String },
    value: { type: String },
    change: { type: String },
  }],
  proInsights: [{
    title: { type: String },
    content: { type: String },
    isLocked: { type: Boolean, default: false },
  }],
  selectedCoins: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Newsletter = models.Newsletter || model<INewsletter>('Newsletter', NewsletterSchema);
