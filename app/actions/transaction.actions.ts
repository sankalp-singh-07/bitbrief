'use server';

import { connectToDB } from '@/lib/mongoose';
import { Transaction } from '@/models/transaction.model';
import { auth } from '@clerk/nextjs/server';

export async function getTransactions() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const trxs = await Transaction.find({ userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(trxs));
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw new Error('Failed to aggregate transaction history');
  }
}

export async function createTransaction(amount: number, status: 'SUCCESS'|'FAILED'|'PENDING', paymentId?: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const trx = await Transaction.create({ userId, amount, status, paymentId });
    return JSON.parse(JSON.stringify(trx));
  } catch (error) {
    console.error('Failed to register transaction log:', error);
    throw new Error('Transaction log failure');
  }
}
