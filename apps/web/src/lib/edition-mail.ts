import 'server-only';
import {z} from 'zod';
import {admin,currentReader,deliveryConfigured,ensureReader,hash,newToken,type Reader} from './beta-store';
import {mailConfigured,sendMail} from './mailer';
import {renderConfirmEmail,renderIssueEmail} from './issue-email';
import {articleById,hotFor,type Article} from './articles';
import {unsubscribeUrl} from './dispatch';
import {scheduleLabel,type NewsletterSelection,type Plan} from './newsletter';
import {appOrigin} from './env';
import {intlLocale} from './i18n';

export const mailReady=()=>deliveryConfigured()&&mailConfigured();
export type MailState={available:boolean;email:string;confirmed:boolean;enabled:boolean};
export async function mailState():Promise<MailState>{
  if(!mailReady())return {available:false,email:'',confirmed:false,enabled:false};
  const reader=await currentReader().catch(()=>null);
  return {available:true,email:reader?.email||'',confirmed:Boolean(reader?.email&&reader.email_confirmed_at),enabled:Boolean(reader?.delivery_enabled)};
}
const emailSchema=z.email().max(254);
export type MailRequest='on'|'check'|'wait'|'bad-email'|'error'|'unavailable';
// Turn mail on for an address: an already-confirmed address is switched on at once, any other gets one confirmation mail.
// Server actions only (a new reader sets a cookie).
export async function requestMail(name:string,selection:NewsletterSelection,plan:Plan,rawEmail:string):Promise<MailRequest>{
  if(!mailReady())return 'unavailable';
  const reader=await ensureReader(name,selection);
  const typed=rawEmail.trim().toLowerCase();
  const email=typed||reader.email||'';
  if(reader.email_confirmed_at&&reader.email===email){
    if(!reader.delivery_enabled)await admin().from('beta_readers').update({delivery_enabled:true,updated_at:new Date().toISOString()}).eq('id',reader.id);
    return 'on';
  }
  const parsed=emailSchema.safeParse(email);
  if(!parsed.success)return 'bad-email';
  // One confirmation mail per minute per reader keeps the form from being used to flood an inbox.
  if(reader.confirm_sent_at&&Date.now()-new Date(reader.confirm_sent_at).getTime()<60_000)return reader.email===parsed.data?'check':'wait';
  const token=newToken();
  const {error}=await admin().from('beta_readers').update({email:parsed.data,email_confirmed_at:null,delivery_enabled:false,confirm_token_hash:hash(token),confirm_sent_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',reader.id);
  if(error)return 'error';
  const promise=selection.lang==='en'
    ?(plan==='subscriber'?`new issues (${scheduleLabel(selection)}) and every edition you make yourself`:'every edition you make yourself')
    :(plan==='subscriber'?`${scheduleLabel(selection)}에 새 호를, 직접 만든 호는 만들 때마다`:'직접 만든 뉴스레터를 만들 때마다');
  try{await sendMail({to:parsed.data,...renderConfirmEmail({name,promise,lang:selection.lang,confirmUrl:`${appOrigin()}/api/beta/confirm?r=${reader.id}&t=${token}`})});}catch{return 'error';}
  return 'check';
}
export async function stopMail(){
  if(!mailReady())return;
  const reader=await currentReader();
  if(reader?.delivery_enabled)await admin().from('beta_readers').update({delivery_enabled:false,updated_at:new Date().toISOString()}).eq('id',reader.id);
}
// Mail one edition to the reader's confirmed address. Returns false when there is no confirmed address or mail is not set up.
export async function mailEdition(reader:Reader|null,name:string,selection:NewsletterSelection,ids:string[],key:string){
  if(!mailReady()||!reader?.email||!reader.email_confirmed_at)return false;
  const articles=ids.map(articleById).filter((a):a is Article=>Boolean(a));
  if(!articles.length)return false;
  const origin=appOrigin(),unsub=unsubscribeUrl(reader);
  const mail=renderIssueEmail({selection,articles,hotIds:hotFor(selection,ids).map(h=>h.id),origin,readerName:name,unsubscribeUrl:unsub,archiveUrl:`${origin}/my/inbox/${key}`,
    dateLabel:new Intl.DateTimeFormat(intlLocale(selection.lang),{timeZone:selection.tz,year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date())});
  await sendMail({to:reader.email,...mail,headers:{'List-Unsubscribe':`<${unsub}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}});
  return true;
}
