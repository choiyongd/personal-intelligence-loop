import {createHmac,timingSafeEqual} from 'node:crypto';

// Resend signs webhooks the Svix way: HMAC-SHA256 over "<svix-id>.<svix-timestamp>.<raw body>" with the
// base64 part of the "whsec_..." secret; the svix-signature header lists one or more "v1,<base64>" values.
export function verifySvix(secret:string,headers:{id:string|null;timestamp:string|null;signature:string|null},body:string,nowSeconds=Math.floor(Date.now()/1000)){
  const {id,timestamp,signature}=headers;
  if(!secret.startsWith('whsec_')||!id||!timestamp||!signature)return false;
  const ts=Number(timestamp);
  // Five minutes either way, as Svix recommends, so a captured request cannot be replayed later.
  if(!Number.isFinite(ts)||Math.abs(nowSeconds-ts)>300)return false;
  const key=Buffer.from(secret.slice(6),'base64');
  const want=createHmac('sha256',key).update(`${id}.${timestamp}.${body}`).digest();
  return signature.split(' ').some(part=>{
    const [version,value]=part.split(',');
    if(version!=='v1'||!value)return false;
    const got=Buffer.from(value,'base64');
    return got.length===want.length&&timingSafeEqual(got,want);
  });
}
