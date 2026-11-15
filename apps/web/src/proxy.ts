import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { configured, authEnv } from './lib/env';
import { REF_COOKIE, REF_COOKIE_DAYS, isReferralCode } from './lib/referral-code';

const authPaths = ['/feed', '/settings', '/saved', '/events', '/publish', '/operations', '/login', '/auth'];
const needsAuth = (path: string) => authPaths.some(p => path === p || path.startsWith(`${p}/`));

// A friend's invite link (/invite/<code>) or a shared story (?ref=<code>) leaves a 30-day note of who sent it.
// The first invite is kept; the note is read only when this browser becomes a reader.
function referralCode(request: NextRequest) {
  const fromPath = /^\/invite\/([^/]+)\/?$/.exec(request.nextUrl.pathname)?.[1];
  const code = fromPath ?? request.nextUrl.searchParams.get('ref');
  return isReferralCode(code) && !request.cookies.has(REF_COOKIE) ? code : null;
}

export async function proxy(request: NextRequest) {
  const ref = referralCode(request);
  let response = NextResponse.next({ request });
  if (configured() && needsAuth(request.nextUrl.pathname)) {
    const { url, key } = authEnv();
    const client = createServerClient(url, key, {
      cookieOptions: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production', httpOnly: true, path: '/' },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    });
    await client.auth.getUser();
    response.headers.set('Cache-Control', 'private, no-store');
  }
  if (ref) response.cookies.set(REF_COOKIE, ref, { path: '/', maxAge: 60 * 60 * 24 * REF_COOKIE_DAYS, sameSite: 'lax', httpOnly: true, secure: process.env.VERCEL === '1' });
  return response;
}
export const config = {
  matcher: [
    '/feed/:path*', '/settings/:path*', '/saved/:path*', '/events/:path*', '/publish/:path*', '/operations/:path*', '/login', '/auth/:path*',
    '/invite/:path*',
    { source: '/((?!_next/|api/|og/|fonts/|favicon).*)', has: [{ type: 'query', key: 'ref' }] }
  ]
};
