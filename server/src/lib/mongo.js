import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);

export async function connectMongo() {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error({ error }, 'Mongo connection failed');
    throw error;
  }
}
