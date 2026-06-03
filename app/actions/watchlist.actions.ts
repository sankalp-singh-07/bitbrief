'use server';

import { connectToDB } from '@/lib/mongoose';
import { Watchlist } from '@/models/watchlist.model';
import { auth } from '@clerk/nextjs/server';

export async function getWatchlist() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    return JSON.parse(JSON.stringify(watchlist));
  } catch (error: any) {
    console.error('Get Watchlist Error:', error);
    throw new Error('Failed to fetch watchlist');
  }
}

export async function addWatchlistCoin(coinId: string, priceAtAdd: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    
    // Upsert to handle duplicates cleanly
    const newEntry = await Watchlist.findOneAndUpdate(
      { userId, coinId },
      { priceAtAdd, addedAt: new Date() },
      { upsert: true, new: true }
    );
    
    return JSON.parse(JSON.stringify(newEntry));
  } catch (error: any) {
    console.error('Add Watchlist Error:', error);
    throw new Error('Failed to add coin to watchlist');
  }
}

export async function removeWatchlistCoin(coinId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    await Watchlist.findOneAndDelete({ userId, coinId });
    return { success: true, coinId };
  } catch (error: any) {
    console.error('Remove Watchlist Error:', error);
    throw new Error('Failed to remove coin');
  }
}

export async function createAlert(coinId: string, alert: { targetPrice: number, type: 'above' | 'below' }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const updated = await Watchlist.findOneAndUpdate(
      { userId, coinId },
      { $push: { alerts: { ...alert, createdAt: new Date() } } },
      { new: true }
    );
    return JSON.parse(JSON.stringify(updated));
  } catch (error: any) {
    console.error('Create Alert Error:', error);
    throw new Error('Failed to create alert');
  }
}

export async function removeAlert(coinId: string, alertIndex: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDB();
    const document = await Watchlist.findOne({ userId, coinId });
    if (!document) throw new Error('Not found');

    document.alerts.splice(alertIndex, 1);
    await document.save();
    
    return JSON.parse(JSON.stringify(document));
  } catch (error: any) {
    console.error('Remove Alert Error:', error);
    throw new Error('Failed to remove alert');
  }
}
