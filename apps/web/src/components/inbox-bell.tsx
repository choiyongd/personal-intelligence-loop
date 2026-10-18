'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';

// The mailbox in the header. The server counts unread editions; when the next scheduled edition's time comes
// while the page is open, the badge goes up and a short notice appears without a reload.
export function InboxBell({count,nextAt}:{count:number;nextAt:number|null}){
  const [unread,setUnread]=useState(count);
  const [arrived,setArrived]=useState(false);
  useEffect(()=>setUnread(count),[count]);
  useEffect(()=>{
    if(!nextAt)return;
    const wait=nextAt-Date.now();
    if(wait<=0||wait>2**31-1)return;
    const t=setTimeout(()=>{setUnread(n=>n+1);setArrived(true);},wait);
    return ()=>clearTimeout(t);
  },[nextAt]);
  useEffect(()=>{if(!arrived)return;const t=setTimeout(()=>setArrived(false),9000);return ()=>clearTimeout(t);},[arrived]);
  const label=unread?`메일함, 읽지 않은 뉴스레터 ${unread}개`:'메일함';
  return <span className="inbox-bell-wrap">
    <Link href="/my/inbox" className={`inbox-bell${unread?' has-unread':''}`} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {unread>0&&<span className="inbox-badge">{unread>9?'9+':unread}</span>}
    </Link>
    {arrived&&<Link href="/my/inbox" className="inbox-toast" role="status">새 뉴스레터가 도착했어요 · 메일함 열기 →</Link>}
  </span>;
}
