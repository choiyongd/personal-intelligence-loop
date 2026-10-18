// Editions are scheduled in Korea time regardless of where the server runs.
export function kstNow(now=new Date()){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(now).map(p=>[p.type,p.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,hour:Number(parts.hour),weekday:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday)};
}
