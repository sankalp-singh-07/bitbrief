import { Schema, model, models } from 'mongoose';

export interface IAlert {
  targetPrice: number;
  type: 'above' | 'below';
  createdAt: Date;
}

export interface IWatchlist {
  userId: string; // Refers to User.clerkId
  coinId: string;
  priceAtAdd: number;
  addedAt: Date;
  alerts: IAlert[];
}

const AlertSchema = new Schema<IAlert>({
  targetPrice: { type: Number, required: true },
  type: { type: String, enum: ['above', 'below'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const WatchlistSchema = new Schema<IWatchlist>({
  userId: { type: String, required: true },
  coinId: { type: String, required: true },
  priceAtAdd: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
  alerts: [AlertSchema],
});

// Ensure a user can only track a specific coin once
WatchlistSchema.index({ userId: 1, coinId: 1 }, { unique: true });

export const Watchlist = models.Watchlist || model<IWatchlist>('Watchlist', WatchlistSchema);
