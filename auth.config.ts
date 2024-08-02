import type { NextAuthConfig } from 'next-auth';
import { LIST_ROUTER } from './app/lib/constants/common';
import { requestGetUser } from './app/lib/services/users';
import { handleSocialLogin } from './app/lib/services/auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: LIST_ROUTER.LOGIN,
    newUser: LIST_ROUTER.REGISTER
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account) {
        token = {
          ...token,
          access_token: account.access_token || ''
        };
      }
      if (user) {
        token = {
          ...token,
          id: user._id,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          user
        };
      }

      if (trigger === 'update' && session) {
        // token = { ...token, user: session };
        // return token;
        console.log('updated', { session });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const {
          id,
          user: { full_name, id: userId, role },
          access_token,
          refresh_token
        } = token;
        const { user } = session;
        session = {
          ...session,
          access_token,
          refresh_token,
          user: {
            ...user,
            id: (id !== undefined ? id : userId) as string,
            name: full_name ? full_name : user.name,
            full_name: user.name ? user.name : full_name,
            role: role
          }
        };
      }

      return session;
    },
    async signIn({ profile, user, account }) {
      if (profile) {
        const res = await requestGetUser({
          email: profile.email
        });
        if (res.error) return false;

        if (!res.data) {
          const isSucced = await handleSocialLogin(profile);
          if (!isSucced) return false;
        } else {
          user.id = res.data._id;
          return true;
        }
      }

      return true;
    }
  },
  providers: []
} satisfies NextAuthConfig;
