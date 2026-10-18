import 'server-only';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {newsletterSelectionSchema,type NewsletterSelection} from './newsletter';
import {articlesFor} from './articles';
import {kstNow} from './kst';

// The reader cookie is "<id>.<secret>"; only a SHA-256 of the secret is stored.
export const READER_COOKIE='pil_reader';
const readerCookie={path:'/',maxAge:60*60*24*180,sameSite:'lax' as const,httpOnly:true,secure:process.env.VERCEL==='1'};
export const hash=(token:string)=>createHash('sha256').update(token).digest('hex');
export const newToken=()=>randomBytes(24).toString('base64url');

function secretKey(){return process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||'';}
export function deliveryConfigured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&secretKey());}
let client:SupabaseClient|null=null;
export function admin(){
  if(!deliveryConfigured())throw new Error('beta-store-not-configured');
  client??=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,secretKey(),{auth:{persistSession:false,autoRefreshToken:false}});
  return client;
}

const readerRow=z.object({
  id:z.uuid(),token_hash:z.string(),name:z.string(),selection:z.unknown(),cadence:z.enum(['daily','weekly']),send_hour:z.number(),send_weekday:z.number(),
  email:z.string().nullable(),email_confirmed_at:z.string().nullable(),confirm_sent_at:z.string().nullable(),unsubscribe_token:z.string(),delivery_enabled:z.boolean(),
});
export type Reader=z.infer<typeof readerRow>&{selectionParsed:NewsletterSelection};
const readerColumns='id,token_hash,name,selection,cadence,send_hour,send_weekday,email,email_confirmed_at,confirm_sent_at,unsubscribe_token,delivery_enabled';
function toReader(row:unknown):Reader{const r=readerRow.parse(row);return {...r,selectionParsed:newsletterSelectionSchema.parse(r.selection)};}
function same(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}

export async function currentReader():Promise<Reader|null>{
  if(!deliveryConfigured())return null;
  const raw=(await cookies()).get(READER_COOKIE)?.value||'';
  const [id,secret]=raw.split('.');
  if(!z.uuid().safeParse(id).success||!secret)return null;
  const {data,error}=await admin().from('beta_readers').select(readerColumns).eq('id',id).maybeSingle();
  if(error)throw new Error('베타 독자 정보를 불러오지 못했습니다.');
  return data&&same(data.token_hash,hash(secret))?toReader(data):null;
}
function scheduleColumns(s:NewsletterSelection){return {selection:s,cadence:s.cadence,send_hour:s.sendHour,send_weekday:s.sendWeekday,updated_at:new Date().toISOString()};}
// Called only from server actions, which may set cookies.
export async function ensureReader(name:string,selection:NewsletterSelection){
  const existing=await currentReader();
  if(existing)return existing;
  const secret=newToken();
  const {data,error}=await admin().from('beta_readers').insert({token_hash:hash(secret),name,unsubscribe_token:newToken(),...scheduleColumns(selection)}).select(readerColumns).single();
  if(error)throw new Error('베타 독자를 만들지 못했습니다.');
  (await cookies()).set(READER_COOKIE,`${data.id}.${secret}`,readerCookie);
  return toReader(data);
}
export async function dueReaders(hour:number){
  // Readers whose hour has already come today; a delayed or missed hourly run still catches them the same day.
  const {data,error}=await admin().from('beta_readers').select(readerColumns).eq('delivery_enabled',true).lte('send_hour',hour).order('send_hour').limit(500);
  if(error)throw new Error('발송 대상을 불러오지 못했습니다.');
  return (data||[]).map(toReader);
}
export async function saveReaderSelection(id:string,selection:NewsletterSelection){
  const {error}=await admin().from('beta_readers').update(scheduleColumns(selection)).eq('id',id);
  if(error)throw new Error('관심사를 저장하지 못했습니다.');
}
export async function forgetReaderCookie(){(await cookies()).delete(READER_COOKIE);}

// Rotate through the matching explainers: never-sent first, then the least recently sent.
export async function pickArticles(readerId:string,selection:NewsletterSelection,count:number){
  const candidates=articlesFor(selection).map(a=>a.id);
  const {data}=await admin().from('beta_issues').select('article_ids,created_at').eq('reader_id',readerId).order('created_at',{ascending:false}).limit(60);
  const lastUsed=new Map<string,number>();
  (data||[]).forEach((row,i)=>(row.article_ids as string[]).forEach(id=>{if(!lastUsed.has(id))lastUsed.set(id,i);}));
  return candidates.map((id,order)=>({id,order,age:lastUsed.has(id)?lastUsed.get(id)!:Infinity}))
    .sort((a,b)=>b.age-a.age||a.order-b.order).slice(0,count).map(x=>x.id);
}
const issueRow=z.object({id:z.uuid(),kind:z.enum(['scheduled','manual']),issue_date:z.string(),title:z.string(),selection:z.unknown(),article_ids:z.array(z.string()),delivery:z.enum(['saved','pending','sent','failed']),attempts:z.number(),created_at:z.string(),sent_at:z.string().nullable()});
export type Issue=z.infer<typeof issueRow>&{selectionParsed:NewsletterSelection};
const issueColumns='id,kind,issue_date,title,selection,article_ids,delivery,attempts,created_at,sent_at';
function toIssue(row:unknown):Issue{const r=issueRow.parse(row);return {...r,selectionParsed:newsletterSelectionSchema.parse(r.selection)};}
export const issueSize=(s:NewsletterSelection)=>s.cadence==='daily'?5:8;

// Insert-or-get keyed by (reader, kind, Korean date), so repeated clicks or overlapping cron runs make one issue.
export async function createIssue(reader:Pick<Reader,'id'|'selectionParsed'>,kind:'scheduled'|'manual',delivery:'saved'|'pending',now=new Date()){
  const date=kstNow(now).date,s=reader.selectionParsed;
  const found=await admin().from('beta_issues').select(issueColumns).eq('reader_id',reader.id).eq('kind',kind).eq('issue_date',date).maybeSingle();
  if(found.data)return {issue:toIssue(found.data),created:false};
  const articleIds=await pickArticles(reader.id,s,issueSize(s));
  if(articleIds.length===0)return {issue:null,created:false};
  const {data,error}=await admin().from('beta_issues').insert({reader_id:reader.id,kind,issue_date:date,title:s.name,selection:s,article_ids:articleIds,delivery})
    .select(issueColumns).single();
  if(error?.code==='23505'){const again=await admin().from('beta_issues').select(issueColumns).eq('reader_id',reader.id).eq('kind',kind).eq('issue_date',date).single();return {issue:toIssue(again.data),created:false};}
  if(error)throw new Error('이번 호를 보관하지 못했습니다.');
  return {issue:toIssue(data),created:true};
}
export async function listIssues(readerId:string){
  const {data,error}=await admin().from('beta_issues').select(issueColumns).eq('reader_id',readerId).order('created_at',{ascending:false}).limit(60);
  if(error)throw new Error('지난 호를 불러오지 못했습니다.');
  return (data||[]).map(toIssue);
}
export async function getIssue(readerId:string,id:string){
  if(!z.uuid().safeParse(id).success)return null;
  const {data}=await admin().from('beta_issues').select(issueColumns).eq('reader_id',readerId).eq('id',id).maybeSingle();
  return data?toIssue(data):null;
}
