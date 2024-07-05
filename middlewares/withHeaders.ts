import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

import { MiddlewareFactory } from './types';
import {
  STORAGE_KEYS,
  REQUIRED_TOKEN_ENDPOINTS,
  MIDDLEWARE_CONFIG
} from '@/app/lib/constants/common';
import { endpointsContainsPath } from '@/app/lib/utils';

export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const headerMatcher = new RegExp(MIDDLEWARE_CONFIG.DEFAULT);
    const { pathname } = request.nextUrl;

    if (headerMatcher.test(pathname)) {
      if (pathname.startsWith('/api')) {
        const headers = new Headers(request.headers);

        if (endpointsContainsPath(REQUIRED_TOKEN_ENDPOINTS, pathname)) {
          headers.set(
            'Authorization',
            `Bearer ${request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value}`
          );
        }
      }

      const response = await next(request, _next);
      return response;
    }
  };
};
