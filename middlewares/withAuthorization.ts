import { NextFetchEvent, NextRequest } from 'next/server';
import { MiddlewareFactory } from './types';
import { cookies } from 'next/headers';
import { STORAGE_KEYS } from '@/app/lib/constants/common';

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const nextUrl = request.nextUrl;

    // Continue to the next middleware for other cases
    const is_authenticated = cookies().get(
      STORAGE_KEYS.IS_AUTHENTICATED
    )?.value;

    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    if (isOnDashboard) {
      if (!is_authenticated) {
        return Response.redirect(new URL('/login', nextUrl));
      }
    } else if (is_authenticated) {
    }
    return next(request, _next);
  };
};
