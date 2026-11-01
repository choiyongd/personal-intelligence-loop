import 'server-only';
import {admin,deliveryConfigured} from '../beta-store';
import {kstNow} from '../kst';
import {articleById,liveArticles,setLiveArticles,setLiveStaleHook,type Article} from '../articles';

// Published live articles are kept in memory so the existing synchronous edition code can use them.
// The recent window is reloaded at most every few minutes; older ones are fetched by id when a saved issue needs them.
const FRESH_MS=5*60_000,WINDOW_DAYS=10;
let loadedAt=0;
let inflight:Promise<void>|null=null;
const extra=new Map<string,Article>();

function fromRow(row:{article:unknown}):Article|null{
  const a=row.article as Article|null;
  return a&&typeof a.id==='string'&&Array.isArray(a.pages)&&Array.isArray(a.sources)?a:null;
}
function publish(recent:Article[]){
  const ids=new Set(recent.map(a=>a.id));
  setLiveArticles([...recent,...[...extra.values()].filter(a=>!ids.has(a.id))]);
}

export async function refreshLive(force=false){
  if(!deliveryConfigured())return;
  if(!force&&Date.now()-loadedAt<FRESH_MS)return;
  inflight??=(async()=>{
    const since=new Date(Date.parse(`${kstNow().date}T00:00:00Z`)-WINDOW_DAYS*864e5).toISOString().slice(0,10);
    const {data,error}=await admin().from('live_articles').select('article').eq('status','published').gte('issue_date',since).order('issue_date',{ascending:false}).order('published_at',{ascending:true}).limit(300);
    if(error)throw new Error(error.message);
    publish((data||[]).map(fromRow).filter((a):a is Article=>Boolean(a)));
    loadedAt=Date.now();
  })().catch(()=>{/* the live table may not exist yet; editions fall back to the written explainers */}).finally(()=>{inflight=null;});
  await inflight;
}

// Saved issues and article links can point at live articles older than the in-memory window.
export async function ensureArticles(ids:string[]){
  await refreshLive();
  const missing=ids.filter(id=>id.startsWith('n-')&&!articleById(id));
  if(!missing.length||!deliveryConfigured())return;
  const {data}=await admin().from('live_articles').select('article').eq('status','published').in('id',missing.slice(0,40));
  for(const a of (data||[]).map(fromRow))if(a)extra.set(a.id,a);
  if(extra.size>500)for(const k of [...extra.keys()].slice(0,extra.size-500))extra.delete(k);
  publish(liveArticles().filter(a=>!extra.has(a.id)));
}

// Any read of the article index nudges a background reload once the copy is stale.
setLiveStaleHook(()=>{if(Date.now()-loadedAt>=FRESH_MS&&!inflight)void refreshLive();});
