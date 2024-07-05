import { stackMiddlewares } from './middlewares/stackMiddlewares';
import { withAuth } from './middlewares/withAuth';
import { withHeaders } from './middlewares/withHeaders';
import { withI18n } from './middlewares/withI18n';

export default stackMiddlewares([withHeaders, withAuth, withI18n]);

// applies this middleware only to files in the app directory
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    {
      source: '/',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
};
