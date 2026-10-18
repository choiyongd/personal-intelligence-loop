'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { appOrigin, configured } from '@/lib/env';
import { context } from '@/lib/data';
import {newsletterSelectionSchema} from '@/lib/newsletter';
import {cookies} from 'next/headers';
import {BETA_COOKIE,DRAFT_COOKIE} from '@/lib/beta';
import {READER_COOKIE} from '@/lib/beta-store';

const id = z.uuid();
function value(form:FormData,name:string) {return String(form.get(name)||'');}
export async function signIn(form:FormData) {
  if(!configured()) redirect('/login?message=setup');
  const parsed=z.object({email:z.email(),password:z.string().min(10).max(128)}).safeParse({email:value(form,'email'),password:value(form,'password')});
  if(!parsed.success) redirect('/login?message=invalid');
  const client=await supabase();
  const {error}=await client.auth.signInWithPassword(parsed.data);
  if(error) redirect('/login?message=auth');
  redirect('/feed');
}
export async function signUp(form:FormData) {
  if(!configured()) redirect('/login?message=setup');
  const parsed=z.object({email:z.email(),password:z.string().min(10).max(128)}).safeParse({email:value(form,'email'),password:value(form,'password')});
  if(!parsed.success) redirect('/login?message=invalid');
  const client=await supabase();
  const {error}=await client.auth.signUp({...parsed.data,options:{emailRedirectTo:`${appOrigin()}/auth/callback`}});
  redirect(error?'/login?message=auth':'/login?message=confirm');
}
export async function signOut() {
  const client=await supabase(); await client.auth.signOut(); redirect('/login');
}
export async function createWorkspace(form:FormData) {
  const {client}=await context();
  const name=z.string().trim().min(1).max(80).safeParse(value(form,'name'));
  if(!name.success) redirect('/settings?message=invalid');
  const {data,error}=await client.rpc('create_workspace',{workspace_name:name.data});
  if(error) redirect('/settings?message=save');
  redirect(`/settings?tenant=${data}`);
}
export async function savePreferences(form:FormData) {
  const tenant=id.parse(value(form,'tenant'));
  const {client,selected}=await context(tenant);
  if(selected?.role!=='owner') redirect('/settings?message=access');
  const industry=z.enum(['technology','energy','health','finance']).parse(value(form,'industry'));
  const keywords=z.array(z.string().trim().min(1).max(60)).max(20).parse(value(form,'keywords').split(',').map(s=>s.trim()).filter(Boolean));
  const result=await client.from('preferences').update({industry,keywords,updated_at:new Date().toISOString()}).eq('tenant_id',tenant);
  if(result.error) redirect(`/settings?tenant=${tenant}&message=save`);
  revalidatePath('/feed');redirect(`/settings?tenant=${tenant}&message=ok`);
}
export async function setSubscription(form:FormData) {
  const tenant=id.parse(value(form,'tenant'));
  const source=z.string().min(1).max(100).parse(value(form,'source'));
  const enabled=value(form,'enabled')==='true';
  const {client,selected}=await context(tenant);
  if(selected?.role!=='owner') redirect('/settings?message=access');
  const {data:existing,error}=await client.from('subscriptions').select('source_id').eq('tenant_id',tenant).eq('source_id',source).maybeSingle();
  if(error) redirect(`/settings?tenant=${tenant}&message=save`);
  const result=existing?await client.from('subscriptions').update({enabled}).eq('tenant_id',tenant).eq('source_id',source)
    :await client.from('subscriptions').insert({tenant_id:tenant,source_id:source,enabled});
  if(result.error) redirect(`/settings?tenant=${tenant}&message=save`);
  redirect(`/settings?tenant=${tenant}&message=ok`);
}
export async function enqueue(form:FormData) {
  const tenant=id.parse(value(form,'tenant'));
  const {client,selected}=await context(tenant);
  if(selected?.role!=='owner') redirect('/settings?message=access');
  const {error}=await client.rpc('enqueue_ingestion',{target_tenant:tenant,target_source:z.string().min(1).max(100).parse(value(form,'source'))});
  redirect(`/operations?tenant=${tenant}&message=${error?'queue':'queued'}`);
}
export async function toggleSave(form:FormData) {
  const tenant=id.parse(value(form,'tenant')),event=id.parse(value(form,'event'));
  const {client,user}=await context(tenant);
  const result=value(form,'saved')==='true'
    ? await client.from('saved_events').delete().eq('tenant_id',tenant).eq('user_id',user.id).eq('event_id',event)
    : await client.from('saved_events').upsert({tenant_id:tenant,user_id:user.id,event_id:event},{onConflict:'tenant_id,user_id,event_id',ignoreDuplicates:true});
  if(result.error) redirect(`/feed?tenant=${tenant}&message=save`);
  revalidatePath('/feed');revalidatePath('/saved');redirect(`/feed?tenant=${tenant}`);
}

export async function saveNewsletterProfile(form:FormData){
  const tenantResult=id.safeParse(value(form,'tenant'));
  if(!tenantResult.success)redirect('/settings?message=invalid');
  const tenant=tenantResult.data;
  const {client,user}=await context(tenant);
  let raw:unknown;
  try{raw=JSON.parse(value(form,'selection'));}catch{redirect(`/settings?tenant=${tenant}&message=invalid`);}
  const result=newsletterSelectionSchema.safeParse(raw);
  if(!result.success)redirect(`/settings?tenant=${tenant}&message=invalid`);
  const s=result.data;
  const {error}=await client.from('newsletter_profiles').upsert({tenant_id:tenant,user_id:user.id,
    industry:s.industries[0],industries:s.industries,subtopics:s.subtopics,scope:s.scope,country:s.countries[0]||'US',countries:s.countries.length?s.countries:['US'],
    content_types:s.contentTypes,name:s.name,cadence:s.cadence,level:s.level,updated_at:new Date().toISOString()}, {onConflict:'tenant_id,user_id'});
  if(error)redirect(`/settings?tenant=${tenant}&message=save`);
  revalidatePath('/publish');redirect(`/publish?tenant=${tenant}`);
}

const betaCookie={path:'/',maxAge:60*60*24*90,sameSite:'lax' as const,httpOnly:true,secure:process.env.VERCEL==='1'};
export async function startBeta(form:FormData){
  const name=value(form,'nickname').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,20);
  const jar=await cookies();
  jar.set(BETA_COOKIE,encodeURIComponent(name),betaCookie);
  redirect(jar.get(DRAFT_COOKIE)?'/my':'/customize?beta=1');
}
export async function endBeta(){
  const jar=await cookies();
  jar.delete(BETA_COOKIE);jar.delete(DRAFT_COOKIE);jar.delete(READER_COOKIE);
  redirect('/');
}
