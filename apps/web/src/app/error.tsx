'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="auth-page"><h1>화면을 불러오지 못했습니다.</h1><p>Supabase 연결과 환경변수를 확인하고 다시 시도해 주세요.</p><button onClick={reset}>다시 시도</button></main>;}
