import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {PGlite} from '@electric-sql/pglite';
// Compile the shared word-book logic in memory, using the project's actual implementation.
const source=await readFile(new URL('../apps/web/src/lib/words.ts',import.meta.url),'utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function('require','module','exports',output)(createRequire(import.meta.url),mod,mod.exports);
const {addSighting,reviewWord,dueWords,nextDue,mergeWords,cleanWords,stageOf,DAY,MAX_WORDS}=mod.exports;
const T0=Date.UTC(2026,10,14,9);
const s={term:'관세',meaning:'수입품에 매기는 세금',lang:'ko',articleId:'trade-explainer',articleTitle:'무역 해설'};

test('opening a meaning saves the word once and counts later sightings',()=>{
  let {list,added}=addSighting([],s,T0);
  assert.equal(added,true);assert.equal(list.length,1);assert.equal(list[0].box,0);assert.equal(list[0].dueAt,T0);
  ({list,added}=addSighting(list,{...s,articleId:'other',articleTitle:'다른 글'},T0+1000));
  assert.equal(added,false);assert.equal(list.length,1);assert.equal(list[0].seen,2);assert.equal(list[0].articleId,'other');
  assert.equal(addSighting(list,{...s,lang:'en'},T0).list.length,2,'the same term in another edition language is a separate word');
});
test('review moves known words up the 1-3-7-14-30 day ladder and resets forgotten ones',()=>{
  let w=addSighting([],s,T0).word;
  const days=[];
  for(let i=0;i<6;i++){w=reviewWord(w,true,T0);days.push((w.dueAt-T0)/DAY);}
  assert.deepEqual(days,[1,3,7,14,30,30]);assert.equal(stageOf(w),'known');
  w=reviewWord(w,false,T0+5);assert.equal(w.box,0);assert.equal(w.dueAt,T0+5);assert.equal(stageOf(w),'new');
});
test('only due words come up for review, least known first',()=>{
  const a=reviewWord(addSighting([],s,T0).word,true,T0);
  const b=addSighting([],{...s,term:'환율'},T0).word;
  let c=addSighting([],{...s,term:'금리'},T0-DAY).word;for(let i=0;i<4;i++)c=reviewWord(c,true,T0-DAY);
  assert.deepEqual(dueWords([a,b,c],T0+1).map(w=>w.term),['환율']);
  assert.deepEqual(dueWords([a,b,c],T0+2*DAY).map(w=>w.term),['환율','관세']);
  assert.equal(nextDue([a,b,c],T0+1),T0+DAY);
});
test('merging two copies keeps every sighting and the latest review',()=>{
  const base=addSighting([],s,T0).word;
  const phone={...reviewWord(base,true,T0+DAY),seen:1};
  const laptop={...base,seen:4,lastAt:T0+2*DAY};
  const [m]=mergeWords([laptop],[phone]);
  assert.equal(m.seen,4);assert.equal(m.lastAt,T0+2*DAY);assert.equal(m.box,1);assert.equal(m.reviewedAt,T0+DAY);
});
test('rejects malformed input and keeps the book within its limit',()=>{
  assert.deepEqual(cleanWords([{term:'',meaning:'x',lang:'ko'},{term:'a',meaning:'b',lang:'fr'},null,'x']),[]);
  const many=Array.from({length:MAX_WORDS+20},(_,i)=>({term:`w${i}`,meaning:'m',lang:'en',firstAt:T0+i,lastAt:T0+i}));
  const kept=cleanWords(many);
  assert.equal(kept.length,MAX_WORDS);assert.equal(kept.some(w=>w.term==='w0'),false,'the word seen longest ago goes first');
  assert.equal(cleanWords([{term:'x'.repeat(500),meaning:'m',lang:'ko'}])[0].term.length,120);
});
test('word book table is server-only and enforces one row per reader, language and word',async()=>{
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create table public.beta_readers(id uuid primary key default gen_random_uuid());`);
  await db.exec(await readFile(new URL('../supabase/migrations/202611140001_word_book.sql',import.meta.url),'utf8'));
  const id=(await db.query('insert into public.beta_readers default values returning id')).rows[0].id;
  await db.query(`insert into public.reader_words(reader_id,lang,term,meaning) values($1,'ko','관세','세금')`,[id]);
  await assert.rejects(db.query(`insert into public.reader_words(reader_id,lang,term,meaning) values($1,'ko','관세','다른 뜻')`,[id]));
  await assert.rejects(db.query(`insert into public.reader_words(reader_id,lang,term,meaning,box) values($1,'ko','환율','x',6)`,[id]));
  await db.exec('set role anon');
  await assert.rejects(db.query('select * from public.reader_words'));
  await db.exec('reset role');
  await db.query('delete from public.beta_readers where id=$1',[id]);
  assert.equal((await db.query('select count(*)::int n from public.reader_words')).rows[0].n,0,'deleting a reader deletes their words');
});
