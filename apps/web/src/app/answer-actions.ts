'use server';
import {redirect} from 'next/navigation';
import {betaReader,savedOrDefaultSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured,ensureReader} from '@/lib/beta-store';
import {addAnswer,articleLocale,deleteAnswer,moderateAnswer,reportAnswer,reportReasons,type ReportReason} from '@/lib/answers';
import {articleById} from '@/lib/articles';
import {getLocale} from '@/lib/locale';

const field=(form:FormData,k:string)=>String(form.get(k)||'');
// Back to the article's answer list, keeping the reading level, with a short status for the notice.
function back(form:FormData,status:string):never{
  const id=field(form,'article'),level=['intro','practitioner','expert'].includes(field(form,'level'))?field(form,'level'):'practitioner';
  if(field(form,'from')==='review')redirect(`/my/answers?done=${status}`);
  if(!articleById(id))redirect('/');
  redirect(`/article/${encodeURIComponent(id)}?level=${level}&answer=${status}#answers`);
}
// Beta readers who have not saved anything to the server yet get their reader record on first answer.
async function author(){
  const existing=await currentReader();
  if(existing)return existing;
  const beta=await betaReader();
  return beta?ensureReader(beta.name,await savedOrDefaultSelection()):null;
}

export async function postAnswer(form:FormData){
  if(field(form,'website'))back(form,'sent'); // honeypot: bots fill every field
  if(!deliveryConfigured())back(form,'setup');
  const id=field(form,'article');
  if(!articleById(id))redirect('/');
  const reader=await author().catch(()=>null);
  if(!reader)redirect('/login#beta');
  const result=await addAnswer(reader,id,field(form,'question'),field(form,'body'),articleLocale(id,await getLocale())).catch(()=>'save' as const);
  back(form,result);
}
export async function removeAnswer(form:FormData){
  const reader=await currentReader().catch(()=>null);
  if(!reader)redirect('/login#beta');
  back(form,(await deleteAnswer(reader,field(form,'answer')).catch(()=>false))?'deleted':'error');
}
export async function flagAnswer(form:FormData){
  const reader=await author().catch(()=>null);
  if(!reader)redirect('/login#beta');
  const raw=field(form,'reason'),reason:ReportReason=(reportReasons as readonly string[]).includes(raw)?raw as ReportReason:'other';
  back(form,(await reportAnswer(reader,field(form,'answer'),reason).catch(()=>false))?'reported':'error');
}
export async function moderate(form:FormData){
  const reader=await currentReader().catch(()=>null);
  if(!reader)redirect('/login#beta');
  const action=field(form,'action')==='show'?'show':'hide';
  back(form,(await moderateAnswer(reader,field(form,'answer'),action).catch(()=>false))?action==='show'?'shown':'hidden':'error');
}
