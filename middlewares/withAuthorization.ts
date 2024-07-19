import { NextFetchEvent, NextRequest } from 'next/server';
import { MiddlewareFactory } from './types';
import { cookies } from 'next/headers';
import { LIST_ROUTER, STORAGE_KEYS } from '@/app/lib/constants/common';

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const nextUrl = request.nextUrl;

    const is_authenticated = cookies().get(
      STORAGE_KEYS.IS_AUTHENTICATED
    )?.value;

    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    const isOnLogin = nextUrl.pathname.startsWith(LIST_ROUTER.LOGIN);

    if (isOnDashboard) {
      if (!is_authenticated) {
        const baseUrl = LIST_ROUTER.LOGIN;
        const url = new URL(baseUrl, nextUrl);
        const { pathname, search } = request.nextUrl;
        url.searchParams.set('callbackUrl', encodeURI(`${pathname}${search}`));

        return Response.redirect(url);
      }
    } else if (is_authenticated) {
      if (isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
    }
    return next(request, _next);
  };
};
