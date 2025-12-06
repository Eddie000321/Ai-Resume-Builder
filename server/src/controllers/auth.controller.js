import { z } from 'zod';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js';
import { signAccessToken, signRefreshToken } from '../utils/token.js';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(60).optional(),
});

const loginSchema = credentialsSchema.omit({ name: true });

function serializeUser(user) {
  const { password, ...rest } = user.toObject ? user.toObject() : user;
  return rest;
}

export const signup = asyncHandler(async (req, res) => {
  const payload = credentialsSchema.parse(req.body);
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create(payload);
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  // Set cookies for backward compatibility
  setAuthCookies(res, { access: accessToken, refresh: refreshToken });

  return res.status(201).json({
    user: serializeUser(user),
    accessToken,
    refreshToken
  });
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email });
  if (!user || !(await user.comparePassword(payload.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  // Set cookies for backward compatibility
  setAuthCookies(res, { access: accessToken, refresh: refreshToken });

  return res.json({
    user: serializeUser(user),
    accessToken,
    refreshToken
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookies(res);
  return res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({ user: serializeUser(req.user) });
});
