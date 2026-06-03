import { Schema, model, models } from 'mongoose';

export interface ITransaction {
  userId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  paymentId?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], required: true },
  paymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);
