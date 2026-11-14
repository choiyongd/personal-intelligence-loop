import 'server-only';
import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {draftSelection} from '@/lib/beta';
import {getLocale} from '@/lib/locale';
import {pushConfigured,removeSubscription,sameOrigin,saveSubscription,subscriptionSchema} from '@/lib/push';

export const dynamic='force-dynamic';

async function body(req:NextRequest){try{return await req.json();}catch{return null;}}

// Turn on (or refresh) notices for this browser. The reader's chosen fields decide which stories it hears about.
export async function POST(req:NextRequest){
  if(!sameOrigin(req))return NextResponse.json({error:'forbidden'},{status:403});
  if(!pushConfigured())return NextResponse.json({error:'push-not-configured'},{status:503});
  const parsed=subscriptionSchema.safeParse(await body(req));
  if(!parsed.success)return NextResponse.json({error:'bad-subscription'},{status:400});
  const [selection,locale]=await Promise.all([draftSelection(),getLocale()]);
  try{
    await saveSubscription(parsed.data,locale==='en'?'en':'ko',(selection?.industries||[]) as string[]);
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'save-failed'},{status:500});}
}
export async function DELETE(req:NextRequest){
  if(!sameOrigin(req))return NextResponse.json({error:'forbidden'},{status:403});
  if(!pushConfigured())return NextResponse.json({error:'push-not-configured'},{status:503});
  const parsed=z.object({endpoint:z.string().min(20).max(1000)}).safeParse(await body(req));
  if(!parsed.success)return NextResponse.json({error:'bad-request'},{status:400});
  try{await removeSubscription(parsed.data.endpoint);return NextResponse.json({ok:true});}
  catch{return NextResponse.json({error:'delete-failed'},{status:500});}
}
