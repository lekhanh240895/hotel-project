import { NextFetchEvent, NextRequest } from 'next/server';
import { MiddlewareFactory } from './types';
export { auth as middleware } from '@/auth';

export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const response = await next(request, _next);
    return response;
  };
};
