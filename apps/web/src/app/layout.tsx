import type { Metadata, Viewport } from 'next';
import { getLocale } from '@/lib/locale';
import { Libre_Baskerville, Noto_Serif_KR } from 'next/font/google';
import { MotionLayer } from '@/components/motion';
import { ServiceWorker } from '@/components/service-worker';
import './globals.css';

// Site type: Libre Baskerville for Latin, Noto Serif KR for Hangul (Baskerville has no Korean glyphs).
const baskerville = Libre_Baskerville({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-baskerville', display: 'swap' });
const serifKr = Noto_Serif_KR({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-serif-kr', display: 'swap', preload: false });
export async function generateMetadata():Promise<Metadata>{
  const en=await getLocale()==='en';
  return {title:'Personal Intelligence Loop',description:en?'A newsletter built from your interests: sourced explainers, written at your level.':'산업의 변화와 근거를 연결하는 업무 브리핑',
    applicationName:'loop.',
    // Home-screen app on iPhone/iPad: full-screen window, dark status bar, its own name and icon.
    appleWebApp:{capable:true,title:'loop.',statusBarStyle:'black'},
    icons:{icon:[{url:'/icons/icon.svg',type:'image/svg+xml'},{url:'/icons/icon-192.png',sizes:'192x192',type:'image/png'}],apple:[{url:'/icons/apple-touch-icon.png',sizes:'180x180'}]},
    formatDetection:{telephone:false}};
}
export const viewport:Viewport={themeColor:'#0d0d0e',colorScheme:'dark',width:'device-width',initialScale:1};
export default async function Layout({children}:{children:React.ReactNode}) {
  const loc=await getLocale();
  return <html lang={loc} className={`${baskerville.variable} ${serifKr.variable}`}><head><link rel="stylesheet" href="/fonts/pretendard/pretendardvariable-dynamic-subset.css"/></head><body><a className="skip" href="#main">{loc==='en'?'Skip to content':'본문으로 건너뛰기'}</a>{children}<MotionLayer/><ServiceWorker/></body></html>;
}
