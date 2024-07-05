import dayjs from 'dayjs';
import ENDPOINTS from '../endpoints';
const STORAGE_KEY_PREFIX = '@HOTEL/';

const STORAGE_KEYS = {
  ACCESS_TOKEN: `${STORAGE_KEY_PREFIX}access_token`,
  REFRESH_TOKEN: `${STORAGE_KEY_PREFIX}refresh_token`,
  APP_TOKEN: `${STORAGE_KEY_PREFIX}app_token`,
  IS_AUTHENTICATED: `${STORAGE_KEY_PREFIX}is_authenticated`
};

interface CookieConfig {
  secure: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path: string;
  expires: Date;
  httpOnly?: boolean;
  priority: 'low' | 'medium' | 'high';
}
const COOKIE_CONFIG: CookieConfig = {
  secure: true,
  sameSite: 'none',
  path: '/',
  expires: dayjs().add(1, 'month').toDate(),
  httpOnly: true,
  priority: 'high'
};

const LIST_ROUTER = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token'
};

const USER_TOKEN_REQUIRED_FOR_ENDPOINTS = [ENDPOINTS.PROFILE];

export {
  STORAGE_KEYS,
  COOKIE_CONFIG,
  LIST_ROUTER,
  USER_TOKEN_REQUIRED_FOR_ENDPOINTS
};
