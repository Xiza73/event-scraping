import { RedisClientType } from 'redis';

import { logger } from '@/config/logger.config';
import { getRedisClient } from '@/config/redis.config';
import { toObject, toString } from '@/utils/json.util';

import { DelRedisResponse, GetRedisResponse, SetRedisResponse } from '../schemas/redis-response.schema';

class RedisService {
  private client: RedisClientType<any>;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    this.client = await getRedisClient();
  }

  getKey(key: string, params?: any): string {
    return params ? `${key}:${toString(params)}` : key;
  }

  async get(key: string): Promise<GetRedisResponse | null> {
    try {
      const value = await this.client.get(key);

      return value as GetRedisResponse;
    } catch (error) {
      logger.error('Error getting value from Redis', error);

      return null;
    }
  }

  async getData<T>(key: string, params?: any): Promise<T | null> {
    try {
      const cachedKey = this.getKey(key, params);
      const value = await this.client.get(cachedKey);

      if (!value) return null;

      return toObject<T>(value);
    } catch (error) {
      logger.error('Error getting data from Redis', error);

      return null;
    }
  }

  async set({
    key,
    params,
    value,
    expiration,
  }: {
    key: string;
    params?: any;
    value: string;
    expiration?: number;
  }): Promise<SetRedisResponse | null> {
    try {
      const cachedKey = this.getKey(key, params);

      if (expiration) {
        return (await this.client.set(cachedKey, value, { EX: expiration })) as SetRedisResponse;
      } else {
        return (await this.client.set(cachedKey, value)) as SetRedisResponse;
      }
    } catch (error) {
      logger.error('Error setting value in Redis', error);

      return null;
    }
  }

  async del(key: string): Promise<DelRedisResponse | null> {
    try {
      return (await this.client.del(key)) as DelRedisResponse;
    } catch (error) {
      logger.error('Error deleting value from Redis', error);

      return null;
    }
  }
}

export const redisService = new RedisService();
