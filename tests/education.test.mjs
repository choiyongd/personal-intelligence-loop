import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

const root=new URL('../supabase/migrations/',import.meta.url);
const teacher='11111111-1111-4111-8111-111111111111';
const reader='22222222-2222-4222-8222-222222222222';
const classmate='33333333-3333-4333-8333-333333333333';
const stranger='44444444-4444-4444-8444-444444444444';
const workspace='55555555-5555-4555-8555-555555555555';
const foreignWorkspace='66666666-6666-4666-8666-666666666666';
const lesson='77777777-7777-4777-8777-777777777777';
const writing='인공지능 규칙을 만들 때 누구에게 어떤 영향을 주는지 함께 생각해야 한다.';

test('classroom publication, invitation rotation, writing submission and feedback enforce classroom boundaries',async()=>{
  const db=new PGlite();
  try{
    await db.exec(`create role anon;create role authenticated;create schema auth;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to authenticated;
      insert into auth.users values('${teacher}'),('${reader}'),('${classmate}'),('${stranger}');`);
    for(const file of ['202610150001_core.sql','20261122000100_education_classrooms.sql']){
      await db.exec(await readFile(new URL(file,root),'utf8'));
    }
    await db.query('insert into public.tenants(id,name) values($1,$3),($2,$4)',[workspace,foreignWorkspace,'학교 A','학교 B']);
    await db.query("insert into public.memberships values ($1,$2,'owner'),($3,$4,'owner')",[workspace,teacher,foreignWorkspace,stranger]);
    const as=async (user,work)=>{
      await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user]);
      await db.exec('set role authenticated');
      try{return await work();}finally{await db.exec('reset role');}
    };
    const sql=(statement,values=[])=>db.query(statement,values);
    const scalar=async(statement,values=[])=>Object.values((await sql(statement,values)).rows[0]??{})[0];
    const denied=error=>error.code==='42501';
    const classId=await as(teacher,()=>scalar("insert into education_classes(tenant_id,name,reading_level) values($1,'1반','middle_school') returning id",[workspace]));
    await as(stranger,async()=>{
      assert.deepEqual((await sql('select id from education_classes where id=$1',[classId])).rows,[]);
      await assert.rejects(()=>sql('select rotate_education_invite($1)',[classId]),denied);
      await assert.rejects(()=>sql("insert into education_classes(tenant_id,name,reading_level) values($1,'비인가','middle_school')",[workspace]),denied);
    });
    const first=await as(teacher,()=>scalar('select rotate_education_invite($1)',[classId]));
    const next=await as(teacher,()=>scalar('select rotate_education_invite($1)',[classId]));
    assert.match(next.code,/^[a-f0-9]{64}$/);
    assert.notEqual(next.code,first.code);
    await as(reader,async()=>{
      await assert.rejects(()=>sql('select join_education_class($1,$2)',[first.code,'독자']),error=>error.code==='22023');
      assert.equal(await scalar('select join_education_class($1,$2)',[next.code,'독자']),classId);
      assert.equal(await scalar('select join_education_class($1,$2)',[next.code,'다른 이름']),classId);
      assert.equal(await scalar('select display_name from education_students where class_id=$1',[classId]),'독자');
      assert.equal(await scalar('select count(*)::int from memberships where tenant_id=$1',[workspace]),0);
      await assert.rejects(()=>sql('select code_hash from private.education_invites'),denied);
    });
    await as(classmate,()=>scalar('select join_education_class($1,$2)',[next.code,'반 친구']));
    await sql("update private.education_invites set expires_at=now()-interval '1 second' where class_id=$1",[classId]);
    await as(stranger,()=>assert.rejects(()=>sql('select join_education_class($1,$2)',[next.code,'외부인']),error=>error.code==='22023'));

    await as(teacher,()=>sql("insert into education_lessons(id,class_id,title,content) values($1,$2,'읽기와 글쓰기','{}')",[lesson,classId]));
    await as(reader,async()=>{
      assert.deepEqual((await sql('select id from education_lessons where id=$1',[lesson])).rows,[]);
      await assert.rejects(()=>sql('select * from save_education_draft($1,$2,$3)',[lesson,classId,writing]),denied);
      assert.equal(await scalar('select count(*)::int from education_students where class_id=$1',[classId]),1);
    });
    await as(teacher,()=>sql('update education_lessons set published_at=now() where id=$1',[lesson]));
    await as(teacher,async()=>assert.equal((await sql("update education_lessons set title='변경' where id=$1",[lesson])).affectedRows,0));
    await as(reader,async()=>{
      assert.equal(await scalar('select id from education_lessons where id=$1',[lesson]),lesson);
      assert.equal(await scalar('select body from save_education_draft($1,$2,$3)',[lesson,classId,'짧은 초안']), '짧은 초안');
      await assert.rejects(()=>sql('update education_writings set submitted_at=now() where lesson_id=$1',[lesson]),error=>error.code==='23514');
      assert.equal(await scalar('select body from save_education_draft($1,$2,$3)',[lesson,classId,writing]),writing);
      await assert.rejects(()=>sql("update education_writings set feedback='가짜 교사 피드백' where lesson_id=$1",[lesson]),denied);
    });
    await as(teacher,async()=>{
      assert.deepEqual((await sql('select body from education_writings where lesson_id=$1',[lesson])).rows,[]);
      assert.equal(await scalar('select review_education_writing($1,$2,$3)',[lesson,reader,'미제출']),false);
    });
    await as(reader,async()=>{
      assert.equal((await sql("update education_writings set submitted_at='2000-01-01' where lesson_id=$1",[lesson])).affectedRows,1);
      assert.equal(await scalar('select submitted_at > date \'2001-01-01\' from education_writings where lesson_id=$1',[lesson]),true);
      assert.equal((await sql("update education_writings set body='제출 뒤 수정' where lesson_id=$1",[lesson])).affectedRows,0);
      assert.equal(await scalar('select review_education_writing($1,$2,$3)',[lesson,reader,'학생의 위조 시도']),false);
    });
    await as(classmate,async()=>assert.deepEqual((await sql('select body,feedback from education_writings where lesson_id=$1',[lesson])).rows,[]));
    await as(teacher,async()=>{
      assert.equal(await scalar('select body from education_writings where lesson_id=$1',[lesson]),writing);
      assert.equal(await scalar('select review_education_writing($1,$2,$3)',[lesson,reader,'기사 근거를 잘 활용했습니다.']),true);
    });
    await as(reader,async()=>assert.equal(await scalar('select feedback from education_writings where lesson_id=$1',[lesson]),'기사 근거를 잘 활용했습니다.'));
  }finally{await db.close();}
});
