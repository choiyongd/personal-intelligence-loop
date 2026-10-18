import {timingSafeEqual} from 'node:crypto';
import {NextResponse,type NextRequest} from 'next/server';
import {deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {dispatchDue} from '@/lib/dispatch';

export const dynamic='force-dynamic';
// Called hourly by the scheduler (GitHub Actions or Vercel Cron) with `Authorization: Bearer <CRON_SECRET>`.
function authorized(req:NextRequest){
  const secret=process.env.CRON_SECRET||'',given=req.headers.get('authorization')||'';
  const want=Buffer.from(`Bearer ${secret}`),got=Buffer.from(given);
  return secret.length>=16&&want.length===got.length&&timingSafeEqual(want,got);
}
async function run(req:NextRequest){
  if(!authorized(req))return NextResponse.json({error:'unauthorized'},{status:401});
  if(!deliveryConfigured()||!mailConfigured())return NextResponse.json({error:'delivery-not-configured'},{status:503});
  return NextResponse.json(await dispatchDue());
}
export const GET=run,POST=run;
