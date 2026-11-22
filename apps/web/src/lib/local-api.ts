import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {authEnv} from './env';
import {supabase} from './supabase';

export class ApiError extends Error {
  constructor(public status:number,message:string){super(message);}
}

export async function apiSession(request:Request){
  const token=request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if(!request.headers.has('authorization')){
    // A cross-site form cannot supply this header, and the API never allows cross-origin requests.
    if(request.method!=='GET'&&request.headers.get('x-loop-classroom')!=='1')throw new ApiError(403,'same_origin_required');
    const client=await supabase();
    const auth=await client.auth.getUser();
    if(auth.error||!auth.data.user)throw new ApiError(401,'invalid_session');
    return {client,user:auth.data.user};
  }
  if(!token)throw new ApiError(401,'bearer_token_required');
  const config=authEnv();
  const client=createClient(config.url,config.key,{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
    global:{headers:{Authorization:`Bearer ${token}`}},
  });
  const auth=await client.auth.getUser(token);
  if(auth.error||!auth.data.user)throw new ApiError(401,'invalid_session');
  return {client,user:auth.data.user};
}

export function checked<T>(result:{data:T;error:{code?:string;message:string}|null}):T{
  if(result.error){
    const code=result.error.code;
    const status=code==='42501'?403:code==='23505'?409:code?.startsWith('22')||code?.startsWith('23')||code==='P0001'?400:503;
    throw new ApiError(status,code||'database_unavailable');
  }
  return result.data;
}

export async function body(request:Request){
  if(!request.headers.get('content-type')?.includes('application/json'))throw new ApiError(415,'application/json required');
  const text=await request.text();
  if(new TextEncoder().encode(text).length>32768)throw new ApiError(413,'request_too_large');
  try{return JSON.parse(text) as unknown;}catch{throw new ApiError(400,'invalid_json');}
}

export function apiErrorResponse(error:unknown){
  if(error instanceof z.ZodError)return Response.json({error:'validation_failed',issues:error.issues.map(issue=>({path:issue.path,message:issue.message}))},{status:400});
  if(error instanceof ApiError)return Response.json({error:error.message},{status:error.status});
  console.error('local_api_unavailable');
  return Response.json({error:'service_unavailable'},{status:503});
}
