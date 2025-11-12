import { env } from './config/env.js';
import app from './app.js';
import { connectMongo } from './lib/mongo.js';
import { logger } from './lib/logger.js';

async function bootstrap() {
  await connectMongo();
  app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, 'Failed to bootstrap server');
  process.exit(1);
});
