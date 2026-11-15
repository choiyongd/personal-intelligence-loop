// The word book: every word whose meaning a reader opened in a story, with a spaced-review schedule.
// Shared by the browser (localStorage), the sync route and tests, so it has no server or browser imports.
export type WordLang='ko'|'en';
export type Word={
  term:string;meaning:string;lang:WordLang;
  articleId?:string;articleTitle?:string;
  seen:number;firstAt:number;lastAt:number;
  // Leitner box: 0 = new or forgotten, 5 = well known. dueAt is when it should come back for review.
  box:number;dueAt:number;reviewedAt?:number;
};
export type Sighting={term:string;meaning:string;lang:WordLang;articleId?:string;articleTitle?:string};

export const WORDS_KEY='pil_words_v1';
export const WORDS_EVENT='pil-words';
export const MAX_WORDS=500;
export const DAY=86_400_000;
// Days until the next review after a correct answer, by the box the word moves into.
export const INTERVAL_DAYS=[0,1,3,7,14,30] as const;
export const MAX_BOX=INTERVAL_DAYS.length-1;
export const LIMITS={term:120,meaning:1000,articleId:160,articleTitle:240};

export const wordKey=(w:{lang:string;term:string})=>`${w.lang}:${w.term}`;
const clip=(s:unknown,n:number)=>typeof s==='string'?s.trim().slice(0,n):'';
const num=(v:unknown,fallback:number)=>typeof v==='number'&&Number.isFinite(v)?v:fallback;

// Keeps only well-formed words; anything a browser or request sends goes through here.
export function cleanWord(raw:unknown,now=Date.now()):Word|null{
  if(!raw||typeof raw!=='object')return null;
  const r=raw as Record<string,unknown>;
  const term=clip(r.term,LIMITS.term),meaning=clip(r.meaning,LIMITS.meaning);
  if(!term||!meaning||(r.lang!=='ko'&&r.lang!=='en'))return null;
  const firstAt=num(r.firstAt,now),lastAt=Math.max(firstAt,num(r.lastAt,firstAt));
  const w:Word={term,meaning,lang:r.lang,seen:Math.max(1,Math.floor(num(r.seen,1))),firstAt,lastAt,
    box:Math.min(MAX_BOX,Math.max(0,Math.floor(num(r.box,0)))),dueAt:num(r.dueAt,firstAt)};
  const id=clip(r.articleId,LIMITS.articleId),title=clip(r.articleTitle,LIMITS.articleTitle);
  if(id)w.articleId=id;if(title)w.articleTitle=title;
  if(typeof r.reviewedAt==='number'&&Number.isFinite(r.reviewedAt))w.reviewedAt=r.reviewedAt;
  return w;
}
export function cleanWords(raw:unknown,now=Date.now()):Word[]{
  if(!Array.isArray(raw))return [];
  const out=new Map<string,Word>();
  for(const item of raw){const w=cleanWord(item,now);if(w)out.set(wordKey(w),out.has(wordKey(w))?mergeWord(out.get(wordKey(w))!,w):w);}
  return cap([...out.values()]);
}

// Two copies of one word (this browser and the server, or two browsers): keep every sighting and the latest review.
export function mergeWord(a:Word,b:Word):Word{
  const newer=b.lastAt>a.lastAt?b:a;
  const ra=a.reviewedAt||0,rb=b.reviewedAt||0;
  const review=rb>ra?b:ra>rb?a:(b.box>a.box?b:a);
  const w:Word={...newer,seen:Math.max(a.seen,b.seen),firstAt:Math.min(a.firstAt,b.firstAt),lastAt:Math.max(a.lastAt,b.lastAt),box:review.box,dueAt:review.dueAt};
  if(review.reviewedAt)w.reviewedAt=review.reviewedAt;else delete w.reviewedAt;
  if(!w.articleId&&(a.articleId||b.articleId)){w.articleId=a.articleId||b.articleId;w.articleTitle=a.articleTitle||b.articleTitle;}
  return w;
}
export function mergeWords(a:Word[],b:Word[]):Word[]{
  const map=new Map(a.map(w=>[wordKey(w),w]));
  for(const w of b){const k=wordKey(w),old=map.get(k);map.set(k,old?mergeWord(old,w):w);}
  return cap([...map.values()]);
}
// Over the limit, the words seen longest ago go first.
function cap(list:Word[]){return list.length<=MAX_WORDS?list:[...list].sort((x,y)=>y.lastAt-x.lastAt).slice(0,MAX_WORDS);}

// A reader opened a word's meaning. New words are due for review right away; known words keep their schedule.
export function addSighting(list:Word[],s:Sighting,now=Date.now()):{list:Word[];word:Word;added:boolean}{
  const k=wordKey(s),old=list.find(w=>wordKey(w)===k);
  const fresh=cleanWord({...s,seen:1,firstAt:now,lastAt:now,box:0,dueAt:now},now);
  if(!fresh)return {list,word:old!,added:false};
  if(!old){const next=cap([...list,fresh]);return {list:next,word:fresh,added:true};}
  const word:Word={...old,meaning:fresh.meaning,seen:old.seen+1,lastAt:now,...(fresh.articleId?{articleId:fresh.articleId,articleTitle:fresh.articleTitle}:{})};
  return {list:list.map(w=>wordKey(w)===k?word:w),word,added:false};
}

// One review answer. A known word moves up a box and comes back later; a forgotten one starts over.
export function reviewWord(w:Word,knew:boolean,now=Date.now()):Word{
  const box=knew?Math.min(MAX_BOX,w.box+1):0;
  return {...w,box,dueAt:knew?now+INTERVAL_DAYS[box]*DAY:now,reviewedAt:now};
}
export const isDue=(w:Word,now=Date.now())=>w.dueAt<=now;
export function dueWords(list:Word[],now=Date.now()):Word[]{
  return list.filter(w=>isDue(w,now)).sort((a,b)=>a.box-b.box||a.dueAt-b.dueAt||a.firstAt-b.firstAt);
}
export function nextDue(list:Word[],now=Date.now()):number|null{
  const later=list.filter(w=>!isDue(w,now)).map(w=>w.dueAt);
  return later.length?Math.min(...later):null;
}
export type Stage='new'|'learning'|'known';
export const stageOf=(w:Word):Stage=>w.box===0?'new':w.box>=4?'known':'learning';
