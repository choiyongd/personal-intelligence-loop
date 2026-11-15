'use server';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {admin,deliveryConfigured} from '@/lib/beta-store';
import {MAX_KRW,platformAdminAccess,platformAdminClient,validMonth} from '@/lib/platform-admin';

export async function operationsLogin(form:FormData){
  const client=await platformAdminClient();
  if(!client)redirect('/admin');
  const input=z.object({email:z.email().max(254),password:z.string().min(10).max(128)}).safeParse({
    email:form.get('email'),password:form.get('password'),
  });
  if(!input.success)redirect('/admin?error=sign-in');
  const {error}=await client.auth.signInWithPassword(input.data);
  if(error)redirect(error.status===429?'/admin?error=wait':'/admin?error=sign-in');
  redirect('/admin');
}
export async function operationsLogout(){
  const client=await platformAdminClient();
  await client?.auth.signOut({scope:'local'});
  redirect('/admin');
}
// Marks a note as handled (or back to open) so the list shows what still needs a look.
export async function toggleFeedback(form:FormData){
  if((await platformAdminAccess()).state!=='allowed'||!deliveryConfigured())redirect('/admin');
  const id=z.uuid().safeParse(form.get('id'));
  const done=form.get('done')==='1';
  const back=String(form.get('fb')||'')==='all'?'all':'open';
  if(id.success)await admin().from('beta_feedback').update({handled_at:done?new Date().toISOString():null}).eq('id',id.data);
  redirect(`/admin?fb=${back}#feedback`);
}

function won(value:FormDataEntryValue|null){
  if(typeof value!=='string'||!/^\d{1,13}$/.test(value))return null;
  const amount=Number(value);
  return amount<=MAX_KRW?amount:null;
}

export async function saveOperationsFinance(form:FormData){
  const client=await platformAdminClient();
  if(!client)redirect('/admin');
  const {data:{user}}=await client.auth.getUser();
  if(!user)redirect('/admin');
  const month=form.get('month'),fb=form.get('fb')==='all'?'all':'open';
  if(!validMonth(month))redirect(`/admin?fb=${fb}&finance=invalid#finance`);
  const gross=won(form.get('gross')),refunds=won(form.get('refunds')),costs=won(form.get('costs'));
  const back=`/admin?fb=${fb}&month=${month}`;
  if(gross===null||refunds===null||costs===null)redirect(`${back}&finance=invalid#finance`);
  // The RPC verifies the live platform grant again before writing the revision.
  const {error}=await client.rpc('admin_record_finance',{month_start:`${month}-01`,gross,refunds,costs});
  if(error?.code==='42501')redirect('/admin');
  redirect(`${back}&finance=${error?'failed':'saved'}#finance`);
}
