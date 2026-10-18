import Link from 'next/link';
import {HOT_BASIS} from '@/lib/articles/hot';
import {contentLabels,countryName,industryFor,levelLabel,regionLabel,topicLabels,type NewsletterSelection,type NewsletterStory} from '@/lib/newsletter';

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
  return <section className={`nl${compact?' nl-compact':''}`} aria-label="맞춤 뉴스레터 지면">
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
      {!compact&&<section className="nl-think" aria-label="생각해 볼 질문"><h3>읽고 나서, 생각해 볼 질문</h3><p className="nl-think-lead">{lead.questions?`‘${lead.title}’에서 출발해 보세요.`:'이 변화는 나의 일과 어디에서 만날까요?'}</p><ol>{(lead.questions||['원문에서 확인할 사실은 무엇인가요?','서로 다른 자료는 무엇을 다르게 보나요?','다음에 더 알아볼 것은 무엇인가요?']).slice(0,3).map(q=><li key={q}>{q}</li>)}</ol></section>}
    </>:<div className="nl-empty"><span>NO STORIES YET</span><h3>이 관심사를 채울 읽을거리를<br/>기다리고 있어요.</h3><p>{editorial?'선택한 분야·주제·유형에 맞는 해설 기사가 아직 없습니다. 읽을거리 유형이나 주제를 넓혀 보세요.':'선택한 주제·국가·유형에 맞는 수집 자료가 없습니다. 지역 미확인 자료는 특정 국가 지면에서 제외합니다.'}</p></div>}
    {!compact&&<footer className="nl-foot"><b>loop.</b><span>{editorial?'공개 자료를 다시 쓴 해설입니다. 숫자와 날짜는 원문에서 함께 확인하세요.':'원문과 출처를 확인하며 읽는 나의 뉴스레터.'}</span></footer>}
  </section>;
}
