import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { getMe, login } from './app/lib/actions';
import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

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
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    access_token: string;
    refresh_token: string;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const res = await login(parsedCredentials.data);

          if (res.error) return null;

          if (res.data) {
            const { data: user } = await getMe();
            return {
              ...user,
              acess_token: res.data.access_token,
              refresh_token: res.data.refresh_token
            };
          } else {
            return null;
          }
        }

        return null;
      }
    })
  ]
});
