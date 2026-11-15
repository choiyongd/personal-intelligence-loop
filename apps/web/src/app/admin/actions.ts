'use server';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {admin} from '@/lib/beta-store';
import {isOwner,OWNER_COOKIE,ownerCookie,ownerToken,passwordMatches} from '@/lib/owner';

export async function ownerLogin(form:FormData){
  if(!passwordMatches(String(form.get('password')||''))){
    await new Promise(r=>setTimeout(r,800)); // slow down guessing
    redirect('/admin?error=password');
  }
  (await cookies()).set(OWNER_COOKIE,ownerToken(),ownerCookie);
  redirect('/admin');
}
export async function ownerLogout(){
  (await cookies()).delete({name:OWNER_COOKIE,path:'/admin'});
  redirect('/admin');
}
// Marks a note as handled (or back to open) so the list shows what still needs a look.
export async function toggleFeedback(form:FormData){
  if(!await isOwner())redirect('/admin');
  const id=z.uuid().safeParse(form.get('id'));
  const done=form.get('done')==='1';
  const back=String(form.get('fb')||'')==='all'?'all':'open';
  if(id.success)await admin().from('beta_feedback').update({handled_at:done?new Date().toISOString():null}).eq('id',id.data);
  redirect(`/admin?fb=${back}#feedback`);
}
