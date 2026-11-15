import type { Metadata } from 'next';
import { getLocale } from '@/lib/locale';
import { Libre_Baskerville, Noto_Serif_KR } from 'next/font/google';
import { MotionLayer } from '@/components/motion';
import { appOrigin } from '@/lib/env';
import './globals.css';

// Site type: Libre Baskerville for Latin, Noto Serif KR for Hangul (Baskerville has no Korean glyphs).
const baskerville = Libre_Baskerville({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-baskerville', display: 'swap' });
const serifKr = Noto_Serif_KR({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-serif-kr', display: 'swap', preload: false });
export async function generateMetadata():Promise<Metadata>{
  const en=await getLocale()==='en';
  const description=en?'A newsletter built from your interests: sourced explainers, written at your level.':'산업의 변화와 근거를 연결하는 업무 브리핑';
  // Absolute links for link previews; pages that are shared (stories, invites) set their own title and image.
  let metadataBase:URL|undefined;try{metadataBase=new URL(appOrigin());}catch{metadataBase=undefined;}
  return {metadataBase,title:'Personal Intelligence Loop',description,
    openGraph:{type:'website',siteName:'loop.',locale:en?'en_US':'ko_KR',title:en?'loop. · Your interests, on one page.':'loop. · 당신의 관심이, 하나의 지면으로.',description,images:[{url:`/og/site${en?'?lang=en':''}`,width:1200,height:630}]},
    twitter:{card:'summary_large_image'}};
}
export default async function Layout({children}:{children:React.ReactNode}) {
  const loc=await getLocale();
  return <html lang={loc} className={`${baskerville.variable} ${serifKr.variable}`}><head><link rel="stylesheet" href="/fonts/pretendard/pretendardvariable-dynamic-subset.css"/></head><body><a className="skip" href="#main">{loc==='en'?'Skip to content':'본문으로 건너뛰기'}</a>{children}<MotionLayer/></body></html>;
}
