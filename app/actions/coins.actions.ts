'use server';

import { redis } from '@/lib/redis';
import { fetchCoinsData, CoinsData } from '@/lib/getcoins';

const CACHE_KEY = 'bitbrief:coins_data';
const CACHE_TTL = 300; // 5 minutes cache expiry in seconds

export async function getCoinsData(): Promise<CoinsData> {
  // 1. Try to read from Redis
  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as CoinsData;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Redis read failed, falling back to direct API query:', msg);
    }
  }

  // 2. Fetch live data from CoinGecko (runs on server)
  const data = await fetchCoinsData();

  // 3. Store parsed coins data in Redis with a 5-minute TTL
  if (redis) {
    try {
      await redis.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Redis write failed:', msg);
    }
  }

  return data;
}
