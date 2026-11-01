import type { Metadata } from 'next';
import { getLocale } from '@/lib/locale';
import { Libre_Baskerville, Noto_Serif_KR } from 'next/font/google';
import { MotionLayer } from '@/components/motion';
import './globals.css';

// Site type: Libre Baskerville for Latin, Noto Serif KR for Hangul (Baskerville has no Korean glyphs).
const baskerville = Libre_Baskerville({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-baskerville', display: 'swap' });
const serifKr = Noto_Serif_KR({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-serif-kr', display: 'swap', preload: false });
export async function generateMetadata():Promise<Metadata>{
  const en=await getLocale()==='en';
  return {title:'Personal Intelligence Loop',description:en?'A newsletter built from your interests: sourced explainers, written at your level.':'산업의 변화와 근거를 연결하는 업무 브리핑'};
}
export default async function Layout({children}:{children:React.ReactNode}) {
  const loc=await getLocale();
  return <html lang={loc} className={`${baskerville.variable} ${serifKr.variable}`}><head><link rel="stylesheet" href="/fonts/pretendard/pretendardvariable-dynamic-subset.css"/></head><body><a className="skip" href="#main">{loc==='en'?'Skip to content':'본문으로 건너뛰기'}</a>{children}<MotionLayer/></body></html>;
}
