import ENDPOINTS from '../endpoints';
import { post } from '../request';

async function requestLogin(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.LOGIN, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestLogout(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.LOGOUT, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

export { requestLogin, requestLogout };
