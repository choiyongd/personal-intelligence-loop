// Pure counting for the operations dashboard, kept apart from the database code so tests can load it.
export const DAY=86_400_000;
export const kstDay=(d:Date|string)=>new Date(d).toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
export function lastDays(n:number,now=new Date()){return Array.from({length:n},(_,i)=>kstDay(new Date(now.getTime()-(n-1-i)*DAY)));}

export type IssueMail={sent_at:string|null;delivery:string;mail_id:string|null;delivered_at:string|null;opened_at:string|null;clicked_at:string|null;bounced_at:string|null;complained_at:string|null};
// Open rate counts delivered mail when delivery events arrive, else everything sent.
// Mail apps that preload images (Apple Mail) report opens nobody made, so treat the rate as an upper bound.
export function mailSummary(rows:IssueMail[]){
  const sent=rows.filter(r=>r.delivery==='sent'&&r.sent_at);
  const tracked=sent.filter(r=>r.mail_id);
  const delivered=tracked.filter(r=>r.delivered_at).length;
  const base=delivered||tracked.length;
  const opened=tracked.filter(r=>r.opened_at).length,clicked=tracked.filter(r=>r.clicked_at).length;
  return {sent:sent.length,tracked:tracked.length,delivered,opened,clicked,
    bounced:tracked.filter(r=>r.bounced_at).length,complained:tracked.filter(r=>r.complained_at).length,
    openRate:base?opened/base:null,clickRate:base?clicked/base:null};
}
export function perDay<T>(rows:T[],day:(r:T)=>string|null,days:string[]){
  const m=new Map(days.map(d=>[d,[] as T[]]));
  for(const r of rows){const d=day(r);if(d)m.get(d)?.push(r);}
  return days.map(d=>({day:d,rows:m.get(d)!}));
}

export type Feedback={id:string;rating:number|null;message:string;source:string;contact:string|null;created_at:string;handled_at:string|null};
export function feedbackSummary(rows:Pick<Feedback,'rating'|'handled_at'>[]){
  const rated=rows.filter(r=>r.rating);
  return {total:rows.length,open:rows.filter(r=>!r.handled_at).length,rated:rated.length,
    average:rated.length?rated.reduce((s,r)=>s+r.rating!,0)/rated.length:null,
    byRating:[1,2,3,4,5].map(n=>rated.filter(r=>r.rating===n).length)};
}
