import 'server-only';
import {timingSafeEqual} from 'node:crypto';
import {NextResponse,type NextRequest} from 'next/server';
import {collect,liveConfigured,plan,write} from '@/lib/live/pipeline';
import {refreshLive} from '@/lib/live/registry';

export const dynamic='force-dynamic';
// Writing several stories with Claude takes minutes; the scheduler calls `write` again until nothing remains.
export const maxDuration=300;
// Run near Korea: the Korean government feeds are on the list.
export const preferredRegion='icn1';

// Called daily by the scheduler with `Authorization: Bearer <CRON_SECRET>` and ?step=collect|plan|write.
function authorized(req:NextRequest){
  const secret=process.env.CRON_SECRET||'';
  const want=Buffer.from(`Bearer ${secret}`),got=Buffer.from(req.headers.get('authorization')||'');
  return secret.length>=16&&want.length===got.length&&timingSafeEqual(want,got);
}
async function run(req:NextRequest){
  if(!authorized(req))return NextResponse.json({error:'unauthorized'},{status:401});
  if(!liveConfigured())return NextResponse.json({error:'live-not-configured',need:['SUPABASE_SECRET_KEY','ANTHROPIC_API_KEY']},{status:503});
  const step=req.nextUrl.searchParams.get('step');
  try{
    if(step==='collect')return NextResponse.json(await collect());
    if(step==='plan')return NextResponse.json(await plan());
    if(step==='write'){const out=await write();await refreshLive(true);return NextResponse.json(out);}
    return NextResponse.json({error:'unknown-step'},{status:400});
  }catch(e){
    return NextResponse.json({error:(e instanceof Error?e.message:String(e)).slice(0,300)},{status:500});
  }
}
export const POST=run;
