// Kept free of server imports so the tests can run it directly.
type Cited={pages:{paragraphs:string[]}[];deep_dive:{paragraphs:string[]};key_facts:{source:number}[]};
// Every paragraph must cite, and every citation must point at a real source; anything else is rejected.
export function citationProblems(a:Cited,sourceCount:number){
  const problems:string[]=[];
  const paragraphs=[...a.pages.flatMap(p=>p.paragraphs),...a.deep_dive.paragraphs];
  for(const p of paragraphs){
    const refs=[...p.matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1]));
    if(!refs.length)problems.push(`uncited:${p.slice(0,40)}`);
    if(refs.some(n=>n<1||n>sourceCount))problems.push(`bad-ref:${p.slice(0,40)}`);
  }
  if(a.key_facts.some(f=>f.source<1||f.source>sourceCount))problems.push('bad-fact-ref');
  return problems;
}
