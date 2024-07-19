'use server';

import { cookies } from 'next/headers';
import {
  requestGetMe,
  requestLogin,
  requestLogout,
  requestRefresh
} from './services/auth';
import { COOKIE_CONFIG, STORAGE_KEYS } from './constants/common';

async function login(payload: any) {
  const res: {
    data: {
      access_token: string;
      refresh_token: string;
    };
    error: CustomError;
  } = await requestLogin(payload);

  if (res.data?.access_token) {
    cookies().set({
      name: STORAGE_KEYS.ACCESS_TOKEN,
      value: res.data.access_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.REFRESH_TOKEN,
      value: res.data.refresh_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.IS_AUTHENTICATED,
      value: 'true'
    });
  }

  return res;
}

async function logout() {
  const access_token = cookies().get(STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const refresh_token = cookies().get(STORAGE_KEYS.REFRESH_TOKEN)?.value;

  const res = await requestLogout(
    {
      refresh_token
    },
    {
      Authorization: `Bearer ${access_token}`
    }
  );

  cookies().set(STORAGE_KEYS.ACCESS_TOKEN, '', {
    ...COOKIE_CONFIG,
    maxAge: 0
  });
  cookies().set(STORAGE_KEYS.REFRESH_TOKEN, '', {
    ...COOKIE_CONFIG,
    maxAge: 0
  });
  cookies().delete(STORAGE_KEYS.IS_AUTHENTICATED);

  return res;
}

async function getMe() {
  const res: {
    data: User;
    error: CustomError;
  } = await requestGetMe({
    Authorization: `Bearer ${cookies().get(STORAGE_KEYS.ACCESS_TOKEN)?.value}`
  });

  return res;
}

async function refresh() {
  const refresh_token = cookies().get(STORAGE_KEYS.REFRESH_TOKEN)?.value;
  const res: {
    data: {
      access_token: string;
      refresh_token: string;
    };
    error: CustomError;
  } = await requestRefresh({ refresh_token });

  if (res?.error) {
    cookies().set(STORAGE_KEYS.ACCESS_TOKEN, '', {
      ...COOKIE_CONFIG,
      maxAge: 0
    });
    cookies().set(STORAGE_KEYS.REFRESH_TOKEN, '', {
      ...COOKIE_CONFIG,
      maxAge: 0
    });
    cookies().delete(STORAGE_KEYS.IS_AUTHENTICATED);
  }

  if (res.data?.access_token) {
    cookies().set({
      name: STORAGE_KEYS.ACCESS_TOKEN,
      value: res.data.access_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.REFRESH_TOKEN,
      value: res.data.refresh_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.IS_AUTHENTICATED,
      value: 'true'
    });
  }

  return res;
}

export { getMe, login, logout, refresh };
