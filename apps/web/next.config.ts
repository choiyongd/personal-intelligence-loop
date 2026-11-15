import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  // Link-preview images read their font files from disk; make sure the server bundle carries them.
  outputFileTracingIncludes: { '/og/**': ['./assets/og/**'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Cache-Control', value: 'private, no-store' }
    ] }, {
      // Preview images are the same for everyone; let KakaoTalk, X and the CDN keep them.
      source: '/og/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' }]
    }, {
      // The service worker must always be re-checked so fixes reach installed apps, and may only load same-origin code.
      source: '/sw.js', headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" }
      ] }, {
      source: '/icons/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }]
    }];
  }
};
export default config;
