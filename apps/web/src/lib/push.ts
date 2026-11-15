import 'server-only';
import webpush from 'web-push';
import {z} from 'zod';
import {admin,deliveryConfigured} from './beta-store';
import {kstNow} from './kst';
import {noticeFor,type PushMessage} from './push-notice';

// Web push needs a VAPID key pair (generate once: `npx web-push generate-vapid-keys`) and the server store.
const publicKey=()=>process.env.VAPID_PUBLIC_KEY||'';
const privateKey=()=>process.env.VAPID_PRIVATE_KEY||'';
export function pushConfigured(){return Boolean(deliveryConfigured()&&publicKey()&&privateKey());}
export function vapidPublicKey(){return pushConfigured()?publicKey():'';}
// Push services want a contact: a mailto: or https: address. Apple rejects localhost.
function subject(){
  const explicit=process.env.VAPID_SUBJECT||'';
  if(/^(mailto:|https:\/\/)/.test(explicit))return explicit;
  const contact=process.env.OPERATOR_CONTACT||'';
  if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact))return `mailto:${contact}`;
  const origin=process.env.APP_ORIGIN||'';
  if(origin.startsWith('https://'))return origin;
  if(process.env.VERCEL_PROJECT_PRODUCTION_URL)return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'mailto:push@loop.invalid';
}
// Only this site's own pages may turn notices on or off for a browser.
export function sameOrigin(req:Request){
  const origin=req.headers.get('origin'),host=req.headers.get('x-forwarded-host')||req.headers.get('host');
  if(!origin||!host)return false;
  try{return new URL(origin).host===host;}catch{return false;}
}
let ready=false;
function setup(){if(!ready){webpush.setVapidDetails(subject(),publicKey(),privateKey());ready=true;}}

export const subscriptionSchema=z.object({
  endpoint:z.url().max(1000).refine(u=>u.startsWith('https://'),'https only'),
  keys:z.object({p256dh:z.string().min(40).max(200),auth:z.string().min(10).max(100)}),
});
export type BrowserSubscription=z.infer<typeof subscriptionSchema>;

export async function saveSubscription(sub:BrowserSubscription,locale:'ko'|'en',industries:string[]){
  const {error}=await admin().from('push_subscriptions').upsert({
    endpoint:sub.endpoint,p256dh:sub.keys.p256dh,auth:sub.keys.auth,locale,industries:industries.slice(0,30),last_seen_at:new Date().toISOString(),failures:0,
  },{onConflict:'endpoint'});
  if(error)throw new Error('알림 신청을 저장하지 못했습니다.');
}
export async function removeSubscription(endpoint:string){
  const {error}=await admin().from('push_subscriptions').delete().eq('endpoint',endpoint);
  if(error)throw new Error('알림 신청을 지우지 못했습니다.');
}

type Row={id:number;endpoint:string;p256dh:string;auth:string;locale:string;industries:string[];failures:number};
type SendResult='sent'|'gone'|'failed';
async function sendTo(row:Row,msg:PushMessage):Promise<SendResult>{
  setup();
  try{
    await webpush.sendNotification({endpoint:row.endpoint,keys:{p256dh:row.p256dh,auth:row.auth}},JSON.stringify(msg),{TTL:60*60*12,urgency:'normal',topic:msg.tag.replace(/[^A-Za-z0-9_-]/g,'').slice(0,32)});
    return 'sent';
  }catch(e){
    const status=(e as {statusCode?:number}).statusCode;
    // 404/410: the browser dropped the subscription (notices turned off, app removed). 403: the key pair changed.
    return status===404||status===410||status===403?'gone':'failed';
  }
}
async function record(row:Row,result:SendResult){
  if(result==='gone'||(result==='failed'&&row.failures+1>=5))await admin().from('push_subscriptions').delete().eq('id',row.id);
  else if(result==='failed')await admin().from('push_subscriptions').update({failures:row.failures+1}).eq('id',row.id);
  else await admin().from('push_subscriptions').update({failures:0,last_sent_at:new Date().toISOString()}).eq('id',row.id);
}

// A test notice to one browser that is already subscribed, at most once a minute.
export async function sendTest(endpoint:string,locale:'ko'|'en'){
  const {data,error}=await admin().from('push_subscriptions').select('id,endpoint,p256dh,auth,locale,industries,failures,last_test_at').eq('endpoint',endpoint).maybeSingle();
  if(error)throw new Error('알림 신청을 찾지 못했습니다.');
  if(!data)return 'not-found' as const;
  if(data.last_test_at&&Date.now()-Date.parse(data.last_test_at)<60_000)return 'wait' as const;
  await admin().from('push_subscriptions').update({last_test_at:new Date().toISOString()}).eq('id',data.id);
  const en=locale==='en';
  const result=await sendTo(data as Row,{title:en?'Notifications are on':'알림이 켜졌어요',body:en?'This is how a new-story notice will look.':'매일 아침 새 소식이 올라오면 이렇게 알려 드릴게요.',url:'/my',tag:'loop-test',lang:locale});
  await record(data as Row,result);
  return result;
}

type LiveRow={id:string;industry:string;article:{title?:unknown}|null};
// Once a day after the stories are written: tell each subscribed Korean reader how many new stories are in their fields.
export async function notifyNewStories(now=new Date()){
  const date=kstNow(now).date;
  if(!pushConfigured())return {date,skipped:'push-not-configured'};
  const {data:arts,error}=await admin().from('live_articles').select('id,industry,article').eq('issue_date',date).eq('status','published').order('published_at',{ascending:true});
  if(error)throw new Error(error.message);
  const stories=((arts||[]) as LiveRow[]).flatMap(a=>typeof a.article?.title==='string'?[{id:a.id,industry:a.industry,title:a.article.title}]:[]);
  if(!stories.length)return {date,skipped:'no-stories'};
  const claim=await admin().from('push_sends').insert({issue_date:date,articles:stories.length});
  if(claim.error){if(claim.error.code==='23505')return {date,skipped:'already-sent'};throw new Error(claim.error.message);}
  const stats={date,stories:stories.length,sent:0,skipped:0,removed:0,failed:0};
  let after=0;
  for(;;){
    const {data:rows,error:e}=await admin().from('push_subscriptions').select('id,endpoint,p256dh,auth,locale,industries,failures').eq('locale','ko').gt('id',after).order('id').limit(500);
    if(e)throw new Error(e.message);
    if(!rows?.length)break;
    after=rows[rows.length-1].id;
    for(let i=0;i<rows.length;i+=25){
      await Promise.all((rows.slice(i,i+25) as Row[]).map(async row=>{
        const msg=noticeFor(stories,row.industries||[],date);
        if(!msg){stats.skipped++;return;}
        const result=await sendTo(row,msg);
        await record(row,result);
        if(result==='sent')stats.sent++;else if(result==='gone')stats.removed++;else stats.failed++;
      }));
    }
    if(rows.length<500)break;
  }
  await admin().from('push_sends').update({finished_at:new Date().toISOString(),stats}).eq('issue_date',date);
  return stats;
}
