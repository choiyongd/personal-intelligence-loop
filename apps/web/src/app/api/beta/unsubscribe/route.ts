import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {admin,deliveryConfigured} from '@/lib/beta-store';
import {newsletterSelectionSchema} from '@/lib/newsletter';

export const dynamic='force-dynamic';
// GET from the footer link, POST from mail clients' one-click unsubscribe. Both only ever turn delivery off.
async function stop(req:NextRequest){
  const id=req.nextUrl.searchParams.get('r')||'',token=req.nextUrl.searchParams.get('t')||'';
  let ok=false,en=false;
  if(deliveryConfigured()&&z.uuid().safeParse(id).success&&token.length>=32){
    const {data}=await admin().from('beta_readers').update({delivery_enabled:false,updated_at:new Date().toISOString()}).eq('id',id).eq('unsubscribe_token',token).select('id,selection');
    ok=Boolean(data?.length);
    en=newsletterSelectionSchema.safeParse(data?.[0]?.selection).data?.lang==='en';
  }
  en||=!ok&&(req.headers.get('accept-language')||'').toLowerCase().startsWith('en');
  if(req.method==='POST')return new NextResponse(null,{status:ok?200:400});
  const body=`<!doctype html><html lang="${en?'en':'ko'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${en?'Unsubscribe':'수신 거부'}</title><body style="margin:0;background:#0e2846;color:#fff;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px"><div><p style="font-size:28px;font-family:Georgia,serif">loop.</p><p style="font-size:18px">${en?(ok?'You are unsubscribed. We will not send you any more newsletter emails.':'This link is not valid or was already used.'):(ok?'메일 수신을 멈췄습니다. 더 이상 뉴스레터 메일을 보내지 않습니다.':'링크가 올바르지 않거나 이미 처리되었습니다.')}</p><p><a href="/my" style="color:#a9c6e6">${en?'Back to my newsletter':'나의 뉴스레터로'}</a></p></div></body></html>`;
  return new NextResponse(body,{status:ok?200:400,headers:{'content-type':'text/html; charset=utf-8'}});
}
export const GET=stop,POST=stop;
