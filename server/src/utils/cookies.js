import { env } from '../config/env.js';

const commonCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  domain: env.COOKIE_DOMAIN,
};

export function setAuthCookies(res, tokens) {
  res.cookie('accessToken', tokens.access, {
    ...commonCookieOptions,
    maxAge: parseDuration(env.ACCESS_TOKEN_TTL),
  });
  res.cookie('refreshToken', tokens.refresh, {
    ...commonCookieOptions,
    maxAge: parseDuration(env.REFRESH_TOKEN_TTL),
  });
}

export function clearAuthCookies(res) {
  res.clearCookie('accessToken', commonCookieOptions);
  res.clearCookie('refreshToken', commonCookieOptions);
}

function parseDuration(value) {
  const match = value.match(/(?<amount>\d+)(?<unit>[smhd])/);
  if (!match || !match.groups) return 0;
  const amount = Number(match.groups.amount);
  const unit = match.groups.unit;
  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}
