import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Personal Intelligence Loop',description:'산업의 변화와 근거를 연결하는 업무 브리핑'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="ko"><body><a className="skip" href="#main">본문으로 건너뛰기</a>{children}</body></html>;}
