import { signIn } from '@/auth';
import ENDPOINTS from '../endpoints';
import { get, post } from '../request';
import { mongooseConnect } from '../mongoose';
import { APP_API_KEY } from '../constants/common';

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

async function requestRegister(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.USERS, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestGetMe(headers = {}) {
  const res = await get(ENDPOINTS.PROFILE, {
    headers: {
      ...headers
    },
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestRefresh(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.REFRESH_TOKEN, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestVerifyEmail(token: string, headers = {}) {
  const res = await get(ENDPOINTS.EMAIL_VERIFICATION + `/${token}`, {
    headers: {
      ...headers
    },
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

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

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

export async function socialLogin(type: string) {
  const res: {
    profile: any;
  } = await signIn(type);

  const profile = res.profile;
  handleSocialLogin(profile);
}

export const handleSocialLogin = async (profile: any) => {
  try {
    await mongooseConnect();

    const res = await requestRegister(
      {
        email: profile?.email,
        full_name: profile?.name,
        image: profile?.picture,
        is_verified: profile?.email_verified,
        grant_type: 'social_login'
      },
      {
        'x-api-key': APP_API_KEY
      }
    );

    if (res.error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export {
  requestLogin,
  requestRegister,
  requestGetMe,
  requestLogout,
  requestVerifyEmail,
  requestRefresh
};
