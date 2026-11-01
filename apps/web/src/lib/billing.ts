import 'server-only';
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import {admin,deliveryConfigured,readerById,type Reader} from './beta-store';
import {mailConfigured,sendMail} from './mailer';
import {appOrigin} from './env';
import {operatorLine} from './operator';
import {plans} from './newsletter';

// Monthly card billing through Toss Payments (자동결제). Toss has no scheduler, so the hourly dispatch run renews due
// subscriptions. Test keys (test_ck_/test_sk_) charge nothing; live keys need Toss's billing contract.
// TOSS_API_BASE exists only so tests can point at a fake Toss server.
const TOSS_API=process.env.TOSS_API_BASE||'https://api.tosspayments.com';
export const PRICE=plans.subscriber.price;
const RETRY_DAYS=[1,2,3]; // after a failed renewal, try again 1, 2 and 3 days later, then end the subscription

function encKey(){const raw=process.env.BILLING_ENCRYPTION_KEY||'';const key=Buffer.from(raw,'base64');return key.length===32?key:null;}
// Paid plans switch on only with BILLING_ENABLED=true, so keys can sit in Production while the free beta runs
// (set it on Preview alone to try test payments there).
export function billingConfigured(){return Boolean(process.env.BILLING_ENABLED==='true'&&deliveryConfigured()&&process.env.TOSS_CLIENT_KEY&&process.env.TOSS_SECRET_KEY&&encKey());}
export const billingTestMode=()=>(process.env.TOSS_SECRET_KEY||'').startsWith('test_');
export const tossClientKey=()=>process.env.TOSS_CLIENT_KEY||'';
// Unguessable enough for Toss's rule (22–50 chars with a special character) and stable per reader.
export const customerKeyFor=(readerId:string)=>`pil_${readerId}`;

function seal(plain:string){
  const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',encKey()!,iv);
  const body=Buffer.concat([c.update(plain,'utf8'),c.final()]);
  return [iv,c.getAuthTag(),body].map(b=>b.toString('base64url')).join('.');
}
function open(sealed:string){
  const [iv,tag,body]=sealed.split('.').map(s=>Buffer.from(s,'base64url'));
  const d=createDecipheriv('aes-256-gcm',encKey()!,iv);d.setAuthTag(tag);
  return Buffer.concat([d.update(body),d.final()]).toString('utf8');
}

export class TossError extends Error{constructor(public code:string,message:string){super(message);}}
async function toss<T>(path:string,body:unknown,idempotencyKey?:string):Promise<T>{
  const auth=Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64');
  const res=await fetch(TOSS_API+path,{method:'POST',signal:AbortSignal.timeout(65_000),
    headers:{authorization:`Basic ${auth}`,'content-type':'application/json',...(idempotencyKey?{'idempotency-key':idempotencyKey}:{})},body:JSON.stringify(body)});
  const json=await res.json().catch(()=>({}));
  if(!res.ok)throw new TossError(String(json.code||res.status),String(json.message||'결제 요청이 실패했습니다.').slice(0,200));
  return json as T;
}
type TossBilling={billingKey:string;customerKey:string;card?:{number?:string;issuerCode?:string;cardType?:string}};
type TossPayment={paymentKey:string;orderId:string;status:string;approvedAt?:string;receipt?:{url?:string}};

export type Subscription={reader_id:string;customer_key:string;billing_key_enc:string|null;card_label:string|null;status:'active'|'past_due'|'canceled'|'ended';amount:number;
  started_at:string;current_period_end:string;cancel_at_period_end:boolean;failed_attempts:number;next_attempt_at:string|null};
export type Payment={id:string;order_id:string;amount:number;status:'pending'|'paid'|'failed'|'refunded';receipt_url:string|null;failure:string|null;period_start:string;period_end:string;created_at:string;approved_at:string|null};

export async function subscriptionFor(readerId:string):Promise<Subscription|null>{
  const {data}=await admin().from('billing_subscriptions').select('*').eq('reader_id',readerId).maybeSingle();
  return data as Subscription|null;
}
export async function paymentsFor(readerId:string):Promise<Payment[]>{
  const {data}=await admin().from('billing_payments').select('id,order_id,amount,status,receipt_url,failure,period_start,period_end,created_at,approved_at').eq('reader_id',readerId).order('created_at',{ascending:false}).limit(24);
  return (data||[]) as Payment[];
}
// Paid through the current period (a renewal being retried keeps access until the last retry fails).
export function subscriptionActive(sub:Subscription|null,now=new Date()){
  return Boolean(sub&&sub.status!=='ended'&&(new Date(sub.current_period_end)>now||sub.status==='past_due'));
}

function addMonth(d:Date){
  const out=new Date(d),day=out.getUTCDate();
  out.setUTCDate(1);out.setUTCMonth(out.getUTCMonth()+1);
  const last=new Date(Date.UTC(out.getUTCFullYear(),out.getUTCMonth()+1,0)).getUTCDate();
  out.setUTCDate(Math.min(day,last));
  return out;
}
const kstDay=(d:Date)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric'}).format(d);
const compactDay=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(d).replaceAll('-','');

// One charge for one period. The payment row (unique order id per period and attempt) is written first,
// so overlapping runs cannot charge the same period twice.
async function charge(reader:Pick<Reader,'id'|'name'|'email'>,sub:Pick<Subscription,'customer_key'|'billing_key_enc'|'amount'|'failed_attempts'>,periodStart:Date,suffix=String(sub.failed_attempts+1)){
  const periodEnd=addMonth(periodStart);
  const orderId=`pil-${reader.id.slice(0,8)}-${compactDay(periodStart)}-${suffix}`;
  const claim=await admin().from('billing_payments').insert({reader_id:reader.id,order_id:orderId,amount:sub.amount,status:'pending',period_start:periodStart.toISOString(),period_end:periodEnd.toISOString()}).select('id').single();
  if(claim.error)return {ok:false as const,skipped:true,periodEnd,error:'already-claimed'};
  try{
    if(!sub.billing_key_enc)throw new TossError('NO_CARD','등록된 카드가 없습니다.');
    const pay=await toss<TossPayment>(`/v1/billing/${encodeURIComponent(open(sub.billing_key_enc))}`,
      {customerKey:sub.customer_key,amount:sub.amount,orderId,orderName:`loop. 구독 (${kstDay(periodStart)}부터 1개월)`,customerEmail:reader.email||undefined,customerName:reader.name},orderId);
    if(pay.status!=='DONE')throw new TossError(pay.status,'결제가 승인되지 않았습니다.');
    await admin().from('billing_payments').update({status:'paid',payment_key:pay.paymentKey,receipt_url:pay.receipt?.url||null,approved_at:pay.approvedAt||new Date().toISOString()}).eq('id',claim.data.id);
    return {ok:true as const,skipped:false,periodEnd,receipt:pay.receipt?.url||null};
  }catch(e){
    const msg=(e instanceof TossError?`${e.code}: ${e.message}`:e instanceof Error?e.message:String(e)).slice(0,300);
    await admin().from('billing_payments').update({status:'failed',failure:msg}).eq('id',claim.data.id);
    return {ok:false as const,skipped:false,periodEnd,error:msg};
  }
}

async function notify(to:string|null,subject:string,lines:string[]){
  if(!to||!mailConfigured())return;
  const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  const all=[...lines,'',`구독 관리: ${appOrigin()}/my/billing`,operatorLine()];
  await sendMail({to,subject,text:all.join('\n'),html:`<!doctype html><html lang="ko"><body style="margin:0;background:#e9e5dd;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:6px"><tr><td style="background:#1c1b19;padding:22px 26px;font-size:26px;color:#fff">loop.</td></tr><tr><td style="padding:26px;font-size:15px;line-height:1.8;color:#1c1b19">${lines.map(esc).join('<br>')}<br><br><a href="${appOrigin()}/my/billing" style="color:#ee6f3c">구독 관리</a><br><span style="font-size:12px;color:#6e6a63">${esc(operatorLine())}</span></td></tr></table></td></tr></table></body></html>`}).catch(()=>{});
}
const won=(n:number)=>`${n.toLocaleString('ko-KR')}원`;

async function setPlan(readerId:string,plan:'free'|'subscriber'){
  await admin().from('beta_readers').update({plan,updated_at:new Date().toISOString()}).eq('id',readerId);
}

export type StartResult='started'|'card-updated'|'not-allowed'|'card-failed'|'payment-failed';
// Called from the Toss success redirect: turn the card authorisation into a billing key and charge the first month.
export async function startSubscription(reader:Reader,authKey:string,customerKey:string):Promise<StartResult>{
  if(customerKey!==customerKeyFor(reader.id)||!reader.email||!reader.email_confirmed_at)return 'not-allowed';
  const existing=await subscriptionFor(reader.id);
  let issued:TossBilling;
  try{issued=await toss<TossBilling>('/v1/billing/authorizations/issue',{authKey,customerKey});}catch{return 'card-failed';}
  const cardLabel=[issued.card?.cardType,issued.card?.number].filter(Boolean).join(' ').slice(0,60)||null;
  const now=new Date();
  // Inside a paid month (a card change, or coming back after cancelling) only the card is replaced and renewal goes on.
  // A renewal that was failing is retried with the new card on the next hourly run; the attempt count keeps order ids unique.
  if(existing&&subscriptionActive(existing)){
    await admin().from('billing_subscriptions').update({billing_key_enc:seal(issued.billingKey),card_label:cardLabel,status:existing.status==='past_due'?'past_due':'active',cancel_at_period_end:false,next_attempt_at:null,updated_at:now.toISOString()}).eq('reader_id',reader.id);
    await setPlan(reader.id,'subscriber');
    return 'card-updated';
  }
  const row={reader_id:reader.id,customer_key:customerKey,billing_key_enc:seal(issued.billingKey),card_label:cardLabel,status:'active' as const,amount:PRICE,
    started_at:now.toISOString(),current_period_end:now.toISOString(),cancel_at_period_end:false,failed_attempts:0,next_attempt_at:null,updated_at:now.toISOString()};
  const saved=await admin().from('billing_subscriptions').upsert(row,{onConflict:'reader_id'});
  if(saved.error)return 'payment-failed';
  const result=await charge(reader,row,now,`s${now.getTime().toString(36)}`);
  if(!result.ok){
    await admin().from('billing_subscriptions').update({status:'ended',billing_key_enc:null,updated_at:new Date().toISOString()}).eq('reader_id',reader.id);
    return 'payment-failed';
  }
  await admin().from('billing_subscriptions').update({current_period_end:result.periodEnd.toISOString(),updated_at:new Date().toISOString()}).eq('reader_id',reader.id);
  await setPlan(reader.id,'subscriber');
  await notify(reader.email,'[loop.] 구독 결제가 완료됐어요',[`${reader.name}님, loop. 구독을 시작했어요.`,`결제 금액 ${won(PRICE)} · 다음 결제일 ${kstDay(result.periodEnd)}`,...(result.receipt?[`영수증: ${result.receipt}`]:[]),'해지는 구독 관리 화면에서 언제든 할 수 있고, 남은 기간까지 계속 받아 보실 수 있어요.']);
  return 'started';
}

// Stop renewing; access continues until the paid period ends.
export async function cancelSubscription(readerId:string){
  await admin().from('billing_subscriptions').update({cancel_at_period_end:true,status:'canceled',updated_at:new Date().toISOString()}).eq('reader_id',readerId).in('status',['active','past_due']);
}
export async function resumeSubscription(readerId:string){
  const sub=await subscriptionFor(readerId);
  if(!sub||sub.status!=='canceled'||new Date(sub.current_period_end)<=new Date()||!sub.billing_key_enc)return false;
  await admin().from('billing_subscriptions').update({cancel_at_period_end:false,status:'active',updated_at:new Date().toISOString()}).eq('reader_id',readerId);
  return true;
}

// Hourly: end cancelled subscriptions whose month is over and charge the ones due for renewal.
export async function renewDue(now=new Date()){
  const summary={renewed:0,failed:0,ended:0};
  if(!billingConfigured())return summary;
  const {data}=await admin().from('billing_subscriptions').select('*').in('status',['active','past_due','canceled']).lte('current_period_end',now.toISOString()).limit(200);
  for(const sub of (data||[]) as Subscription[]){
    const reader=await readerById(sub.reader_id);
    if(!reader)continue;
    if(sub.status==='canceled'||sub.cancel_at_period_end){
      await admin().from('billing_subscriptions').update({status:'ended',billing_key_enc:null,updated_at:now.toISOString()}).eq('reader_id',sub.reader_id);
      await setPlan(sub.reader_id,'free');summary.ended++;continue;
    }
    if(sub.next_attempt_at&&new Date(sub.next_attempt_at)>now)continue;
    const result=await charge(reader,sub,new Date(sub.current_period_end));
    if(result.skipped)continue;
    if(result.ok){
      await admin().from('billing_subscriptions').update({status:'active',current_period_end:result.periodEnd.toISOString(),failed_attempts:0,next_attempt_at:null,updated_at:new Date().toISOString()}).eq('reader_id',sub.reader_id);
      await notify(reader.email,'[loop.] 이번 달 구독료가 결제됐어요',[`${reader.name}님, ${won(sub.amount)}이 결제됐어요.`,`다음 결제일 ${kstDay(result.periodEnd)}`,...(result.receipt?[`영수증: ${result.receipt}`]:[])]);
      summary.renewed++;continue;
    }
    summary.failed++;
    const attempts=sub.failed_attempts+1;
    if(attempts>RETRY_DAYS.length){
      await admin().from('billing_subscriptions').update({status:'ended',billing_key_enc:null,failed_attempts:attempts,updated_at:now.toISOString()}).eq('reader_id',sub.reader_id);
      await setPlan(sub.reader_id,'free');summary.ended++;
      await notify(reader.email,'[loop.] 결제가 되지 않아 구독이 끝났어요',[`${reader.name}님, 여러 번 결제를 시도했지만 승인되지 않아 구독을 종료했어요.`,'다시 구독하려면 요금제 화면에서 카드를 새로 등록해 주세요.']);
      continue;
    }
    const next=new Date(now.getTime()+RETRY_DAYS[attempts-1]*86_400_000);
    await admin().from('billing_subscriptions').update({status:'past_due',failed_attempts:attempts,next_attempt_at:next.toISOString(),updated_at:now.toISOString()}).eq('reader_id',sub.reader_id);
    if(attempts===1)await notify(reader.email,'[loop.] 구독료 결제가 되지 않았어요',[`${reader.name}님, 등록된 카드로 ${won(sub.amount)} 결제가 승인되지 않았어요.`,`${kstDay(next)}에 다시 시도합니다. 카드를 바꾸려면 구독 관리 화면에서 새 카드를 등록해 주세요.`]);
  }
  return summary;
}
