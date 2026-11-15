'use client';
import {useEffect,useId,useState} from 'react';
import type {ShareText} from '@/lib/share';

type KakaoSDK={isInitialized():boolean;init(key:string):void;Share:{sendDefault(o:unknown):void}};
declare global{interface Window{Kakao?:KakaoSDK}}
// Kakao's official JavaScript SDK. It only loads when a Kakao app key is set (NEXT_PUBLIC_KAKAO_JS_KEY).
const KAKAO_SDK='https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
let kakaoLoading:Promise<KakaoSDK|null>|null=null;
function loadKakao(key:string){
  kakaoLoading??=new Promise(resolve=>{
    const ready=()=>{const k=window.Kakao;if(!k)return resolve(null);if(!k.isInitialized())k.init(key);resolve(k);};
    if(window.Kakao)return ready();
    const s=document.createElement('script');s.src=KAKAO_SDK;s.async=true;s.crossOrigin='anonymous';
    s.onload=ready;s.onerror=()=>{kakaoLoading=null;resolve(null);};document.head.appendChild(s);
  });
  return kakaoLoading;
}

// One row of share buttons: copy link, KakaoTalk, X, and the phone's own share sheet where there is one.
export function ShareBar({url,title,text,image,kakaoKey,t,compact}:{url:string;title:string;text:string;image?:string;kakaoKey?:string;t:ShareText;compact?:boolean}){
  const [status,setStatus]=useState('');
  const [native,setNative]=useState(false);
  const fieldId=useId();
  useEffect(()=>{setNative(typeof navigator!=='undefined'&&typeof navigator.share==='function');if(kakaoKey)void loadKakao(kakaoKey);},[kakaoKey]);
  async function copy(){
    try{await navigator.clipboard.writeText(url);setStatus(t.copied);}
    catch{
      // Older browsers or blocked clipboard: select the link text so the reader can copy it by hand.
      const field=document.getElementById(fieldId) as HTMLInputElement|null;
      if(field){field.hidden=false;field.select();}
      setStatus(t.copyFailed);
    }
  }
  async function kakao(){
    const k=kakaoKey?await loadKakao(kakaoKey):null;
    if(!k){await copy();return;}
    const link={mobileWebUrl:url,webUrl:url};
    k.Share.sendDefault({objectType:'feed',content:{title,description:text,...(image?{imageUrl:image,imageWidth:1200,imageHeight:630}:{}),link},buttons:[{title:t.button,link}]});
  }
  const xUrl=`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  return <div className={`share-bar${compact?' compact':''}`} role="group" aria-label={t.label}>
    {!compact&&<span className="share-label">{t.label}</span>}
    <button type="button" className="share-btn" onClick={copy}><span aria-hidden="true">🔗</span>{t.copy}</button>
    {kakaoKey&&<button type="button" className="share-btn kakao" onClick={kakao}><span aria-hidden="true">💬</span>{t.kakao}</button>}
    <a className="share-btn" href={xUrl} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">𝕏</span>{t.x}</a>
    {native&&<button type="button" className="share-btn" onClick={()=>navigator.share({title,text,url}).catch(()=>undefined)}><span aria-hidden="true">↗</span>{t.more}</button>}
    <input id={fieldId} className="share-url" value={url} readOnly hidden aria-label={t.copy} onFocus={e=>e.currentTarget.select()}/>
    <span className="share-status" role="status" aria-live="polite">{status}</span>
  </div>;
}
