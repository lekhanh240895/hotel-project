import type { NextAuthConfig } from 'next-auth';
import { LIST_ROUTER } from './app/lib/constants/common';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: LIST_ROUTER.LOGIN,
    newUser: LIST_ROUTER.REGISTER
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token = {
          ...token,
          id: user._id,
          access_token: account.access_token || user.access_token,
          refresh_token: account.refresh_token || user.refresh_token,
          user
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const { id, user, access_token } = token as {
          id: string;
          access_token: string;
          user: any;
        };
        session = {
          ...session,
          access_token,
          user: { ...user, id }
        };
      }

      return session;
    }
  },
  providers: []
} satisfies NextAuthConfig;
