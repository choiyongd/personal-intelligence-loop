import {context,eventSchema} from '@/lib/data';
import {Shell} from '@/components/shell';
import {EventCard} from '@/components/event-card';
export default async function Saved({searchParams}:{searchParams:Promise<{tenant?:string}>}) {
  const c=await context((await searchParams).tenant),t=c.selected?.tenant_id;
  const result=t?await c.client.from('saved_events').select('events(id,title,last_seen_at,articles(id,title,published_at,canonical_url,observations(id,source_id,title,published_at,original_url,excerpt)))').eq('tenant_id',t).eq('user_id',c.user.id).order('created_at',{ascending:false}).limit(100):{data:[],error:null};
  if(result.error)throw new Error('저장함을 불러오지 못했습니다.');
  const events=(result.data||[]).map(row=>eventSchema.parse(row.events));
  return <Shell tenant={t} workspace={c.selected?.tenants.name} active="/saved"><p className="eyebrow">YOUR REFERENCE SHELF</p><h1>저장함</h1><p>개인 저장 목록 · 최근 100개</p>{events.map((e,i)=><EventCard key={e.id} event={e} tenant={t} saved index={i+1}/>)}{!events.length&&<div className="empty">브리핑에서 다시 살펴볼 사건을 저장해 주세요.</div>}</Shell>;
}
