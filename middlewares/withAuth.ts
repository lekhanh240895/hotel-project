import { NextFetchEvent, NextRequest } from 'next/server';
import { MiddlewareFactory } from './types';
import { auth } from '@/auth';
import { LIST_ROUTER } from '@/app/lib/constants/common';

export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const session = await auth();
    const nextUrl = request.nextUrl;

    const isOnDashboard = nextUrl.pathname.startsWith(LIST_ROUTER.DASHBOARD);
    const isOnLogin = nextUrl.pathname.startsWith(LIST_ROUTER.LOGIN);

    if (isOnDashboard) {
      if (!session) {
        const baseUrl = LIST_ROUTER.LOGIN;
        const url = new URL(baseUrl, nextUrl);
        const { pathname, search } = request.nextUrl;
        url.searchParams.set('callbackUrl', encodeURI(`${pathname}${search}`));

        return Response.redirect(url);
      }
    } else if (session) {
      if (isOnLogin) {
        return Response.redirect(new URL(LIST_ROUTER.DASHBOARD, nextUrl));
      }
    }
    return next(request, _next);
  };
};
