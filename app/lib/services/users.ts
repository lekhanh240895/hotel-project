import { APP_API_KEY } from '../constants/common';
import ENDPOINTS from '../endpoints';
import { get, post, put } from '../request';

async function requestGetUser(params: any, headers = {}) {
  const res = await get(ENDPOINTS.USERS, {
    headers: {
      ...headers,
      'x-api-key': APP_API_KEY!
    },
    params,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}
async function requestResetPassword(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.RESET_PASSWORD, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}
async function requestUpdate(id: string, payload: any, headers = {}) {
  const res = await put(ENDPOINTS.USERS, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache',
    params: { _id: id }
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

export { requestGetUser, requestResetPassword, requestUpdate };
