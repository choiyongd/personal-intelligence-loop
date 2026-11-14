import 'server-only';
import {cookies} from 'next/headers';
import {admin,deliveryConfigured} from './beta-store';
import {appOrigin} from './env';
import {REF_COOKIE,isReferralCode} from './referral-code';

// Invite links work only once the referral SQL has run; until then every helper quietly returns nothing,
// so the rest of the site keeps working whether or not the columns exist yet.
export type Referral={code:string;url:string;joined:number;confirmed:number};
export const inviteUrl=(code:string)=>`${appOrigin()}/invite/${code}`;
// Links to a story carry the sharer's code, so a friend who joins from the story counts as their invite too.
export const withRef=(url:string,code?:string|null)=>code?`${url}${url.includes('?')?'&':'?'}ref=${code}`:url;

export async function referralFor(readerId:string):Promise<Referral|null>{
  if(!deliveryConfigured())return null;
  try{
    const {data,error}=await admin().from('beta_readers').select('referral_code').eq('id',readerId).maybeSingle();
    if(error||!isReferralCode(data?.referral_code))return null;
    const code=data.referral_code;
    const [joined,confirmed]=await Promise.all([
      admin().from('beta_readers').select('id',{count:'exact',head:true}).eq('referred_by',readerId),
      admin().from('beta_readers').select('id',{count:'exact',head:true}).eq('referred_by',readerId).not('email_confirmed_at','is',null),
    ]);
    return {code,url:inviteUrl(code),joined:joined.count||0,confirmed:confirmed.count||0};
  }catch{return null;}
}
export async function codeFor(readerId:string){return (await referralFor(readerId))?.code??null;}

// The inviter's display name for the invite page; nothing else about them is shown.
export async function inviterName(code:string):Promise<string|null>{
  if(!deliveryConfigured()||!isReferralCode(code))return null;
  try{
    const {data}=await admin().from('beta_readers').select('name').eq('referral_code',code).maybeSingle();
    return data?.name?.trim()||null;
  }catch{return null;}
}

// Called right after a new reader row is created: remember the friend whose link brought this browser here.
// First invite wins (the cookie is never overwritten), a reader cannot invite themselves, and a failure never blocks sign-up.
export async function attributeReferral(newReaderId:string){
  try{
    const code=(await cookies()).get(REF_COOKIE)?.value;
    if(!isReferralCode(code))return;
    const {data}=await admin().from('beta_readers').select('id').eq('referral_code',code).maybeSingle();
    if(!data?.id||data.id===newReaderId)return;
    await admin().from('beta_readers').update({referred_by:data.id,referred_at:new Date().toISOString()}).eq('id',newReaderId).is('referred_by',null);
  }catch{/* referral columns not added yet, or a lookup failed: sign-up goes on */}
}
