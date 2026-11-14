import 'server-only';
import {cookies} from 'next/headers';
import {z} from 'zod';
import {articleCode,dayNumber,emptyProfile,readingProfile,type ReadEntry} from './recommend';

// Which articles a beta reader opened, kept in this browser only, like the mailbox.
// Each entry is the article's 5-character code, its topic and the day it was opened; nothing else about the visit.
export const READS_COOKIE='pil_reads';
const KEEP=120;
const readsCookie={path:'/',maxAge:60*60*24*180,sameSite:'lax' as const,httpOnly:true,secure:process.env.VERCEL==='1'};
const entry=z.object({c:z.string().regex(/^[0-9a-z]{5}$/),t:z.string().max(40),d:z.number().int()});
const schema=z.object({v:z.literal(1),on:z.boolean(),r:z.array(entry).max(KEEP)});
export type ReadingStore=z.infer<typeof schema>;
const empty=():ReadingStore=>({v:1,on:true,r:[]});

export async function readReading():Promise<ReadingStore>{
  const raw=(await cookies()).get(READS_COOKIE)?.value;
  if(!raw)return empty();
  try{const parsed=schema.safeParse(JSON.parse(Buffer.from(raw,'base64url').toString('utf8')));return parsed.success?parsed.data:empty();}catch{return empty();}
}
// Server actions only: render code cannot set cookies.
export async function writeReading(store:ReadingStore){
  (await cookies()).set(READS_COOKIE,Buffer.from(JSON.stringify({...store,r:store.r.slice(-KEEP)})).toString('base64url'),readsCookie);
}
// Opening an article again moves it to the newest place instead of counting twice.
export function addRead(store:ReadingStore,id:string,topic:string,today=dayNumber()):ReadingStore{
  if(!store.on)return store;
  const c=articleCode(id);
  const r:ReadEntry[]=[...store.r.filter(e=>e.c!==c),{c,t:topic,d:today}];
  return {...store,r:r.slice(-KEEP)};
}
// The profile used for recommendations; switched off, it is empty and every page falls back to chosen topics alone.
export async function currentProfile(){
  const store=await readReading();
  return store.on?readingProfile(store.r):emptyProfile();
}
