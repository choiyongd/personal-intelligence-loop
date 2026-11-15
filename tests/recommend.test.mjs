import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

// Load the app's TS modules in memory (relative imports only), so the tests use the real implementation.
const lib=resolve(dirname(fileURLToPath(import.meta.url)),'../apps/web/src/lib');
const req=createRequire(import.meta.url),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const m={exports:{}};cache.set(file,m);
  const out=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const local=(spec)=>{
    if(!spec.startsWith('.'))return req(spec);
    const base=resolve(dirname(file),spec);
    for(const f of [base+'.ts',base+'/index.ts'])if(existsSync(f))return load(f);
    throw new Error(`cannot load ${spec}`);
  };
  new Function('require','module','exports',out)(local,m,m.exports);
  return m.exports;
}
const {readingProfile,recommend,scoreArticle,suggestedTopics,withTopic,personalOrder,articleCode,emptyProfile}=load(`${lib}/recommend.ts`);
const articles=load(`${lib}/articles/index.ts`);
const {defaultSelection,newsletterSelectionSchema}=load(`${lib}/newsletter.ts`);
const all=articles.allArticles;
const byTopic=(t)=>all.filter(a=>a.topic===t);
const TODAY=318;
const entry=(a,d=TODAY)=>({c:articleCode(a.id),t:a.topic,d});

test('reading profile decays older reads and keeps the codes it has seen',()=>{
  const [a]=byTopic('ai');
  const p=readingProfile([entry(a),{...entry(byTopic('semiconductor')[0]),d:TODAY-21}],TODAY);
  assert.equal(p.count,2);
  assert.ok(p.read.has(articleCode(a.id)));
  assert.equal(p.topics.get('ai'),1);
  assert.ok(Math.abs(p.topics.get('semiconductor')-.5)<1e-9);
  assert.ok(Math.abs(p.fields.get('technology')-1.5)<1e-9);
});
test('recommendations skip read stories, favour chosen topics and stay varied',()=>{
  const s={...defaultSelection,industries:['technology'],subtopics:['ai','robotics']};
  const read=byTopic('semiconductor')[0];
  const recs=recommend(s,readingProfile([entry(read)],TODAY),6,{today:TODAY});
  assert.ok(recs.length>0);
  assert.ok(recs.every(r=>r.article.id!==read.id),'already read story is left out');
  assert.ok(['ai','robotics'].includes(recs[0].article.topic));
  assert.equal(recs[0].reason.kind,'topic');
  const counts={};for(const r of recs)counts[r.article.topic]=(counts[r.article.topic]||0)+1;
  assert.ok(Object.values(counts).every(n=>n<=2),'no more than two from one topic');
});
test('reading outside the chosen fields brings that topic in, and nothing unrelated',()=>{
  const s={...defaultSelection,industries:['technology'],subtopics:['ai']};
  const [bio]=byTopic('biotech');
  assert.equal(recommend(s,emptyProfile(),40,{today:TODAY}).some(r=>r.article.industry==='health'),false);
  // A second, unread biotech story (as the daily live pipeline would add) is suggested because the reader opened one.
  const other={...bio,id:'live-biotech-test'};
  const p=readingProfile([entry(bio)],TODAY);
  const recs=recommend(s,p,20,{today:TODAY,pool:[...all,other]});
  const hit=recs.find(r=>r.article.id===other.id);
  assert.ok(hit,'unread story on a read topic is suggested');
  assert.equal(hit.reason.kind,'read');
  assert.ok(recs.every(r=>r.article.id!==bio.id));
  assert.equal(scoreArticle(all.find(a=>a.industry==='sports'),s,p,TODAY),null);
});
test('topic suggestions add the field when needed and respect the schema',()=>{
  const s={...defaultSelection,industries:['technology'],subtopics:['ai']};
  const p=readingProfile([{c:'aaaaa',t:'biotech',d:TODAY},{c:'bbbbb',t:'biotech',d:TODAY},{c:'ccccc',t:'semiconductor',d:TODAY},{c:'ddddd',t:'semiconductor',d:TODAY},{c:'eeeee',t:'ai',d:TODAY},{c:'fffff',t:'ai',d:TODAY}],TODAY);
  const t=suggestedTopics(s,p);
  assert.deepEqual([...t].sort(),['biotech','semiconductor']);
  const next=withTopic(s,'biotech');
  assert.deepEqual(next.industries,['technology','health']);
  assert.ok(newsletterSelectionSchema.safeParse(next).success);
  // A whole chosen field already covers its topics.
  assert.deepEqual(suggestedTopics({...s,industries:['technology','health']},p),['semiconductor']);
  assert.equal(withTopic(s,'ai'),null);
});
test('personal order moves read stories back and read topics forward, keeping order inside each group',()=>{
  const list=[{id:'a',topic:'x'},{id:'b',topic:'y'},{id:'c',topic:'y'},{id:'d',topic:'z'}];
  const p=readingProfile([{c:articleCode('b'),t:'y',d:TODAY}],TODAY);
  assert.deepEqual(personalOrder(list,p).map(x=>x.id),['c','a','d','b']);
  assert.deepEqual(personalOrder(list,emptyProfile()).map(x=>x.id),['a','b','c','d']);
});
test('scheduled editions are unchanged; a personal order only reorders the same reading',()=>{
  const s={...defaultSelection,industries:['technology','health'],subtopics:[]};
  const plain=articles.pickEdition(s,15,1000);
  assert.deepEqual(articles.pickEdition(s,15,1000),plain);
  const read=articles.articleById(plain[plain.length-1]);
  const p=readingProfile([entry(read)],TODAY);
  const personal=articles.pickEdition(s,15,1000,(l)=>personalOrder(l,p));
  assert.equal(personal.length,plain.length);
  assert.notEqual(personal.indexOf(read.id),0);
});
