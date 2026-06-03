import { Schema, model, models } from 'mongoose';

export interface INotification {
  userId: string;
  type: 'ALERT' | 'REPORT' | 'PAYMENT' | 'SYSTEM' | 'WATCHLIST';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  type: { type: String, enum: ['ALERT', 'REPORT', 'PAYMENT', 'SYSTEM', 'WATCHLIST'], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = models.Notification || model<INotification>('Notification', NotificationSchema);
