// Paid plans end to end against an in-memory database and a stand-in for the Toss API (no keys, no network).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import ts from 'typescript';
import {PGlite} from '@electric-sql/pglite';

const here=dirname(fileURLToPath(import.meta.url)),lib=resolve(here,'../apps/web/src/lib');
const req=createRequire(import.meta.url);

// ---- a tiny in-memory stand-in for the parts of the Supabase client billing.ts uses ----
const tables={billing_subscriptions:[],billing_payments:[],beta_readers:[]};
const unique={billing_subscriptions:['reader_id','customer_key'],billing_payments:['order_id']};
function query(name){
  const rows=tables[name],filters=[];let op='select',payload=null,single=false,maybe=false,limit=Infinity;
  const match=r=>filters.every(f=>f(r));
  const q={
    select(){return q;},eq(k,v){filters.push(r=>r[k]===v);return q;},in(k,vs){filters.push(r=>vs.includes(r[k]));return q;},
    lte(k,v){filters.push(r=>r[k]<=v);return q;},order(){return q;},limit(n){limit=n;return q;},
    single(){single=true;return q;},maybeSingle(){maybe=true;return q;},
    insert(row){op='insert';payload=row;return q;},update(patch){op='update';payload=patch;return q;},upsert(row){op='upsert';payload=row;return q;},
    then(ok,bad){return Promise.resolve(run()).then(ok,bad);},
  };
  function run(){
    if(op==='insert'){
      if((unique[name]||[]).some(k=>rows.some(r=>r[k]===payload[k])))return {data:null,error:{message:'duplicate'}};
      const row={id:randomBytes(8).toString('hex'),created_at:new Date().toISOString(),plan_id:'basic',...payload};rows.push(row);
      return {data:single?row:[row],error:null};
    }
    if(op==='upsert'){const i=rows.findIndex(r=>r.reader_id===payload.reader_id);if(i>=0)rows[i]={...rows[i],...payload};else rows.push({...payload});return {data:null,error:null};}
    if(op==='update'){const hit=rows.filter(match);hit.forEach(r=>Object.assign(r,payload));return {data:hit,error:null};}
    const out=rows.filter(match).slice(0,limit);
    return {data:maybe||single?(out[0]||null):out,error:null};
  }
  return q;
}
const mails=[];
const stubs={
  'server-only':{},
  './beta-store':{admin:()=>({from:query}),deliveryConfigured:()=>true,readerById:async id=>tables.beta_readers.find(r=>r.id===id)||null},
  './mailer':{mailConfigured:()=>true,sendMail:async m=>{mails.push(m);}},
  './env':{appOrigin:()=>'http://127.0.0.1:3100'},
  './operator':{operatorLine:()=>'loop.'},
};
function load(file){
  const m={exports:{}};
  const out=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const local=spec=>{
    if(spec in stubs)return stubs[spec];
    if(!spec.startsWith('.'))return req(spec);
    const base=resolve(dirname(file),spec);
    for(const f of [base+'.ts',base+'/index.ts'])if(existsSync(f))return load(f);
    throw new Error(`cannot load ${spec}`);
  };
  new Function('require','module','exports',out)(local,m,m.exports);
  return m.exports;
}

// ---- Toss stand-in (same answers as scripts/fake-toss.mjs) ----
const calls=[];let refuse=false;
globalThis.fetch=async(url,init)=>{
  const body=JSON.parse(init.body||'{}'),path=new URL(url).pathname;calls.push({path,body});
  const send=(status,o)=>new Response(JSON.stringify(o),{status,headers:{'content-type':'application/json'}});
  if(path==='/v1/billing/authorizations/issue')return send(200,{billingKey:'bk_'+body.authKey,customerKey:body.customerKey,card:{number:'43301234****123*',cardType:'신용'}});
  if(refuse)return send(400,{code:'REJECT_CARD_COMPANY',message:'한도 초과'});
  return send(200,{paymentKey:'pk_'+body.orderId,orderId:body.orderId,status:'DONE',approvedAt:new Date().toISOString(),receipt:{url:'https://receipt.example/'+body.orderId}});
};

function env(extra={}){
  for(const k of ['BILLING_ALLOW_LIVE','PRICE_BASIC','PRICE_PRO','PRICE_YEARLY'])delete process.env[k];
  Object.assign(process.env,{BILLING_ENABLED:'true',TOSS_CLIENT_KEY:'test_ck_x',TOSS_SECRET_KEY:'test_sk_fake',TOSS_API_BASE:'http://toss.test',BILLING_ENCRYPTION_KEY:randomBytes(32).toString('base64')},extra);
}
env();
const billing=load(`${lib}/billing.ts`);
const plans=load(`${lib}/billing-plans.ts`);
function reader(id){const r={id,name:'독자',email:`${id.slice(0,4)}@example.com`,email_confirmed_at:new Date().toISOString(),plan:'free'};tables.beta_readers.push(r);return r;}

test('plans default to 4,900 / 9,900 / 49,000 and follow the PRICE_* settings',()=>{
  env();
  const p=plans.paidPlans();
  assert.deepEqual([p.basic.price,p.pro.price,p.yearly.price],[4900,9900,49000]);
  assert.equal(p.yearly.months,12);assert.equal(plans.yearlySaving(),9800);
  env({PRICE_BASIC:'5900',PRICE_PRO:'abc',PRICE_YEARLY:'59000'});
  const q=plans.paidPlans();
  assert.deepEqual([q.basic.price,q.pro.price,q.yearly.price],[5900,9900,59000]);
  env();
});

test('payments stay off without BILLING_ENABLED, and live keys are refused unless explicitly allowed',()=>{
  env();assert.equal(billing.billingConfigured(),true);assert.equal(billing.billingTestMode(),true);
  env({BILLING_ENABLED:'false'});assert.equal(billing.billingConfigured(),false);
  env({TOSS_CLIENT_KEY:'live_ck_x',TOSS_SECRET_KEY:'live_sk_x'});assert.equal(billing.billingConfigured(),false);
  env({TOSS_CLIENT_KEY:'live_ck_x',TOSS_SECRET_KEY:'live_sk_x',BILLING_ALLOW_LIVE:'true'});assert.equal(billing.billingConfigured(),true);
  env();
});

test('months roll over to the last day of shorter months, and a year is twelve of them',()=>{
  assert.equal(billing.addMonths(new Date('2026-01-31T03:00:00Z'),1).toISOString(),'2026-02-28T03:00:00.000Z');
  assert.equal(billing.addMonths(new Date('2026-11-14T03:00:00Z'),12).toISOString(),'2027-11-14T03:00:00.000Z');
});

test('each plan charges its own price and period, and a plan change applies at renewal',async()=>{
  env();
  const pro=reader('aaaaaaaa-0000-4000-8000-000000000001');
  assert.equal(await billing.startSubscription(pro,'auth1',billing.customerKeyFor(pro.id),'pro'),'started');
  let sub=await billing.subscriptionFor(pro.id);
  assert.equal(sub.plan_id,'pro');assert.equal(sub.amount,9900);
  assert.equal(tables.beta_readers.find(r=>r.id===pro.id).plan,'subscriber');
  const first=calls.at(-1);assert.equal(first.body.amount,9900);assert.match(first.body.orderName,/프로 구독 .*1개월/);

  const yearly=reader('bbbbbbbb-0000-4000-8000-000000000002');
  assert.equal(await billing.startSubscription(yearly,'auth2',billing.customerKeyFor(yearly.id),'yearly'),'started');
  const ysub=await billing.subscriptionFor(yearly.id);
  assert.equal(ysub.amount,49000);
  const days=(new Date(ysub.current_period_end)-new Date(ysub.started_at))/86_400_000;
  assert.ok(days>=364&&days<=366,`yearly period is ${days} days`);

  // Pro → Basic from the next payment: nothing is charged now, the renewal charges Basic's price.
  assert.equal(await billing.changePlan(pro.id,'basic'),true);
  sub=await billing.subscriptionFor(pro.id);assert.equal(sub.plan_id,'pro');assert.equal(sub.next_plan_id,'basic');
  const n=calls.length;
  const renewal=new Date(new Date(sub.current_period_end).getTime()+60_000);
  const summary=await billing.renewDue(renewal);
  assert.equal(summary.renewed,1);assert.equal(calls.length,n+1);assert.equal(calls.at(-1).body.amount,4900);
  sub=await billing.subscriptionFor(pro.id);
  assert.equal(sub.plan_id,'basic');assert.equal(sub.amount,4900);assert.equal(sub.next_plan_id,null);
  const pay=(await billing.paymentsFor(pro.id)).find(p=>p.amount===4900);assert.equal(pay.plan_id,'basic');assert.equal(pay.status,'paid');
});

test('unknown plans and unconfirmed readers are refused before any card call',async()=>{
  env();
  const r=reader('cccccccc-0000-4000-8000-000000000003');
  const n=calls.length;
  assert.equal(await billing.startSubscription(r,'auth3',billing.customerKeyFor(r.id),'gold'),'not-allowed');
  assert.equal(await billing.startSubscription({...r,email_confirmed_at:null},'auth3',billing.customerKeyFor(r.id),'basic'),'not-allowed');
  assert.equal(calls.length,n);
  assert.equal(await billing.changePlan(r.id,'pro'),false);
});

test('a refused first payment leaves the reader on the free plan',async()=>{
  env();refuse=true;
  try{
    const r=reader('dddddddd-0000-4000-8000-000000000004');
    assert.equal(await billing.startSubscription(r,'auth4',billing.customerKeyFor(r.id),'basic'),'payment-failed');
    assert.equal((await billing.subscriptionFor(r.id)).status,'ended');
    assert.equal(tables.beta_readers.find(x=>x.id===r.id).plan,'free');
  }finally{refuse=false;}
});

test('the plan migration applies on top of the billing tables',async()=>{
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;
    create table public.beta_readers(id uuid primary key default gen_random_uuid(),email text,email_confirmed_at timestamptz);`);
  await db.exec(readFileSync(resolve(here,'../supabase/migrations/202611010001_billing.sql'),'utf8'));
  await db.exec(readFileSync(resolve(here,'../supabase/migrations/202611140001_billing_plans.sql'),'utf8'));
  const {rows:[{id}]}=await db.query('insert into public.beta_readers default values returning id');
  await db.query(`insert into public.billing_subscriptions(reader_id,customer_key,amount,current_period_end) values($1,'pil_x',4900,now())`,[id]);
  assert.equal((await db.query('select plan_id,next_plan_id from public.billing_subscriptions')).rows[0].plan_id,'basic');
  await assert.rejects(db.query(`update public.billing_subscriptions set next_plan_id='gold'`));
  await db.query(`update public.billing_subscriptions set next_plan_id='yearly'`);
  await db.close();
});
