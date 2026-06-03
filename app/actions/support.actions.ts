'use server';

import { connectToDB } from '@/lib/mongoose';
import { SupportTicket } from '@/models/support.model';
import { auth } from '@clerk/nextjs/server';

export async function createSupportTicket(subject: string, description: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const ticket = await SupportTicket.create({ userId, subject, description });
    return JSON.parse(JSON.stringify(ticket));
  } catch (error) {
    console.error('Failed to submit ticket:', error);
    throw new Error('Failed to create support ticket');
  }
}
