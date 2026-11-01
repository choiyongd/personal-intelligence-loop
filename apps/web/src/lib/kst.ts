// Editions are scheduled in each reader's own time zone (Korea time unless they chose another).
export function zonedNow(now=new Date(),timeZone='Asia/Seoul'){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(now).map(p=>[p.type,p.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,hour:Number(parts.hour),weekday:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday)};
}
export function kstNow(now=new Date()){return zonedNow(now,'Asia/Seoul');}
// Offset of a time zone from UTC at a moment, in milliseconds.
function offsetAt(t:number,timeZone:string){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',hourCycle:'h23'}).formatToParts(new Date(t)).map(x=>[x.type,Number(x.value)]));
  return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-Math.floor(t/1000)*1000;
}
// Epoch milliseconds of a local date and hour in a time zone (daylight saving included).
export function zonedAt(date:string,hour:number,timeZone='Asia/Seoul'){
  const wall=Date.parse(`${date}T${String(hour).padStart(2,'0')}:00:00Z`);
  let t=wall-offsetAt(wall,timeZone);
  t=wall-offsetAt(t,timeZone);
  return t;
}
