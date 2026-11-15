import 'server-only';
import {z} from 'zod';
import {admin,currentReader,deliveryConfigured,type Reader} from './beta-store';
import {articleById,hasEnglish,localize} from './articles';
import {operator} from './operator';
import type {Locale} from './i18n';

// Readers' answers to the check questions and things to think about at the end of each article.
// Stored in server-only tables (migration 202611140006); every read and write goes through the service key here.
export type Prompt={key:string;text:string;kind:'question'|'thought'};
export const MAX_BODY=1000,DAILY_LIMIT=20,HIDE_AFTER_REPORTS=3;
export const reportReasons=['abuse','spam','privacy','other'] as const;
export type ReportReason=(typeof reportReasons)[number];

// The prompts as a reader sees them on the page, in the page's language.
export function articleLocale(id:string,siteLoc:Locale):Locale{return siteLoc==='en'&&hasEnglish(id)?'en':'ko';}
export function promptsFor(id:string,loc:Locale):Prompt[]{
  const raw=articleById(id);if(!raw)return [];
  const a=localize(raw,loc);
  return [...a.questions.map((text,i)=>({key:`q${i}`,text,kind:'question' as const})),...a.thoughts.map((text,i)=>({key:`t${i}`,text,kind:'thought' as const}))];
}

const answerRow=z.object({id:z.uuid(),article_id:z.string(),question_key:z.string(),question:z.string(),reader_id:z.uuid(),author_name:z.string(),body:z.string(),
  status:z.enum(['visible','hidden']),hidden_reason:z.string().nullable(),report_count:z.number(),created_at:z.string()});
export type Answer=z.infer<typeof answerRow>&{mine:boolean};
const columns='id,article_id,question_key,question,reader_id,author_name,body,status,hidden_reason,report_count,created_at';

// The moderator signs in by mail link like any reader; their confirmed address must be in MODERATOR_EMAILS
// (comma-separated). Without it, the operator's contact address is the moderator.
export function moderatorEmails(){
  const list=(process.env.MODERATOR_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(s=>s.includes('@'));
  if(list.length)return list;
  const contact=operator().contact.trim().toLowerCase();
  return contact.includes('@')?[contact]:[];
}
export function isModerator(r:Pick<Reader,'email'|'email_confirmed_at'>|null){
  return Boolean(r?.email&&r.email_confirmed_at&&moderatorEmails().includes(r.email.toLowerCase()));
}
export const answersReady=deliveryConfigured;

// Everyone sees visible answers; authors also see their own hidden ones, the moderator sees all.
export async function answersFor(articleId:string,viewer:Reader|null){
  const mod=isModerator(viewer);
  let q=admin().from('discussion_answers').select(columns).eq('article_id',articleId).order('created_at',{ascending:true}).limit(300);
  if(!mod)q=viewer?q.or(`status.eq.visible,reader_id.eq.${viewer.id}`):q.eq('status','visible');
  const {data,error}=await q;
  if(error)throw new Error('answers-load');
  return (data||[]).map(r=>{const a=answerRow.parse(r);return {...a,mine:a.reader_id===viewer?.id};});
}
export async function answerCount(articleId:string){
  const {count}=await admin().from('discussion_answers').select('id',{count:'exact',head:true}).eq('article_id',articleId).eq('status','visible');
  return count||0;
}

export type AddResult='sent'|'invalid'|'limit'|'question'|'save';
export async function addAnswer(reader:Reader,articleId:string,key:string,body:string,loc:Locale):Promise<AddResult>{
  const text=body.replace(/\r\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
  if(text.length<2||text.length>MAX_BODY)return 'invalid';
  const prompt=promptsFor(articleId,loc).find(p=>p.key===key);
  if(!prompt)return 'question';
  const since=new Date(Date.now()-864e5).toISOString();
  const recent=await admin().from('discussion_answers').select('id',{count:'exact',head:true}).eq('reader_id',reader.id).gte('created_at',since);
  if((recent.count||0)>=DAILY_LIMIT)return 'limit';
  const name=(reader.name||'').trim().slice(0,20)||(loc==='en'?'Reader':'베타 독자');
  const {error}=await admin().from('discussion_answers').insert({article_id:articleId,question_key:key,question:prompt.text.slice(0,600),reader_id:reader.id,author_name:name,body:text});
  return error?'save':'sent';
}
async function answerById(id:string){
  if(!z.uuid().safeParse(id).success)return null;
  const {data}=await admin().from('discussion_answers').select(columns).eq('id',id).maybeSingle();
  return data?answerRow.parse(data):null;
}
// Authors may delete their own answers; the moderator may delete any.
export async function deleteAnswer(reader:Reader,id:string){
  const a=await answerById(id);if(!a)return false;
  if(a.reader_id!==reader.id&&!isModerator(reader))return false;
  const {error}=await admin().from('discussion_answers').delete().eq('id',id);
  return !error;
}
// One report per reader per answer; the database hides an answer once it reaches HIDE_AFTER_REPORTS.
export async function reportAnswer(reader:Reader,id:string,reason:ReportReason){
  const a=await answerById(id);if(!a||a.reader_id===reader.id)return false;
  const {error}=await admin().from('discussion_reports').insert({answer_id:id,reader_id:reader.id,reason});
  return !error||error.code==='23505';
}
export async function moderateAnswer(reader:Reader,id:string,action:'hide'|'show'){
  if(!isModerator(reader)||!z.uuid().safeParse(id).success)return false;
  const {error}=await admin().from('discussion_answers').update(action==='hide'?{status:'hidden',hidden_reason:'moderator'}:{status:'visible',hidden_reason:null,report_count:0}).eq('id',id);
  return !error;
}
// The moderator's queue: reported or hidden answers first, then the newest ones.
export async function reviewQueue(){
  const flagged=await admin().from('discussion_answers').select(columns).or('report_count.gt.0,status.eq.hidden').order('report_count',{ascending:false}).order('created_at',{ascending:false}).limit(100);
  const latest=await admin().from('discussion_answers').select(columns).order('created_at',{ascending:false}).limit(50);
  if(flagged.error||latest.error)throw new Error('answers-load');
  const reasons=await admin().from('discussion_reports').select('answer_id,reason').in('answer_id',(flagged.data||[]).map(r=>r.id as string));
  const byAnswer=new Map<string,string[]>();
  (reasons.data||[]).forEach(r=>byAnswer.set(r.answer_id as string,[...(byAnswer.get(r.answer_id as string)||[]),r.reason as string]));
  const parse=(rows:unknown[]|null)=>(rows||[]).map(r=>{const a=answerRow.parse(r);return {...a,mine:false,reasons:byAnswer.get(a.id)||[]};});
  return {flagged:parse(flagged.data),latest:parse(latest.data)};
}
export async function viewer(){return deliveryConfigured()?currentReader().catch(()=>null):null;}
export async function myAnswers(readerId:string){
  const {data,error}=await admin().from('discussion_answers').select(columns).eq('reader_id',readerId).order('created_at',{ascending:false}).limit(100);
  if(error)throw new Error('answers-load');
  return (data||[]).map(r=>({...answerRow.parse(r),mine:true,reasons:[] as string[]}));
}
