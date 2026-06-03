'use server';

import { connectToDB } from '@/lib/mongoose';
import { Newsletter } from '@/models/newsletter.model';
import { auth } from '@clerk/nextjs/server';

export async function getNewsletters() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const newsletters = await Newsletter.find({ userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(newsletters));
  } catch (error) {
    console.error('Failed to get newsletters:', error);
    throw new Error('Failed to fetch newsletters');
  }
}

export async function saveNewsletter(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const newNewsletter = await Newsletter.create({ ...data, userId });
    return JSON.parse(JSON.stringify(newNewsletter));
  } catch (error) {
    console.error('Failed to save newsletter:', error);
    throw new Error('Failed to save newsletter');
  }
}

export async function deleteNewsletter(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    await Newsletter.findOneAndDelete({ _id: id, userId });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete newsletter:', error);
    throw new Error('Failed to delete newsletter');
  }
}
