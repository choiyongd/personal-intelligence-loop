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
export function NewsletterPaper({selection,stories,editorial=false,compact=false,issuedAt}:{selection:NewsletterSelection;stories:NewsletterStory[];editorial?:boolean;compact?:boolean;issuedAt?:string}){
  // Each story appears once: the lead, up to three companion cards, then the reading list.
  const lead=stories[0],cards=stories.slice(1,4),more=stories.slice(4,12);
  const count=(type:keyof typeof contentLabels)=>stories.filter(s=>s.type===type).length;
  const countries=[...new Set(stories.flatMap(s=>s.countries))];
  const fields=selection.industries.map(id=>industryFor(id).label);
  return <section className={`nl${compact?' nl-compact':''}`} aria-label="맞춤 뉴스레터 지면">
    <header className="nl-hero">
      <div className="nl-hero-top"><span>{date(issuedAt||new Date(),{year:'numeric',month:'long',day:'numeric',weekday:'long'})}</span><span>{editorial?`${levelLabel(selection.level)} 수준 해설 · BETA`:'수집 자료 에디션'}</span></div>
      <p className="nl-kicker">{selection.cadence==='daily'?'DAILY':'WEEKLY'} BRIEF · {regionLabel(selection)} 에디션</p>
      <h2 className="nl-title">{selection.name}</h2>
      <p className="nl-topics">{[...fields,...topicLabels(selection).slice(0,5)].join(' · ')}</p>
    </header>
    {lead?<>
      <article className="nl-lead"><p className="nl-label">이번 호 머리기사</p><Category story={lead}/><h3><StoryTitle story={lead}/></h3>{lead.hot&&!compact&&<p className="nl-hot-reason">왜 화제인가 · {lead.hot.reason}</p>}{lead.description&&<p className="nl-deck">{lead.description}</p>}<Meta story={lead}/>{lead.href&&!compact&&<Link className="nl-read" href={lead.href}>전문 읽기 →</Link>}<Evidence story={lead}/></article>
      {cards.length>0&&<section className="nl-cards" aria-label="함께 읽을 이야기"><h3 className="nl-section-title">함께 읽을 이야기</h3><div>{cards.map(s=><article key={s.id}><Category story={s}/><h4><StoryTitle story={s}/></h4>{s.hot&&!compact&&<p className="nl-hot-reason">{s.hot.reason}</p>}{s.description&&!compact&&!s.hot&&<p>{s.description}</p>}</article>)}</div></section>}
      {!compact&&<div className="nl-body">
        <section className="nl-more" aria-label="더 읽을거리"><h3 className="nl-section-title">더 읽을거리</h3>{more.length>0?<ul>{more.map(s=><li key={s.id}><h4><StoryTitle story={s}/></h4><Category story={s}/></li>)}</ul>:<p className="nl-quiet">이번 호의 읽을거리는 위의 {stories.length}편입니다. 주제를 더 고르면 지면이 넓어집니다.</p>}</section>
        <aside className="nl-aside" aria-label="이번 호의 구성"><h3>이번 호의 구성</h3><p className="nl-figure"><b>{stories.length}</b>편의 읽을거리</p><dl>{selection.contentTypes.map(type=><div key={type}><dt>{contentLabels[type]}</dt><dd>{count(type)}</dd></div>)}<div><dt>다룬 지역</dt><dd>{countries.length?countries.slice(0,4).map(countryName).join(' · '):'전 세계'}</dd></div></dl>{stories.some(s=>s.hot)&&<p className="nl-basis">전 세계 에디션은 ‘세계의 화제’ 2편을 꼭 담습니다. {HOT_BASIS}</p>}</aside>
      </div>}
      {!compact&&<section className="nl-think" aria-label="생각해 볼 질문"><h3>읽고 나서, 생각해 볼 질문</h3><p className="nl-think-lead">{lead.questions?`‘${lead.title}’에서 출발해 보세요.`:'이 변화는 나의 일과 어디에서 만날까요?'}</p><ol>{(lead.questions||['원문에서 확인할 사실은 무엇인가요?','서로 다른 자료는 무엇을 다르게 보나요?','다음에 더 알아볼 것은 무엇인가요?']).slice(0,3).map(q=><li key={q}>{q}</li>)}</ol></section>}
    </>:<div className="nl-empty"><span>NO STORIES YET</span><h3>이 관심사를 채울 읽을거리를<br/>기다리고 있어요.</h3><p>{editorial?'선택한 분야·주제·유형에 맞는 해설 기사가 아직 없습니다. 읽을거리 유형이나 주제를 넓혀 보세요.':'선택한 주제·국가·유형에 맞는 수집 자료가 없습니다. 지역 미확인 자료는 특정 국가 지면에서 제외합니다.'}</p></div>}
    {!compact&&<footer className="nl-foot"><b>loop.</b><span>{editorial?'공개 자료를 다시 쓴 해설입니다. 숫자와 날짜는 원문에서 함께 확인하세요.':'원문과 출처를 확인하며 읽는 나의 뉴스레터.'}</span></footer>}
  </section>;
}
