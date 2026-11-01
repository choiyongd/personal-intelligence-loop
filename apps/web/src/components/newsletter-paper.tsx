import Link from 'next/link';
import {TermFit} from '@/components/term-fit';
import {hotBasis} from '@/lib/articles/hot';
import {lx,intlLocale,type Locale} from '@/lib/i18n';
import {lensFor,fill,josa,shortTitle} from '@/lib/discussion';
import {withTerms} from './terms';
import {CoverArt} from './cover-art';
import {wordsPerLevel,continentOf,contentLabels,contentLabel,countryName,industryName,levelLabel,regionLabel,topicLabels,type NewsletterSelection,type NewsletterStory} from '@/lib/newsletter';

function date(raw:string|Date,opts:Intl.DateTimeFormatOptions={month:'long',day:'numeric'},loc:Locale='ko',tz='Asia/Seoul'){return new Intl.DateTimeFormat(intlLocale(loc),{...opts,timeZone:tz}).format(new Date(raw));}
function usableUrl(raw?:string){try{const u=new URL(raw||'');return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:undefined;}catch{return undefined;}}
function StoryTitle({story}:{story:NewsletterStory}){
  return story.href?<Link href={story.href}>{story.title}</Link>:story.eventId?<Link href={`/events/${story.eventId}?tenant=${story.tenant}`}>{story.title}</Link>:usableUrl(story.url)?<a href={usableUrl(story.url)} target="_blank" rel="noopener noreferrer">{story.title}</a>:<>{story.title}</>;
}
function Hot({story,loc}:{story:NewsletterStory;loc:Locale}){return story.hot?<span className="hot-badge">{loc==='en'?`Global hot #${story.hot.rank}`:`세계의 화제 ${story.hot.rank}위`}</span>:null;}
function Category({story,loc}:{story:NewsletterStory;loc:Locale}){return <span className="nl-category"><Hot story={story} loc={loc}/>{contentLabel(story.type,loc)}{story.countries.length>0&&<> · {story.countries.slice(0,3).map(c=>countryName(c,loc)).join(', ')}</>}</span>;}
function Meta({story,loc}:{story:NewsletterStory;loc:Locale}){const en=loc==='en',d=date(story.date,undefined,loc);return <p className="nl-meta"><span>{story.source||(en?'Source pending':'출처 확인')}</span>{story.sourceCount?<span>{en?`${story.sourceCount} sources`:`출처 ${story.sourceCount}개`}</span>:null}<time dateTime={story.date}>{story.href?(en?`As of ${d}`:`${d} 기준`):d}</time></p>;}
function Evidence({story,loc}:{story:NewsletterStory;loc:Locale}){
  return story.evidence.length>0?<details className="nl-evidence"><summary>{loc==='en'?`Show ${story.evidence.length} sources`:`근거 출처 ${story.evidence.length}개 보기`}</summary><ul>{story.evidence.map((e,i)=><li key={`${e.source}-${i}`}><a href={usableUrl(e.url)} target="_blank" rel="noopener noreferrer">{e.source} · {e.title} ↗</a></li>)}</ul></details>:null;
}
// A word list for the edition: hard terms from the stories, more of them for readers who chose the intro level.
function Words({stories,selection,loc}:{stories:NewsletterStory[];selection:NewsletterSelection;loc:Locale}){
  const L=lx(loc);
  const seen=new Set<string>(),items:{term:string;meaning:string;from:NewsletterStory}[]=[];
  for(let round=0;round<3&&items.length<wordsPerLevel[selection.level];round++)
    for(const s of stories){const g=s.glossary?.[round];if(g&&!seen.has(g.term)&&items.length<wordsPerLevel[selection.level]){seen.add(g.term);items.push({...g,from:s});}}
  if(!items.length)return null;
  return <section className="nl-words" aria-label={L('이번 호의 낱말','Words in this issue')}><div className="nl-words-head"><h3>{L('이번 호의 낱말','Words in this issue')} <small>{items.length}</small></h3><p className="nl-think-lead">{loc==='en'?`Picked for the ${levelLabel(selection.level,loc)} level. Cover the meaning and try explaining each word first; it sticks longer.`:`${levelLabel(selection.level)} 수준에 맞춰 골랐어요. 뜻을 가리고 먼저 설명해 본 뒤 확인하면 어휘가 오래 남습니다.`}</p></div>
    <dl>{items.map(w=><div key={w.term}><dt>{w.term}</dt><dd>{w.meaning}<small>{shortTitle(w.from.title)}</small></dd></div>)}</dl></section>;
}
// After reading: fact checks drawn from the leading stories; prompts that widen the view in three
// directions (out to the world, across stories, back to the reader); and topics to talk over with others.
type Prompt={q:string;from?:NewsletterStory};
function unique<T>(list:T[],key:(x:T)=>string){const seen=new Set<string>();return list.filter(x=>{const k=key(x);if(seen.has(k))return false;seen.add(k);return true;});}
function PromptList({items}:{items:Prompt[]}){return <ol>{items.map(({q,from})=><li key={q}>{q}{from&&<small>{shortTitle(from.title)}</small>}</li>)}</ol>;}
function Questions({stories,loc}:{stories:NewsletterStory[];loc:Locale}){
  const L=lx(loc),en=loc==='en';
  const top=stories.filter(s=>s.questions?.length).slice(0,3);
  const checks=top.flatMap(s=>s.questions!.slice(0,2).map(q=>({q,from:s})));
  // One story per field, so the lenses are not repeated.
  const fieldLeads=unique(stories,s=>s.industry).slice(0,3);
  const world:Prompt[]=fieldLeads.map(s=>({q:fill(lensFor(s.industry,loc).world,shortTitle(s.title)),from:s}));
  const lead=stories[0];
  if(lead?.thoughts?.[0])world.push({q:lead.thoughts[0],from:lead});
  const link:Prompt[]=[];
  const q=(x:NewsletterStory)=>en?`“${shortTitle(x.title)}”`:`‘${shortTitle(x.title)}’`;
  const field=(id:string)=>industryName(id,loc),place=(c:string)=>countryName(c,loc);
  const pairs=stories.slice(0,8).flatMap((x,i)=>stories.slice(i+1,8).map(y=>({x,y})));
  const used=new Set<string>();const take=<T extends {x:NewsletterStory;y:NewsletterStory}>(p?:T)=>{if(p)used.add(p.x.id+p.y.id);return p;};
  const fresh=(p:{x:NewsletterStory;y:NewsletterStory})=>!used.has(p.x.id+p.y.id);
  const cross=take(pairs.find(p=>p.x.industry!==p.y.industry));
  if(cross)link.push({q:en?`${q(cross.x)} in ${field(cross.x.industry)} and ${q(cross.y)} in ${field(cross.y.industry)} look far apart. If a change in one affected the other, what path would it take? Write one line for the cause and one for the effect.`:`${field(cross.x.industry)} 분야의 ${josa(q(cross.x),'과와')} ${field(cross.y.industry)} 분야의 ${josa(q(cross.y),'은는')} 서로 멀어 보이는 이야기입니다. 한쪽의 변화가 다른 쪽에 영향을 준다면 어떤 경로를 거칠까요? 원인과 결과를 한 줄씩 적어 보세요.`});
  const shared=take(pairs.filter(fresh).map(p=>({...p,c:p.x.countries.find(c=>p.y.countries.includes(c)&&c!=='KR')})).find(p=>p.c));
  if(shared)link.push({q:en?`${q(shared.x)} and ${q(shared.y)} are both stories about ${place(shared.c!)}. If both changes happen at once, what should businesses and citizens there adjust first?`:`${josa(q(shared.x),'과와')} ${josa(q(shared.y),'은는')} 모두 ${place(shared.c!)}의 이야기입니다. 두 변화가 동시에 일어날 때 그곳의 기업과 시민은 무엇부터 조정해야 할까요?`});
  const far=take(pairs.filter(fresh).map(p=>({...p,cx:p.x.countries.map(continentOf).find(Boolean),cy:p.y.countries.map(continentOf).find(Boolean)})).find(p=>p.cx&&p.cy&&p.cx!==p.cy));
  if(far)link.push({q:en?`${q(far.x)} is about ${place(far.cx!)}, ${q(far.y)} about ${place(far.cy!)}. If a change in one reached the other continent, would it travel by trade, money, people or information?`:`${josa(q(far.x),'은는')} ${place(far.cx!)}, ${josa(q(far.y),'은는')} ${place(far.cy!)}의 이야기입니다. 한쪽의 변화가 다른 대륙에 닿는다면 무역·돈·사람·정보 가운데 무엇을 타고 건너갈까요?`});
  if(stories.length>=3)link.push({q:L('이번 호의 이야기 세 개를 골라 하나의 흐름으로 묶는다면 어떤 제목을 붙이겠어요? 각 이야기가 그 흐름의 원인·결과·신호 가운데 무엇인지 표시해 보세요.','Pick three stories from this issue and tie them into one trend. What headline would you give it? Mark each story as a cause, an effect or a signal.')});
  link.push({q:L('이번 호에서 1년 뒤에도 뉴스가 될 이야기와 곧 잊힐 이야기를 하나씩 골라 보세요. 무엇이 그 차이를 만드나요?','Pick one story that will still be news a year from now and one that will soon be forgotten. What makes the difference?')});
  const me:Prompt[]=fieldLeads.slice(0,2).map(s=>({q:lensFor(s.industry,loc).personal,from:s}));
  me.push({q:L('이번 호에서 내 일이나 생활에 가장 먼저 닿을 이야기는 무엇인가요? 앞으로 한 달 동안 어떤 숫자를 지켜보면 그 영향을 확인할 수 있을까요?','Which story here will reach your work or life first? What number could you watch over the next month to see its effect?')});
  me.push({q:L('읽기 전과 비교해 생각이 바뀐 지점이 하나라도 있나요? 아직 확신이 서지 않아 더 알아보고 싶은 것은 무엇인가요?','Did anything change your mind compared with before you read? What are you still unsure about and want to look into?')});
  const widen=world.length+link.length+me.length;
  const talks=fieldLeads.map((s,i)=>{const l=lensFor(s.industry,loc),[motion,pro,con]=l.motions[i%l.motions.length],t=shortTitle(s.title);
    const own=(s.thoughts||[]).find(x=>!world.some(w=>w.q===x))||s.thoughts?.[0];
    return {s,t,own,motion,pro,con,follow:en?['Each person takes a role (government, business or citizen) and says one sentence about this claim. Whose argument was most convincing?',`If you used one number or fact from “${t}” as evidence, which side would it strengthen?`,'If you disagreed, what is the smallest point you could both accept?']:[`정부·기업·시민 가운데 한 역할을 맡아 이 주장에 대해 한 문장씩 말해 보세요. 누구의 말이 가장 설득력 있었나요?`,`${josa(`‘${t}’`,'을를')} 읽고 찾은 숫자나 사실 하나를 근거로 쓴다면 어느 쪽 주장이 더 강해질까요?`,`의견이 갈렸다면, 서로 받아들일 수 있는 최소한의 합의는 무엇일까요?`]};});
  return <section className="nl-think" aria-label={L('생각해 볼 질문','Questions to consider')}><div className="nl-think-cols">
    <div><h3>{L('읽고 확인할 질문','Check your reading')} <small>{checks.length}</small></h3><p className="nl-think-lead">{L('본문에서 답을 찾을 수 있는 질문이에요.','The answers are in the stories.')}</p><PromptList items={checks}/></div>
    <div><h3>{L('생각 넓히기','Think wider')} <small>{widen}</small></h3><p className="nl-think-lead">{L('정답이 없는 질문이에요. 세계로, 서로에게로, 나에게로 이어 보세요.','No right answers here. Take them out to the world, across the stories, and back to you.')}</p>
      <div className="nl-widen"><p className="nl-widen-label">{L('세계로 넓히기','Out to the world')}</p><PromptList items={world}/></div>
      <div className="nl-widen"><p className="nl-widen-label">{L('이야기 잇기','Connect the stories')}</p><PromptList items={link}/></div>
      <div className="nl-widen"><p className="nl-widen-label">{L('나에게 가져오기','Bring it home')}</p><PromptList items={me}/></div></div>
  </div>
  {talks.length>0&&<div className="nl-talk"><h3>{L('함께 이야기해 볼 주제','Talk it over')} <small>{talks.length}</small></h3><p className="nl-think-lead">{L('친구, 동료, 가족과 나눠 보세요. 한 사람이 찬성을, 다른 사람이 반대를 맡아 보면 생각이 더 넓어집니다.','Share these with friends, coworkers or family. Have one person argue for and another against; it widens everyone’s thinking.')}</p>
    <div className="nl-talk-grid">{talks.map(({s,t,own,motion,pro,con,follow},i)=><article key={s.id}><p className="nl-talk-kicker">{L('주제','Topic')} {i+1} · {field(s.industry)}</p><p className="nl-talk-from">{en?`After reading “${t}”`:`${josa(`‘${t}’`,'을를')} 읽고`}</p>{own&&<p className="nl-talk-own">{own}</p>}<p className="nl-talk-wider">{L('넓혀 보면 이런 쟁점','The wider debate')}</p><h4>“{motion}”</h4>
      <div className="nl-talk-sides"><p><b>{L('찬성','For')}</b>{pro}</p><p><b>{L('반대','Against')}</b>{con}</p></div>
      <ol>{follow.map(x=><li key={x}>{x}</li>)}</ol>
      <p className="nl-talk-opener">{en?`An opener · “Did you see the story on ${t}? What do you think?”`:`대화를 여는 한마디 · “‘${t}’ 소식 봤어? 너는 어떻게 생각해?”`}</p></article>)}</div></div>}
  </section>;
}
// Issue number on the masthead: day of month for daily editions, ISO week for weekly ones.
function issueNo(raw:string|Date,cadence:string,tz='Asia/Seoul'){
  const d=new Date(new Date(raw).toLocaleString('en-US',{timeZone:tz}));
  if(cadence==='daily') return String(d.getDate()).padStart(2,'0');
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));
  return String(Math.ceil(((+t-Date.UTC(t.getUTCFullYear(),0,1))/864e5+1)/7)).padStart(2,'0');
}
export function NewsletterPaper({selection,stories,editorial=false,compact=false,issuedAt,loc=selection.lang}:{selection:NewsletterSelection;stories:NewsletterStory[];editorial?:boolean;compact?:boolean;issuedAt?:string;loc?:Locale}){
  const L=lx(loc),en=loc==='en',tz=selection.tz||'Asia/Seoul',day=(raw:string|Date,opts?:Intl.DateTimeFormatOptions)=>date(raw,opts,loc,tz);
  // Each story appears once: the cover story, two headlines beside it, up to three cards, then the reading list.
  const lead=stories[0],heads=stories.slice(1,3),cards=stories.slice(3,6),more=stories.slice(6,14);
  const count=(type:keyof typeof contentLabels)=>stories.filter(s=>s.type===type).length;
  const countries=[...new Set(stories.flatMap(s=>s.countries))];
  const fields=selection.industries.map(id=>industryName(id,loc));
  const topics=topicLabels(selection,loc);
  const issued=issuedAt||new Date();
  // The cover image stands for the edition, so it follows the field most of the reader's own stories belong to
  // (hot picks open every world edition and would make all covers look alike).
  const own=stories.filter(x=>!x.hot&&x.industry!=='unknown'),tally=new Map<string,number>();
  for(const x of own)tally.set(x.industry,(tally.get(x.industry)||0)+1);
  const artField=[...tally].sort((a,b)=>b[1]-a[1]||selection.industries.indexOf(a[0] as never)-selection.industries.indexOf(b[0] as never))[0]?.[0]||selection.industries[0]||'business';
  // Hard terms are marked once per edition; readers can switch this off in settings.
  const seen=new Set<string>(),desc=(st:NewsletterStory)=>selection.terms==='off'||!st.description?st.description:withTerms(st.description,st.glossary,seen,st.id);
  const cadence=selection.cadence==='daily'?'Daily':'Weekly';
  return <section className={`nl theme-${selection.theme||'magazine'} accent-${selection.accent||'auto'}${compact?' nl-compact':''}`} aria-label={L('맞춤 뉴스레터 지면','Your personal newsletter')}>
    <TermFit/><header className="nl-mast">
      <div className="nl-mast-top"><p>{en?(editorial?`Rewritten at the ${levelLabel(selection.level,loc)} level`:'Built from collected sources'):(editorial?`${levelLabel(selection.level)} 수준으로 다시 쓴`:'수집 자료로 엮은')}<br/><b>{en?`${regionLabel(selection,loc)} edition`:`${regionLabel(selection)} 에디션`}</b></p><span>{new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:tz}).format(new Date(issued)).toUpperCase()}</span></div>
      <div className="nl-mast-row"><p className="nl-mast-note">your curiosity,<br/>your own<br/>edition</p><h2 className="nl-title">{selection.name}</h2><p className="nl-vol"><span>{selection.cadence==='daily'?'NO.':'VOL.'}</span>{issueNo(issued,selection.cadence,tz)}</p></div>
      <div className="nl-teasers"><p><span className="nl-teaser-label">{cadence}<br/>Issue</span><b>01</b><span>{fields.join(' · ')||L('나의 분야','Your fields')}</span></p><p><span className="nl-teaser-label">{cadence}<br/>Issue</span><b>02</b><span>{topics.slice(0,4).join(' · ')||day(issued,{year:'numeric',month:'long',day:'numeric',weekday:'long'})}</span></p></div>
    </header>
    {lead?<>
      <div className="nl-cover">
        <article className="nl-lead"><CoverArt industry={artField} seed={`${stories.map(x=>x.id).join("")}${new Date(issued).toISOString().slice(0,10)}`} label={en?`Cover image · ${industryName(artField,loc)}`:`대표 이미지 · ${industryName(artField)}`} loc={loc}/><div className="nl-lead-body"><p className="nl-label">COVER STORY</p><Category story={lead} loc={loc}/><h3><StoryTitle story={lead}/></h3>{lead.hot&&!compact&&<p className="nl-hot-reason">{L('왜 화제인가','Why it matters')} · {lead.hot.reason}</p>}</div></article>
        <div className="nl-heads">
          <p className="nl-heads-label">HEADLINE NEWS</p>
          {heads.map(s=><article key={s.id}><Category story={s} loc={loc}/><h4><StoryTitle story={s}/></h4>{!compact&&(s.hot?<p className="nl-hot-reason">{s.hot.reason}</p>:s.description&&<p>{desc(s)}</p>)}</article>)}
          {!compact&&<dl className="nl-colophon"><div><dt>{L('발행일','Issued')}</dt><dd>{day(issued,{year:'numeric',month:'2-digit',day:'2-digit'})}</dd></div><div><dt>{L('구성','Contents')}</dt><dd>{en?`${stories.length} stories`:`읽을거리 ${stories.length}편`}</dd></div><div><dt>{L('지역','Region')}</dt><dd>{countries.length?countries.slice(0,3).map(c=>countryName(c,loc)).join(' · '):L('전 세계','Worldwide')}</dd></div></dl>}
        </div>
      </div>
      {!compact&&<section className="nl-story" aria-label={L('커버 스토리 요약','Cover story summary')}>{lead.description&&<p className="nl-deck">{desc(lead)}</p>}{selection.level==='intro'&&lead.easy&&<p className="nl-easy"><b>{L('쉽게 말하면','In plain words')}</b>{lead.easy}</p>}{selection.level==='expert'&&lead.deep&&<p className="nl-easy nl-deep"><b>{L('심화 장','Deep dive')}</b>{lead.deep}</p>}<Meta story={lead} loc={loc}/>{lead.href&&<Link className="nl-read" href={lead.href}>{L('전문 읽기 →','Read the full story →')}</Link>}<Evidence story={lead} loc={loc}/></section>}
      {cards.length>0&&!compact&&<section className="nl-cards" aria-label={L('함께 읽을 이야기','More to read')}><h3 className="nl-section-title">{L('함께 읽을 이야기','More to read')}</h3><div>{cards.map((s,i)=><article key={s.id}><b className="nl-card-no">{String(i+4).padStart(2,'0')}</b><Category story={s} loc={loc}/><h4><StoryTitle story={s}/></h4>{s.hot?<p className="nl-hot-reason">{s.hot.reason}</p>:s.description&&<p>{desc(s)}</p>}</article>)}</div></section>}
      {!compact&&<div className="nl-body">
        <section className="nl-more" aria-label={L('더 읽을거리','Further reading')}><h3 className="nl-section-title">{L('더 읽을거리','Further reading')}</h3>{more.length>0?<ul>{more.map(s=><li key={s.id}><h4><StoryTitle story={s}/></h4><Category story={s} loc={loc}/></li>)}</ul>:<p className="nl-quiet">{en?`This issue holds the ${stories.length} stories above. Pick more topics to widen it.`:`이번 호의 읽을거리는 위의 ${stories.length}편입니다. 주제를 더 고르면 지면이 넓어집니다.`}</p>}</section>
        <aside className="nl-aside" aria-label={L('이번 호의 구성','In this issue')}><h3>{L('이번 호의 구성','In this issue')}</h3><p className="nl-figure"><b>{stories.length}</b>{L('편의 읽을거리',' stories')}</p><dl>{selection.contentTypes.map(type=><div key={type}><dt>{contentLabel(type,loc)}</dt><dd>{count(type)}</dd></div>)}<div><dt>{L('다룬 지역','Regions')}</dt><dd>{countries.length?countries.slice(0,4).map(c=>countryName(c,loc)).join(' · '):L('전 세계','Worldwide')}</dd></div></dl>{stories.some(s=>s.hot)&&<p className="nl-basis">{L('전 세계 에디션은 ‘세계의 화제’ 2편을 꼭 담습니다.','Worldwide editions always carry two “Global hot” stories.')} {hotBasis(loc)}</p>}</aside>
      </div>}
      {!compact&&selection.terms!=='off'&&<Words stories={stories} selection={selection} loc={loc}/>}{!compact&&<Questions stories={stories} loc={loc}/>}
    </>:<div className="nl-empty"><span>NO STORIES YET</span><h3>{L(<>이 관심사를 채울 읽을거리를<br/>기다리고 있어요.</>,<>We are still waiting for stories<br/>to fill these interests.</>)}</h3><p>{editorial?L('선택한 분야·주제·유형에 맞는 해설 기사가 아직 없습니다. 읽을거리 유형이나 주제를 넓혀 보세요.',`There are no explainers yet for these fields, topics and types${en?' in English':''}. Try widening the reading types or topics.`):L('선택한 주제·국가·유형에 맞는 수집 자료가 없습니다. 지역 미확인 자료는 특정 국가 지면에서 제외합니다.','No collected sources match these topics, countries and types. Sources with an unknown region are left out of country editions.')}</p></div>}
    {!compact&&<footer className="nl-foot"><b>loop.</b><span>{editorial?L('공개 자료를 다시 쓴 해설입니다. 숫자와 날짜는 원문에서 함께 확인하세요.','Explainers rewritten from public sources. Check numbers and dates against the originals.'):L('원문과 출처를 확인하며 읽는 나의 뉴스레터.','My newsletter, read with its sources in hand.')}</span></footer>}
  </section>;
}
