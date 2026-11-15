const ADMIN_COOKIE = 'pil_platform_session';

export function platformAdminEnv() {
  const url = process.env.ADMIN_SUPABASE_URL;
  const key = process.env.ADMIN_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key?.startsWith('sb_publishable_')) return null;
  try {
    const origin = new URL(url);
    if (origin.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(origin.hostname)) return null;
    if (origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) return null;
    return {url:origin.origin,key};
  } catch {
    return null;
  }
}

export const platformAdminCookie = {
  name: ADMIN_COOKIE, path: '/admin', sameSite: 'lax' as const, httpOnly: true,
  secure: process.env.VERCEL === '1',
};
