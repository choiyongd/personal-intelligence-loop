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
const {parseFeed}=load(`${lib}/live/rss.ts`);
const {citationProblems}=load(`${lib}/live/check.ts`);
const {feeds}=load(`${lib}/live/feeds.ts`);
const articles=load(`${lib}/articles/index.ts`);
const {defaultSelection}=load(`${lib}/newsletter.ts`);

test('reads RSS items with CDATA, entities and dates',()=>{
  const xml=`<rss><channel><title>x</title><item><title><![CDATA[Fed &amp; rates: decision]]></title><link>https://www.federalreserve.gov/newsevents/pressreleases/monetary20261029a.htm</link>
    <description>&lt;p&gt;The Committee decided&#8230;&lt;/p&gt;</description><pubDate>Thu, 29 Oct 2026 18:00:00 GMT</pubDate></item></channel></rss>`;
  assert.deepEqual(parseFeed(xml),[{title:'Fed & rates: decision',url:'https://www.federalreserve.gov/newsevents/pressreleases/monetary20261029a.htm',summary:'The Committee decided…',publishedAt:'2026-10-29T18:00:00.000Z'}]);
});
test('reads Atom entries and picks the alternate link',()=>{
  const xml=`<feed><entry><title>UK announces grid plan</title><link rel="self" href="https://www.gov.uk/api/x"/><link rel="alternate" type="text/html" href="https://www.gov.uk/government/news/grid"/>
    <updated>2026-10-31T10:06:11+00:00</updated><summary type="html">Plan &lt;b&gt;today&lt;/b&gt;</summary></entry></feed>`;
  const [e]=parseFeed(xml);
  assert.equal(e.url,'https://www.gov.uk/government/news/grid');
  assert.equal(e.summary,'Plan today');
  assert.equal(e.publishedAt,'2026-10-31T10:06:11.000Z');
});
test('every approved feed is https, has a licence link and known fields',()=>{
  const fields=new Set(load(`${lib}/newsletter.ts`).industries.map(i=>i.id));
  assert.equal(new Set(feeds.map(f=>f.id)).size,feeds.length);
  for(const f of feeds){
    assert.equal(new URL(f.url).protocol,'https:');assert.ok(f.hosts.includes(new URL(f.url).hostname),f.id);
    assert.ok(f.license&&new URL(f.licenseUrl).protocol==='https:',f.id);
    assert.ok(f.fields.length&&f.fields.every(x=>fields.has(x)),f.id);
  }
});
test('rejects uncited paragraphs and citations past the source list',()=>{
  const ok={pages:[{paragraphs:['A [1].','B [2].']}],deep_dive:{paragraphs:['C [1][2].']},key_facts:[{source:2}]};
  assert.deepEqual(citationProblems(ok,2),[]);
  assert.equal(citationProblems({...ok,pages:[{paragraphs:['no cite']}]},2).length,1);
  assert.equal(citationProblems({...ok,deep_dive:{paragraphs:['C [3].']}},2).length,1);
  assert.deepEqual(citationProblems({...ok,key_facts:[{source:0}]},2),['bad-fact-ref']);
});

const base=articles.allArticles.find(a=>a.industry==='finance');
const live=(id,asOf,extra={})=>({...base,id,asOf,type:'news',regions:['US'],live:{model:'m',writtenAt:`${asOf}T05:00:00Z`},...extra});
test('editions lead with live stories from their own date window and keep explainers',()=>{
  const s={...defaultSelection,industries:['finance'],subtopics:[],scope:'global',cadence:'daily'};
  articles.setLiveArticles([live('n-261101-aaaa','2026-11-01'),live('n-261030-bbbb','2026-10-30'),live('n-261027-cccc','2026-10-27'),live('n-261101-dddd','2026-11-01',{industry:'health',topic:'medicine'})]);
  const seed=articles.editionSeed('2026-11-01',0);
  const ids=articles.pickEdition(s,15,seed);
  const hot=articles.hotFor(s,ids).length;
  assert.deepEqual(ids.slice(hot,hot+2),['n-261101-aaaa','n-261030-bbbb']);
  assert.ok(!ids.includes('n-261027-cccc'),'older than the daily window');
  assert.ok(!ids.includes('n-261101-dddd'),'outside the chosen fields');
  assert.ok(ids.some(id=>!id.startsWith('n-')),'explainers stay in the edition');
  assert.equal(ids.length,new Set(ids).size);
  // A past edition never shows stories written after its date.
  assert.ok(!articles.pickEdition(s,15,articles.editionSeed('2026-10-29',0)).some(id=>id==='n-261101-aaaa'||id==='n-261030-bbbb'));
  // Weekly readers get the past week.
  assert.ok(articles.pickEdition({...s,cadence:'weekly'},15,seed).includes('n-261027-cccc'));
  assert.equal(articles.articleById('n-261030-bbbb').asOf,'2026-10-30');
  assert.match(articles.articleStory(articles.articleById('n-261101-aaaa'),'practitioner').source,/AI 작성/);
  // English editions only carry translated stories, so Korean live stories stay out of them.
  assert.ok(!articles.pickEdition({...s,lang:'en'},15,seed).some(id=>id.startsWith('n-')));
  articles.setLiveArticles([]);
});
test('without live stories an edition is unchanged',()=>{
  const s={...defaultSelection,industries:['finance','technology'],subtopics:[],scope:'global',cadence:'daily'};
  articles.setLiveArticles([]);
  const a=articles.pickEdition(s,15,articles.editionSeed('2026-11-01',1));
  assert.ok(a.length>=10);assert.ok(a.every(id=>!id.startsWith('n-')));
});
