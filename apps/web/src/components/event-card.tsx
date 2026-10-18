import Link from 'next/link';
import { toggleSave } from '@/app/actions';
import { dateLabel, safeSourceUrl, type BriefEvent } from '@/lib/data';
export function EventCard({event,tenant,saved=false,demo=false,index=1}:{event:BriefEvent;tenant?:string;saved?:boolean;demo?:boolean;index?:number}) {
  const observations=event.articles.flatMap(a=>a.observations);
  const sourceCount=new Set(observations.map(o=>o.source_id)).size;
  return <article className="event-card"><div className="event-index">{String(index).padStart(2,'0')}</div><div className="event-content">
    <div className="eyebrow">사건 후보 <span>·</span> {sourceCount}개 출처 <span>·</span> {event.articles.length}개 문서</div>
    <h2>{demo?event.title:<Link href={`/events/${event.id}?tenant=${tenant}`}>{event.title}</Link>}</h2>
    <p className="muted">제목 유사도로 묶은 사건 후보입니다. 같은 사건인지 원문을 확인하세요.</p>
    <div className="source-strip">{observations.slice(0,3).map(o=><a key={o.id} href={safeSourceUrl(o.original_url)} target="_blank" rel="noopener noreferrer">{o.source_id} ↗</a>)}</div>
    <footer><span>마지막 변화 {dateLabel(event.last_seen_at)}</span>{demo?<span>미리보기</span>:<form action={toggleSave}><input type="hidden" name="tenant" value={tenant}/><input type="hidden" name="event" value={event.id}/><input type="hidden" name="saved" value={String(saved)}/><button className="quiet" aria-label={`${event.title} ${saved?'저장 취소':'저장'}`}>{saved?'저장됨 ✓':'저장 +'}</button></form>}</footer>
  </div></article>;
}
