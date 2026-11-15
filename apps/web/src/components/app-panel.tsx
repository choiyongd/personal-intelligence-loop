'use client';
import {useEffect,useState} from 'react';
import {lx,type Locale} from '@/lib/i18n';

type InstallEvent=Event&{prompt():Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
type Push='checking'|'unsupported'|'ios-install'|'unconfigured'|'denied'|'off'|'on'|'busy';

function keyBytes(base64:string){
  const padded=(base64+'='.repeat((4-base64.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/');
  const raw=atob(padded),out=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
  return out;
}
const isIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
async function send(method:'POST'|'DELETE',url:string,body:unknown){
  const res=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return res;
}

// "Use it like an app": add to the home screen, and get a notice when the day's new stories are out.
export function AppPanel({vapidKey,loc='ko'}:{vapidKey:string;loc?:Locale}){
  const L=lx(loc),en=loc==='en';
  const [installed,setInstalled]=useState(false);
  const [ios,setIos]=useState(false);
  const [prompt,setPrompt]=useState<InstallEvent|null>(null);
  const [push,setPush]=useState<Push>('checking');
  const [note,setNote]=useState('');

  useEffect(()=>{
    setInstalled(isStandalone());setIos(isIos());
    const onPrompt=(e:Event)=>{e.preventDefault();setPrompt(e as InstallEvent);};
    const onInstalled=()=>{setInstalled(true);setPrompt(null);};
    window.addEventListener('beforeinstallprompt',onPrompt);
    window.addEventListener('appinstalled',onInstalled);
    (async()=>{
      if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){
        setPush(isIos()&&!isStandalone()?'ios-install':'unsupported');return;
      }
      if(!vapidKey){setPush('unconfigured');return;}
      if(Notification.permission==='denied'){setPush('denied');return;}
      const reg=await navigator.serviceWorker.ready;
      const sub=await reg.pushManager.getSubscription();
      if(sub){
        setPush('on');
        // Keep the server copy current (fields may have changed since notices were turned on).
        void send('POST','/api/push',sub.toJSON()).catch(()=>{});
      }else setPush('off');
    })().catch(()=>setPush('unsupported'));
    return ()=>{window.removeEventListener('beforeinstallprompt',onPrompt);window.removeEventListener('appinstalled',onInstalled);};
  },[vapidKey]);

  async function install(){
    if(!prompt)return;
    await prompt.prompt();
    const {outcome}=await prompt.userChoice;
    setPrompt(null);
    if(outcome==='accepted')setInstalled(true);
  }
  async function turnOn(){
    setPush('busy');setNote('');
    try{
      const permission=await Notification.requestPermission();
      if(permission!=='granted'){setPush(permission==='denied'?'denied':'off');return;}
      const reg=await navigator.serviceWorker.ready;
      const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(vapidKey)});
      const res=await send('POST','/api/push',sub.toJSON());
      if(!res.ok){await sub.unsubscribe();throw new Error('save');}
      setPush('on');
      await test(sub.endpoint);
    }catch{setPush('off');setNote(L('알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.','We could not turn notifications on. Please try again shortly.'));}
  }
  async function turnOff(){
    setPush('busy');setNote('');
    try{
      const reg=await navigator.serviceWorker.ready;
      const sub=await reg.pushManager.getSubscription();
      if(sub){await send('DELETE','/api/push',{endpoint:sub.endpoint}).catch(()=>{});await sub.unsubscribe();}
      setPush('off');setNote(L('알림을 껐어요.','Notifications are off.'));
    }catch{setPush('on');setNote(L('알림을 끄지 못했어요.','We could not turn notifications off.'));}
  }
  async function test(endpoint?:string){
    try{
      const ep=endpoint||(await (await navigator.serviceWorker.ready).pushManager.getSubscription())?.endpoint;
      if(!ep)return;
      const res=await send('POST','/api/push/test',{endpoint:ep});
      setNote(res.ok?L('시험 알림을 보냈어요. 몇 초 안에 도착해요.','We sent a test notification. It should arrive in a few seconds.'):res.status===429?L('시험 알림은 1분에 한 번 보낼 수 있어요.','You can send one test notification a minute.'):L('시험 알림을 보내지 못했어요.','We could not send a test notification.'));
    }catch{setNote(L('시험 알림을 보내지 못했어요.','We could not send a test notification.'));}
  }

  const installPart=installed?<p className="delivery-state">{L('홈 화면 앱으로 열려 있어요.','You are using the home-screen app.')}</p>
    :prompt?<><p className="muted">{L('홈 화면에 아이콘을 두고 앱처럼 바로 열 수 있어요. 설치는 몇 초면 끝나고, 언제든 지울 수 있어요.','Put loop. on your home screen and open it like an app. It takes a few seconds and you can remove it any time.')}</p><button type="button" className="primary small" onClick={install}>{L('홈 화면에 설치','Install app')}</button></>
    :ios?<p className="muted">{en?<>In Safari, tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>.</>:<>Safari 아래쪽의 <b>공유</b> 버튼(네모에 화살표)을 누르고 <b>홈 화면에 추가</b>를 고르세요.</>}</p>
    :<p className="muted">{en?<>Use your browser menu’s <b>Install app</b> or <b>Add to Home screen</b>.</>:<>브라우저 메뉴(⋮)에서 <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 고르세요.</>}</p>;

  const pushPart=en?<p className="muted">Daily new-story notifications are available in the Korean edition.</p>
    :push==='checking'?<p className="muted">알림 설정을 확인하는 중이에요…</p>
    :push==='ios-install'?<p className="muted">아이폰·아이패드는 먼저 <b>홈 화면에 추가</b>한 뒤, 홈 화면의 loop. 아이콘으로 열어야 알림을 켤 수 있어요(iOS 16.4 이상).</p>
    :push==='unsupported'?<p className="muted">이 브라우저는 알림을 지원하지 않아요. 크롬·엣지·사파리 최신 버전에서 열어 주세요.</p>
    :push==='unconfigured'?<p className="muted">알림은 운영 설정이 끝나면 열립니다. 지금은 메일함과 메일로 받아 볼 수 있어요.</p>
    :push==='denied'?<p className="muted">이 기기에서 loop. 알림이 차단되어 있어요. 브라우저 주소창의 자물쇠(또는 휴대폰 설정 › 알림)에서 허용으로 바꾼 뒤 이 페이지를 새로 고쳐 주세요.</p>
    :push==='on'?<><p className="delivery-state">매일 아침 고른 분야에 새 소식이 올라오면 이 기기로 알려 드려요.</p><div className="delivery-actions"><button type="button" className="secondary small" onClick={turnOff}>알림 끄기</button><button type="button" className="text-button" onClick={()=>test()}>시험 알림 보내기</button></div></>
    :<><p className="muted">매일 아침 고른 분야에 새 소식이 올라오면 하루 한 번만 알려 드려요. 광고는 보내지 않아요.</p><button type="button" className="primary small" disabled={push==='busy'} onClick={turnOn}>{push==='busy'?'켜는 중…':'새 소식 알림 켜기'}</button></>;

  return <section className="delivery app-panel" aria-label={L('앱처럼 쓰기','Use it like an app')}>
    <div className="delivery-grid">
      <div className="delivery-card"><p className="eyebrow">NOTIFICATIONS</p><h2>{L('새 소식 알림','New-story notifications')}</h2>{pushPart}{note&&<p className="delivery-fine" role="status">{note}</p>}</div>
      <div className="delivery-card"><p className="eyebrow">APP</p><h2>{L('홈 화면에 두기','Add to home screen')}</h2>{installPart}</div>
    </div>
  </section>;
}
