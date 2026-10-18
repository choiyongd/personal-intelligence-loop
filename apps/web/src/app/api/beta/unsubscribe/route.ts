import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {admin,deliveryConfigured} from '@/lib/beta-store';

export const dynamic='force-dynamic';
// GET from the footer link, POST from mail clients' one-click unsubscribe. Both only ever turn delivery off.
async function stop(req:NextRequest){
  const id=req.nextUrl.searchParams.get('r')||'',token=req.nextUrl.searchParams.get('t')||'';
  let ok=false;
  if(deliveryConfigured()&&z.uuid().safeParse(id).success&&token.length>=32){
    const {data}=await admin().from('beta_readers').update({delivery_enabled:false,updated_at:new Date().toISOString()}).eq('id',id).eq('unsubscribe_token',token).select('id');
    ok=Boolean(data?.length);
  }
  if(req.method==='POST')return new NextResponse(null,{status:ok?200:400});
  const body=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>수신 거부</title><body style="margin:0;background:#0e2846;color:#fff;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px"><div><p style="font-size:28px;font-family:Georgia,serif">loop.</p><p style="font-size:18px">${ok?'메일 수신을 멈췄습니다. 더 이상 뉴스레터 메일을 보내지 않습니다.':'링크가 올바르지 않거나 이미 처리되었습니다.'}</p><p><a href="/my" style="color:#a9c6e6">나의 뉴스레터로</a></p></div></body></html>`;
  return new NextResponse(body,{status:ok?200:400,headers:{'content-type':'text/html; charset=utf-8'}});
}
export const GET=stop,POST=stop;
