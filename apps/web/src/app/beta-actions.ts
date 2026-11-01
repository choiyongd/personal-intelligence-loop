'use server';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {BETA_COOKIE,DRAFT_COOKIE,betaReader,savedOrDefaultSelection} from '@/lib/beta';
import {admin,currentReader,deliveryConfigured,saveReaderSelection} from '@/lib/beta-store';
import {mailEdition,mailReady,requestMail,stopMail} from '@/lib/edition-mail';
import {generationsLeft,inboxIssues,newEdition,readInbox,setPlanIn,writeInbox} from '@/lib/inbox';
import {accents,articleStyles,newsletterSelectionSchema,selectionQuery,themes,type NewsletterSelection} from '@/lib/newsletter';

const draftCookie={path:'/',maxAge:60*60*24*90,sameSite:'lax' as const,httpOnly:false,secure:process.env.VERCEL==='1'};
async function requireBeta(){const beta=await betaReader();if(!beta)redirect('/login#beta');return beta;}

// The builder's finish step for beta readers: keep the choice in the browser and, when a reader record exists, on the server.
// The same step can switch mail on (confirming a new address) or off, so readers never need a separate settings screen.
const mailChoice=z.object({on:z.boolean(),email:z.string().max(254)}).optional();
export async function saveBetaSelection(raw:string,rawMail?:string):Promise<{error:string;mail?:string}>{
  const beta=await requireBeta();
  let value:unknown,mailValue:unknown;
  try{value=JSON.parse(raw);mailValue=rawMail?JSON.parse(rawMail):undefined;}catch{return {error:'선택을 읽지 못했습니다. 다시 시도해 주세요.'};}
  const parsed=newsletterSelectionSchema.safeParse(value);
  if(!parsed.success)return {error:parsed.error.issues[0].message};
  const mail=mailChoice.safeParse(mailValue);
  (await cookies()).set(DRAFT_COOKIE,selectionQuery(parsed.data),draftCookie);
  const reader=await currentReader().catch(()=>null);
  if(reader)await saveReaderSelection(reader.id,parsed.data).catch(()=>undefined);
  let mailed:string|undefined;
  // A mail setup failure must not block saving the interests; the reader sees a notice and can retry from /my.
  if(mail.success&&mail.data){
    try{
      if(mail.data.on)mailed=await requestMail(beta.name,parsed.data,(await readInbox()).plan,mail.data.email);
      else if(reader?.delivery_enabled){await stopMail();mailed='stopped';}
    }catch{mailed='error';}
  }
  revalidatePath('/my');
  return {error:'',mail:mailed};
}
export async function subscribeEmail(form:FormData){
  const beta=await requireBeta();
  const result=await requestMail(beta.name,await savedOrDefaultSelection(),(await readInbox()).plan,String(form.get('email')||'')).catch(()=>'error' as const);
  redirect(`/my?mail=${result==='on'?'resumed':result}#delivery`);
}
export async function stopEmail(){
  await requireBeta();
  await stopMail();
  redirect('/my?mail=stopped#delivery');
}
export async function resumeEmail(){
  await requireBeta();
  const reader=await currentReader();
  if(reader?.email&&reader.email_confirmed_at)await admin().from('beta_readers').update({delivery_enabled:true,updated_at:new Date().toISOString()}).eq('id',reader.id);
  redirect('/my?mail=resumed#delivery');
}

// Make a fresh edition within the plan's allowance. The make form carries a "also by mail" choice:
// a confirmed address gets the edition at once; a new address gets a confirmation mail, and confirming sends this edition.
export async function generateEdition(form?:FormData){
  const beta=await requireBeta();
  const selection=await savedOrDefaultSelection();
  const store=await readInbox();
  if(generationsLeft(store)<=0)redirect(store.plan==='free'?'/pricing?from=limit':'/my?notice=limit');
  const edition=newEdition(selection,store);
  if(!edition.ids.length)redirect('/my?notice=empty');
  await writeInbox({...store,trial:true,issues:[edition.stored,...store.issues]});
  // Without a form (older callers) the reader's saved mail setting decides.
  const wantMail=form?form.get('mail')==='on':true;
  let mailed='';
  try{
    if(wantMail&&mailReady()){
      const typed=String(form?.get('email')||'');
      const request=form?await requestMail(beta.name,selection,store.plan,typed):null;
      const reader=await currentReader();
      if((request==='on'||(!form&&reader?.delivery_enabled))&&await mailEdition(reader,beta.name,selection,edition.ids,edition.key))mailed='?mail=sent';
      else if(request&&request!=='on')mailed=`?mail=${request}`;
    }else if(wantMail&&form)mailed='?mail=unavailable';
  }catch{mailed='?mail=error';}
  redirect(`/my/inbox/${edition.key}${mailed}`);
}
export async function mailThisEdition(key:string){
  const beta=await requireBeta();
  const selection=await savedOrDefaultSelection();
  const issue=inboxIssues(selection,await readInbox()).find(i=>i.key===key);
  if(!issue)redirect('/my/inbox');
  let result='unavailable';
  try{result=!mailReady()?'unavailable':await mailEdition(await currentReader(),beta.name,selection,issue.articleIds,key)?'sent':'need-email';}catch{result='error';}
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

// Personal settings: newsletter look and colour, article look and colour. Unknown values keep the current choice.
export async function saveLook(form:FormData){
  await requireBeta();
  const current=await savedOrDefaultSelection();
  const pick=<T extends string>(key:string,list:readonly (readonly [T,...string[]])[],fallback:T)=>{const v=String(form.get(key)||'');return (list.find(x=>x[0]===v)?.[0])??fallback;};
  const selection:NewsletterSelection={...current,theme:pick('theme',themes,current.theme),accent:pick('accent',accents,current.accent),articleStyle:pick('articleStyle',articleStyles,current.articleStyle),articleAccent:pick('articleAccent',accents,current.articleAccent)};
  (await cookies()).set(DRAFT_COOKIE,selectionQuery(selection),draftCookie);
  const reader=deliveryConfigured()?await currentReader():null;
  if(reader)await saveReaderSelection(reader.id,selection);
  revalidatePath('/','layout');
  redirect('/my/settings?saved=1');
}
