// A small RSS 2.0 / RDF / Atom reader. Feeds come only from the approved list, so this needs to be
// forgiving about markup, not a general XML parser.
export type FeedEntry={title:string;url:string;summary:string;publishedAt:string|null};

const ENTITIES:Record<string,string>={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',hellip:'…',mdash:'—',ndash:'–',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“',middot:'·'};
export function decodeEntities(s:string){
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(m,e:string)=>{
    if(e[0]==='#'){const n=e[1]==='x'||e[1]==='X'?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return Number.isFinite(n)&&n>0&&n<0x110000?String.fromCodePoint(n):'';}
    return ENTITIES[e.toLowerCase()]??m;
  });
}
const unwrapCdata=(s:string)=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1');
// Markup to plain text: drop scripts and styles, turn block ends into spaces, collapse whitespace.
export function toText(html:string){
  return decodeEntities(decodeEntities(unwrapCdata(html))
    .replace(/<(script|style|noscript|svg|nav|header|footer|form)[\s\S]*?<\/\1>/gi,' ')
    .replace(/<\/(p|div|li|h[1-6]|tr|br)>|<br\s*\/?>/gi,'\n')
    .replace(/<[^>]+>/g,' '))
    .replace(/[ \t\f\v ]+/g,' ').replace(/\s*\n\s*/g,'\n').replace(/\n{2,}/g,'\n').trim();
}
function tag(block:string,name:string){
  const m=new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`,'i').exec(block);
  return m?m[1]:'';
}
function attr(block:string,name:string,key:string){
  const tags=block.match(new RegExp(`<${name}\\b[^>]*>`,'gi'))||[];
  // Atom entries may carry several links; the alternate (or unlabelled) one is the page.
  const pick=tags.find(t=>!/rel=/.test(t)||/rel=["']alternate["']/.test(t))||tags[0];
  const m=pick&&new RegExp(`${key}=["']([^"']+)["']`,'i').exec(pick);
  return m?m[1]:'';
}
function isoDate(raw:string){
  const t=Date.parse(raw.trim());
  return Number.isFinite(t)?new Date(t).toISOString():null;
}
export function parseFeed(xml:string,limit=40):FeedEntry[]{
  const blocks=xml.match(/<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi)||[];
  const out:FeedEntry[]=[];
  for(const b of blocks.slice(0,limit)){
    const title=toText(tag(b,'title')).replace(/\s+/g,' ');
    const link=decodeEntities(unwrapCdata(tag(b,'link')).trim())||decodeEntities(attr(b,'link','href'))||unwrapCdata(tag(b,'guid')).trim();
    const summary=toText(tag(b,'description')||tag(b,'summary')||tag(b,'content:encoded')||tag(b,'content'));
    const date=tag(b,'pubDate')||tag(b,'dc:date')||tag(b,'published')||tag(b,'updated');
    if(title&&link)out.push({title:title.slice(0,400),url:link,summary:summary.replace(/\s+/g,' ').slice(0,1500),publishedAt:date?isoDate(unwrapCdata(date)):null});
  }
  return out;
}
