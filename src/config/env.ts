// config/env.ts
export const env = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN!,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN!,
};