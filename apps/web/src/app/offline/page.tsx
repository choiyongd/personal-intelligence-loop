import Link from 'next/link';

// Shown by the service worker when the app is opened without a connection. Must stay static (no cookies, no data).
export const dynamic='force-static';
export const metadata={title:'연결 없음 · loop.'};
export default function Offline(){
  return <main id="main" className="auth-page"><p className="eyebrow">OFFLINE</p><h1>인터넷에 연결되어 있지 않아요</h1><p className="muted">연결되면 다시 불러올게요. You are offline; reconnect and try again.</p><Link href="/my">다시 시도 →</Link></main>;
}
