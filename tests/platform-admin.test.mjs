import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

const migration=await readFile(new URL('../supabase/migrations/20261115000100_platform_admin.sql',import.meta.url),'utf8');
const staff='11111111-1111-4111-8111-111111111111',customer='22222222-2222-4222-8222-222222222222';

test('only an explicitly registered verified account reads metrics or records finance; revocation is immediate',async()=>{
  const db=new PGlite();
  try {
    await db.exec(`create role anon;create role authenticated;create role pil_worker;
      create schema private;grant usage on schema private to authenticated;
      create schema auth;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,
        is_anonymous boolean not null default false,created_at timestamptz not null default now(),
        last_sign_in_at timestamptz,deleted_at timestamptz,banned_until timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      insert into auth.users(id,email,email_confirmed_at,last_sign_in_at)
        values('${staff}','staff@example.com',now(),now()),('${customer}','customer@example.com',now(),now());`);
    await db.exec(migration);
    await db.query('select private.grant_platform_admin($1)',[staff]);

    const as=async(role,id,fn)=>{
      await db.exec(`set role ${role}; select set_config('request.jwt.claim.sub','${id}',false)`);
      try{return await fn();}finally{await db.exec('reset role');}
    };
    const month='2026-01-01';
    const overview=async()=> (await db.query('select public.admin_overview($1) as result',[month])).rows[0].result;
    const record=(gross,refunds,costs)=> db.query('select public.admin_record_finance($1,$2,$3,$4)',[month,gross,refunds,costs]);

    await as('anon','',()=>assert.rejects(overview,/permission denied/));
    await as('authenticated',customer,async()=>{
      await assert.rejects(overview,/administrator required/);
      await assert.rejects(record(100,0,0),/administrator required/);
      await assert.rejects(db.query('select private.grant_platform_admin($1)',[customer]),/permission denied/);
    });
    await as('authenticated',staff,async()=>{
      const first=await overview();
      assert.deepEqual(first.customers,{total:1,new30:1,active30:1});
      assert.equal(first.finance,null);
      assert.doesNotMatch(JSON.stringify(first),/@example\.com/);
      await record(100,10,25);
      await record(150,20,35);
      const {gross,refunds,costs}= (await overview()).finance;
      assert.deepEqual({gross,refunds,costs},{gross:150,refunds:20,costs:35});
    });
    await db.query('delete from private.platform_admins where user_id=$1',[staff]);
    await as('authenticated',staff,async()=>{
      await assert.rejects(overview,/administrator required/);
      await assert.rejects(record(1,0,0),/administrator required/);
    });
  } finally { await db.close(); }
});
