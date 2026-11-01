'use server';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {admin,currentReader,deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured,sendMail} from '@/lib/mailer';
import {operator} from '@/lib/operator';

const schema=z.object({
  rating:z.coerce.number().int().min(1).max(5).optional(),
  message:z.string().trim().min(1).max(2000),
  contact:z.union([z.literal(''),z.email().max(254)]),
  source:z.enum(['site','mail']),
});
// Readers' notes go to the database and, when mail is set up, to the operator's inbox.
export async function sendFeedback(form:FormData){
  if(String(form.get('website')||''))redirect('/feedback?sent=1'); // honeypot: bots fill every field
  if(!deliveryConfigured())redirect('/feedback?error=setup');
  const parsed=schema.safeParse({rating:form.get('rating')||undefined,message:String(form.get('message')||''),contact:String(form.get('contact')||'').trim().toLowerCase(),source:form.get('source')==='mail'?'mail':'site'});
  if(!parsed.success)redirect('/feedback?error=invalid');
  const reader=await currentReader().catch(()=>null);
  const {rating,message,contact,source}=parsed.data;
  const {error}=await admin().from('beta_feedback').insert({reader_id:reader?.id??null,rating:rating??null,message,contact:contact||null,source});
  if(error)redirect('/feedback?error=save');
  const to=operator().contact;
  if(to.includes('@')&&mailConfigured()){
    const lines=[`만족도: ${rating?`${rating}/5`:'선택 안 함'}`,`보낸 곳: ${source==='mail'?'메일 링크':'사이트'}`,`답장 받을 주소: ${contact||'없음'}`,`독자: ${reader?`${reader.name} (${reader.id})`:'알 수 없음'}`,'',message];
    const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
    await sendMail({to,subject:`[loop. 의견] ${message.slice(0,40)}`,text:lines.join('\n'),html:`<pre style="font:14px/1.6 sans-serif;white-space:pre-wrap">${esc(lines.join('\n'))}</pre>`}).catch(()=>{});
  }
  redirect('/feedback?sent=1');
}
