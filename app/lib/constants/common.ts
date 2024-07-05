import dayjs from 'dayjs';
import ENDPOINTS from '../endpoints';

interface CookieConfig {
  secure: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path: string;
  expires: Date;
  httpOnly?: boolean;
  priority: 'low' | 'medium' | 'high';
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const STORAGE_KEY_PREFIX = '@HOTEL/';

const STORAGE_KEYS = {
  ACCESS_TOKEN: `${STORAGE_KEY_PREFIX}access_token`,
  REFRESH_TOKEN: `${STORAGE_KEY_PREFIX}refresh_token`,
  IS_AUTHENTICATED: `${STORAGE_KEY_PREFIX}is_authenticated`
};

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
  EMAIL_VERIFICATION: '/email-verification',
  TERM: '/terms-of-service',
  POLICY: '/privacy-policy',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  HOTEL: '/dashboard/hotel'
};

const MAILTRAP = {
  HOST: process.env.MAILTRAP_HOST,
  PORT: process.env.MAILTRAP_PORT,
  USER: process.env.MAILTRAP_USER,
  PASSWORD: process.env.MAILTRAP_PASSWORD
};

const USER_TOKEN_REQUIRED_FOR_ENDPOINTS = [
  ENDPOINTS.PROFILE,
  ENDPOINTS.LOGOUT,
  ENDPOINTS.LOGIN
];

export {
  APP_URL,
  STORAGE_KEYS,
  COOKIE_CONFIG,
  LIST_ROUTER,
  USER_TOKEN_REQUIRED_FOR_ENDPOINTS,
  MAILTRAP
};
