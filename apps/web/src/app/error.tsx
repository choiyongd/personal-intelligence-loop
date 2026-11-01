'use client';
import {useEffect,useState} from 'react';
export default function ErrorPage({reset}:{reset:()=>void}){
  const [en,setEn]=useState(false);
  useEffect(()=>setEn(document.documentElement.lang==='en'),[]);
  return <main id="main" className="auth-page"><h1>{en?'This page could not load.':'화면을 불러오지 못했습니다.'}</h1><p>{en?'Please try again in a moment.':'Supabase 연결과 환경변수를 확인하고 다시 시도해 주세요.'}</p><button onClick={reset}>{en?'Try again':'다시 시도'}</button></main>;
}
