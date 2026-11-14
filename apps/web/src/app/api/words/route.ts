import 'server-only';
import {NextResponse,type NextRequest} from 'next/server';
import {admin,currentReader,deliveryConfigured} from '@/lib/beta-store';
import {cleanWord,cleanWords,LIMITS,MAX_WORDS,mergeWords,wordKey,type Word} from '@/lib/words';

export const dynamic='force-dynamic';
// The word book on the server, for readers with a server account (the pil_reader cookie). Everyone else keeps
// the book in their own browser only, and gets {sync:false}.
const off=()=>NextResponse.json({sync:false});
const columns='term,meaning,lang,article_id,article_title,seen_count,box,due_at,first_seen_at,last_seen_at,reviewed_at';
type Row={term:string;meaning:string;lang:string;article_id:string|null;article_title:string|null;seen_count:number;box:number;due_at:string;first_seen_at:string;last_seen_at:string;reviewed_at:string|null};
const ms=(t:string)=>new Date(t).getTime();
const iso=(n:number)=>new Date(n).toISOString();
const fromRow=(r:Row)=>cleanWord({term:r.term,meaning:r.meaning,lang:r.lang,articleId:r.article_id??undefined,articleTitle:r.article_title??undefined,seen:r.seen_count,box:r.box,dueAt:ms(r.due_at),firstAt:ms(r.first_seen_at),lastAt:ms(r.last_seen_at),reviewedAt:r.reviewed_at?ms(r.reviewed_at):undefined});
const toRow=(readerId:string,w:Word)=>({reader_id:readerId,term:w.term,meaning:w.meaning,lang:w.lang,article_id:w.articleId??null,article_title:w.articleTitle??null,seen_count:w.seen,box:w.box,due_at:iso(w.dueAt),first_seen_at:iso(w.firstAt),last_seen_at:iso(w.lastAt),reviewed_at:w.reviewedAt?iso(w.reviewedAt):null});

// Cookies are SameSite=Lax already; this also refuses writes a page on another site tries to send.
function sameOrigin(req:NextRequest){
  const origin=req.headers.get('origin');
  return !origin||origin===req.nextUrl.origin||origin===process.env.APP_ORIGIN;
}
async function reader(){
  if(!deliveryConfigured())return null;
  return currentReader().catch(()=>null);
}
async function serverWords(readerId:string):Promise<Word[]>{
  const {data,error}=await admin().from('reader_words').select(columns).eq('reader_id',readerId).order('last_seen_at',{ascending:false}).limit(MAX_WORDS);
  if(error)throw new Error('word-book-read');
  return (data as Row[]).map(fromRow).filter((w):w is Word=>Boolean(w));
}

export async function GET(){
  const r=await reader();if(!r)return off();
  try{return NextResponse.json({sync:true,words:await serverWords(r.id)},{headers:{'cache-control':'no-store'}});}
  catch{return NextResponse.json({sync:false,error:'unavailable'},{status:503});}
}

export async function POST(req:NextRequest){
  if(!sameOrigin(req))return NextResponse.json({error:'forbidden'},{status:403});
  const r=await reader();if(!r)return off();
  const body=await req.json().catch(()=>null) as {words?:unknown}|null;
  const raw=Array.isArray(body?.words)?body!.words.slice(0,MAX_WORDS):[];
  const incoming=cleanWords(raw);
  if(!incoming.length)return NextResponse.json({sync:true,saved:0});
  try{
    // Merge with what the server already has, so an older browser copy never rolls back a newer review.
    const existing=await serverWords(r.id);
    const keys=new Set(incoming.map(wordKey));
    const merged=mergeWords(existing,incoming).filter(w=>keys.has(wordKey(w)));
    const {error}=await admin().from('reader_words').upsert(merged.map(w=>toRow(r.id,w)),{onConflict:'reader_id,lang,term'});
    if(error)throw error;
    // Keep the book at its limit on the server too: the words seen longest ago go first.
    if(existing.length+incoming.length>MAX_WORDS){
      const all=await serverWords(r.id);
      if(all.length>=MAX_WORDS){
        const cutoff=all[all.length-1].lastAt;
        await admin().from('reader_words').delete().eq('reader_id',r.id).lt('last_seen_at',iso(cutoff));
      }
    }
    return NextResponse.json({sync:true,saved:merged.length});
  }catch{return NextResponse.json({sync:true,error:'unavailable'},{status:503});}
}

export async function DELETE(req:NextRequest){
  if(!sameOrigin(req))return NextResponse.json({error:'forbidden'},{status:403});
  const r=await reader();if(!r)return off();
  const body=await req.json().catch(()=>null) as {term?:unknown;lang?:unknown}|null;
  const term=typeof body?.term==='string'?body.term.trim().slice(0,LIMITS.term):'';
  const lang=body?.lang==='en'?'en':body?.lang==='ko'?'ko':null;
  if(!term||!lang)return NextResponse.json({error:'bad-request'},{status:400});
  const {error}=await admin().from('reader_words').delete().eq('reader_id',r.id).eq('lang',lang).eq('term',term);
  return error?NextResponse.json({sync:true,error:'unavailable'},{status:503}):NextResponse.json({sync:true,deleted:1});
}
