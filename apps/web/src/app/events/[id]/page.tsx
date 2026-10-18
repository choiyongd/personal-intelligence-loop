import {notFound} from 'next/navigation';
import {z} from 'zod';
import {context,eventSchema,dateLabel,safeSourceUrl} from '@/lib/data';
import {Shell} from '@/components/shell';
import Link from 'next/link';
export default async function EventDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{tenant?:string}>}) {
  const [{id},p]=await Promise.all([params,searchParams]);if(!z.uuid().safeParse(id).success)notFound();
  const c=await context(p.tenant),t=c.selected?.tenant_id;if(!t)notFound();
  const result=await c.client.from('events').select('id,title,last_seen_at,articles(id,title,published_at,canonical_url,observations(id,source_id,title,published_at,original_url,excerpt))').eq('tenant_id',t).eq('id',id).maybeSingle();
  if(result.error)throw new Error('사건을 불러오지 못했습니다.');if(!result.data)notFound();const event=eventSchema.parse(result.data);
  const timeline=event.articles.flatMap(a=>a.observations).sort((a,b)=>a.published_at.localeCompare(b.published_at)||a.id.localeCompare(b.id));
  return <Shell tenant={t} workspace={c.selected?.tenants.name} active="/feed"><Link className="text-link" href={`/feed?tenant=${t}`}>← 브리핑으로</Link><header className="page-heading"><div><p className="eyebrow">EVENT GRAPH LITE · 근거 타임라인</p><h1>{event.title}</h1><p>제목 유사도에 따른 사건 후보 · 동일 사건 여부는 검증되지 않았습니다.</p></div></header><div className="notice">수치가 다른 제목은 자동 병합하지 않습니다. 중요도·행동 제안·모순 판정은 후속 Sprint에서 근거 검증과 함께 구현합니다.</div>
    <ol className="timeline">{timeline.map(o=><li key={o.id}><time dateTime={o.published_at}>{dateLabel(o.published_at)}</time><section><p className="eyebrow">{o.source_id}</p><h2>{o.title}</h2>{o.excerpt&&<p>{o.excerpt}</p>}<a href={safeSourceUrl(o.original_url)} target="_blank" rel="noopener noreferrer">원문에서 확인 ↗</a></section></li>)}</ol>
  </Shell>;
}
