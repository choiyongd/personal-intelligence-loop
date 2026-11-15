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

test('personal editorial stories use the saved topics and retain original evidence',()=>{
  const selection={...defaultSelection,industries:['education','policy','technology','science'],
    subtopics:['software','robotics','space','biology','physics','edtech','higher-ed','k12','society','migration'],
    scope:'global',contentTypes:['article','research','news'],level:'expert'};
  const stories=articles.personalEditorialStories(selection);
  assert.equal(stories.length,10);
  assert.equal(new Set(stories.map(story=>story.id)).size,stories.length);
  for(const story of stories){
    assert.ok(selection.industries.includes(story.industry));
    assert.ok(story.topics.every(topic=>selection.subtopics.includes(topic)));
    assert.equal(story.href,`/article/${story.id}?level=expert`);
    assert.ok(story.evidence.some(source=>new URL(source.url).protocol==='https:'));
    assert.equal(story.hot,undefined);
  }
});

test('personal editorial stories respect narrow countries and content types',()=>{
  const selection={...defaultSelection,industries:['education'],subtopics:['k12'],scope:'kr',contentTypes:['news']};
  assert.deepEqual(articles.personalEditorialStories(selection).map(story=>story.id),['k12-explainer']);
  assert.deepEqual(articles.personalEditorialStories({...selection,scope:'country',countries:['US']}),[]);
  assert.deepEqual(articles.personalEditorialStories({...selection,contentTypes:['research']}),[]);
});

const {callUsage,addUsage}=load(`${lib}/live/cost.ts`);
const {isNotice,capPerFeed,thinMaterial}=load(`${lib}/live/quality.ts`);

test('call cost follows the model price, counting cache reads and writes',()=>{
  const u=callUsage('claude-opus-5-5',{input_tokens:10_000,output_tokens:4_000,cache_read_input_tokens:1_000,cache_creation_input_tokens:0});
  // (10,000 + 1,000 x 0.1) x $4/M + 4,000 x $20/M
  assert.equal(u.usd,0.1204);
  assert.equal(callUsage('claude-sonnet-5-5',{input_tokens:1_000_000,output_tokens:0}).usd,2);
  assert.equal(callUsage('unknown-model',{input_tokens:5,output_tokens:5}).usd,null);
  const sum=addUsage([u,callUsage('claude-sonnet-5-5',{input_tokens:1_000_000,output_tokens:0})]);
  assert.equal(sum.calls,2);assert.equal(sum.usd,2.1204);
});

test('notices, schedules and housekeeping never reach the editor',()=>{
  for(const t of ['Media Advisory: Secretary to Host Roundtable','Chair Powell to speak at conference','FDA Webinar on new guidance','2026년 11월 셋째 주 장관 주요 일정','공무원 채용 공고','인사 발령'])assert.ok(isNotice(t),t);
  for(const t of ['Federal Reserve issues FOMC statement','FDA approves first gene therapy for sickle cell','소비자물가 2.1% 상승'])assert.ok(!isNotice(t),t);
});

test('one feed cannot fill the list, and headline-only stories are dropped',()=>{
  const items=[...Array(40)].map((_,i)=>({feed_id:i<35?'arxiv-ai':'fed',i}));
  const kept=capPerFeed(items,25);
  assert.equal(kept.filter(i=>i.feed_id==='arxiv-ai').length,25);
  assert.equal(kept.filter(i=>i.feed_id==='fed').length,5);
  assert.ok(thinMaterial([{title:'t',material:'(설명 없음, 제목만 있음)'}]));
  assert.ok(!thinMaterial([{title:'t',material:'가'.repeat(500)}]));
});
