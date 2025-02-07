import { setGlobalOptions, Severity } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import { logger } from '@/config/logger.config';
import { env } from '@/utils/env-config.util';

const connect = async () => {
  try {
    logger.info('Connecting to the database...');
    setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
    const db = await mongoose.connect(env.DB_URI, {});

    if (!db.connection.db) {
      throw new Error('Database connection failed');
    }

    logger.info(`Connected to the database: ${db.connection.db.databaseName}`);

    return db.connection;
  } catch (error) {
    logger.error('Error connecting to the database: ', error);

    return null;
  }
};

let db: mongoose.Connection | null = null;

(async () => {
  db = await connect();
})();

export const getConnection = async () => {
  if (!db) db = await connect();

  return db!;
};

export const getSession = async () => {
  const conn = await getConnection();
  const session = await conn.startSession();

  return session;
};
