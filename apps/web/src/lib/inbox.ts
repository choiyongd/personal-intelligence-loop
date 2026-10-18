import 'server-only';
import {cookies} from 'next/headers';
import {z} from 'zod';
import {allArticles,editionSeed,pickEdition} from './articles';
import {kstNow} from './kst';
import {plans,type NewsletterSelection,type Plan} from './newsletter';

// The beta inbox lives in one browser cookie, like the beta identity itself.
// Scheduled editions are derived from the schedule and the date, so they cost no storage; the cookie keeps
// fresh editions a reader made (their article lists) and which scheduled editions were read.
export const INBOX_COOKIE='pil_inbox';
const KEEP=15,LOOKBACK_DAYS=62;
const inboxCookie={path:'/',maxAge:60*60*24*180,sameSite:'lax' as const,httpOnly:true,secure:process.env.VERCEL==='1'};

// Article ids are long; the cookie keeps a 5-character code per article instead.
function code(id:string){let h=2166136261;for(const c of id){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36).padStart(7,'0').slice(-5);}
const byCode=new Map(allArticles.map(a=>[code(a.id),a.id]));

const storedIssue=z.object({k:z.string().max(20),t:z.enum(['m','s']),d:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),at:z.number(),c:z.string().max(120)});
const storeSchema=z.object({v:z.literal(1),plan:z.enum(['free','subscriber']),since:z.string(),subAt:z.number().optional(),trial:z.boolean(),issues:z.array(storedIssue).max(KEEP),read:z.array(z.string().max(20)).max(70)});
export type InboxStore=z.infer<typeof storeSchema>;
const empty=():InboxStore=>({v:1,plan:'free',since:kstNow().date,trial:false,issues:[],read:[]});

export async function readInbox():Promise<InboxStore>{
  const raw=(await cookies()).get(INBOX_COOKIE)?.value;
  if(!raw)return empty();
  try{const parsed=storeSchema.safeParse(JSON.parse(Buffer.from(raw,'base64url').toString('utf8')));return parsed.success?parsed.data:empty();}catch{return empty();}
}
// Server actions only: render code cannot set cookies.
export async function writeInbox(store:InboxStore){
  const issues=[...store.issues].sort((a,b)=>b.at-a.at).slice(0,KEEP);
  const next={...store,issues,read:store.read.filter(k=>k.startsWith('s-')).slice(-70)};
  (await cookies()).set(INBOX_COOKIE,Buffer.from(JSON.stringify(next)).toString('base64url'),inboxCookie);
}

export type InboxIssue={key:string;kind:'manual'|'scheduled';date:string;at:number;articleIds:string[];read:boolean;stored:boolean};
const compact=(d:string)=>d.replaceAll('-','');
export const scheduledKey=(date:string)=>`s-${compact(date)}`;
function addDays(date:string,n:number){const t=new Date(`${date}T00:00:00Z`);t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10);}
function weekdayOf(date:string){return new Date(`${date}T00:00:00Z`).getUTCDay();}
// Korea time (UTC+9) for a date and hour, as epoch milliseconds.
const kstAt=(date:string,hour:number)=>Date.parse(`${date}T${String(hour).padStart(2,'0')}:00:00+09:00`);

// Dates whose scheduled edition has already arrived, newest first. Only subscribers get scheduled editions.
export function arrivedDates(s:NewsletterSelection,store:InboxStore,now=new Date()){
  if(store.plan!=='subscriber')return [];
  const {date:today}=kstNow(now),out:string[]=[];
  for(let i=0;i<=LOOKBACK_DAYS;i++){
    const d=addDays(today,-i);
    if(d<store.since)break;
    if(s.cadence==='weekly'&&weekdayOf(d)!==s.sendWeekday)continue;
    if(kstAt(d,s.sendHour)<=now.getTime())out.push(d);
  }
  return out;
}
// The next moment a scheduled edition arrives, so an open page can announce it without reloading.
export function nextArrival(s:NewsletterSelection,store:InboxStore,now=new Date()){
  if(store.plan!=='subscriber')return null;
  const {date:today}=kstNow(now);
  for(let i=0;i<=7;i++){
    const d=addDays(today,i);
    if(s.cadence==='weekly'&&weekdayOf(d)!==s.sendWeekday)continue;
    const at=kstAt(d,s.sendHour);
    if(at>now.getTime())return at;
  }
  return null;
}
export function scheduledIds(s:NewsletterSelection,date:string){return pickEdition(s,plans.subscriber.stories,editionSeed(date,0));}

export function inboxIssues(s:NewsletterSelection,store:InboxStore,now=new Date()):InboxIssue[]{
  const read=new Set(store.read);
  const stored=store.issues.map(i=>({key:i.k,kind:i.t==='m'?'manual' as const:'scheduled' as const,date:i.d,at:i.at*1000,
    articleIds:i.c.match(/.{5}/g)?.map(c=>byCode.get(c)).filter((x):x is string=>Boolean(x))||[],read:i.t==='m'||read.has(i.k),stored:true}));
  const have=new Set(stored.map(i=>i.key));
  const virtual=arrivedDates(s,store,now).map(d=>scheduledKey(d)).filter(k=>!have.has(k)).map(k=>{
    const date=`${k.slice(2,6)}-${k.slice(6,8)}-${k.slice(8,10)}`;
    return {key:k,kind:'scheduled' as const,date,at:kstAt(date,s.sendHour),articleIds:scheduledIds(s,date),read:read.has(k),stored:false};
  });
  return [...stored,...virtual].sort((a,b)=>b.at-a.at);
}
export function unreadCount(s:NewsletterSelection,store:InboxStore,now=new Date()){return inboxIssues(s,store,now).filter(i=>!i.read).length;}

export function generationsUsed(store:InboxStore,now=new Date()){
  const today=kstNow(now).date;
  // A subscription starts with a full day's allowance, even if a trial edition was made earlier that day.
  return store.plan==='free'?(store.trial?1:0):store.issues.filter(i=>i.t==='m'&&i.d===today&&i.at>=(store.subAt||0)).length;
}
export function generationsLeft(store:InboxStore,now=new Date()){return Math.max(0,plans[store.plan].generations-generationsUsed(store,now));}

// A fresh edition: subscribers get a different turn of their reading list for each of today's three slots.
export function newEdition(s:NewsletterSelection,store:InboxStore,now=new Date()){
  const today=kstNow(now).date,slot=store.issues.filter(i=>i.t==='m'&&i.d===today).length+1;
  const ids=pickEdition(s,plans[store.plan].stories,editionSeed(today,slot));
  const key=`m-${compact(today)}-${slot}`;
  return {key,ids,stored:{k:key,t:'m' as const,d:today,at:Math.floor(now.getTime()/1000),c:ids.map(code).join('')}};
}
export function setPlanIn(store:InboxStore,plan:Plan,now=new Date()):InboxStore{
  return plan===store.plan?store:{...store,plan,since:plan==='subscriber'?kstNow(now).date:store.since,subAt:plan==='subscriber'?Math.floor(now.getTime()/1000):store.subAt};
}
