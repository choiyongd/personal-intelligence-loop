import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';

// Load the dashboard's pure TS modules in memory so the tests use the real implementation.
const lib=resolve(dirname(fileURLToPath(import.meta.url)),'../apps/web/src/lib'),req=createRequire(import.meta.url);
function load(name){
  const m={exports:{}};
  const out=ts.transpileModule(readFileSync(`${lib}/${name}`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new Function('require','module','exports',out)(req,m,m.exports);return m.exports;
}
const {verifySvix}=load('webhook-signature.ts');
const {mailSummary,feedbackSummary,lastDays,perDay,kstDay}=load('ops-metrics.ts');
const {passwordMatchesWith,ownerTokenWith,tokenValidWith,OWNER_TTL_SECONDS}=load('owner-token.ts');

const secret='whsec_'+Buffer.from('a-test-signing-key-32-bytes-long!').toString('base64');
const sign=(id,ts,body,key=secret)=>'v1,'+createHmac('sha256',Buffer.from(key.slice(6),'base64')).update(`${id}.${ts}.${body}`).digest('base64');

test('accepts a correctly signed Resend webhook and rejects tampering, replays and other keys',()=>{
  const now=1_800_000_000,body='{"type":"email.opened","data":{"email_id":"abc"}}',id='msg_1',ts=String(now);
  const h={id,timestamp:ts,signature:sign(id,ts,body)};
  assert.equal(verifySvix(secret,h,body,now),true);
  assert.equal(verifySvix(secret,{...h,signature:`v1,bogus ${h.signature}`},body,now),true,'any listed signature may match');
  assert.equal(verifySvix(secret,h,body.replace('opened','clicked'),now),false);
  assert.equal(verifySvix(secret,h,body,now+301),false,'older than five minutes');
  assert.equal(verifySvix('whsec_'+Buffer.from('other').toString('base64'),h,body,now),false);
  assert.equal(verifySvix(secret,{...h,signature:null},body,now),false);
  assert.equal(verifySvix('plain-secret',h,body,now),false);
});

test('open rate uses delivered mail when known and ignores untracked or unsent rows',()=>{
  const at='2026-11-10T00:00:00Z',row=(o)=>({sent_at:at,delivery:'sent',mail_id:'m',delivered_at:null,opened_at:null,clicked_at:null,bounced_at:null,complained_at:null,...o});
  const s=mailSummary([row({delivered_at:at,opened_at:at,clicked_at:at}),row({delivered_at:at}),row({delivered_at:at,opened_at:at}),row({bounced_at:at}),row({mail_id:null}),row({delivery:'failed'})]);
  assert.deepEqual({sent:s.sent,tracked:s.tracked,delivered:s.delivered,opened:s.opened,clicked:s.clicked,bounced:s.bounced},{sent:5,tracked:4,delivered:3,opened:2,clicked:1,bounced:1});
  assert.equal(s.openRate,2/3);
  assert.equal(mailSummary([]).openRate,null);
  // Before delivery events arrive, everything tracked is the base.
  assert.equal(mailSummary([row({opened_at:at}),row({})]).openRate,.5);
});

test('days are Korean calendar days and rows land on the right one',()=>{
  const now=new Date('2026-11-14T16:30:00Z'); // 01:30 on 11/15 in Seoul
  const days=lastDays(3,now);
  assert.deepEqual(days,['2026-11-13','2026-11-14','2026-11-15']);
  assert.equal(kstDay('2026-11-14T15:00:00Z'),'2026-11-15');
  const grouped=perDay([{t:'2026-11-14T15:00:00Z'},{t:'2026-11-14T14:59:59Z'},{t:'2020-01-01T00:00:00Z'}],r=>kstDay(r.t),days);
  assert.deepEqual(grouped.map(g=>g.rows.length),[0,1,1]);
});

test('feedback summary averages only rated notes and counts open ones',()=>{
  const s=feedbackSummary([{rating:5,handled_at:null},{rating:2,handled_at:'x'},{rating:null,handled_at:null}]);
  assert.deepEqual(s,{total:3,open:2,rated:2,average:3.5,byRating:[0,1,0,0,1]});
});

test('owner sessions need the current password and expire',()=>{
  const pw='correct horse battery',now=Date.now();
  assert.equal(passwordMatchesWith(pw,pw),true);
  assert.equal(passwordMatchesWith(pw,pw+' '),false);
  assert.equal(passwordMatchesWith('short',''),false,'a password under 12 characters never opens the page');
  const token=ownerTokenWith(pw,now);
  assert.equal(tokenValidWith(pw,token,now),true);
  assert.equal(tokenValidWith('another password!',token,now),false,'changing the password signs sessions out');
  assert.equal(tokenValidWith(pw,token,now+(OWNER_TTL_SECONDS+1)*1000),false);
  const [exp,mac]=token.split('.');
  assert.equal(tokenValidWith(pw,`${Number(exp)+999999}.${mac}`,now),false);
  assert.equal(tokenValidWith(pw,`${token}.x`,now),false);
});
