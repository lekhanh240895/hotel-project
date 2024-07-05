import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

import { MiddlewareFactory } from './types';
import {
  STORAGE_KEYS,
  USER_TOKEN_REQUIRED_FOR_ENDPOINTS
} from '@/app/lib/constants/common';

export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const path = request.nextUrl.pathname;

    if (path.startsWith('/api')) {
      const pathNameHasId = path.match(
        /^\/api\/edsdk\/purchases\/(\d+)/
      )?.length;

      const headers = new Headers(request.headers);

      if (USER_TOKEN_REQUIRED_FOR_ENDPOINTS.includes(path) || pathNameHasId) {
        headers.set(
          'Authorization',
          `Bearer ${request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value}`
        );
      }
    }

    const response = await next(request, _next);
    return response;
  };
};
