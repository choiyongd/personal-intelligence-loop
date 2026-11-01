import Link from 'next/link';
import {HOT_BASIS} from '@/lib/articles/hot';
import {lensFor,fill,josa,shortTitle} from '@/lib/discussion';
import {continentOf,contentLabels,countryName,industryFor,levelLabel,regionLabel,topicLabels,type NewsletterSelection,type NewsletterStory} from '@/lib/newsletter';

function date(raw:string|Date,opts:Intl.DateTimeFormatOptions={month:'long',day:'numeric'}){return new Intl.DateTimeFormat('ko-KR',{...opts,timeZone:'Asia/Seoul'}).format(new Date(raw));}
function usableUrl(raw?:string){try{const u=new URL(raw||'');return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:undefined;}catch{return undefined;}}
function StoryTitle({story}:{story:NewsletterStory}){
  return story.href?<Link href={story.href}>{story.title}</Link>:story.eventId?<Link href={`/events/${story.eventId}?tenant=${story.tenant}`}>{story.title}</Link>:usableUrl(story.url)?<a href={usableUrl(story.url)} target="_blank" rel="noopener noreferrer">{story.title}</a>:<>{story.title}</>;
}
function Hot({story}:{story:NewsletterStory}){return story.hot?<span className="hot-badge">{`세계의 화제 ${story.hot.rank}위`}</span>:null;}
function Category({story}:{story:NewsletterStory}){return <span className="nl-category"><Hot story={story}/>{contentLabels[story.type]}{story.countries.length>0&&<> · {story.countries.slice(0,3).map(countryName).join(', ')}</>}</span>;}
function Meta({story}:{story:NewsletterStory}){return <p className="nl-meta"><span>{story.source||'출처 확인'}</span>{story.sourceCount?<span>출처 {story.sourceCount}개</span>:null}<time dateTime={story.date}>{story.href?`${date(story.date)} 기준`:date(story.date)}</time></p>;}
function Evidence({story}:{story:NewsletterStory}){
  return story.evidence.length>0?<details className="nl-evidence"><summary>근거 출처 {story.evidence.length}개 보기</summary><ul>{story.evidence.map((e,i)=><li key={`${e.source}-${i}`}><a href={usableUrl(e.url)} target="_blank" rel="noopener noreferrer">{e.source} · {e.title} ↗</a></li>)}</ul></details>:null;
}
// After reading: fact checks drawn from the leading stories; prompts that widen the view in three
// directions (out to the world, across stories, back to the reader); and topics to talk over with others.
type Prompt={q:string;from?:NewsletterStory};
function unique<T>(list:T[],key:(x:T)=>string){const seen=new Set<string>();return list.filter(x=>{const k=key(x);if(seen.has(k))return false;seen.add(k);return true;});}
function PromptList({items}:{items:Prompt[]}){return <ol>{items.map(({q,from})=><li key={q}>{q}{from&&<small>{shortTitle(from.title)}</small>}</li>)}</ol>;}
function Questions({stories}:{stories:NewsletterStory[]}){
  const top=stories.filter(s=>s.questions?.length).slice(0,3);
  const checks=top.flatMap(s=>s.questions!.slice(0,2).map(q=>({q,from:s})));
  // One story per field, so the lenses are not repeated.
  const fieldLeads=unique(stories,s=>s.industry).slice(0,3);
  const world:Prompt[]=fieldLeads.map(s=>({q:fill(lensFor(s.industry).world,shortTitle(s.title)),from:s}));
  const lead=stories[0];
  if(lead?.thoughts?.[0])world.push({q:lead.thoughts[0],from:lead});
  const link:Prompt[]=[];
  const q=(x:NewsletterStory)=>`‘${shortTitle(x.title)}’`;
  const pairs=stories.slice(0,8).flatMap((x,i)=>stories.slice(i+1,8).map(y=>({x,y})));
  const used=new Set<string>();const take=<T extends {x:NewsletterStory;y:NewsletterStory}>(p?:T)=>{if(p)used.add(p.x.id+p.y.id);return p;};
  const fresh=(p:{x:NewsletterStory;y:NewsletterStory})=>!used.has(p.x.id+p.y.id);
  const cross=take(pairs.find(p=>p.x.industry!==p.y.industry));
  if(cross)link.push({q:`${industryFor(cross.x.industry).label} 분야의 ${josa(q(cross.x),'과와')} ${industryFor(cross.y.industry).label} 분야의 ${josa(q(cross.y),'은는')} 서로 멀어 보이는 이야기입니다. 한쪽의 변화가 다른 쪽에 영향을 준다면 어떤 경로를 거칠까요? 원인과 결과를 한 줄씩 적어 보세요.`});
  const shared=take(pairs.filter(fresh).map(p=>({...p,c:p.x.countries.find(c=>p.y.countries.includes(c)&&c!=='KR')})).find(p=>p.c));
  if(shared)link.push({q:`${josa(q(shared.x),'과와')} ${josa(q(shared.y),'은는')} 모두 ${countryName(shared.c!)}의 이야기입니다. 두 변화가 동시에 일어날 때 그곳의 기업과 시민은 무엇부터 조정해야 할까요?`});
  const far=take(pairs.filter(fresh).map(p=>({...p,cx:p.x.countries.map(continentOf).find(Boolean),cy:p.y.countries.map(continentOf).find(Boolean)})).find(p=>p.cx&&p.cy&&p.cx!==p.cy));
  if(far)link.push({q:`${josa(q(far.x),'은는')} ${countryName(far.cx!)}, ${josa(q(far.y),'은는')} ${countryName(far.cy!)}의 이야기입니다. 한쪽의 변화가 다른 대륙에 닿는다면 무역·돈·사람·정보 가운데 무엇을 타고 건너갈까요?`});
  if(stories.length>=3)link.push({q:`이번 호의 이야기 세 개를 골라 하나의 흐름으로 묶는다면 어떤 제목을 붙이겠어요? 각 이야기가 그 흐름의 원인·결과·신호 가운데 무엇인지 표시해 보세요.`});
  link.push({q:'이번 호에서 1년 뒤에도 뉴스가 될 이야기와 곧 잊힐 이야기를 하나씩 골라 보세요. 무엇이 그 차이를 만드나요?'});
  const me:Prompt[]=fieldLeads.slice(0,2).map(s=>({q:lensFor(s.industry).personal,from:s}));
  me.push({q:'이번 호에서 내 일이나 생활에 가장 먼저 닿을 이야기는 무엇인가요? 앞으로 한 달 동안 어떤 숫자를 지켜보면 그 영향을 확인할 수 있을까요?'});
  me.push({q:'읽기 전과 비교해 생각이 바뀐 지점이 하나라도 있나요? 아직 확신이 서지 않아 더 알아보고 싶은 것은 무엇인가요?'});
  const widen=world.length+link.length+me.length;
  const talks=fieldLeads.map((s,i)=>{const l=lensFor(s.industry),[motion,pro,con]=l.motions[i%l.motions.length],t=shortTitle(s.title);
    const own=(s.thoughts||[]).find(x=>!world.some(w=>w.q===x))||s.thoughts?.[0];
    return {s,t,own,motion,pro,con,follow:[`정부·기업·시민 가운데 한 역할을 맡아 이 주장에 대해 한 문장씩 말해 보세요. 누구의 말이 가장 설득력 있었나요?`,`${josa(`‘${t}’`,'을를')} 읽고 찾은 숫자나 사실 하나를 근거로 쓴다면 어느 쪽 주장이 더 강해질까요?`,`의견이 갈렸다면, 서로 받아들일 수 있는 최소한의 합의는 무엇일까요?`]};});
  return <section className="nl-think" aria-label="생각해 볼 질문"><div className="nl-think-cols">
    <div><h3>읽고 확인할 질문 <small>{checks.length}</small></h3><p className="nl-think-lead">본문에서 답을 찾을 수 있는 질문이에요.</p><PromptList items={checks}/></div>
    <div><h3>생각 넓히기 <small>{widen}</small></h3><p className="nl-think-lead">정답이 없는 질문이에요. 세계로, 서로에게로, 나에게로 이어 보세요.</p>
      <div className="nl-widen"><p className="nl-widen-label">세계로 넓히기</p><PromptList items={world}/></div>
      <div className="nl-widen"><p className="nl-widen-label">이야기 잇기</p><PromptList items={link}/></div>
      <div className="nl-widen"><p className="nl-widen-label">나에게 가져오기</p><PromptList items={me}/></div></div>
  </div>
  {talks.length>0&&<div className="nl-talk"><h3>함께 이야기해 볼 주제 <small>{talks.length}</small></h3><p className="nl-think-lead">친구, 동료, 가족과 나눠 보세요. 한 사람이 찬성을, 다른 사람이 반대를 맡아 보면 생각이 더 넓어집니다.</p>
    <div className="nl-talk-grid">{talks.map(({s,t,own,motion,pro,con,follow},i)=><article key={s.id}><p className="nl-talk-kicker">주제 {i+1} · {industryFor(s.industry).label}</p><p className="nl-talk-from">{josa(`‘${t}’`,'을를')} 읽고</p>{own&&<p className="nl-talk-own">{own}</p>}<p className="nl-talk-wider">넓혀 보면 이런 쟁점</p><h4>“{motion}”</h4>
      <div className="nl-talk-sides"><p><b>찬성</b>{pro}</p><p><b>반대</b>{con}</p></div>
      <ol>{follow.map(q=><li key={q}>{q}</li>)}</ol>
      <p className="nl-talk-opener">대화를 여는 한마디 · “‘{t}’ 소식 봤어? 너는 어떻게 생각해?”</p></article>)}</div></div>}
  </section>;
}
// Issue number on the masthead: day of month for daily editions, ISO week for weekly ones.
function issueNo(raw:string|Date,cadence:string){
  const d=new Date(new Date(raw).toLocaleString('en-US',{timeZone:'Asia/Seoul'}));
  if(cadence==='daily') return String(d.getDate()).padStart(2,'0');
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));
  return String(Math.ceil(((+t-Date.UTC(t.getUTCFullYear(),0,1))/864e5+1)/7)).padStart(2,'0');
}
export function NewsletterPaper({selection,stories,editorial=false,compact=false,issuedAt}:{selection:NewsletterSelection;stories:NewsletterStory[];editorial?:boolean;compact?:boolean;issuedAt?:string}){
  // Each story appears once: the cover story, two headlines beside it, up to three cards, then the reading list.
  const lead=stories[0],heads=stories.slice(1,3),cards=stories.slice(3,6),more=stories.slice(6,14);
  const count=(type:keyof typeof contentLabels)=>stories.filter(s=>s.type===type).length;
  const countries=[...new Set(stories.flatMap(s=>s.countries))];
  const fields=selection.industries.map(id=>industryFor(id).label);
  const topics=topicLabels(selection);
  const issued=issuedAt||new Date();
  const cadence=selection.cadence==='daily'?'Daily':'Weekly';
  return <section className={`nl theme-${selection.theme||'magazine'} accent-${selection.accent||'auto'}${compact?' nl-compact':''}`} aria-label="맞춤 뉴스레터 지면">
    <header className="nl-mast">
      <div className="nl-mast-top"><p>{editorial?`${levelLabel(selection.level)} 수준으로 다시 쓴`:'수집 자료로 엮은'}<br/><b>{regionLabel(selection)} 에디션</b></p><span>{new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'Asia/Seoul'}).format(new Date(issued)).toUpperCase()}</span></div>
      <div className="nl-mast-row"><p className="nl-mast-note">your curiosity,<br/>your own<br/>edition</p><h2 className="nl-title">{selection.name}</h2><p className="nl-vol"><span>{selection.cadence==='daily'?'NO.':'VOL.'}</span>{issueNo(issued,selection.cadence)}</p></div>
      <div className="nl-teasers"><p><span className="nl-teaser-label">{cadence}<br/>Issue</span><b>01</b><span>{fields.join(' · ')||'나의 분야'}</span></p><p><span className="nl-teaser-label">{cadence}<br/>Issue</span><b>02</b><span>{topics.slice(0,4).join(' · ')||date(issued,{year:'numeric',month:'long',day:'numeric',weekday:'long'})}</span></p></div>
    </header>
    {lead?<>
      <div className="nl-cover">
        <article className="nl-lead"><div className="nl-art" aria-hidden="true"><i/><i/><i/></div><div className="nl-lead-body"><p className="nl-label">COVER STORY</p><Category story={lead}/><h3><StoryTitle story={lead}/></h3>{lead.hot&&!compact&&<p className="nl-hot-reason">왜 화제인가 · {lead.hot.reason}</p>}</div></article>
        <div className="nl-heads">
          <p className="nl-heads-label">HEADLINE NEWS</p>
          {heads.map(s=><article key={s.id}><Category story={s}/><h4><StoryTitle story={s}/></h4>{!compact&&(s.hot?<p className="nl-hot-reason">{s.hot.reason}</p>:s.description&&<p>{s.description}</p>)}</article>)}
          {!compact&&<dl className="nl-colophon"><div><dt>발행일</dt><dd>{date(issued,{year:'numeric',month:'2-digit',day:'2-digit'})}</dd></div><div><dt>구성</dt><dd>읽을거리 {stories.length}편</dd></div><div><dt>지역</dt><dd>{countries.length?countries.slice(0,3).map(countryName).join(' · '):'전 세계'}</dd></div></dl>}
        </div>
      </div>
      {!compact&&<section className="nl-story" aria-label="커버 스토리 요약">{lead.description&&<p className="nl-deck">{lead.description}</p>}<Meta story={lead}/>{lead.href&&<Link className="nl-read" href={lead.href}>전문 읽기 →</Link>}<Evidence story={lead}/></section>}
      {cards.length>0&&!compact&&<section className="nl-cards" aria-label="함께 읽을 이야기"><h3 className="nl-section-title">함께 읽을 이야기</h3><div>{cards.map((s,i)=><article key={s.id}><b className="nl-card-no">{String(i+4).padStart(2,'0')}</b><Category story={s}/><h4><StoryTitle story={s}/></h4>{s.hot?<p className="nl-hot-reason">{s.hot.reason}</p>:s.description&&<p>{s.description}</p>}</article>)}</div></section>}
      {!compact&&<div className="nl-body">
        <section className="nl-more" aria-label="더 읽을거리"><h3 className="nl-section-title">더 읽을거리</h3>{more.length>0?<ul>{more.map(s=><li key={s.id}><h4><StoryTitle story={s}/></h4><Category story={s}/></li>)}</ul>:<p className="nl-quiet">이번 호의 읽을거리는 위의 {stories.length}편입니다. 주제를 더 고르면 지면이 넓어집니다.</p>}</section>
        <aside className="nl-aside" aria-label="이번 호의 구성"><h3>이번 호의 구성</h3><p className="nl-figure"><b>{stories.length}</b>편의 읽을거리</p><dl>{selection.contentTypes.map(type=><div key={type}><dt>{contentLabels[type]}</dt><dd>{count(type)}</dd></div>)}<div><dt>다룬 지역</dt><dd>{countries.length?countries.slice(0,4).map(countryName).join(' · '):'전 세계'}</dd></div></dl>{stories.some(s=>s.hot)&&<p className="nl-basis">전 세계 에디션은 ‘세계의 화제’ 2편을 꼭 담습니다. {HOT_BASIS}</p>}</aside>
      </div>}
      {!compact&&<Questions stories={stories}/>}
    </>:<div className="nl-empty"><span>NO STORIES YET</span><h3>이 관심사를 채울 읽을거리를<br/>기다리고 있어요.</h3><p>{editorial?'선택한 분야·주제·유형에 맞는 해설 기사가 아직 없습니다. 읽을거리 유형이나 주제를 넓혀 보세요.':'선택한 주제·국가·유형에 맞는 수집 자료가 없습니다. 지역 미확인 자료는 특정 국가 지면에서 제외합니다.'}</p></div>}
    {!compact&&<footer className="nl-foot"><b>loop.</b><span>{editorial?'공개 자료를 다시 쓴 해설입니다. 숫자와 날짜는 원문에서 함께 확인하세요.':'원문과 출처를 확인하며 읽는 나의 뉴스레터.'}</span></footer>}
  </section>;
}
