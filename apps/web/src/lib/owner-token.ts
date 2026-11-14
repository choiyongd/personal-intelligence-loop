import {createHmac,timingSafeEqual} from 'node:crypto';

// Owner session tokens: "<expiry seconds>.<HMAC of the expiry keyed by OPS_PASSWORD>".
export const OWNER_TTL_SECONDS=60*60*12;
const sign=(password:string,exp:string)=>createHmac('sha256',password).update(`owner:${exp}`).digest('base64url');
function same(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
// Compare digests, not the strings, so the comparison time says nothing about the password's length.
const digest=(s:string)=>createHmac('sha256','owner-compare').update(s).digest('hex');
export function passwordMatchesWith(password:string,candidate:string){return password.length>=12&&same(digest(candidate),digest(password));}
export function ownerTokenWith(password:string,now=Date.now()){const exp=String(Math.floor(now/1000)+OWNER_TTL_SECONDS);return `${exp}.${sign(password,exp)}`;}
export function tokenValidWith(password:string,token:string,now=Date.now()){
  if(password.length<12)return false;
  const [exp,mac,...rest]=token.split('.');
  return Boolean(!rest.length&&exp&&mac&&/^\d+$/.test(exp)&&Number(exp)>now/1000&&Number(exp)<=now/1000+OWNER_TTL_SECONDS&&same(mac,sign(password,exp)));
}
