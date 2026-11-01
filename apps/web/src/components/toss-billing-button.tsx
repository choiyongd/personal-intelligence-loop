'use client';
import {useState} from 'react';

declare global{interface Window{TossPayments?:(clientKey:string)=>{payment:(o:{customerKey:string})=>{requestBillingAuth:(o:Record<string,unknown>)=>Promise<void>}}}}
const SDK='https://js.tosspayments.com/v2/standard';
function loadSdk(){
  return new Promise<void>((resolve,reject)=>{
    if(window.TossPayments)return resolve();
    const s=document.createElement('script');s.src=SDK;s.async=true;s.onload=()=>resolve();s.onerror=()=>reject(new Error('sdk'));document.head.appendChild(s);
  });
}
// Opens Toss's card registration window; Toss then redirects to our success or fail route.
export function TossBillingButton({clientKey,customerKey,origin,email,name,label}:{clientKey:string;customerKey:string;origin:string;email:string;name:string;label:string}){
  const [agreed,setAgreed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function start(){
    setBusy(true);setError('');
    try{
      await loadSdk();
      await window.TossPayments!(clientKey).payment({customerKey}).requestBillingAuth({method:'CARD',successUrl:`${origin}/api/billing/success`,failUrl:`${origin}/api/billing/fail`,customerEmail:email,customerName:name});
    }catch{setError('결제창을 열지 못했어요. 잠시 후 다시 시도해 주세요.');setBusy(false);}
  }
  return <div className="billing-start">
    <label className="billing-agree"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/><span><a href="/terms" target="_blank">이용약관과 환불 규정</a>을 확인했고, 매월 같은 날 자동으로 결제되는 데 동의합니다.</span></label>
    <button className="primary" disabled={!agreed||busy} onClick={start}>{busy?'결제창을 여는 중…':label}</button>
    {error&&<p className="delivery-notice" role="alert">{error}</p>}
  </div>;
}
