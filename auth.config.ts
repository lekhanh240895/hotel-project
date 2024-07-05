import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  callbacks: {
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
