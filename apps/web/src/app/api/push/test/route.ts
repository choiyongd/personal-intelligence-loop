import 'server-only';
import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {getLocale} from '@/lib/locale';
import {pushConfigured,sameOrigin,sendTest} from '@/lib/push';

export const dynamic='force-dynamic';

// Sends one sample notice to the calling browser, so a reader can see that notices arrive.
export async function POST(req:NextRequest){
  if(!sameOrigin(req))return NextResponse.json({error:'forbidden'},{status:403});
  if(!pushConfigured())return NextResponse.json({error:'push-not-configured'},{status:503});
  let raw:unknown=null;try{raw=await req.json();}catch{}
  const parsed=z.object({endpoint:z.string().min(20).max(1000)}).safeParse(raw);
  if(!parsed.success)return NextResponse.json({error:'bad-request'},{status:400});
  try{
    const result=await sendTest(parsed.data.endpoint,(await getLocale())==='en'?'en':'ko');
    return NextResponse.json({result},{status:result==='sent'?200:result==='wait'?429:result==='not-found'?404:502});
  }catch{return NextResponse.json({error:'send-failed'},{status:500});}
}
