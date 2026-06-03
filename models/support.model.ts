import { Schema, model, models } from 'mongoose';

export interface ISupportTicket {
  userId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
  createdAt: { type: Date, default: Date.now },
});

export const SupportTicket = models.SupportTicket || model<ISupportTicket>('SupportTicket', SupportTicketSchema);
