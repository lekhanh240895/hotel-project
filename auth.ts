import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { getMe, login } from './app/lib/actions';
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User extends IUser {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }
  interface Session {
    user: User & {
      id: string;
    };
    access_token: string;
  }
}

import { JWT } from 'next-auth/jwt';
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    user: {
      full_name: string;
      image?: string | null;
      email?: string | null;
      username: string;
      role: string;
      chatIds: string[];
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    access_token: string;
    refresh_token: string;
  }
}

class UnverifiedUser extends CredentialsSignin {
  code = 'unverified';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const res: {
          data: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
          };
          error: CustomError;
        } = await login(credentials);

        if (res.error) {
          switch (res.error.error_id) {
            case 'LO-0001':
              throw new CredentialsSignin(res.error.message);
            case 'LO-0003':
              throw new UnverifiedUser(res.error.message);
            default:
              throw res.error;
          }
        }

        const data = res.data;

        const { access_token, refresh_token, expires_in } = data;

        const { data: user } = await getMe(access_token);

        if (!user) {
          return null;
        }

        return {
          ...user,
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in
        };
      }
    })
  ]
});
