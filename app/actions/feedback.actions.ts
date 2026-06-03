'use server';

import { connectToDB } from '@/lib/mongoose';
import { Feedback } from '@/models/feedback.model';
import { auth } from '@clerk/nextjs/server';

export async function submitFeedback(data: { rating: number, liked: string, improved: string, bugs?: string }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const fb = await Feedback.create({ userId, ...data });
    return JSON.parse(JSON.stringify(fb));
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    throw new Error('Failed to generate user feedback string');
  }
}
