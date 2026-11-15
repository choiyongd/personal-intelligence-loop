import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {z} from 'zod';
import {platformAdminEnv,platformAdminCookie} from './platform-admin-env';

export const MAX_KRW = 1_000_000_000_000;
const clock = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit'});
export function reportMonth(now=new Date()) {
  const parts=clock.formatToParts(now);
  return `${parts.find(p=>p.type==='year')?.value}-${parts.find(p=>p.type==='month')?.value}`;
}
export function validMonth(month:unknown):month is string {
  return typeof month==='string' && /^20\d{2}-(0[1-9]|1[0-2])$/.test(month) && month<=reportMonth();
}

const count=z.number().int().nonnegative();
const amount=count.max(MAX_KRW);
const snapshot=z.object({
  month:z.iso.date(),customers:z.object({total:count,new30:count,active30:count}),
  finance:z.object({gross:amount,refunds:amount,costs:amount,recordedAt:z.iso.datetime({offset:true})}).nullable()
});
export type PlatformSnapshot=z.infer<typeof snapshot>;

export async function platformAdminClient(){
  const config=platformAdminEnv();
  if(!config)return null;
  const jar=await cookies();
  return createServerClient(config.url,config.key,{
    cookieOptions:platformAdminCookie,
    cookies:{
      getAll:()=>jar.getAll(),
      setAll(values){
        try{values.forEach(({name,value,options})=>jar.set(name,value,options));}
        catch{/* The proxy refreshes cookies on Server Component requests. */}
      }
    }
  });
}

export async function platformAdminAccess(month=reportMonth()){
  const client=await platformAdminClient();
  if(!client)return {state:'setup'} as const;
  const {data:{user},error:authError}=await client.auth.getUser();
  if(!user)return {state:authError?.status===0 || (authError?.status??0)>=500?'unavailable':'sign-in'} as const;
  const {data,error}=await client.rpc('admin_overview',{month_start:`${month}-01`});
  if(error)return {state:error.code==='42501'?'denied':'unavailable'} as const;
  const result=snapshot.safeParse(data);
  if(!result.success)return {state:'unavailable'} as const;
  return {state:'allowed',overview:result.data} as const;
}
