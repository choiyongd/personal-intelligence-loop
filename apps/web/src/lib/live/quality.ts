// Rules that keep the editor's list to real news and stop thin stories before they cost a writer call.
// Kept free of server imports so the tests can run them directly.

// Schedules, invitations and housekeeping notices are not news for readers.
const NOTICE=[
  /\bmedia advisory\b/i,/\b(to|will) (host|hold|speak|testify|deliver remarks|participate)\b/i,/\bwebinar\b/i,/\bsave the date\b/i,
  /\bpress (call|briefing) (schedule|advisory)\b/i,/\b(weekly|daily|public) schedule\b/i,/\bopen meeting\b/i,/\bsunshine act\b/i,
  /\breminder\b/i,/\b(job|vacanc(y|ies)|hiring|internship|fellowship) (opening|announcement|application)s?\b/i,/\bcall for (nominations|applications|papers)\b/i,
  /(일정|행사 안내|개최 안내|참석 안내|채용|인사 발령|인사발령|부고|모집 공고|취재 요청|사진 배포)/,
];
export function isNotice(title:string){return NOTICE.some(r=>r.test(title));}

// No single feed may fill the editor's list (arXiv alone publishes dozens of papers a day).
export const PER_FEED_CAP=25;
export function capPerFeed<T extends {feed_id:string}>(items:T[],cap=PER_FEED_CAP){
  const seen=new Map<string,number>();
  return items.filter(i=>{const n=(seen.get(i.feed_id)||0)+1;seen.set(i.feed_id,n);return n<=cap;});
}

// A story needs enough source text to say something; below this the writer would only restate a headline.
export const MIN_MATERIAL_CHARS=400;
export function thinMaterial(sources:{title:string;material:string}[]){
  return sources.reduce((n,s)=>n+s.material.length,0)<MIN_MATERIAL_CHARS;
}
