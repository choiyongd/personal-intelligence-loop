export function configured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.startsWith('replace_');
}
export function authEnv() {
  if (!configured()) throw new Error('Supabase environment is not configured');
  return { url: process.env.NEXT_PUBLIC_SUPABASE_URL!, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! };
}
export function appOrigin() {
  const origin = new URL(process.env.APP_ORIGIN || 'http://localhost:3000');
  // `next start` always runs as production; allow plain HTTP only for this machine's own preview.
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname);
  if (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:' && !loopback) throw new Error('APP_ORIGIN must use HTTPS in production');
  return origin.origin;
}
