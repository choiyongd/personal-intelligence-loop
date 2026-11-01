import 'server-only';
import {cookies} from 'next/headers';
import {z} from 'zod';
import {admin,deliveryConfigured,hash,newToken,readerById,signInAs} from './beta-store';
import {mailConfigured,sendMail} from './mailer';
import {appOrigin} from './env';
import {BETA_COOKIE,DRAFT_COOKIE} from './beta';
import {selectionQuery} from './newsletter';
import {operatorLine} from './operator';

// An account is a reader with a confirmed mail address. Signing in on another browser mails a one-time link
// to that address; nothing tells the asker whether the address is known.
const LINK_TTL_MS=1000*60*30;
const browserCookie={path:'/',maxAge:60*60*24*180,sameSite:'lax' as const,secure:process.env.VERCEL==='1'};
export const accountsReady=()=>deliveryConfigured()&&mailConfigured();

export type LoginRequest='sent'|'bad-email'|'wait'|'unavailable';
export async function requestLoginLink(raw:string):Promise<LoginRequest>{
  if(!accountsReady())return 'unavailable';
  const email=z.email().max(254).safeParse(raw.trim().toLowerCase());
  if(!email.success)return 'bad-email';
  // A paying reader wins over an older trial row made with the same address in another browser.
  const {data}=await admin().from('beta_readers').select('id,name,login_sent_at,plan,updated_at').eq('email',email.data).not('email_confirmed_at','is',null)
    .order('plan',{ascending:false}).order('updated_at',{ascending:false}).limit(1);
  const reader=data?.[0];
  if(!reader)return 'sent';
  if(reader.login_sent_at&&Date.now()-new Date(reader.login_sent_at).getTime()<60_000)return 'wait';
  const token=newToken();
  const {error}=await admin().from('beta_readers').update({login_token_hash:hash(token),login_sent_at:new Date().toISOString()}).eq('id',reader.id);
  if(error)return 'sent';
  const url=`${appOrigin()}/api/account/login?r=${reader.id}&t=${token}`;
  const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  await sendMail({to:email.data,subject:'[loop.] 로그인 링크',
    text:`${reader.name}님, 아래 링크를 30분 안에 열면 이 브라우저에서 loop.에 로그인됩니다.\n${url}\n직접 요청하지 않았다면 무시하세요.\n${operatorLine()}`,
    html:`<!doctype html><html lang="ko"><body style="margin:0;background:#e9e5dd;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:6px"><tr><td style="background:#1c1b19;padding:22px 26px;font-size:26px;color:#fff">loop.</td></tr><tr><td style="padding:26px;font-size:15px;line-height:1.7;color:#1c1b19">${esc(reader.name)}님, 아래 버튼을 30분 안에 누르면 이 브라우저에서 로그인됩니다.<br><br><a href="${url}" style="display:inline-block;background:#ee6f3c;color:#fff;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:4px">로그인하기</a><br><br><span style="font-size:12px;color:#6e6a63">직접 요청하지 않았다면 이 메일을 무시하세요. 링크는 한 번만 쓸 수 있습니다.<br>${esc(operatorLine())}</span></td></tr></table></td></tr></table></body></html>`}).catch(()=>{});
  return 'sent';
}

// Route handlers only. Consumes the link, gives this browser its own session, and restores the reader's name and interests.
export async function consumeLoginLink(id:string,token:string):Promise<boolean>{
  if(!deliveryConfigured()||!z.uuid().safeParse(id).success||token.length<20)return false;
  const {data}=await admin().from('beta_readers').select('login_token_hash,login_sent_at').eq('id',id).maybeSingle();
  if(!data?.login_token_hash||data.login_token_hash!==hash(token))return false;
  if(!data.login_sent_at||Date.now()-new Date(data.login_sent_at).getTime()>LINK_TTL_MS)return false;
  // Clear first so the link works once even if two clicks race.
  const cleared=await admin().from('beta_readers').update({login_token_hash:null}).eq('id',id).eq('login_token_hash',hash(token)).select('id');
  if(!cleared.data?.length)return false;
  const reader=await readerById(id);
  if(!reader)return false;
  await signInAs(id);
  const jar=await cookies();
  jar.set(BETA_COOKIE,encodeURIComponent(reader.name),{...browserCookie,httpOnly:true});
  jar.set(DRAFT_COOKIE,selectionQuery(reader.selectionParsed),{...browserCookie,httpOnly:false});
  return true;
}
