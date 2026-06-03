'use server';

import { connectToDB } from '@/lib/mongoose';
import { User } from '@/models/user.model';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function syncUser() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();

    const existingUser = await User.findOne({ clerkId: userId });

    if (!existingUser) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress || 'no-email@bitbrief.com';
      
      const newUser = await User.create({
        clerkId: userId,
        email: email,
        name: clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 'Crypto Trader',
        plan: 'FREE'
      });
      return JSON.parse(JSON.stringify(newUser));
    }

    return JSON.parse(JSON.stringify(existingUser));
  } catch (error: any) {
    console.error('Failed to sync user:', error);
    throw new Error('Failed to sync user: ' + error.message);
  }
}

export async function upgradeToPro() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { plan: 'PRO' },
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error: any) {
    console.error('Failed to upgrade user:', error);
    throw new Error('Failed to upgrade user');
  }
}
