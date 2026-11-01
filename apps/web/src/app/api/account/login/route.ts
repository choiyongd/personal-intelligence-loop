import {NextResponse,type NextRequest} from 'next/server';
import {consumeLoginLink} from '@/lib/account';
import {appOrigin} from '@/lib/env';

export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  const ok=await consumeLoginLink(req.nextUrl.searchParams.get('r')||'',req.nextUrl.searchParams.get('t')||'').catch(()=>false);
  return NextResponse.redirect(new URL(ok?'/my?signed-in=1':'/login?login=expired#mail-login',appOrigin()),303);
}
