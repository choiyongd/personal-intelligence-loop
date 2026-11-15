// Shared by the proxy (which records the invite) and the server code (which reads it). No server-only imports here.
export const REF_COOKIE='pil_ref';
export const REF_COOKIE_DAYS=30;
export const isReferralCode=(v:unknown):v is string=>typeof v==='string'&&/^[a-f0-9]{10}$/.test(v);
