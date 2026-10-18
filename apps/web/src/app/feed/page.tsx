import Link from 'next/link';
import {context,feed,industryLabels} from '@/lib/data';
import {Shell} from '@/components/shell';
import {EventCard} from '@/components/event-card';
import {Notice} from '@/components/notice';
export default async function Feed({searchParams}:{searchParams:Promise<{tenant?:string;page?:string;message?:string;q?:string}>}) {
  const p=await searchParams;const c=await context(p.tenant);const t=c.selected?.tenant_id;
  if(!t)return <Shell active="/feed"><h1>첫 워크스페이스를 만드세요.</h1><p>관심 분야와 출처를 설정하면 사건별 브리핑을 시작할 수 있습니다.</p><Link className="button" href="/settings">워크스페이스 만들기 →</Link></Shell>;
  const page=Math.min(100,Math.max(1,Number.parseInt(p.page||'1')||1));
  const [{events,more},preferences,saves]=await Promise.all([feed(t,(page-1)*20),c.client.from('preferences').select('industry,keywords').eq('tenant_id',t).single(),c.client.from('saved_events').select('event_id').eq('tenant_id',t).eq('user_id',c.user.id)]);
  if(preferences.error||saves.error)throw new Error('설정을 불러오지 못했습니다.');
  const saved=new Set((saves.data||[]).map(s=>s.event_id));
  const query=(p.q||'').slice(0,100).toLocaleLowerCase();
  const visible=events.filter(e=>!query||[e.title,...e.articles.map(a=>a.title)].join(' ').toLocaleLowerCase().includes(query));
  const keywords=(preferences.data?.keywords||[]) as string[];
  return <Shell tenant={t} workspace={c.selected?.tenants.name} active="/feed"><header className="page-heading"><div><p className="eyebrow">YOUR INTELLIGENCE DESK</p><h1>브리핑</h1><p>{industryLabels[preferences.data?.industry||'technology']} <span className="muted">· 관심 키워드 {keywords.join(', ')||'전체'}</span></p></div><Link className="button secondary" href={`/settings?tenant=${t}`}>출처 설정 ↗</Link></header><Notice message={p.message}/>
    <form className="search" method="get"><input type="hidden" name="tenant" value={t}/><label htmlFor="query">현재 페이지에서 찾기</label><input id="query" name="q" defaultValue={p.q} placeholder="사건 제목 또는 키워드" maxLength={100}/><button>찾기</button></form>
    <div className="section-label"><span>변화의 단위로 읽기</span><span>{visible.length}개 사건 후보 · {page}페이지</span></div>{visible.map((event,i)=><EventCard key={event.id} event={event} tenant={t} saved={saved.has(event.id)} index={(page-1)*20+i+1}/>)}
    {!visible.length&&<div className="empty"><h2>아직 브리핑이 없습니다.</h2><p>출처를 구독하고 수집을 요청해 주세요. 관심 분야·키워드는 발행 초안에 반영됩니다.</p><Link href={`/settings?tenant=${t}`}>출처 설정 →</Link></div>}
    <div className="pagination">{page>1&&<Link href={`/feed?tenant=${t}&page=${page-1}`}>← 이전</Link>}{more&&<Link href={`/feed?tenant=${t}&page=${page+1}`}>다음 →</Link>}</div>
  </Shell>;
}
