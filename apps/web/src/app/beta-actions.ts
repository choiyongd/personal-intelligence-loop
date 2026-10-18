'use server';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {BETA_COOKIE,DRAFT_COOKIE,betaReader,savedOrDefaultSelection} from '@/lib/beta';
import {admin,currentReader,deliveryConfigured,ensureReader,hash,newToken,saveReaderSelection} from '@/lib/beta-store';
import {mailConfigured,sendMail} from '@/lib/mailer';
import {renderConfirmEmail,renderIssueEmail} from '@/lib/issue-email';
import {articleById,hotFor,type Article} from '@/lib/articles';
import {generationsLeft,inboxIssues,newEdition,readInbox,setPlanIn,writeInbox} from '@/lib/inbox';
import {unsubscribeUrl} from '@/lib/dispatch';
import {newsletterSelectionSchema,scheduleLabel,selectionQuery,themes,type NewsletterSelection} from '@/lib/newsletter';
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

// Mail one edition to the reader's confirmed address. Returns false when there is no confirmed address or mail is not set up.
async function mailEdition(name:string,selection:NewsletterSelection,ids:string[],key:string){
  if(!deliveryConfigured()||!mailConfigured())return false;
  const reader=await currentReader();
  if(!reader?.email||!reader.email_confirmed_at)return false;
  const articles=ids.map(articleById).filter((a):a is Article=>Boolean(a));
  if(!articles.length)return false;
  const origin=appOrigin(),unsub=unsubscribeUrl(reader);
  const mail=renderIssueEmail({selection,articles,hotIds:hotFor(selection,ids).map(h=>h.id),origin,readerName:name,unsubscribeUrl:unsub,archiveUrl:`${origin}/my/inbox/${key}`,
    dateLabel:new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date())});
  await sendMail({to:reader.email,...mail,headers:{'List-Unsubscribe':`<${unsub}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}});
  return true;
}
// Make a fresh edition within the plan's allowance; subscribers who turned on mail also get it by mail.
export async function generateEdition(){
  const beta=await requireBeta();
  const selection=await savedOrDefaultSelection();
  const store=await readInbox();
  if(generationsLeft(store)<=0)redirect(store.plan==='free'?'/pricing?from=limit':'/my?notice=limit');
  const edition=newEdition(selection,store);
  if(!edition.ids.length)redirect('/my?notice=empty');
  await writeInbox({...store,trial:true,issues:[edition.stored,...store.issues]});
  let mailed='';
  try{
    const reader=deliveryConfigured()?await currentReader():null;
    if(reader?.delivery_enabled&&await mailEdition(beta.name,selection,edition.ids,edition.key))mailed='?mail=sent';
  }catch{mailed='?mail=error';}
  redirect(`/my/inbox/${edition.key}${mailed}`);
}
export async function mailThisEdition(key:string){
  const beta=await requireBeta();
  const selection=await savedOrDefaultSelection();
  const issue=inboxIssues(selection,await readInbox()).find(i=>i.key===key);
  if(!issue)redirect('/my/inbox');
  let result='unavailable';
  try{result=await mailEdition(beta.name,selection,issue.articleIds,key)?'sent':'need-email';}catch{result='error';}
  redirect(`/my/inbox/${key}?mail=${result}`);
}
export async function markEditionRead(key:string){
  await requireBeta();
  if(!/^s-\d{8}$/.test(key))return;
  const store=await readInbox();
  if(!store.read.includes(key))await writeInbox({...store,read:[...store.read,key]});
}
// Beta stand-in for checkout: switching plans needs no payment while the service is in beta.
export async function choosePlan(form:FormData){
  await requireBeta();
  const plan=form.get('plan')==='subscriber'?'subscriber':'free';
  await writeInbox(setPlanIn(await readInbox(),plan));
  const reader=deliveryConfigured()?await currentReader():null;
  if(reader)await admin().from('beta_readers').update({plan,updated_at:new Date().toISOString()}).eq('id',reader.id);
  revalidatePath('/','layout');
  redirect(`/pricing?plan=${plan}`);
}
export async function chooseTheme(form:FormData){
  await requireBeta();
  const theme=String(form.get('theme'));
  if(!themes.some(t=>t[0]===theme))return;
  const selection={...await savedOrDefaultSelection(),theme:theme as NewsletterSelection['theme']};
  (await cookies()).set(DRAFT_COOKIE,selectionQuery(selection),draftCookie);
  const reader=deliveryConfigured()?await currentReader():null;
  if(reader)await saveReaderSelection(reader.id,selection);
  revalidatePath('/my','layout');
}
