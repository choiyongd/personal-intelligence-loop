import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {admin,deliveryConfigured,hash,readerById} from '@/lib/beta-store';
import {betaReader,savedOrDefaultSelection} from '@/lib/beta';
import {inboxIssues,readInbox} from '@/lib/inbox';
import {mailEdition} from '@/lib/edition-mail';
import {appOrigin} from '@/lib/env';

export const dynamic='force-dynamic';
const CONFIRM_TTL_MS=1000*60*60*48;
export async function GET(req:NextRequest){
  // Redirect to the configured origin: behind a proxy req.url may carry a different host than the reader's cookies.
  const back=(state:string)=>NextResponse.redirect(new URL(`/my?mail=${state}#delivery`,appOrigin()),303);
  const id=req.nextUrl.searchParams.get('r')||'',token=req.nextUrl.searchParams.get('t')||'';
  if(!deliveryConfigured()||!z.uuid().safeParse(id).success||token.length<20)return back('invalid');
  const {data}=await admin().from('beta_readers').select('confirm_token_hash,confirm_sent_at').eq('id',id).maybeSingle();
  if(!data?.confirm_token_hash||data.confirm_token_hash!==hash(token))return back('invalid');
  if(!data.confirm_sent_at||Date.now()-new Date(data.confirm_sent_at).getTime()>CONFIRM_TTL_MS)return back('expired');
  const {error}=await admin().from('beta_readers').update({email_confirmed_at:new Date().toISOString(),delivery_enabled:true,confirm_token_hash:null,updated_at:new Date().toISOString()}).eq('id',id);
  if(error)return back('error');
  // An edition made while the address was waiting for confirmation is sent now, so asking for mail while making it is enough.
  try{
    const reader=await readerById(id),selection=await savedOrDefaultSelection();
    const pending=inboxIssues(selection,await readInbox()).find(i=>i.kind==='manual'&&Date.now()-i.at<CONFIRM_TTL_MS);
    if(reader&&pending&&await mailEdition(reader,(await betaReader())?.name||reader.name,selection,pending.articleIds,pending.key))return back('confirmed-sent');
  }catch{/* the address is confirmed either way */}
  return back('confirmed');
}
