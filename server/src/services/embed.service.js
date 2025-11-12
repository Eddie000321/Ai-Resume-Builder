import axios from 'axios';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

const CACHE = new Map();

export async function embedText(text, cacheKey) {
  if (!text.trim()) {
    return [];
  }

  const key = cacheKey ?? crypto.createHash('sha256').update(text).digest('hex');
  const existing = CACHE.get(key);
  if (existing) {
    return existing;
  }

  const vector = env.EMBEDDING_API_URL ? await callRemoteEmbedding(text) : fakeEmbedding(text);
  CACHE.set(key, vector);
  return vector;
}

async function callRemoteEmbedding(text) {
  try {
    const response = await axios.post(
      env.EMBEDDING_API_URL,
      {
        input: text,
        model: env.EMBEDDING_MODEL,
      },
      {
        headers: {
          Authorization: `Bearer ${env.EMBEDDING_API_KEY}`,
        },
      }
    );

    return response.data.data?.[0]?.embedding ?? [];
  } catch (error) {
    logger.error({ error }, 'Embedding API failed, falling back to fake vector');
    return fakeEmbedding(text);
  }
}

function fakeEmbedding(text) {
  // Deterministic pseudo-vector so local dev does not break while models are TBD
  const hash = crypto.createHash('sha1').update(text).digest();
  return Array.from(hash).map((byte) => Number(byte) / 255);
}
