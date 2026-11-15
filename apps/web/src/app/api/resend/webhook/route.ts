import 'server-only';
import {NextResponse,type NextRequest} from 'next/server';
import {admin,deliveryConfigured} from '@/lib/beta-store';
import {verifySvix} from '@/lib/webhook-signature';

export const dynamic='force-dynamic';

// Resend > Webhooks posts here for each mail event. Only events for newsletter issues are kept
// (matched by the message id saved when the issue was sent); sign-in and confirmation mail are ignored.
const columns:Record<string,'delivered_at'|'opened_at'|'clicked_at'|'bounced_at'|'complained_at'>={
  'email.delivered':'delivered_at','email.opened':'opened_at','email.clicked':'clicked_at','email.bounced':'bounced_at','email.complained':'complained_at',
};
export async function POST(req:NextRequest){
  const secret=process.env.RESEND_WEBHOOK_SECRET||'';
  if(!secret||!deliveryConfigured())return NextResponse.json({error:'webhook-not-configured'},{status:503});
  const body=await req.text();
  const headers={id:req.headers.get('svix-id'),timestamp:req.headers.get('svix-timestamp'),signature:req.headers.get('svix-signature')};
  if(!verifySvix(secret,headers,body))return NextResponse.json({error:'bad-signature'},{status:401});
  let event:{type?:unknown;created_at?:unknown;data?:{email_id?:unknown}};
  try{event=JSON.parse(body);}catch{return NextResponse.json({error:'bad-json'},{status:400});}
  const type=typeof event.type==='string'?event.type:'',mailId=typeof event.data?.email_id==='string'?event.data.email_id:'';
  const column=columns[type];
  if(!column||!mailId)return NextResponse.json({ok:true,ignored:true});
  const at=typeof event.created_at==='string'&&!Number.isNaN(Date.parse(event.created_at))?new Date(event.created_at).toISOString():new Date().toISOString();
  const db=admin();
  // Record each event id once: Resend retries until it gets a 2xx, and a retry must not count a second open.
  const seen=await db.from('mail_events').insert({id:headers.id!.slice(0,100),mail_id:mailId.slice(0,100),type:type.slice(0,40)});
  if(seen.error?.code==='23505')return NextResponse.json({ok:true,duplicate:true});
  if(seen.error)return NextResponse.json({error:'save'},{status:500});
  const {data}=await db.from('beta_issues').select('id,open_count,delivered_at,opened_at,clicked_at,bounced_at,complained_at').eq('mail_id',mailId).maybeSingle();
  if(!data)return NextResponse.json({ok:true,unmatched:true});
  const row=data as unknown as Record<string,unknown>&{id:string;open_count:number};
  const patch:Record<string,unknown>={};
  if(!row[column])patch[column]=at; // keep the first time each thing happened
  if(type==='email.opened')patch.open_count=(row.open_count||0)+1;
  // A click means the mail was opened even when the client blocked the tracking image.
  if(type==='email.clicked'&&!row.opened_at)patch.opened_at=at;
  if(Object.keys(patch).length){
    const {error}=await db.from('beta_issues').update(patch).eq('id',row.id);
    // Forget the event id again so Resend's retry is applied instead of skipped as a duplicate.
    if(error){await db.from('mail_events').delete().eq('id',headers.id!.slice(0,100));return NextResponse.json({error:'save'},{status:500});}
  }
  return NextResponse.json({ok:true});
}
