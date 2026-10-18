import type {Article} from './types';
import {articles as technology} from './technology';
import {articles as businessFinance} from './business-finance';
import {articles as scienceHealth} from './science-health';
import {articles as energyPolicy} from './energy-policy';
import {articles as design} from './design';
import {allTopics,selectedCountries,type Level,type NewsletterSelection,type NewsletterStory} from '../newsletter';

export type {Article} from './types';
export const allArticles:Article[]=[...technology,...businessFinance,...scienceHealth,...energyPolicy,...design];
export function articleById(id:string){return allArticles.find(a=>a.id===id);}

// Field and topic decide what is in the edition; region only decides the order, so a narrow region never empties it.
export function articlesFor(s:NewsletterSelection){
  const fields=s.industries as string[];
  const inScope=allArticles.filter(a=>fields.includes(a.industry)&&(s.subtopics.length===0||s.subtopics.includes(a.topic)));
  const typed=inScope.filter(a=>s.contentTypes.includes(a.type));
  const pool=typed.length?typed:inScope;
  const wanted=selectedCountries(s);
  const score=(a:Article)=>wanted.length?(a.regions.some(r=>wanted.includes(r))?0:1):(a.regions.includes('GLOBAL')?0:1);
  return pool.map((a,i)=>({a,i})).sort((x,y)=>score(x.a)-score(y.a)||x.i-y.i).map(x=>x.a);
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
export function articleStories(s:NewsletterSelection){return articlesFor(s).map(a=>articleStory(a,s.level));}
export function topicLabel(id:string){return allTopics.find(t=>t[0]===id)?.[1]||id;}
