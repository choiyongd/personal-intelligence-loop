import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

const root=new URL('../',import.meta.url);
const migration=await readFile(new URL('supabase/migrations/202610150001_core.sql',root),'utf8');
const personalMigration=await readFile(new URL('supabase/migrations/202610170001_newsletter_profiles.sql',root),'utf8');
const multiMigration=await readFile(new URL('supabase/migrations/202610180001_multi_select_profiles.sql',root),'utf8');
const deliveryMigration=await readFile(new URL('supabase/migrations/202610180002_beta_delivery.sql',root),'utf8');
const seed=await readFile(new URL('supabase/seed.sql',root),'utf8');
const U1='11111111-1111-4111-8111-111111111111',U2='22222222-2222-4222-8222-222222222222';
const E1='33333333-3333-4333-8333-333333333333',E2='44444444-4444-4444-8444-444444444444';
const A1='55555555-5555-4555-8555-555555555555';

async function db(){
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;
    insert into auth.users values('${U1}'),('${U2}');`);
  await db.exec(migration);await db.exec(personalMigration);await db.exec(multiMigration);await db.exec(deliveryMigration);await db.exec(seed);
  return db;
}
async function as(db,role,uid,fn){
  await db.exec(`set role ${role};select set_config('request.jwt.claim.sub','${uid||''}',false)`);
  try{return await fn();}finally{await db.exec('reset role');}
}
async function setup(db){
  const t1=await as(db,'authenticated',U1,async()=> (await db.query("select public.create_workspace('Team A') as id")).rows[0].id);
  const t2=await as(db,'authenticated',U2,async()=> (await db.query("select public.create_workspace('Team B') as id")).rows[0].id);
  await db.query(`insert into public.events(id,tenant_id,title,anchor_tokens,anchor_numbers,anchor_published_at) values
    ($1,$2,'Atlas AI evaluation policy',array['atlas','evaluation','policy'],'{}',now()),
    ($3,$4,'Different tenant secret',array['tenant','secret'],'{}',now())`,[E1,t1,E2,t2]);
  return {t1,t2};
}

test('migration enables RLS on every application table and denies anon access',async()=>{
  const d=await db();try{
    const tables=(await d.query("select relname,relrowsecurity from pg_class join pg_namespace n on n.oid=relnamespace where n.nspname='public' and relkind='r'")).rows;
    assert.equal(tables.length,15);assert.ok(tables.every(t=>t.relrowsecurity));
    await as(d,'anon','',async()=>{await assert.rejects(d.query('select * from public.events'),/permission denied/);await assert.rejects(d.query("select public.create_workspace('X')"),/permission denied/);});
  }finally{await d.close();}
});
test('workspace RPC derives caller identity; tenants, evidence and logs remain isolated',async()=>{
  const d=await db();try{
    const {t1,t2}=await setup(d);
    await as(d,'authenticated',U1,async()=>{
      assert.deepEqual((await d.query('select id from public.tenants')).rows.map(x=>x.id),[t1]);
      assert.deepEqual((await d.query('select id from public.events')).rows.map(x=>x.id),[E1]);
      assert.equal((await d.query('select * from public.memberships where tenant_id=$1',[t2])).rows.length,0);
      await assert.rejects(d.query("insert into public.memberships values($1,$2,'owner')",[t2,U1]),/permission denied/);
      const result=await d.query("update public.preferences set industry='energy' where tenant_id=$1 returning *",[t2]);assert.equal(result.rows.length,0);
      await assert.rejects(d.query("select public.enqueue_ingestion($1,'demo-rss')",[t2]),/owner required/);
      await assert.rejects(d.query('select public.create_workspace($1)', [' '.repeat(2)]),/check constraint/);
    });
    await as(d,'authenticated','',async()=>{await assert.rejects(d.query("select public.create_workspace('X')"),/authentication required/);});
  }finally{await d.close();}
});
test('composite foreign keys reject cross-tenant article, save and log links',async()=>{
  const d=await db();try{
    const {t1,t2}=await setup(d);
    await assert.rejects(d.query(`insert into public.articles(tenant_id,canonical_url,url_hash,title,published_at,title_tokens,event_id) values($1,'https://news.example.com/a',repeat('a',64),'Atlas evaluation policy',now(),'{}',$2)`,[t1,E2]),/foreign key/);
    await as(d,'authenticated',U1,async()=>{await assert.rejects(d.query('insert into public.saved_events(tenant_id,user_id,event_id) values($1,$2,$3)',[t1,U1,E2]),/foreign key/);});
    await d.query("insert into public.subscriptions values($1,'demo-rss',true)",[t2]);
    const j=(await d.query("insert into public.ingestion_jobs(tenant_id,source_id) values($1,'demo-rss') returning id",[t2])).rows[0].id;
    await assert.rejects(d.query("insert into public.ingestion_logs(tenant_id,job_id,level,code) values($1,$2,'info','test')",[t1,j]),/foreign key/);
  }finally{await d.close();}
});
test('members can read team evidence but only owners configure; saves are personal',async()=>{
  const d=await db();try{
    const {t1}=await setup(d);await d.query("insert into public.memberships values($1,$2,'member')",[t1,U2]);
    await as(d,'authenticated',U1,async()=>{await d.query('insert into public.saved_events(tenant_id,user_id,event_id) values($1,$2,$3)',[t1,U1,E1]);});
    await as(d,'authenticated',U2,async()=>{
      assert.equal((await d.query('select * from public.events where tenant_id=$1',[t1])).rows.length,1);
      assert.equal((await d.query('select * from public.saved_events where tenant_id=$1',[t1])).rows.length,0);
      assert.equal((await d.query("update public.preferences set industry='energy' where tenant_id=$1 returning *",[t1])).rows.length,0);
      await assert.rejects(d.query("insert into public.subscriptions values($1,'demo-rss',true)",[t1]),/row-level security/);
      await assert.rejects(d.query('insert into public.saved_events(tenant_id,user_id,event_id) values($1,$2,$3)',[t1,U1,E1]),/row-level security/);
    });
  }finally{await d.close();}
});
test('license gates subscription, queue, excerpt and evidence writes; queue requests are idempotent',async()=>{
  const d=await db();try{
    const {t1}=await setup(d);
    let j;
    await as(d,'authenticated',U1,async()=>{
      await assert.rejects(d.query("insert into public.subscriptions values($1,'unreviewed-rss',true)",[t1]),/row-level security/);
      await d.query("insert into public.subscriptions values($1,'demo-rss',true)",[t1]);
      j=(await d.query("select public.enqueue_ingestion($1,'demo-rss') as id",[t1])).rows[0].id;
      assert.equal((await d.query("select public.enqueue_ingestion($1,'demo-rss') as id",[t1])).rows[0].id,j);
    });
    await as(d,'pil_worker','',async()=>{
      await assert.rejects(d.query('select * from public.memberships'),/permission denied/);
      await assert.rejects(d.query("update public.license_registry set status='approved'"),/permission denied/);
      await d.query(`insert into public.articles(id,tenant_id,canonical_url,url_hash,title,published_at,title_tokens,event_id) values($1,$2,'https://news.example.com/a',repeat('a',64),'Atlas evaluation policy',now(),'{}',$3)`,[A1,t1,E1]);
      await assert.rejects(d.query(`insert into public.observations(tenant_id,article_id,source_id,external_id,original_url,title,published_at,excerpt,content_hash,license_id) values($1,$2,'demo-rss','1','https://news.example.com/a','Atlas evaluation policy',now(),'unauthorized excerpt',repeat('b',64),'synthetic-v1')`,[t1,A1]),/license policy denied/);
      await d.query(`insert into public.observations(tenant_id,article_id,source_id,external_id,original_url,title,published_at,content_hash,license_id) values($1,$2,'demo-rss','1','https://news.example.com/a','Atlas evaluation policy',now(),repeat('b',64),'synthetic-v1')`,[t1,A1]);
    });
    await d.exec("update public.license_registry set status='revoked' where id='synthetic-v1'");
    await as(d,'authenticated',U1,async()=>{await assert.rejects(d.query("select public.enqueue_ingestion($1,'demo-rss')",[t1]),/source unavailable/);});
    await as(d,'pil_worker','',async()=>{await assert.rejects(d.query("update public.observations set title='Changed evaluation policy'"),/license policy denied/);});
  }finally{await d.close();}
});
test('database enforces URL identity and at most one active job per tenant/source',async()=>{
  const d=await db();try{
    const {t1}=await setup(d);
    await d.query("insert into public.subscriptions values($1,'demo-rss',true)",[t1]);
    await d.query("insert into public.ingestion_jobs(tenant_id,source_id) values($1,'demo-rss')",[t1]);
    await assert.rejects(d.query("insert into public.ingestion_jobs(tenant_id,source_id) values($1,'demo-rss')",[t1]),/unique constraint/);
    await d.query(`insert into public.articles(tenant_id,canonical_url,url_hash,title,published_at,title_tokens,event_id) values($1,'https://news.example.com/a',repeat('a',64),'Atlas evaluation policy',now(),'{}',$2)`,[t1,E1]);
    await assert.rejects(d.query(`insert into public.articles(tenant_id,canonical_url,url_hash,title,published_at,title_tokens,event_id) values($1,'https://news.example.com/a',repeat('a',64),'Atlas evaluation policy',now(),'{}',$2)`,[t1,E1]),/unique constraint/);
  }finally{await d.close();}
});

test('newsletter profiles are private per user even inside the same tenant',async()=>{
  const d=await db();try{
    const {t1,t2}=await setup(d);
    await d.query("insert into public.memberships values($1,$2,'member')",[t1,U2]);
    await as(d,'authenticated',U1,async()=>{
      await d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry,subtopics,scope,country,name) values($1,$2,'technology',array['ai'],'country','JP','Owner edition')",[t1,U1]);
      await assert.rejects(d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry) values($1,$2,'technology')",[t1,U2]),/row-level security/);
      await assert.rejects(d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry) values($1,$2,'technology')",[t2,U1]),/row-level security/);
    });
    await as(d,'authenticated',U2,async()=>{
      assert.equal((await d.query('select * from public.newsletter_profiles where tenant_id=$1',[t1])).rows.length,0);
      await d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry,subtopics,scope) values($1,$2,'health',array['biotech'],'kr')",[t1,U2]);
      assert.equal((await d.query('select * from public.newsletter_profiles where tenant_id=$1',[t1])).rows.length,1);
      assert.equal((await d.query("update public.newsletter_profiles set name='Wrong writer' where user_id=$1 returning *",[U1])).rows.length,0);
    });
    await as(d,'pil_worker','',async()=>{await assert.rejects(d.query('select * from public.newsletter_profiles'),/permission denied/);});
  }finally{await d.close();}
});
test('profile check constraints enforce topic parent, known country and nonempty types',async()=>{
  const d=await db();try{
    const {t1}=await setup(d);
    await as(d,'authenticated',U1,async()=>{
      await assert.rejects(d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry,subtopics) values($1,$2,'health',array['ai'])",[t1,U1]),/check constraint/);
      await assert.rejects(d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry,country) values($1,$2,'technology','XX')",[t1,U1]),/check constraint/);
      await assert.rejects(d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry,content_types) values($1,$2,'technology','{}')",[t1,U1]),/check constraint/);
    });
  }finally{await d.close();}
});

test('profiles accept several fields, topics and countries but only from the selected fields',async()=>{
  const d=await db();try{
    const {t1}=await setup(d);
    await as(d,'authenticated',U1,async()=>{
      const row=(await d.query("insert into public.newsletter_profiles(tenant_id,user_id,industry,industries,subtopics,scope,country,countries,level) values($1,$2,'technology',array['technology','health'],array['ai','biotech'],'country','US',array['US','JP'],'intro') returning industry,country,level",[t1,U1])).rows[0];
      assert.deepEqual(row,{industry:'technology',country:'US',level:'intro'});
      await assert.rejects(d.query("update public.newsletter_profiles set subtopics=array['ai','battery'] where user_id=$1",[U1]),/check constraint/);
      await assert.rejects(d.query("update public.newsletter_profiles set level='guru' where user_id=$1",[U1]),/check constraint/);
      await assert.rejects(d.query("update public.newsletter_profiles set countries=array['US','XX'] where user_id=$1",[U1]),/check constraint/);
      const moved=(await d.query("update public.newsletter_profiles set industries=array['energy'],subtopics=array['battery'] where user_id=$1 returning industry",[U1])).rows[0];
      assert.equal(moved.industry,'energy');
    });
  }finally{await d.close();}
});

test('beta reader tables are server-only and one scheduled issue exists per reader per day',async()=>{
  const d=await db();try{
    const reader=(await d.query("insert into public.beta_readers(token_hash,selection,unsubscribe_token) values(repeat('a',64),'{}'::jsonb,repeat('u',32)) returning id")).rows[0].id;
    const issue=`insert into public.beta_issues(reader_id,kind,issue_date,title,selection,article_ids) values($1,'scheduled','2026-10-18','Brief','{}'::jsonb,array['ai-explainer'])`;
    await d.query(issue,[reader]);
    await assert.rejects(d.query(issue,[reader]),/unique constraint/);
    await assert.rejects(d.query("update public.beta_readers set delivery_enabled=true where id=$1",[reader]),/check constraint/);
    for(const role of ['anon','authenticated'])await as(d,role,role==='authenticated'?U1:'',async()=>{
      await assert.rejects(d.query('select * from public.beta_readers'),/permission denied/);
      await assert.rejects(d.query('select * from public.beta_issues'),/permission denied/);
    });
  }finally{await d.close();}
});
