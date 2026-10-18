import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authEnv } from './env';

export async function supabase() {
  const jar = await cookies();
  const { url, key } = authEnv();
  return createServerClient(url, key, {
    cookieOptions: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production', httpOnly: true, path: '/' },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Server Component cannot write cookies; proxy refresh handles this path. */ }
      }
    }
  });
}
