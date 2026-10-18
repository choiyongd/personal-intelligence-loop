// Ephemeral PostgreSQL protocol harness. Auth/users are a test stub, not Supabase Auth.
import {PGlite} from '@electric-sql/pglite';
import {PGLiteSocketServer} from '@electric-sql/pglite-socket';
import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const root=new URL('../',import.meta.url);
const db=await PGlite.create();
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`);
await db.exec(await readFile(new URL('supabase/migrations/202610150001_core.sql',root),'utf8'));
await db.exec(await readFile(new URL('supabase/migrations/202610170001_newsletter_profiles.sql',root),'utf8'));
await db.exec(await readFile(new URL('supabase/seed.sql',root),'utf8'));
await db.exec(`insert into public.tenants(id,name) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Integration A'),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Integration B');
insert into public.sources values('slow-rss','Rate limit fixture','fixture_rss','demo.xml',array['news.example.com'],'synthetic-v1',true,60);
insert into public.subscriptions values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','demo-rss',true),('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','demo-mirror',true),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','demo-rss',true);
insert into public.subscriptions values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','slow-rss',true);
insert into public.ingestion_jobs(tenant_id,source_id,available_at) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','slow-rss',now()+interval '1 day');
set role pil_worker;`);
const server=new PGLiteSocketServer({db,host:'127.0.0.1',port:55433,maxConnections:10});
await server.start();
const python=process.env.PIL_TEST_PYTHON||(process.platform==='win32'?'.venv/Scripts/python.exe':'.venv/bin/python');
try {
  const exit=await new Promise((resolve,reject)=>{
    const child=spawn(python,['-m','pytest','worker/tests/integration_pipeline.py','-q'],{
      cwd:root,stdio:'inherit',env:{...process.env,PIL_TEST_DSN:'postgresql://postgres@127.0.0.1:55433/postgres?sslmode=disable'}
    });
    child.on('error',reject);child.on('exit',resolve);
  });
  if(exit!==0)process.exitCode=1;
}finally{await server.stop();await db.close();}
