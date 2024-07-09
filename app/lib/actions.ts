'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

import { cookies } from 'next/headers';
import { requestLogin, requestLogout } from './services/auth';
import { COOKIE_CONFIG, STORAGE_KEYS } from './constants/common';

async function login(payload: any) {
  const res: {
    data: {
      access_token: string;
      refresh_token: string;
    };
  } = await requestLogin(payload);

  if (res.data.access_token) {
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

export { login, logout };
