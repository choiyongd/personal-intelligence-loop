import {NextResponse,type NextRequest} from 'next/server';
import {appOrigin} from '@/lib/env';
import {isPaidPlanId} from '@/lib/billing-plans';

export const dynamic='force-dynamic';
// Toss redirects here when card registration is cancelled or refused: ?code=…&message=…
export async function GET(req:NextRequest){
  const code=(req.nextUrl.searchParams.get('code')||'').replace(/[^A-Z_]/g,'').slice(0,60);
  const plan=req.nextUrl.searchParams.get('plan');
  return NextResponse.redirect(new URL(`/billing?${isPaidPlanId(plan)?`plan=${plan}&`:''}error=${code==='PAY_PROCESS_CANCELED'?'canceled':'card-failed'}`,appOrigin()),303);
}
