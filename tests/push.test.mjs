import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const web=resolve(dirname(fileURLToPath(import.meta.url)),'../apps/web');
function load(file){
  const m={exports:{}};
  const out=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new Function('require','module','exports',out)(()=>({}),m,m.exports);
  return m.exports;
}
const {noticeFor}=load(`${web}/src/lib/push-notice.ts`);
const stories=[{id:'n-261114-aaaa',industry:'technology',title:'반도체 수출 규정 개정'},{id:'n-261114-bbbb',industry:'energy',title:'전력망 계획 발표'},{id:'n-261114-cccc',industry:'technology',title:'AI 안전 지침'}];

test('a notice counts only the stories in the reader’s fields and opens the first one',()=>{
  assert.deepEqual(noticeFor(stories,['technology'],'2026-11-14'),{title:'오늘의 새 소식 2편',body:'반도체 수출 규정 개정 외 1편',url:'/article/n-261114-aaaa',tag:'live-2026-11-14',lang:'ko'});
  assert.equal(noticeFor(stories,['energy'],'2026-11-14').body,'전력망 계획 발표');
});
test('no fields picked means every story; no match means no notice',()=>{
  assert.equal(noticeFor(stories,[],'2026-11-14').title,'오늘의 새 소식 3편');
  assert.equal(noticeFor(stories,['food'],'2026-11-14'),null);
});
test('the service worker only opens same-site links and never caches pages',()=>{
  const sw=readFileSync(`${web}/public/sw.js`,'utf8');
  assert.match(sw,/data\.url\.startsWith\('\/'\)/);
  assert.doesNotMatch(sw,/cache\.put/);
  assert.match(sw,/mode!=='navigate'/);
});
