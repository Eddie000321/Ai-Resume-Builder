import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

function decodeToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    return null;
  }
}

export async function deserializeUser(req, _res, next) {
  // Try Authorization header first, fall back to cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies?.accessToken;

  const payload = decodeToken(token);

  if (!payload) {
    return next();
  }

  try {
    const user = await User.findById(payload.sub).lean();
    if (user) {
      req.user = user;
    }
  } catch {
    // ignore lookup errors, request continues unauthenticated
  }

  return next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
}
