import Link from 'next/link';
import {contentLabels,countryName,industryFor,regionLabel,topicLabels,type NewsletterSelection,type NewsletterStory} from '@/lib/newsletter';

function date(raw:string){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',timeZone:'Asia/Seoul'}).format(new Date(raw));}
function usableUrl(raw?:string){try{const u=new URL(raw||'');return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:undefined;}catch{return undefined;}}
function StoryTitle({story}:{story:NewsletterStory}){
  return story.eventId?<Link href={`/events/${story.eventId}?tenant=${story.tenant}`}>{story.title}</Link>:usableUrl(story.url)?<a href={usableUrl(story.url)} target="_blank" rel="noopener noreferrer">{story.title}</a>:<>{story.title}</>;
}
function Category({story}:{story:NewsletterStory}){return <span className="paper-category">{contentLabels[story.type]}{story.countries.length>0&&<> · {story.countries.map(countryName).join(', ')}</>}</span>;}
function Meta({story}:{story:NewsletterStory}){return <p className="story-meta"><span>{story.source||'출처 확인'}</span><time dateTime={story.date}>{date(story.date)}</time></p>;}
function Evidence({story}:{story:NewsletterStory}){
  return story.evidence.length>0?<details className="evidence"><summary>근거 출처 {story.evidence.length}개 확인</summary><ul>{story.evidence.map((e,i)=><li key={`${e.source}-${i}`}><a href={usableUrl(e.url)} target="_blank" rel="noopener noreferrer">{e.source} · {e.title} ↗</a></li>)}</ul></details>:null;
}
export function NewsletterPaper({selection,stories,demo=false,compact=false}:{selection:NewsletterSelection;stories:NewsletterStory[];demo?:boolean;compact?:boolean}){
  // Each story appears once: lead, three related, a feature, then latest and the remaining index.
  const lead=stories[0],related=stories.slice(1,4),feature=stories[4],latest=stories.slice(5,9),index=stories.slice(9,14);
  const countries=[...new Set(stories.flatMap(s=>s.countries))];
  const count=(type:keyof typeof contentLabels)=>stories.filter(s=>s.type===type).length;
  return <section className={`newspaper${compact?' newspaper-compact':''}`} aria-label="맞춤 뉴스레터 지면">
    <div className="paper-utility"><span>PERSONAL INTELLIGENCE LOOP</span><span>{demo?'SAMPLE EDITION · 합성 콘텐츠':'PERSONAL EDITION · 수집 자료'}</span></div>
    <header className="paper-masthead"><span className="paper-brand">{selection.name}</span><span className="edition">{regionLabel(selection)} 에디션</span></header>
    <nav className="paper-sections" aria-label="뉴스레터 구성"><span className="live-dot">맞춤 브리핑</span><span>{industryFor(selection.industry).label}</span>{topicLabels(selection).map(t=><span key={t}>{t}</span>)}<span className="paper-frequency">{selection.cadence==='daily'?'DAILY':'WEEKLY'} BRIEF</span></nav>
    <div className="paper-ticker"><span><b>읽을거리</b> {stories.length}</span><span><b>연구</b> {count('research')}</span><span><b>국가</b> {countries.length}</span><span className="ticker-note">{demo?'실제 뉴스가 아닌 디자인 예시입니다.':'제목과 등록된 지역 정보로 선별했습니다.'}</span></div>
    {lead?<><div className="paper-lead-grid"><div className="lead-column"><article className="lead-story"><h2><StoryTitle story={lead}/></h2>{lead.description&&<p className="lead-deck">{lead.description}</p>}<Meta story={lead}/><Evidence story={lead}/></article>{related.length>0&&<div className="related-stories">{related.map(s=><article key={s.id}><h3><StoryTitle story={s}/></h3><Category story={s}/></article>)}</div>}</div>
    <aside className="paper-sidebar" aria-label="이번 호 구성"><p className="desk-title">이번 호의 구성</p><p className="desk-sub">{industryFor(selection.industry).label} · {regionLabel(selection)} · {selection.cadence==='daily'?'매일':'매주'}</p><p className="desk-figure"><b>{stories.length}</b><span>개의 읽을거리</span></p><div className="coverage-bars">{selection.contentTypes.map(type=><div key={type}><span>{contentLabels[type]}</span><i><em style={{width:`${Math.max(3,count(type)/Math.max(stories.length,1)*100)}%`}}/></i><b>{count(type)}</b></div>)}</div><p className="desk-foot">{countries.length?`${countries.map(countryName).join(' · ')} 자료`:'지역 정보가 확인된 자료 없음'}</p></aside></div>
    {(feature||latest.length>0)&&<div className="paper-bottom-grid">{latest.length>0&&<section className="latest-column" aria-label="최신 읽을거리"><h3>LATEST</h3>{latest.map(s=><article key={s.id}><Category story={s}/><h4><StoryTitle story={s}/></h4><Meta story={s}/></article>)}</section>}{feature&&<section className="feature-column" aria-label="주목할 읽을거리"><article className="feature-story"><Category story={feature}/><h3><StoryTitle story={feature}/></h3>{feature.description&&<p className="feature-deck">{feature.description}</p>}<Meta story={feature}/><Evidence story={feature}/></article>{index.length>0&&<ul className="story-index">{index.map(s=><li key={s.id}><StoryTitle story={s}/></li>)}</ul>}</section>}<section className="conversation-column"><h3>Beyond <span>the Brief</span></h3><p className="conversation-lead">이 변화는 나의 일과 어디에서 만날까요?</p><ol><li>원문에서 확인할 사실은 무엇인가요?</li><li>서로 다른 자료는 무엇을 다르게 보나요?</li><li>다음에 더 알아볼 것은 무엇인가요?</li></ol><p className="quiet-note">자동 생성된 분석이 아닌 검토용 질문입니다.</p></section></div>}</>:<div className="paper-empty"><span>NO STORIES YET</span><h2>이 관심사를 채울<br/>읽을거리를 기다리고 있어요.</h2><p>{demo?'선택한 국가·주제의 합성 예시가 없습니다. 범위를 넓혀 살펴보세요.':'선택한 주제·국가·유형에 맞는 수집 자료가 없습니다. 지역 미확인 자료는 특정 국가 지면에서 제외합니다.'}</p></div>}
    <footer className="paper-footer"><b>loop.</b><span>{demo?'PROJECT-AUTHORED SAMPLE · 실제 보도·연구 결과가 아닙니다.':'원문과 출처를 확인하며 읽는 나의 뉴스레터.'}</span></footer>
  </section>;
}
