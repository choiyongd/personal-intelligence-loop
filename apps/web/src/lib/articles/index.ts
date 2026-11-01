import type {Article} from './types';
import {articles as technology} from './technology';
import {articles as businessFinance} from './business-finance';
import {articles as scienceHealth} from './science-health';
import {articles as energyPolicy} from './energy-policy';
import {articles as design} from './design';
import {articles as europe} from './world-europe';
import {articles as southAmerica} from './world-south-america';
import {articles as northAmerica} from './world-north-america';
import {articles as eurasia} from './world-eurasia';
import {articles as mobility} from './world-mobility';
import {articles as society} from './world-society';
import {articles as moreCulture} from './more-culture';
import {articles as moreLife} from './more-life';
import {articles as moreEnvironment} from './more-environment';
import {articles as moreWork} from './more-work';
import {articles as moreIndustry} from './more-industry';
import {articles as moreEconomy} from './more-economy';
import {allTopics,continentOf,industries,selectedCountries,topicName,type Level,type NewsletterSelection,type NewsletterStory} from '../newsletter';
import type {Locale} from '../i18n';
import {english} from './en';

export type {Article} from './types';
import {hotPicks as allHotPicks,HOT_PER_EDITION} from './hot';
export {HOT_BASIS,HOT_PER_EDITION,hotBasis} from './hot';
export const allArticles:Article[]=[...technology,...businessFinance,...scienceHealth,...energyPolicy,...design,...europe,...southAmerica,...northAmerica,...eurasia,...mobility,...society,...moreCulture,...moreLife,...moreEnvironment,...moreWork,...moreIndustry,...moreEconomy];
export function articleById(id:string){return allArticles.find(a=>a.id===id);}
// English text for an explainer, when it has been translated; facts, sources and citation numbers stay the same.
export const hasEnglish=(id:string)=>Boolean(english[id]);
export function localize(a:Article,loc:Locale):Article{
  const en=loc==='en'?english[a.id]:undefined;
  if(!en)return a;
  const {sourceTitles,...text}=en;
  return {...a,...text,sources:a.sources.map((src,i)=>sourceTitles?.[i+1]?{...src,title:sourceTitles[i+1]}:src)};
}
export function localizedArticle(id:string,loc:Locale){const a=articleById(id);return a&&localize(a,loc);}
// English editions use only translated explainers, so a US reader never gets a Korean page in the newsletter.
const inLanguage=(a:Article,loc:Locale)=>loc!=='en'||hasEnglish(a.id);
export function hotPicksFor(loc:Locale){return loc==='en'?allHotPicks.filter(h=>hasEnglish(h.id)).map(h=>({id:h.id,reason:h.reasonEn||h.reason})):allHotPicks;}
export const hotPicks=allHotPicks;
const articleTopicField=new Map(industries.flatMap(i=>i.topics.map(t=>[t[0] as string,i.id as string] as const)));

// Field and topic decide what is in the edition; region only decides the order, so a narrow region never empties it.
export function articlesFor(s:NewsletterSelection){
  const fields=s.industries as string[];
  // A field with none of its own topics picked contributes all its topics, so adding a field always adds reading.
  const fieldTopics=(field:string)=>allTopics.filter(t=>articleTopicField.get(t[0])===field).map(t=>t[0]);
  const narrowed=new Set(fields.filter(f=>fieldTopics(f).some(t=>s.subtopics.includes(t))));
  const inScope=allArticles.filter(a=>inLanguage(a,s.lang)&&fields.includes(a.industry)&&(!narrowed.has(a.industry)||s.subtopics.includes(a.topic)));
  const typed=inScope.filter(a=>s.contentTypes.includes(a.type));
  const pool=typed.length?typed:inScope;
  const wanted=selectedCountries(s);
  if(wanted.length){
    const score=(a:Article)=>a.regions.some(r=>wanted.includes(r))?0:1;
    return pool.map((a,i)=>({a,i})).sort((x,y)=>score(x.a)-score(y.a)||x.i-y.i).map(x=>x.a);
  }
  return spreadAcrossContinents(pool);
}
function rotate<T>(list:T[],by:number){if(!list.length)return list;const k=((by%list.length)+list.length)%list.length;return [...list.slice(k),...list.slice(0,k)];}
// One edition's article ids, decided only by the selection, its size and a seed (issue date and slot),
// so the inbox, a re-read and the emailed copy of the same issue always agree without storing anything.
export function pickEdition(s:NewsletterSelection,size:number,seed:number){
  const hot=s.scope==='global'?rotate(hotPicksFor(s.lang).map(h=>h.id),seed*HOT_PER_EDITION).slice(0,HOT_PER_EDITION):[];
  const rest=articlesFor(s).filter(a=>!hot.includes(a.id));
  const wanted=selectedCountries(s);
  // Region matches stay ahead of the rest; each group turns by the seed so every new edition opens differently.
  const near=wanted.length?rest.filter(a=>a.regions.some(r=>wanted.includes(r))):rest;
  const far=wanted.length?rest.filter(a=>!near.includes(a)):[];
  const step=Math.max(1,size-hot.length);
  return [...hot,...rotate(near,seed*step).map(a=>a.id),...rotate(far,seed*step).map(a=>a.id)].slice(0,size);
}
// Day number since 2026-01-01 in Korea time; editions on the same day differ by slot.
export function editionSeed(date:string,slot=0){return Math.round((Date.parse(`${date}T00:00:00Z`)-Date.UTC(2026,0,1))/864e5)*4+slot;}
// World editions take turns between continents, so one region's stories never crowd out the others.
function homeContinent(a:Article){const r=a.regions.find(x=>x!=='GLOBAL'&&x!=='KR');return (r&&continentOf(r))||'ASIA_PACIFIC';}
function spreadAcrossContinents(pool:Article[]){
  const queues=new Map<string,Article[]>();
  for(const a of pool){const k=homeContinent(a);queues.set(k,[...(queues.get(k)||[]),a]);}
  const out:Article[]=[];
  while(out.length<pool.length)for(const q of queues.values()){const a=q.shift();if(a)out.push(a);}
  return out;
}
export function articleStory(raw:Article,level:Level,loc:Locale='ko'):NewsletterStory{
  const a=localize(raw,loc);
  const publishers=[...new Set(a.sources.map(s=>s.publisher))];
  return {
    id:a.id,title:a.title,description:a.dek,industry:a.industry,topics:[a.topic],countries:a.regions.filter(r=>r!=='GLOBAL'),
    type:a.type,source:publishers.slice(0,2).join(' · ')+(publishers.length>2?(loc==='en'?` +${publishers.length-2} more`:` 외 ${publishers.length-2}곳`):''),date:`${a.asOf}T00:00:00+09:00`,
    href:`/article/${a.id}?level=${level}`,sourceCount:a.sources.length,questions:a.questions,thoughts:a.thoughts,easy:a.pages[0]?.easy||undefined,deep:a.deepDive?.heading,glossary:a.glossary,
    evidence:a.sources.map(src=>({source:src.publisher,url:src.url,title:src.title})),
  };
}
// World editions always open with the top hot picks, even when they sit outside the chosen fields.
export function hotFor(s:NewsletterSelection,ids?:string[]){
  if(s.scope!=='global')return [];
  // Saved issues store their hot picks first, so read them back from the head of the id list.
  const picks=hotPicksFor(s.lang);
  const pool=ids?ids.slice(0,HOT_PER_EDITION).map(id=>picks.find(h=>h.id===id)).filter((h):h is typeof picks[number]=>Boolean(h)):picks.slice(0,HOT_PER_EDITION);
  return pool.map(h=>({...h,article:articleById(h.id)!,rank:picks.indexOf(h)+1})).filter(h=>h.article);
}
export function editionStories(s:NewsletterSelection,ids?:string[]){
  const hot=hotFor(s,ids);
  const rest=(ids?ids.map(articleById).filter((a):a is Article=>Boolean(a)):articlesFor(s)).filter(a=>!hot.some(h=>h.id===a.id));
  return [...hot.map(h=>({...articleStory(h.article,s.level,s.lang),hot:{rank:h.rank,reason:h.reason}})),...rest.map(a=>articleStory(a,s.level,s.lang))];
}
export function articleStories(s:NewsletterSelection){return editionStories(s);}
export function topicLabel(id:string,loc:Locale='ko'){return loc==='en'?topicName(id,'en'):allTopics.find(t=>t[0]===id)?.[1]||id;}
