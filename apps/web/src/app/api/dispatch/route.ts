import {timingSafeEqual} from 'node:crypto';
import {NextResponse,type NextRequest} from 'next/server';
import {deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {dispatchDue} from '@/lib/dispatch';
import {renewDue} from '@/lib/billing';

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
  // Renewals first, so a reader whose subscription just ended gets no more scheduled mail.
  const billing=await renewDue().catch(e=>({error:(e instanceof Error?e.message:String(e)).slice(0,200)}));
  return NextResponse.json({...await dispatchDue(),billing});
}
export const GET=run,POST=run;
