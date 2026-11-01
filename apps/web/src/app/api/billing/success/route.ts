import {NextResponse,type NextRequest} from 'next/server';
import {currentReader} from '@/lib/beta-store';
import {billingConfigured,startSubscription} from '@/lib/billing';
import {appOrigin} from '@/lib/env';

export const dynamic='force-dynamic';
export const maxDuration=120;
// Toss redirects here after the reader registers a card: ?customerKey=…&authKey=…
export async function GET(req:NextRequest){
  const go=(path:string)=>NextResponse.redirect(new URL(path,appOrigin()),303);
  if(!billingConfigured())return go('/pricing');
  const reader=await currentReader().catch(()=>null);
  if(!reader)return go('/billing?error=signin');
  const authKey=req.nextUrl.searchParams.get('authKey')||'',customerKey=req.nextUrl.searchParams.get('customerKey')||'';
  if(!authKey||authKey.length>300)return go('/billing?error=card-failed');
  const result=await startSubscription(reader,authKey,customerKey).catch(()=>'payment-failed' as const);
  return go(result==='started'||result==='card-updated'?`/my/billing?state=${result}`:`/billing?error=${result}`);
}
