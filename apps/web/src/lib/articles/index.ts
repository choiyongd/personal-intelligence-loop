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
import {allTopics,continentOf,industries,selectedCountries,type Level,type NewsletterSelection,type NewsletterStory} from '../newsletter';

export type {Article} from './types';
import {hotPicks,HOT_PER_EDITION} from './hot';
export {HOT_BASIS,hotPicks,HOT_PER_EDITION} from './hot';
export const allArticles:Article[]=[...technology,...businessFinance,...scienceHealth,...energyPolicy,...design,...europe,...southAmerica,...northAmerica,...eurasia,...mobility,...society];
export function articleById(id:string){return allArticles.find(a=>a.id===id);}
const articleTopicField=new Map(industries.flatMap(i=>i.topics.map(t=>[t[0] as string,i.id as string] as const)));

// Field and topic decide what is in the edition; region only decides the order, so a narrow region never empties it.
export function articlesFor(s:NewsletterSelection){
  const fields=s.industries as string[];
  // A field with none of its own topics picked contributes all its topics, so adding a field always adds reading.
  const fieldTopics=(field:string)=>allTopics.filter(t=>articleTopicField.get(t[0])===field).map(t=>t[0]);
  const narrowed=new Set(fields.filter(f=>fieldTopics(f).some(t=>s.subtopics.includes(t))));
  const inScope=allArticles.filter(a=>fields.includes(a.industry)&&(!narrowed.has(a.industry)||s.subtopics.includes(a.topic)));
  const typed=inScope.filter(a=>s.contentTypes.includes(a.type));
  const pool=typed.length?typed:inScope;
  const wanted=selectedCountries(s);
  if(wanted.length){
    const score=(a:Article)=>a.regions.some(r=>wanted.includes(r))?0:1;
    return pool.map((a,i)=>({a,i})).sort((x,y)=>score(x.a)-score(y.a)||x.i-y.i).map(x=>x.a);
  }
  return spreadAcrossContinents(pool);
}
// World editions take turns between continents, so one region's stories never crowd out the others.
function homeContinent(a:Article){const r=a.regions.find(x=>x!=='GLOBAL'&&x!=='KR');return (r&&continentOf(r))||'ASIA_PACIFIC';}
function spreadAcrossContinents(pool:Article[]){
  const queues=new Map<string,Article[]>();
  for(const a of pool){const k=homeContinent(a);queues.set(k,[...(queues.get(k)||[]),a]);}
  const out:Article[]=[];
  while(out.length<pool.length)for(const q of queues.values()){const a=q.shift();if(a)out.push(a);}
  return out;
}
export function articleStory(a:Article,level:Level):NewsletterStory{
  const publishers=[...new Set(a.sources.map(s=>s.publisher))];
  return {
    id:a.id,title:a.title,description:a.dek,industry:a.industry,topics:[a.topic],countries:a.regions.filter(r=>r!=='GLOBAL'),
    type:a.type,source:publishers.slice(0,2).join(' · ')+(publishers.length>2?` 외 ${publishers.length-2}곳`:''),date:`${a.asOf}T00:00:00+09:00`,
    href:`/article/${a.id}?level=${level}`,sourceCount:a.sources.length,questions:a.questions,
    evidence:a.sources.map(src=>({source:src.publisher,url:src.url,title:src.title})),
  };
}
// World editions always open with the top hot picks, even when they sit outside the chosen fields.
export function hotFor(s:NewsletterSelection,ids?:string[]){
  if(s.scope!=='global')return [];
  // Saved issues store their hot picks first, so read them back from the head of the id list.
  const pool=ids?ids.slice(0,HOT_PER_EDITION).map(id=>hotPicks.find(h=>h.id===id)).filter((h):h is typeof hotPicks[number]=>Boolean(h)):hotPicks.slice(0,HOT_PER_EDITION);
  return pool.map(h=>({...h,article:articleById(h.id)!,rank:hotPicks.indexOf(h)+1})).filter(h=>h.article);
}
export function editionStories(s:NewsletterSelection,ids?:string[]){
  const hot=hotFor(s,ids);
  const rest=(ids?ids.map(articleById).filter((a):a is Article=>Boolean(a)):articlesFor(s)).filter(a=>!hot.some(h=>h.id===a.id));
  return [...hot.map(h=>({...articleStory(h.article,s.level),hot:{rank:h.rank,reason:h.reason}})),...rest.map(a=>articleStory(a,s.level))];
}
export function articleStories(s:NewsletterSelection){return editionStories(s);}
export function topicLabel(id:string){return allTopics.find(t=>t[0]===id)?.[1]||id;}
