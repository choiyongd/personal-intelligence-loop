import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {betaReader,draftSelection} from '@/lib/beta';
import {inboxIssues,readInbox,type InboxIssue} from '@/lib/inbox';
import {articleById} from '@/lib/articles';
import {plans,scheduleLabel,weekdays} from '@/lib/newsletter';
import {kstNow} from '@/lib/kst';

export const metadata={title:'메일함 · Personal Intelligence Loop'};
const views=[['day','일자별'],['calendar','날짜(달력)'],['month','월별']] as const;
type View=typeof views[number][0];
const time=(at:number)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'numeric',minute:'2-digit'}).format(new Date(at));
const dayTitle=(d:string)=>{const [y,m,day]=d.split('-').map(Number);return `${m}월 ${day}일 ${weekdays[new Date(Date.UTC(y,m-1,day)).getUTCDay()]}요일`;};
const monthTitle=(m:string)=>`${m.slice(0,4)}년 ${Number(m.slice(5,7))}월`;
function shiftMonth(m:string,n:number){const d=new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5,7))-1+n,1));return d.toISOString().slice(0,7);}
function groupBy<T>(items:T[],key:(t:T)=>string){const map=new Map<string,T[]>();for(const i of items)map.set(key(i),[...(map.get(key(i))||[]),i]);return [...map];}

function Row({issue}:{issue:InboxIssue}){
  const lead=articleById(issue.articleIds[0]);
  return <li className={`inbox-row${issue.read?'':' unread'}`}><Link href={`/my/inbox/${issue.key}`}>
    <span className="inbox-kind">{issue.kind==='scheduled'?'정기 호':'직접 만든 호'}</span>
    <strong>{lead?.title||'읽을거리'}</strong>
    <span className="inbox-meta">{time(issue.at)} · 읽을거리 {issue.articleIds.length}편{issue.read?'':' · 새 호'}</span>
  </Link></li>;
}
export default async function Inbox({searchParams}:{searchParams:Promise<{view?:string;month?:string;date?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const q=await searchParams,store=await readInbox();
  const view:View=views.some(v=>v[0]===q.view)?q.view as View:'day';
  const issues=inboxIssues(selection,store);
  const today=kstNow().date,month=/^\d{4}-\d{2}$/.test(q.month||'')?q.month!:today.slice(0,7);
  const date=/^\d{4}-\d{2}-\d{2}$/.test(q.date||'')?q.date:undefined;
  const shown=date?issues.filter(i=>i.date===date):issues;
  const unread=issues.filter(i=>!i.read).length;
  // Calendar grid for the chosen month, Sunday first.
  const first=new Date(`${month}-01T00:00:00Z`),days=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
  const cells=[...Array(first.getUTCDay()).fill(null),...Array.from({length:days},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)];
  const byDate=new Map(groupBy(issues,i=>i.date));
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="inbox-page">
    <header className="inbox-head"><div><p className="eyebrow">MAILBOX</p><h1>메일함</h1><p className="muted">{store.plan==='subscriber'?`${scheduleLabel(selection)} 정기 호가 이곳에 도착해요.`:'무료 체험으로 만든 호가 이곳에 보관돼요.'} 지금까지 {issues.length}호{unread?`, 새 호 ${unread}개`:''}.</p></div>
      <Link className="button secondary" href="/my">새로 만들기 ↗</Link></header>
    <nav className="inbox-tabs" aria-label="보기 방식">{views.map(([id,label])=><Link key={id} href={`/my/inbox?view=${id}${id==='calendar'?`&month=${month}`:''}`} aria-current={view===id?'page':undefined}>{label}</Link>)}</nav>
    {issues.length===0?<div className="inbox-empty"><h2>아직 도착한 뉴스레터가 없어요</h2><p className="muted">{store.plan==='free'?'나의 뉴스레터에서 첫 호를 만들어 보세요.':`다음 정기 호는 ${scheduleLabel(selection)}에 도착해요. 지금 바로 새로 만들 수도 있어요.`}</p><Link className="button primary" href="/my">뉴스레터 만들기 →</Link></div>
    :view==='calendar'?<section className="inbox-calendar" aria-label={`${monthTitle(month)} 달력`}>
      <div className="cal-head"><Link href={`/my/inbox?view=calendar&month=${shiftMonth(month,-1)}`} aria-label="이전 달">←</Link><h2>{monthTitle(month)}</h2><Link href={`/my/inbox?view=calendar&month=${shiftMonth(month,1)}`} aria-label="다음 달">→</Link></div>
      <div className="cal-grid">{weekdays.map(w=><span key={w} className="cal-wd">{w}</span>)}{cells.map((d,i)=>{if(!d)return <span key={`b${i}`}/>;const list=byDate.get(d)||[];const n=Number(d.slice(8));
        return list.length?<Link key={d} href={`/my/inbox?view=day&date=${d}`} className={`cal-day has${list.some(x=>!x.read)?' unread':''}${d===today?' today':''}`} aria-label={`${dayTitle(d)} ${list.length}호`}><b>{n}</b><i>{list.length}호</i></Link>:<span key={d} className={`cal-day${d===today?' today':''}`}><b>{n}</b></span>;})}</div>
      <p className="muted cal-note">날짜를 누르면 그날 받은 호를 볼 수 있어요.</p>
    </section>
    :view==='month'?<section className="inbox-months">{groupBy(shown,i=>i.date.slice(0,7)).map(([m,list])=><details key={m} open={m===today.slice(0,7)}><summary><b>{monthTitle(m)}</b><span>{list.length}호{list.some(i=>!i.read)?` · 새 호 ${list.filter(i=>!i.read).length}`:''}</span></summary><ul className="inbox-list">{list.map(i=><Row key={i.key} issue={i}/>)}</ul></details>)}</section>
    :<section className="inbox-days">{date&&<p className="inbox-filter">{dayTitle(date)}만 보는 중 · <Link href="/my/inbox">전체 보기</Link></p>}{shown.length===0&&<p className="muted">이 날짜에 받은 호가 없어요.</p>}{groupBy(shown,i=>i.date).map(([d,list])=><div key={d} className="inbox-day"><h2>{d===today?'오늘':dayTitle(d)}</h2><ul className="inbox-list">{list.map(i=><Row key={i.key} issue={i}/>)}</ul></div>)}</section>}
    <p className="inbox-fine muted">메일함은 이 브라우저에 보관돼요. 직접 만든 호는 최근 15호, 정기 호는 최근 두 달까지 다시 볼 수 있어요. {plans[store.plan].label} 플랜</p>
  </main><footer className="site-footer"><span>loop.</span><span>읽은 만큼 쌓입니다.</span></footer></div>;
}
