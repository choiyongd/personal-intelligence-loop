import {NextResponse,type NextRequest} from 'next/server';
import {cookies} from 'next/headers';
import {isLocale,LANG_COOKIE} from '@/lib/i18n';
import {DRAFT_COOKIE,draftSelection} from '@/lib/beta';
import {inLocale,selectionQuery} from '@/lib/newsletter';
import {currentReader,deliveryConfigured,saveReaderSelection} from '@/lib/beta-store';

export const dynamic='force-dynamic';
// The language switcher: remember the choice, carry the saved edition (and its mail) over to that language, and go back.
export async function GET(req:NextRequest){
  const to=req.nextUrl.searchParams.get('to');
  // Without an explicit target, return to the page the switcher was pressed on.
  const ref=(()=>{try{const u=new URL(req.headers.get('referer')||'');return u.host===req.nextUrl.host?u.pathname+u.search+u.hash:'';}catch{return '';}})();
  const raw=req.nextUrl.searchParams.get('next')||ref||'/';
  const next=raw.startsWith('/')&&!raw.startsWith('//')&&!raw.startsWith('/\\')?raw:'/';
  const res=NextResponse.redirect(new URL(next,req.nextUrl.origin),303);
  if(!isLocale(to))return res;
  const jar=await cookies();
  res.cookies.set(LANG_COOKIE,to,{path:'/',maxAge:60*60*24*365,sameSite:'lax',secure:process.env.VERCEL==='1'});
  const draft=await draftSelection();
  if(draft&&draft.lang!==to){
    const moved=inLocale(draft,to);
    res.cookies.set(DRAFT_COOKIE,selectionQuery(moved),{path:'/',maxAge:60*60*24*90,sameSite:'lax',httpOnly:false,secure:process.env.VERCEL==='1'});
    try{const reader=deliveryConfigured()&&jar.get('pil_reader')?await currentReader():null;if(reader)await saveReaderSelection(reader.id,moved);}catch{/* the cookie copy is enough to continue */}
  }
  return res;
}
