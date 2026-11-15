import 'server-only';
import {cookies} from 'next/headers';
import {OWNER_TTL_SECONDS,passwordMatchesWith,ownerTokenWith,tokenValidWith} from './owner-token';

// The operations dashboard belongs to the owner alone. There are no staff accounts: one password,
// OPS_PASSWORD, set in the hosting environment. The cookie holds an expiry and an HMAC of it keyed
// by that password, so changing the password signs every open session out.
export const OWNER_COOKIE='pil_owner';
const password=()=>process.env.OPS_PASSWORD||'';
export const ownerConfigured=()=>password().length>=12;
export const passwordMatches=(candidate:string)=>ownerConfigured()&&passwordMatchesWith(password(),candidate);
export const ownerToken=()=>ownerTokenWith(password());
export const tokenValid=(token:string)=>ownerConfigured()&&tokenValidWith(password(),token);
export async function isOwner(){return tokenValid((await cookies()).get(OWNER_COOKIE)?.value||'');}
export const ownerCookie={path:'/admin',maxAge:OWNER_TTL_SECONDS,sameSite:'strict' as const,httpOnly:true,secure:process.env.VERCEL==='1'};
