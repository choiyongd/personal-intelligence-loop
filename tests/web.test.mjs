// Run against `npm run start` or `npm run dev`; no Supabase credentials required.
import {test} from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.PIL_WEB_ORIGIN||'http://127.0.0.1:3000';
test('synthetic preview renders clearly labeled content without credentials',async()=>{
  const response=await fetch(`${origin}/demo`);assert.equal(response.status,200);
  assert.match(await response.text(),/실제 뉴스가 아닙니다/);
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.equal(response.headers.get('x-frame-options'),'DENY');
});
test('private routes cannot be accessed without authentication or configuration',async()=>{
  for(const route of ['/feed','/saved','/settings','/operations','/publish']){
    const response=await fetch(`${origin}${route}`,{redirect:'manual'});
    assert.equal(response.status,307);assert.match(response.headers.get('location'),/^\/login/);
  }
});
test('login provides labeled password fields and server-side actions',async()=>{
  const response=await fetch(`${origin}/login`);assert.equal(response.status,200);
  const html=await response.text();assert.match(html,/autoComplete="current-password"/i);
  assert.match(html,/type="email"/);assert.match(html,/minLength="10"/i);
});
test('personalization wizard and newsletter retain selected country in the edition',async()=>{
  const builder=await fetch(`${origin}/customize`);assert.equal(builder.status,200);
  assert.match(await builder.text(),/어떤 세상이/);
  const paper=await fetch(`${origin}/newsletter?industry=technology&topics=ai&scope=country&country=JP&types=research&name=Japan%20Research&cadence=weekly`);
  const html=await paper.text();assert.equal(paper.status,200);
  assert.match(html,/Japan Research/);assert.match(html,/일본/);assert.match(html,/WEEKLY/);
  assert.match(html,/실제 뉴스가 아닙니다/);
});
