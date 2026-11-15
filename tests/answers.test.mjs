// Reader answers: the tables are server-only, and three reports from different readers hide an answer.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

const root=new URL('../',import.meta.url);
const sql=name=>readFile(new URL(`supabase/migrations/${name}`,root),'utf8');
async function db(){
  const d=new PGlite();
  await d.exec('create role anon;create role authenticated;create role pil_worker;');
  for(const m of ['202610180002_beta_delivery.sql','202611140006_discussion_answers.sql'])await d.exec(await sql(m));
  return d;
}
const reader=async(d,name)=>(await d.query(`insert into public.beta_readers(token_hash,name,selection,unsubscribe_token) values(repeat('a',64),$1,'{}',repeat('u',32)) returning id`,[name])).rows[0].id;
const answer=async(d,rid,body='나는 찬성합니다')=>(await d.query(`insert into public.discussion_answers(article_id,question_key,question,reader_id,author_name,body) values('ai-explainer','q0','질문',$1,'독자',$2) returning id`,[rid,body])).rows[0].id;
const row=async(d,id)=>(await d.query('select status,hidden_reason,report_count from public.discussion_answers where id=$1',[id])).rows[0];

test('three reports hide an answer, and a reader can report it only once',async()=>{
  const d=await db();try{
    const [a,b,c,e]=[await reader(d,'A'),await reader(d,'B'),await reader(d,'C'),await reader(d,'E')];
    const id=await answer(d,a);
    await d.query(`insert into public.discussion_reports(answer_id,reader_id,reason) values($1,$2,'spam')`,[id,b]);
    await assert.rejects(d.query(`insert into public.discussion_reports(answer_id,reader_id) values($1,$2)`,[id,b]),/duplicate key/);
    await d.query(`insert into public.discussion_reports(answer_id,reader_id) values($1,$2)`,[id,c]);
    assert.deepEqual(await row(d,id),{status:'visible',hidden_reason:null,report_count:2});
    await d.query(`insert into public.discussion_reports(answer_id,reader_id,reason) values($1,$2,'abuse')`,[id,e]);
    assert.deepEqual(await row(d,id),{status:'hidden',hidden_reason:'reports',report_count:3});
  }finally{await d.close();}
});
test('answers are checked for length and question keys, and go away with their reader',async()=>{
  const d=await db();try{
    const a=await reader(d,'A');
    await assert.rejects(answer(d,a,' '),/check constraint/);
    await assert.rejects(answer(d,a,'가'.repeat(1001)),/check constraint/);
    await assert.rejects(d.query(`insert into public.discussion_answers(article_id,question_key,question,reader_id,author_name,body) values('x','z9','q',$1,'n','본문')`,[a]),/check constraint/);
    await answer(d,a);
    await d.query('delete from public.beta_readers where id=$1',[a]);
    assert.equal((await d.query('select count(*)::int n from public.discussion_answers')).rows[0].n,0);
  }finally{await d.close();}
});
test('browser keys cannot read or write answers or reports',async()=>{
  const d=await db();try{
    for(const role of ['anon','authenticated']){
      await d.exec(`set role ${role}`);
      try{
        await assert.rejects(d.query('select * from public.discussion_answers'),/permission denied/);
        await assert.rejects(d.query('select * from public.discussion_reports'),/permission denied/);
      }finally{await d.exec('reset role');}
    }
  }finally{await d.close();}
});
