import IORedis from 'ioredis';

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  // this required for BullMQ workers
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
  console.log('Redis connected');
});

redisConnection.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redisConnection;