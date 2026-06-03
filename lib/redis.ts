import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let redis: Redis | null = null;

if (typeof window === 'undefined') {
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000, // 2 seconds timeout to fail fast
      lazyConnect: true, // Only connect when requested to avoid server startup delays
    });

    redis.on('error', (err) => {
      // Gracefully capture errors to prevent crashes if Redis is offline
      console.warn('Redis connection warning:', err.message);
    });
  } catch (err) {
    console.error('Failed to initialize Redis client:', err);
  }
}

export { redis };
