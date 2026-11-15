import {allArticles,hasEnglish,liveArticles,type Article} from './articles';
import {industries,selectedCountries,type NewsletterSelection} from './newsletter';

// Recommendations from two signals the reader gives us: the topics they chose, and the articles they opened.
// Pure functions only (no cookies), so the scoring can be tested and reused by the inbox and the edition maker.

// One opened article: its short code, its topic and the day (since 2026-01-01) it was opened.
export type ReadEntry={c:string;t:string;d:number};
export type ReadingProfile={
  // Article codes already opened; recommendations skip them and editions move them back.
  read:Set<string>;
  // Decayed weight per topic and field: one fresh read is 1, a read three weeks ago counts about half.
  topics:Map<string,number>;fields:Map<string,number>;
  count:number;
};
const DAY0=Date.UTC(2026,0,1),HALF_LIFE_DAYS=21;
export const dayNumber=(now=Date.now())=>Math.floor((now+9*36e5-DAY0)/864e5);
export const topicField=new Map(industries.flatMap(i=>i.topics.map(t=>[t[0] as string,i.id as string] as const)));

// Article ids are long; cookies keep a 5-character code per article instead (the same code the mailbox uses).
export function articleCode(id:string){let h=2166136261;for(const c of id){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36).padStart(7,'0').slice(-5);}

export const emptyProfile=():ReadingProfile=>({read:new Set(),topics:new Map(),fields:new Map(),count:0});
export function readingProfile(history:ReadEntry[],today=dayNumber()):ReadingProfile{
  const p=emptyProfile();
  for(const e of history){
    p.read.add(e.c);p.count++;
    const w=Math.pow(.5,Math.max(0,today-e.d)/HALF_LIFE_DAYS);
    p.topics.set(e.t,(p.topics.get(e.t)||0)+w);
    const f=topicField.get(e.t);if(f)p.fields.set(f,(p.fields.get(f)||0)+w);
  }
  return p;
}

export type Reason={kind:'topic'|'read'|'field'|'new'|'region';topic:string};
export type Recommendation={article:Article;score:number;reason:Reason};
const inLanguage=(a:Article,s:NewsletterSelection)=>s.lang!=='en'||hasEnglish(a.id);
const fresh=(a:Article,today:number)=>Boolean(a.live)&&today-dayNumber(Date.parse(`${a.asOf}T00:00:00+09:00`))<=2;

// How well one article fits the reader. Zero means "no reason to suggest it".
export function scoreArticle(a:Article,s:NewsletterSelection,p:ReadingProfile,today=dayNumber()):{score:number;reason:Reason}|null{
  if(!inLanguage(a,s)||p.read.has(articleCode(a.id)))return null;
  const fields=s.industries as string[];
  const narrowed=fields.some(f=>f===a.industry)&&s.subtopics.some(t=>topicField.get(t)===a.industry);
  const parts:[Reason['kind'],number][]=[];
  if(s.subtopics.includes(a.topic))parts.push(['topic',3]);
  // A chosen field without picked topics means "everything in this field".
  else if(fields.includes(a.industry)&&!narrowed)parts.push(['field',1.5]);
  else if(fields.includes(a.industry))parts.push(['field',.5]);
  const topicW=p.topics.get(a.topic)||0,fieldW=p.fields.get(a.industry)||0;
  if(topicW>0)parts.push(['read',Math.min(3,1.5*topicW)]);
  if(fieldW>0)parts.push(['field',Math.min(1,.4*fieldW)]);
  // Without any interest or reading signal, region and freshness alone are not a reason to recommend.
  if(!parts.length)return null;
  if(fresh(a,today))parts.push(['new',1.5]);
  const wanted=selectedCountries(s);
  if(wanted.length&&a.regions.some(r=>wanted.includes(r)))parts.push(['region',1]);
  const score=parts.reduce((n,[,v])=>n+v,0);
  // The reason shown is the strongest single signal; "new" wins only when it is the main thing going for the story.
  const [kind]=parts.reduce((best,x)=>x[1]>best[1]?x:best);
  return {score,reason:{kind,topic:a.topic}};
}

// Up to `limit` unread articles, best first, with no more than two from one topic so the list stays varied.
export function recommend(s:NewsletterSelection,p:ReadingProfile,limit=6,opts:{pool?:Article[];today?:number}={}):Recommendation[]{
  const today=opts.today??dayNumber();
  const pool=opts.pool??[...liveArticles(),...allArticles];
  const seen=new Set<string>();
  const scored=pool.filter(a=>!seen.has(a.id)&&seen.add(a.id)).map((a,i)=>({a,i,r:scoreArticle(a,s,p,today)}))
    .filter((x):x is {a:Article;i:number;r:{score:number;reason:Reason}}=>Boolean(x.r));
  const out:Recommendation[]=[],perTopic=new Map<string,number>();
  // Greedy pick: each pick lowers the score of other stories on the same topic.
  while(out.length<limit&&scored.length){
    let bi=0,bs=-Infinity;
    scored.forEach((x,k)=>{const v=x.r.score-1.5*(perTopic.get(x.a.topic)||0);if(v>bs||(v===bs&&x.i<scored[bi].i)){bs=v;bi=k;}});
    const [x]=scored.splice(bi,1);
    if((perTopic.get(x.a.topic)||0)>=2)continue;
    perTopic.set(x.a.topic,(perTopic.get(x.a.topic)||0)+1);
    out.push({article:x.a,score:x.r.score,reason:x.r.reason});
  }
  return out;
}

// Topics the reader keeps opening that their interests do not cover yet, strongest first.
// A topic in a chosen field with no picked topics is already covered, so it is not suggested.
export function suggestedTopics(s:NewsletterSelection,p:ReadingProfile,limit=3){
  const fields=s.industries as string[];
  const covered=(t:string)=>{const f=topicField.get(t);if(!f)return true;if(s.subtopics.includes(t))return true;return fields.includes(f)&&!s.subtopics.some(x=>topicField.get(x)===f);};
  return [...p.topics].filter(([t,w])=>w>=.9&&!covered(t)).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([t])=>t);
}
// The selection with one more topic (and its field, if needed), or null when the schema limits would be broken.
export function withTopic(s:NewsletterSelection,topic:string):NewsletterSelection|null{
  const f=topicField.get(topic) as NewsletterSelection['industries'][number]|undefined;
  if(!f||s.subtopics.includes(topic)||s.subtopics.length>=16)return null;
  const fields=s.industries.includes(f)?s.industries:[...s.industries,f];
  if(fields.length>16)return null;
  return {...s,industries:fields,subtopics:[...s.subtopics,topic]};
}

// Edition order for a reader: unread stories on topics they read first, then other unread ones, then the ones already read.
// Each group keeps its incoming order, so the seed's daily rotation still decides what opens the issue.
export function personalOrder<T extends {id:string;topic:string}>(list:T[],p:ReadingProfile){
  if(!p.count)return list;
  const rank=(a:T)=>p.read.has(articleCode(a.id))?2:(p.topics.get(a.topic)||0)>=.5?0:1;
  return list.map((a,i)=>({a,i})).sort((x,y)=>rank(x.a)-rank(y.a)||x.i-y.i).map(x=>x.a);
}
