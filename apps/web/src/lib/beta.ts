import 'server-only';
import {cookies} from 'next/headers';
import {defaultSelection,selectionFromQuery,type NewsletterSelection} from './newsletter';

// Beta readers enter without an account. The cookie holds only a display name; it grants no access to Supabase data.
export const BETA_COOKIE='pil_beta',DRAFT_COOKIE='pil_draft_selection';
export async function betaReader(){
  const raw=(await cookies()).get(BETA_COOKIE)?.value;
  if(raw===undefined)return null;
  const name=decodeURIComponent(raw).trim().slice(0,20);
  return {name:name||'베타 독자'};
}
export async function draftSelection():Promise<NewsletterSelection|null>{
  const draft=(await cookies()).get(DRAFT_COOKIE)?.value;
  return draft?selectionFromQuery(Object.fromEntries(new URLSearchParams(draft))):null;
}
export async function savedOrDefaultSelection(){return (await draftSelection())||defaultSelection;}
