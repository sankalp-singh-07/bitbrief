'use server';

import { connectToDB } from '@/lib/mongoose';
import { Notification } from '@/models/notification.model';
import { auth } from '@clerk/nextjs/server';

export async function getNotifications() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to get notifications:', error);
    throw new Error('Failed to get notifications');
  }
}

export async function createNotification(type: string, message: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const notif = await Notification.create({ userId, type, message });
    return JSON.parse(JSON.stringify(notif));
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw new Error('Failed to create notification');
  }
}

export async function markAsRead(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to mark read:', error);
    throw new Error('Failed to mark notification state');
  }
}

export async function markAllAsRead() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to mark all read:', error);
    throw new Error('Failed to resolve all unread states');
  }
}
