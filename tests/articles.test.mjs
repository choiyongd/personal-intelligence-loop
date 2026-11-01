import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import ts from 'typescript';
// Load each editorial data file as plain JS; the files only import types.
const files=['technology','business-finance','science-health','energy-policy','design','world-europe','world-south-america','world-north-america','world-eurasia','world-mobility','world-society','more-culture','more-life','more-environment','more-work','more-industry','more-economy'];
const articles=[];
for(const f of files){
  const source=await readFile(new URL(`../apps/web/src/lib/articles/${f}.ts`,import.meta.url),'utf8');
  const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const m={exports:{}};new Function('require','module','exports',out)(createRequire(import.meta.url),m,m.exports);
  articles.push(...m.exports.articles);
}
const topics=['ai','semiconductor','robotics','software','startup','strategy','commerce','space','materials','biology','battery','renewables','climate','digital-health','biotech','medicine','economy','fintech','investment','product-design','creative','culture','regulation','society','international',
  'cybersecurity','quantum','supply-chain','labor','physics','earth','nuclear','critical-minerals','public-health','aging','crypto','realestate','architecture','media','security','migration','ev','aviation','autonomous','agriculture','foodtech','edtech','higher-ed',
  'cloud','esg','neuroscience','hydrogen','mental-health','currency','ux','democracy','shipping','food-prices','k12',
  'games','music','film','sports-business','mega-events','travel','wellness','fashion','biodiversity','ocean','pollution','skills','remote-work'];
const continents=['EUROPE','N_AMERICA','S_AMERICA','EURASIA'];
test('every topic has an explainer and ids are unique',()=>{
  assert.deepEqual([...new Set(articles.map(a=>a.topic))].sort(),[...topics].sort());
  assert.equal(new Set(articles.map(a=>a.id)).size,articles.length);
});
for(const a of articles){
  test(`${a.id}: at least two pages, questions, thoughts and resolvable citations`,()=>{
    assert.ok(a.pages.length>=2,'pages');
    assert.ok(a.questions.length>=3&&a.thoughts.length>=2,'questions/thoughts');
    assert.ok(a.sources.length>=3,'sources');
    for(const s of a.sources){const u=new URL(s.url);assert.equal(u.protocol,'https:');assert.ok(u.pathname.length>1||u.search,`specific url ${s.url}`);}
    assert.ok(a.sources.some(s=>['원문','공식 자료','학술 자료','통계'].includes(s.kind)),'primary source');
    const text=[...a.pages.flatMap(p=>p.paragraphs),...a.deepDive.paragraphs].join(' ');
    const cited=[...text.matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1]));
    assert.ok(cited.length>=a.pages.length*2,'citations per page');
    for(const n of [...cited,...a.keyFacts.map(f=>f.source)])assert.ok(n>=1&&n<=a.sources.length,`citation [${n}] has a source`);
    for(const p of a.pages)assert.ok(p.paragraphs.length>=2&&p.easy.length>0,`page ${p.heading}`);
  });
}
test('the reading covers Europe, both Americas and Eurasia',()=>{
  for(const c of continents)assert.ok(articles.filter(a=>a.regions.includes(c)).length>=3,c);
});
test('every global hot pick points at an existing explainer',async()=>{
  const source=await readFile(new URL('../apps/web/src/lib/articles/hot.ts',import.meta.url),'utf8');
  const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const m={exports:{}};new Function('require','module','exports',out)(createRequire(import.meta.url),m,m.exports);
  assert.ok(m.exports.hotPicks.length>=m.exports.HOT_PER_EDITION*2,'enough picks to rotate');
  for(const h of m.exports.hotPicks)assert.ok(articles.some(a=>a.id===h.id&&a.regions.includes('GLOBAL')),h.id);
});

// English editions: each must mirror its Korean original so citations still point at the same sources.
const enDir=new URL('../apps/web/src/lib/articles/en/',import.meta.url);
const enIndex=await readFile(new URL('index.ts',enDir),'utf8');
const enEntries=[...enIndex.matchAll(/'([a-z-]+-explainer)':(\w+)/g)].map(m=>({id:m[1],name:m[2]}));
const enFiles=Object.fromEntries([...enIndex.matchAll(/import \{(\w+)\} from '\.\/([a-z-]+)'/g)].map(m=>[m[1],m[2]]));
const cites=t=>[...t.matchAll(/\[(\d+)\]/g)].map(m=>m[1]).join(',');
test('english editions cover one explainer per field',()=>{assert.ok(enEntries.length>=16);});
for(const {id,name} of enEntries){
  test(`${id}: english edition mirrors the original`,async()=>{
    const source=await readFile(new URL(`${enFiles[name]}.ts`,enDir),'utf8');
    const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    const m={exports:{}};new Function('require','module','exports',out)(createRequire(import.meta.url),m,m.exports);
    const en=m.exports[name],ko=articles.find(a=>a.id===id);
    assert.ok(en&&ko,'both editions exist');
    assert.ok(!/[가-힣]/.test(JSON.stringify(en)),'no Korean left');
    assert.equal(en.pages.length,ko.pages.length,'page count');
    en.pages.forEach((p,i)=>{
      assert.equal(p.paragraphs.length,ko.pages[i].paragraphs.length,`paragraphs on page ${i+1}`);
      p.paragraphs.forEach((t,j)=>assert.equal(cites(t),cites(ko.pages[i].paragraphs[j]),`citations p${i+1}.${j+1}`));
    });
    assert.equal(cites(en.deepDive.paragraphs.join(' ')),cites(ko.deepDive.paragraphs.join(' ')),'deep dive citations');
    assert.deepEqual(en.keyFacts.map(f=>f.source),ko.keyFacts.map(f=>f.source),'key fact sources');
    assert.equal(en.glossary.length,ko.glossary.length,'glossary');
    assert.equal(en.questions.length,ko.questions.length,'questions');
    assert.equal(en.thoughts.length,ko.thoughts.length,'thoughts');
    for(const k of Object.keys(en.sourceTitles??{}))assert.ok(Number(k)>=1&&Number(k)<=ko.sources.length,`source title ${k}`);
    for(const [i,s] of ko.sources.entries())if(/[가-힣]/.test(s.title))assert.ok(en.sourceTitles?.[i+1],`english title for source ${i+1}`);
  });
}
