'use server';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {BETA_COOKIE,DRAFT_COOKIE,betaReader,savedOrDefaultSelection} from '@/lib/beta';
import {admin,createIssue,currentReader,deliveryConfigured,ensureReader,hash,newToken,saveReaderSelection} from '@/lib/beta-store';
import {mailConfigured,sendMail} from '@/lib/mailer';
import {renderConfirmEmail} from '@/lib/issue-email';
import {newsletterSelectionSchema,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {appOrigin} from '@/lib/env';

const draftCookie={path:'/',maxAge:60*60*24*90,sameSite:'lax' as const,httpOnly:false,secure:process.env.VERCEL==='1'};
async function requireBeta(){const beta=await betaReader();if(!beta)redirect('/login#beta');return beta;}

// The builder's finish step for beta readers: keep the choice in the browser and, when a reader record exists, on the server.
export async function saveBetaSelection(raw:string){
  await requireBeta();
  let value:unknown;try{value=JSON.parse(raw);}catch{return {error:'선택을 읽지 못했습니다. 다시 시도해 주세요.'};}
  const parsed=newsletterSelectionSchema.safeParse(value);
  if(!parsed.success)return {error:parsed.error.issues[0].message};
  (await cookies()).set(DRAFT_COOKIE,selectionQuery(parsed.data),draftCookie);
  const reader=await currentReader();
  if(reader)await saveReaderSelection(reader.id,parsed.data);
  revalidatePath('/my');
  return {error:''};
}
export async function archiveCurrentIssue(){
  const beta=await requireBeta();
  if(!deliveryConfigured())redirect('/my?mail=unavailable');
  const reader=await ensureReader(beta.name,await savedOrDefaultSelection());
  const {issue}=await createIssue(reader,'manual','saved');
  if(!issue)redirect('/my?mail=empty');
  redirect(`/my/archive/${issue.id}`);
}
const emailSchema=z.email().max(254);
export async function subscribeEmail(form:FormData){
  const beta=await requireBeta();
  if(!deliveryConfigured()||!mailConfigured())redirect('/my?mail=unavailable#delivery');
  const email=emailSchema.safeParse(String(form.get('email')||'').trim().toLowerCase());
  if(!email.success)redirect('/my?mail=bad-email#delivery');
  const selection=await savedOrDefaultSelection();
  const reader=await ensureReader(beta.name,selection);
  // One confirmation mail per minute per reader keeps the form from being used to flood an inbox.
  if(reader.confirm_sent_at&&Date.now()-new Date(reader.confirm_sent_at).getTime()<60_000)redirect('/my?mail=wait#delivery');
  const token=newToken();
  const {error}=await admin().from('beta_readers').update({email:email.data,email_confirmed_at:null,delivery_enabled:false,confirm_token_hash:hash(token),confirm_sent_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',reader.id);
  if(error)redirect('/my?mail=error#delivery');
  try{
    await sendMail({to:email.data,...renderConfirmEmail({name:beta.name,schedule:scheduleLabel(selection),confirmUrl:`${appOrigin()}/api/beta/confirm?r=${reader.id}&t=${token}`})});
  }catch{redirect('/my?mail=error#delivery');}
  redirect('/my?mail=check#delivery');
}
export async function stopEmail(){
  await requireBeta();
  const reader=await currentReader();
  if(reader)await admin().from('beta_readers').update({delivery_enabled:false,updated_at:new Date().toISOString()}).eq('id',reader.id);
  redirect('/my?mail=stopped#delivery');
}
export async function resumeEmail(){
  await requireBeta();
  const reader=await currentReader();
  if(reader?.email&&reader.email_confirmed_at)await admin().from('beta_readers').update({delivery_enabled:true,updated_at:new Date().toISOString()}).eq('id',reader.id);
  redirect('/my?mail=resumed#delivery');
}
