'use server';

import { connectToDB } from '@/lib/mongoose';
import { SupportTicket } from '@/models/support.model';
import { auth, currentUser } from '@clerk/nextjs/server';
import { sendSupportTicketEmail } from '@/lib/mail';

export async function createSupportTicket(subject: string, description: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const ticket = await SupportTicket.create({ userId, subject, description });

    // Fetch user details for notification
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || 'no-email@bitbrief.com';
        const name = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 'Crypto Trader';
        await sendSupportTicketEmail(email, name, subject, description);
      }
    } catch (emailErr) {
      console.error('Failed to send support email notification:', emailErr);
    }

    return JSON.parse(JSON.stringify(ticket));
  } catch (error) {
    console.error('Failed to submit ticket:', error);
    throw new Error('Failed to create support ticket');
  }
}
