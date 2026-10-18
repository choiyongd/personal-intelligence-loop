import {context,dateLabel} from '@/lib/data';
import {Shell} from '@/components/shell';
import {Notice} from '@/components/notice';
export default async function Operations({searchParams}:{searchParams:Promise<{tenant?:string;message?:string}>}) {
  const p=await searchParams,c=await context(p.tenant),t=c.selected?.tenant_id;
  const jobs=t?await c.client.from('ingestion_jobs').select('id,source_id,state,attempt,accepted,rejected,error_code,created_at').eq('tenant_id',t).order('created_at',{ascending:false}).limit(50):{data:[],error:null};
  const logs=t?await c.client.from('ingestion_logs').select('id,job_id,level,code,details,created_at').eq('tenant_id',t).order('created_at',{ascending:false}).limit(50):{data:[],error:null};
  if(jobs.error||logs.error)throw new Error('수집 현황을 불러오지 못했습니다.');
  return <Shell tenant={t} workspace={c.selected?.tenants.name} active="/operations"><p className="eyebrow">INGESTION HEALTH</p><h1>수집 현황</h1><Notice message={p.message}/><p>최근 요청 50개와 운영 로그 · 새로고침하면 상태를 확인할 수 있습니다.</p><div className="table-scroll"><table><thead><tr><th>출처</th><th>상태</th><th>시도</th><th>통과 / 제외</th><th>오류 코드</th><th>요청일</th></tr></thead><tbody>{jobs.data?.map(j=><tr key={j.id}><td>{j.source_id}</td><td>{j.state}</td><td>{j.attempt}</td><td>{j.accepted} / {j.rejected}</td><td>{j.error_code||'—'}</td><td>{dateLabel(j.created_at)}</td></tr>)}</tbody></table></div><h2>운영 로그</h2><ul className="log-list">{logs.data?.map(l=><li key={l.id}><span>{l.level} · {l.code}</span><code>{JSON.stringify(l.details)}</code></li>)}</ul>{!jobs.data?.length&&<div className="empty">등록된 수집 요청이 없습니다.</div>}</Shell>;
}
