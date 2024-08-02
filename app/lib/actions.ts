'use server';

import { requestGetMe, requestLogout } from './services/auth';
import ENDPOINTS from './endpoints';
import { get, post } from './request';
import { auth, signOut } from '@/auth';

async function login(payload: any) {
  const res = await post(ENDPOINTS.LOGIN, {
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function logout() {
  const session = await auth();
  if (session?.refresh_token) {
    const logoutRes = await requestLogout(
      { refresh_token: session?.refresh_token },
      { Authorization: `Bearer ${session?.access_token}` }
    );
    if (logoutRes.error) {
      throw logoutRes.error;
    }
  }

  const res = await signOut({
    redirect: false
  });
  return res;
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

async function getUser(params: any, headers = {}) {
  const res = await get(ENDPOINTS.USERS, {
    headers: {
      ...headers
    },
    params,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

export { getMe, login, logout, refresh, getUser };
