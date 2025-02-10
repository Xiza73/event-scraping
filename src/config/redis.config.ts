import { createClient, RedisClientType } from 'redis';

import { env } from '@/utils/env-config.util';

import { logger } from './logger.config';

const redisConnect = async () => {
  try {
    const redisClient = createClient({
      url: env.REDIS_URI,
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis client error: ', error);
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error('Error connecting to Redis: ', error);

    return null;
  }
};

let redisClient: any = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = await redisConnect();
  }

  return redisClient as RedisClientType;
};
