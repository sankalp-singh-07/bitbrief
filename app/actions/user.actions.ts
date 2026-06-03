'use server';

import { connectToDB } from '@/lib/mongoose';
import { User } from '@/models/user.model';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { sendWelcomeEmail, sendSubscriptionEmail } from '@/lib/mail';

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

      // Send welcome email asynchronously
      try {
        await sendWelcomeEmail(newUser.email, newUser.name || 'Crypto Trader');
      } catch (emailErr) {
        console.error('Failed to send welcome email:', emailErr);
      }

      return JSON.parse(JSON.stringify(newUser));
    }

    // Auto-downgrade check
    if (
      existingUser.plan === 'PRO' &&
      existingUser.subscriptionExpiry &&
      new Date(existingUser.subscriptionExpiry) < new Date()
    ) {
      existingUser.plan = 'FREE';
      existingUser.subscriptionStart = undefined;
      existingUser.subscriptionExpiry = undefined;
      await existingUser.save();

      // Sync downgrade to Clerk metadata
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: { role: 'free' },
        });
      } catch (clerkErr) {
        console.error('Failed to downgrade Clerk metadata:', clerkErr);
      }
    }

    return JSON.parse(JSON.stringify(existingUser));
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Failed to sync user:', error);
    throw new Error('Failed to sync user: ' + error.message);
  }
}

export async function upgradeToPro() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();

    const start = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3);

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        plan: 'PRO',
        subscriptionStart: start,
        subscriptionExpiry: expiry
      },
      { new: true }
    );

    if (!updatedUser) throw new Error('Failed to locate user records');

    // Update Clerk metadata
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role: 'pro' },
      });
    } catch (clerkErr) {
      console.error('Failed to update Clerk metadata:', clerkErr);
    }

    // Send purchase confirmation email
    try {
      await sendSubscriptionEmail(updatedUser.email, updatedUser.name || 'Crypto Trader', 'PRO', expiry);
    } catch (emailErr) {
      console.error('Failed to send subscription email:', emailErr);
    }

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Failed to upgrade user:', error);
    throw new Error('Failed to upgrade user');
  }
}
