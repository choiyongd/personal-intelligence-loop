import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {admin,deliveryConfigured,hash} from '@/lib/beta-store';
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
  return back(error?'error':'confirmed');
}
