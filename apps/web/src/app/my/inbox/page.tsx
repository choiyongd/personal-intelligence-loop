import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {betaReader,draftSelection} from '@/lib/beta';
import {inboxIssues,readInbox,type InboxIssue} from '@/lib/inbox';
import {localizedArticle} from '@/lib/articles';
import {planLabel,scheduleLabel,weekdays,weekdaysEn} from '@/lib/newsletter';
import {zonedNow} from '@/lib/kst';
import {getL} from '@/lib/locale';
import {intlLocale,lx,type Locale} from '@/lib/i18n';
import {ensureArticles} from '@/lib/live/registry';

export async function generateMetadata(){return {title:`${(await getL()).L('메일함','Mailbox')} · Personal Intelligence Loop`};}
const views=[['day','일자별','By day'],['calendar','날짜(달력)','Calendar'],['month','월별','By month']] as const;
type View=typeof views[number][0];
const time=(at:number,loc:Locale,tz:string)=>new Intl.DateTimeFormat(intlLocale(loc),{timeZone:tz,hour:'numeric',minute:'2-digit'}).format(new Date(at));
const dayTitle=(d:string,loc:Locale)=>{const [y,m,day]=d.split('-').map(Number);return loc==='en'?new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'}).format(new Date(Date.UTC(y,m-1,day))):`${m}월 ${day}일 ${weekdays[new Date(Date.UTC(y,m-1,day)).getUTCDay()]}요일`;};
const monthTitle=(m:string,loc:Locale)=>loc==='en'?new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'long',year:'numeric'}).format(new Date(`${m}-01T00:00:00Z`)):`${m.slice(0,4)}년 ${Number(m.slice(5,7))}월`;
function shiftMonth(m:string,n:number){const d=new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5,7))-1+n,1));return d.toISOString().slice(0,7);}
function groupBy<T>(items:T[],key:(t:T)=>string){const map=new Map<string,T[]>();for(const i of items)map.set(key(i),[...(map.get(key(i))||[]),i]);return [...map];}

function Row({issue,loc,tz}:{issue:InboxIssue;loc:Locale;tz:string}){
  const L=lx(loc),lead=localizedArticle(issue.articleIds[0],loc);
  return <li className={`inbox-row${issue.read?'':' unread'}`}><Link href={`/my/inbox/${issue.key}`}>
    <span className="inbox-kind">{issue.kind==='scheduled'?L('정기 호','Scheduled issue'):L('직접 만든 호','Your edition')}</span>
    <strong>{lead?.title||L('읽을거리','Reading')}</strong>
    <span className="inbox-meta">{time(issue.at,loc,tz)} · {loc==='en'?`${issue.articleIds.length} stories`:`읽을거리 ${issue.articleIds.length}편`}{issue.read?'':L(' · 새 호',' · New')}</span>
  </Link></li>;
}
export default async function Inbox({searchParams}:{searchParams:Promise<{view?:string;month?:string;date?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const [q,store,{loc,L}]=await Promise.all([searchParams,readInbox(),getL()]),en=loc==='en',tz=selection.tz;
  const dt=(d:string)=>dayTitle(d,loc),mt=(m:string)=>monthTitle(m,loc),wd=en?weekdaysEn:weekdays;
  const view:View=views.some(v=>v[0]===q.view)?q.view as View:'day';
  const issues=inboxIssues(selection,store);
  await ensureArticles(issues.flatMap(i=>i.articleIds.slice(0,1)));
  const today=zonedNow(new Date(),tz).date,month=/^\d{4}-\d{2}$/.test(q.month||'')?q.month!:today.slice(0,7);
  const date=/^\d{4}-\d{2}-\d{2}$/.test(q.date||'')?q.date:undefined;
  const shown=date?issues.filter(i=>i.date===date):issues;
  const unread=issues.filter(i=>!i.read).length;
  // Calendar grid for the chosen month, Sunday first.
  const first=new Date(`${month}-01T00:00:00Z`),days=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
  const cells=[...Array(first.getUTCDay()).fill(null),...Array.from({length:days},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)];
  const byDate=new Map(groupBy(issues,i=>i.date));
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="inbox-page">
    <header className="inbox-head"><div><p className="eyebrow">MAILBOX</p><h1>{L('메일함','Mailbox')}</h1><p className="muted">{en?`${store.plan==='subscriber'?`Scheduled issues arrive here (${scheduleLabel(selection,loc)}).`:'Editions from your free trial are kept here.'} ${issues.length} issue${issues.length===1?'':'s'} so far${unread?`, ${unread} new`:''}.`:`${store.plan==='subscriber'?`${scheduleLabel(selection)} 정기 호가 이곳에 도착해요.`:'무료 체험으로 만든 호가 이곳에 보관돼요.'} 지금까지 ${issues.length}호${unread?`, 새 호 ${unread}개`:''}.`}</p></div>
      <Link className="button secondary" href="/my">{L('새로 만들기 ↗','Make a new one ↗')}</Link></header>
    <nav className="inbox-tabs" aria-label={L('보기 방식','View')}>{views.map(([id,koLabel,enLabel])=>{const label=en?enLabel:koLabel;return <Link key={id} href={`/my/inbox?view=${id}${id==='calendar'?`&month=${month}`:''}`} aria-current={view===id?'page':undefined}>{label}</Link>;})}</nav>
    {issues.length===0?<div className="inbox-empty"><h2>{L('아직 도착한 뉴스레터가 없어요','No newsletters yet')}</h2><p className="muted">{store.plan==='free'?L('나의 뉴스레터에서 첫 호를 만들어 보세요.','Make your first issue from My newsletter.'):en?`Your next scheduled issue arrives ${scheduleLabel(selection,loc).replace(/^Daily/,'daily')}. You can also make one right now.`:`다음 정기 호는 ${scheduleLabel(selection)}에 도착해요. 지금 바로 새로 만들 수도 있어요.`}</p><Link className="button primary" href="/my">{L('뉴스레터 만들기 →','Make a newsletter →')}</Link></div>
    :view==='calendar'?<section className="inbox-calendar" aria-label={en?`${mt(month)} calendar`:`${mt(month)} 달력`}>
      <div className="cal-head"><Link href={`/my/inbox?view=calendar&month=${shiftMonth(month,-1)}`} aria-label={L('이전 달','Previous month')}>←</Link><h2>{mt(month)}</h2><Link href={`/my/inbox?view=calendar&month=${shiftMonth(month,1)}`} aria-label={L('다음 달','Next month')}>→</Link></div>
      <div className="cal-grid">{wd.map(w=><span key={w} className="cal-wd">{w}</span>)}{cells.map((d,i)=>{if(!d)return <span key={`b${i}`}/>;const list=byDate.get(d)||[];const n=Number(d.slice(8));
        return list.length?<Link key={d} href={`/my/inbox?view=day&date=${d}`} className={`cal-day has${list.some(x=>!x.read)?' unread':''}${d===today?' today':''}`} aria-label={en?`${dt(d)}, ${list.length} issue${list.length===1?'':'s'}`:`${dt(d)} ${list.length}호`}><b>{n}</b><i>{en?list.length:`${list.length}호`}</i></Link>:<span key={d} className={`cal-day${d===today?' today':''}`}><b>{n}</b></span>;})}</div>
      <p className="muted cal-note">{L('날짜를 누르면 그날 받은 호를 볼 수 있어요.','Tap a date to see the issues from that day.')}</p>
    </section>
    :view==='month'?<section className="inbox-months">{groupBy(shown,i=>i.date.slice(0,7)).map(([m,list])=><details key={m} open={m===today.slice(0,7)}><summary><b>{mt(m)}</b><span>{en?`${list.length} issue${list.length===1?'':'s'}`:`${list.length}호`}{list.some(i=>!i.read)?(en?` · ${list.filter(i=>!i.read).length} new`:` · 새 호 ${list.filter(i=>!i.read).length}`):''}</span></summary><ul className="inbox-list">{list.map(i=><Row key={i.key} issue={i} loc={loc} tz={tz}/>)}</ul></details>)}</section>
    :<section className="inbox-days">{date&&<p className="inbox-filter">{en?`Showing ${dt(date)} only`:`${dt(date)}만 보는 중`} · <Link href="/my/inbox">{L('전체 보기','Show all')}</Link></p>}{shown.length===0&&<p className="muted">{L('이 날짜에 받은 호가 없어요.','No issues on this date.')}</p>}{groupBy(shown,i=>i.date).map(([d,list])=><div key={d} className="inbox-day"><h2>{d===today?L('오늘','Today'):dt(d)}</h2><ul className="inbox-list">{list.map(i=><Row key={i.key} issue={i} loc={loc} tz={tz}/>)}</ul></div>)}</section>}
    <p className="inbox-fine muted">{L('메일함은 이 브라우저에 보관돼요. 직접 만든 호는 최근 15호, 정기 호는 최근 두 달까지 다시 볼 수 있어요.','Your mailbox is kept in this browser. You can reread your last 15 editions and the last two months of scheduled issues.')} {en?`${planLabel(store.plan,loc)} plan`:`${planLabel(store.plan)} 플랜`}</p>
  </main><footer className="site-footer"><span>loop.</span><span>{L('읽은 만큼 쌓입니다.','What you read adds up.')}</span></footer></div>;
}
