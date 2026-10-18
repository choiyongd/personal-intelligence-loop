import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import ts from 'typescript';
// Compile the shared TS validator in memory, using the project's actual implementation.
const source=await readFile(new URL('../apps/web/src/lib/newsletter.ts',import.meta.url),'utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const localModule={exports:{}};
new Function('require','module','exports',output)(createRequire(import.meta.url),localModule,localModule.exports);
const {defaultSelection,newsletterSelectionSchema,matchesSelection,selectionFromQuery,selectionQuery}=localModule.exports;
const story={id:'1',title:'Atlas AI evaluation model',industry:'unknown',topics:[],countries:['US'],type:'research',source:'test',date:'2026-10-17',evidence:[]};
test('personal selection round-trips through URL without losing country, topics or types',()=>{
  const s={...defaultSelection,industries:['technology','health'],subtopics:['ai','biotech'],scope:'country',countries:['JP','US'],name:'나의 연구 노트',contentTypes:['research'],level:'expert'};
  assert.deepEqual(selectionFromQuery(Object.fromEntries(new URLSearchParams(selectionQuery(s)))),s);
});
test('rejects subtopics from another parent and unsupported countries',()=>{
  assert.equal(newsletterSelectionSchema.safeParse({...defaultSelection,industries:['health'],subtopics:['ai']}).success,false);
  assert.equal(newsletterSelectionSchema.safeParse({...defaultSelection,industries:[]}).success,false);
  assert.equal(newsletterSelectionSchema.safeParse({...defaultSelection,level:'guru'}).success,false);
  assert.equal(newsletterSelectionSchema.safeParse({...defaultSelection,scope:'country',countries:['US','XX']}).success,false);
  assert.equal(newsletterSelectionSchema.safeParse({...defaultSelection,scope:'country',countries:['US','JP','CN','GB','DE','FR']}).success,false);
  assert.equal(newsletterSelectionSchema.safeParse({...defaultSelection,contentTypes:[]}).success,false);
});
test('Korean edition excludes US and country-unknown stories rather than inferring language',()=>{
  const s={...defaultSelection,scope:'kr'};
  assert.equal(matchesSelection(story,s),false);
  assert.equal(matchesSelection({...story,countries:[]},s),false);
  assert.equal(matchesSelection({...story,countries:['KR']},s),true);
});
test('exact selected country and content type govern inclusion',()=>{
  const s={...defaultSelection,scope:'country',countries:['US'],contentTypes:['research']};
  assert.equal(matchesSelection(story,s),true);
  assert.equal(matchesSelection({...story,type:'news'},s),false);
  assert.equal(matchesSelection({...story,countries:['JP']},s),false);
});
test('English AI topic uses word boundaries and does not match said or paid',()=>{
  assert.equal(matchesSelection({...story,title:'The company said it paid staff'},defaultSelection),false);
  assert.equal(matchesSelection(story,defaultSelection),true);
});
test('malformed or injected URL selections fall back to a valid default',()=>{
  assert.deepEqual(selectionFromQuery({industry:'<script>',scope:'country',country:'XX'}),defaultSelection);
});
test('legacy single-field links still open, and several fields widen the match',()=>{
  const legacy=selectionFromQuery({industry:'health',topics:'biotech',scope:'country',country:'JP'});
  assert.deepEqual([legacy.industries,legacy.countries,legacy.level],[['health'],['JP'],'practitioner']);
  const both={...defaultSelection,industries:['technology','health'],subtopics:[],scope:'country',countries:['US','JP']};
  assert.equal(matchesSelection({...story,industry:'health',countries:['JP']},both),true);
  assert.equal(matchesSelection({...story,industry:'energy'},both),false);
});
