import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import ts from 'typescript';
// Load each editorial data file as plain JS; the files only import types.
const files=['technology','business-finance','science-health','energy-policy','design'];
const articles=[];
for(const f of files){
  const source=await readFile(new URL(`../apps/web/src/lib/articles/${f}.ts`,import.meta.url),'utf8');
  const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const m={exports:{}};new Function('require','module','exports',out)(createRequire(import.meta.url),m,m.exports);
  articles.push(...m.exports.articles);
}
const topics=['ai','semiconductor','robotics','software','startup','strategy','commerce','space','materials','biology','battery','renewables','climate','digital-health','biotech','medicine','economy','fintech','investment','product-design','creative','culture','regulation','society','international'];
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
