'use server';

import { requestGetMe } from './services/auth';
import ENDPOINTS from './endpoints';
import { post } from './request';
import { signOut } from '@/auth';

async function login(payload: any) {
  const res = await post(ENDPOINTS.LOGIN, {
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function logout() {
  await signOut();
}

async function getMe(token: string) {
  const res: {
    data: IUser;
    error: CustomError;
  } = await requestGetMe({
    Authorization: `Bearer ${token}`
  });

  return res;
}

async function refresh(refresh_token: string) {
  const res = await post(ENDPOINTS.REFRESH_TOKEN, {
    body: { refresh_token },
    cache: 'no-cache'
  });

  return await res.json();
}

export { getMe, login, logout, refresh };
