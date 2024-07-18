import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { getMe, login } from './app/lib/actions';
import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { requestLogin } from './app/lib/services/auth';
import { post } from './app/lib/request';
import ENDPOINTS from './app/lib/endpoints';
import { cookies } from 'next/headers';
import { COOKIE_CONFIG, STORAGE_KEYS } from './app/lib/constants/common';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      access_token: string;
      refresh_token: string;
    } & DefaultSession['user'];
    access_token: string;
  }

  interface User extends IUser {
    access_token: string;
    refresh_token: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    access_token: string;
    refresh_token: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const res = await post(ENDPOINTS.LOGIN, {
          body: credentials,
          cache: 'no-cache'
        });

        if (!res.ok) {
          return null;
        }

        const {
          data: { access_token, refresh_token }
        } = await res.json();

        if (access_token && refresh_token) {
          const { data: user } = await getMe(access_token);
          return {
            ...user,
            access_token: access_token,
            refresh_token: refresh_token
          };
        }

        return null;
      }
    })
  ]
});
