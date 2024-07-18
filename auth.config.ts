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
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          user
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string };
        const { user } = session;
        session = {
          ...session,
          user: { ...user, id },
          access_token: token.access_token
        };
      }

      console.log({ token, session });

      return session;
    }
  },
  providers: []
} satisfies NextAuthConfig;
