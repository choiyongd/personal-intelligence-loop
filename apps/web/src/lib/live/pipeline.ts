import 'server-only';
import {createHash} from 'node:crypto';
import {admin,deliveryConfigured} from '../beta-store';
import {appOrigin} from '../env';
import {kstNow} from '../kst';
import type {Article} from '../articles/types';
import type {IndustryId} from '../newsletter';
import {aiConfigured,citationProblems,liveModel,planStories,writeStory,type CandidateItem,type WriterSource} from './ai';
import {allowedUrl,feedById,feeds,type Feed} from './feeds';
import {parseFeed,toText} from './rss';

// The daily live edition runs in three steps so each request stays well inside a serverless time limit:
// collect (read every approved feed) -> plan (one editor call picks the day's stories) -> write (a few stories per call).
export function liveConfigured(){return deliveryConfigured()&&aiConfigured();}
const MAX_BYTES=2*1024*1024;
const FRESH_DAYS=4;
const dailyStories=()=>Math.min(20,Math.max(1,Number(process.env.LIVE_DAILY_STORIES)||10));
const err=(e:unknown)=>(e instanceof Error?e.message:String(e)).replace(/\s+/g,' ').slice(0,300);
function addDays(date:string,n:number){const t=new Date(`${date}T00:00:00Z`);t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10);}

async function fetchText(url:string,timeoutMs:number){
  let origin='';try{origin=appOrigin();}catch{}
  const res=await fetch(url,{signal:AbortSignal.timeout(timeoutMs),redirect:'follow',cache:'no-store',
    headers:{'User-Agent':`loop-newsletter/1.0${origin?` (+${origin})`:''}`,Accept:'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.8'}});
  if(!res.ok)throw new Error(`http-${res.status}`);
  const buf=await res.arrayBuffer();
  if(buf.byteLength>MAX_BYTES)throw new Error('too-large');
  return new TextDecoder('utf-8').decode(buf);
}
// Feeds sometimes still say http:// for pages served over https.
function pageUrl(feed:Feed,raw:string){
  let url=raw.trim();
  if(url.startsWith('http://'))url='https://'+url.slice(7);
  return allowedUrl(feed,url)?url:null;
}

async function logRun(step:'collect'|'plan'|'write',started:Date,stats:Record<string,unknown>,error?:string){
  await admin().from('live_runs').insert({step,started_at:started.toISOString(),finished_at:new Date().toISOString(),stats,error:error||null});
}

export async function collect(now=new Date()){
  const started=new Date();
  const cutoff=now.getTime()-FRESH_DAYS*864e5;
  const results=await Promise.all(feeds.map(async feed=>{
    try{
      const entries=parseFeed(await fetchText(feed.url,15_000));
      const rows=entries.flatMap(e=>{
        const url=pageUrl(feed,e.url);
        if(!url)return [];
        if(e.publishedAt&&Date.parse(e.publishedAt)<cutoff)return [];
        return [{feed_id:feed.id,url,title:e.title,summary:e.summary,published_at:e.publishedAt}];
      });
      if(!rows.length)return {feed:feed.id,ok:true,found:entries.length,fresh:0,added:0};
      const {data,error}=await admin().from('live_items').upsert(rows,{onConflict:'url',ignoreDuplicates:true}).select('id');
      if(error)throw new Error(error.message);
      return {feed:feed.id,ok:true,found:entries.length,fresh:rows.length,added:data?.length||0};
    }catch(e){return {feed:feed.id,ok:false,error:err(e)};}
  }));
  const stats={added:results.reduce((n,r)=>n+('added' in r?r.added||0:0),0),feeds:results};
  await logRun('collect',started,stats);
  return stats;
}

function storyId(date:string,itemIds:number[]){
  const h=createHash('sha256').update(itemIds.sort((a,b)=>a-b).join(',')).digest('hex');
  return `n-${date.slice(2).replaceAll('-','')}-${BigInt('0x'+h.slice(0,12)).toString(36).slice(0,8)}`;
}

export async function plan(now=new Date()){
  const started=new Date();
  const date=kstNow(now).date;
  const existing=await admin().from('live_articles').select('id',{count:'exact',head:true}).eq('issue_date',date);
  if(existing.error)throw new Error(existing.error.message);
  if((existing.count||0)>0)return {date,skipped:'already-planned',stories:existing.count};
  const since=new Date(now.getTime()-2*864e5).toISOString();
  const {data,error}=await admin().from('live_items').select('id,feed_id,title,summary,published_at').is('story_id',null).gte('collected_at',since).order('collected_at',{ascending:false}).limit(150);
  if(error)throw new Error(error.message);
  const items:CandidateItem[]=(data||[]).flatMap(r=>{const f=feedById(r.feed_id);return f?[{id:r.id,publisher:f.publisher,title:r.title,summary:r.summary,publishedAt:r.published_at,regions:f.regions}]:[];});
  if(!items.length){await logRun('plan',started,{date,items:0,stories:0});return {date,items:0,stories:0};}
  try{
    const stories=await planStories(items,dailyStories(),date);
    const rows=stories.map(s=>({id:storyId(date,s.itemIds),issue_date:date,industry:s.industry,topic:s.topic,regions:s.regions,angle:s.angle,item_ids:s.itemIds,type:s.type,status:'planned',model:liveModel()}));
    if(rows.length){
      const ins=await admin().from('live_articles').upsert(rows,{onConflict:'id',ignoreDuplicates:true});
      if(ins.error)throw new Error(ins.error.message);
      for(const r of rows)await admin().from('live_items').update({story_id:r.id}).in('id',r.item_ids);
    }
    const stats={date,items:items.length,stories:rows.length};
    await logRun('plan',started,stats);
    return stats;
  }catch(e){await logRun('plan',started,{date,items:items.length},err(e));throw e;}
}

type StoryRow={id:string;issue_date:string;industry:string;topic:string;regions:string[];type:'news'|'research';angle:string;item_ids:number[];status:string;attempts:number;last_error:string|null};
const MAX_ATTEMPTS=2,STALE_MS=10*60_000;
async function claimable(date:string){
  const stale=new Date(Date.now()-STALE_MS).toISOString();
  const {data,error}=await admin().from('live_articles').select('id,issue_date,industry,topic,regions,type,angle,item_ids,status,attempts,last_error')
    .gte('issue_date',addDays(date,-1)).lt('attempts',MAX_ATTEMPTS)
    .or(`status.eq.planned,status.eq.failed,and(status.eq.writing,claimed_at.lt.${stale})`).order('created_at').limit(40);
  if(error)throw new Error(error.message);
  return (data||[]) as StoryRow[];
}

async function sourcesFor(row:StoryRow):Promise<WriterSource[]>{
  const {data,error}=await admin().from('live_items').select('id,feed_id,url,title,summary,published_at').in('id',row.item_ids);
  if(error)throw new Error(error.message);
  return Promise.all((data||[]).map(async item=>{
    const feed=feedById(item.feed_id);
    let material=item.summary;
    // Public-domain and open-licence releases may be read in full; for the rest only the feed's description is used.
    if(feed?.fullText&&allowedUrl(feed,item.url)){
      try{const page=toText(await fetchText(item.url,12_000));if(page.length>material.length)material=page.slice(0,7000);}catch{}
    }
    return {publisher:feed?.publisher||item.feed_id,title:item.title,url:item.url,date:item.published_at,material:material||'(설명 없음, 제목만 있음)'};
  }));
}

function toArticle(row:StoryRow,w:Awaited<ReturnType<typeof writeStory>>,sources:WriterSource[]):Article{
  return {
    id:row.id,industry:row.industry as IndustryId,topic:row.topic,regions:row.regions,type:row.type,
    title:w.title,dek:w.dek,asOf:row.issue_date,glossary:w.glossary,
    pages:w.pages,deepDive:w.deep_dive,keyFacts:w.key_facts,questions:w.questions,thoughts:w.thoughts,
    sources:sources.map(s=>({title:s.title,publisher:s.publisher,year:(s.date||row.issue_date).slice(0,4),url:s.url,kind:s.publisher==='arXiv'?'학술 자료':'공식 자료'})),
    live:{model:liveModel(),writtenAt:new Date().toISOString()},
  };
}

async function writeOne(row:StoryRow){
  try{
    const sources=await sourcesFor(row);
    if(!sources.length)throw new Error('no-sources');
    const written=await writeStory(row.angle,sources,row.issue_date);
    const problems=citationProblems(written,sources.length);
    if(problems.length)throw new Error(`citations:${problems.slice(0,2).join('|')}`);
    const article=toArticle(row,written,sources);
    const {error}=await admin().from('live_articles').update({article,status:'published',published_at:new Date().toISOString(),last_error:null,model:liveModel()}).eq('id',row.id);
    if(error)throw new Error(error.message);
    return {id:row.id,ok:true as const};
  }catch(e){
    await admin().from('live_articles').update({status:'failed',last_error:err(e)}).eq('id',row.id);
    return {id:row.id,ok:false as const,error:err(e)};
  }
}

export async function write(now=new Date(),batch=Math.min(6,Math.max(1,Number(process.env.LIVE_WRITE_BATCH)||4))){
  const started=new Date();
  const date=kstNow(now).date;
  const queue=await claimable(date);
  const mine:StoryRow[]=[];
  for(const row of queue){
    if(mine.length>=batch)break;
    // Compare-and-set on attempts so two overlapping runs never write the same story.
    const {data}=await admin().from('live_articles').update({status:'writing',attempts:row.attempts+1,claimed_at:new Date().toISOString()}).eq('id',row.id).eq('attempts',row.attempts).select('id');
    if(data?.length)mine.push(row);
  }
  const results=await Promise.all(mine.map(writeOne));
  const remaining=(await claimable(date)).length;
  const stats={date,written:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).map(r=>`${r.id}:${'error' in r?r.error:''}`),remaining};
  await logRun('write',started,stats);
  return stats;
}
