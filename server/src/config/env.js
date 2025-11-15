import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '../..');
const repoRoot = path.resolve(serverRoot, '..');

// Load env vars from repo root first (for local dev), then allow server/.env to override.
[path.resolve(repoRoot, '.env'), path.resolve(serverRoot, '.env')]
  .filter((envPath, index, allPaths) => fs.existsSync(envPath) && allPaths.indexOf(envPath) === index)
  .forEach((envPath) => {
    config({ path: envPath });
  });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  EMBEDDING_PROVIDER: z.string().optional(),
  EMBEDDING_MODEL: z.string().optional(),
  EMBEDDING_API_URL: z.string().optional(),
  EMBEDDING_API_KEY: z.string().optional(),
  LLM_PROVIDER: z.string().optional(),
  LLM_MODEL: z.string().optional(),
  LLM_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  MAX_UPLOAD_MB: z.coerce.number().default(5),
});

export const env = envSchema.parse(process.env);
