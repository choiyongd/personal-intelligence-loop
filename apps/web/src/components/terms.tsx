import type {ReactNode} from 'react';

// Marks the first appearance of each glossary term in a text. Hover, focus or tap shows the meaning,
// with no script: the tip is a sibling shown by CSS on :hover and :focus-within.
export type Gloss={term:string;meaning:string};
const escape=(t:string)=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function Term({term,meaning,children}:{term:string;meaning:string;children?:ReactNode}){
  return <span className="term" tabIndex={0} aria-label={`${term}: ${meaning}`}><span className="term-word">{children??term}</span><span className="term-tip" role="tooltip"><b>{term}</b>{meaning}</span></span>;
}
export function withTerms(text:string,glossary:Gloss[]|undefined,seen:Set<string>,keyBase='t'):ReactNode[]{
  const list=(glossary||[]).filter(g=>g.term.length>=2&&!seen.has(g.term)).sort((a,b)=>b.term.length-a.term.length);
  if(!list.length)return [text];
  // Glossary terms often carry an explanation in parentheses ("FFIO(외국 우려 기관)"); match the head word.
  const heads=list.map(g=>({g,head:g.term.split(/[(（]/)[0].trim()})).filter(x=>x.head.length>=2);
  if(!heads.length)return [text];
  const re=new RegExp(`(${heads.map(x=>escape(x.head)).join('|')})`,'g');
  const out:ReactNode[]=[];let last=0,m:RegExpExecArray|null,i=0;
  while((m=re.exec(text))){
    const hit=heads.find(x=>x.head===m![0]);
    if(!hit||seen.has(hit.g.term))continue;
    seen.add(hit.g.term);
    if(m.index>last)out.push(text.slice(last,m.index));
    out.push(<Term key={`${keyBase}-${i++}`} term={hit.g.term} meaning={hit.g.meaning}>{m[0]}</Term>);
    last=m.index+m[0].length;
  }
  if(last<text.length)out.push(text.slice(last));
  return out;
}
