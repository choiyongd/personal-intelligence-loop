'use client';

import {useState} from 'react';

export function ClassroomSampleWriting(){
  const [draft,setDraft]=useState('');
  return <section className="panel education-exercise">
    <h2>글쓰기 연습</h2>
    <p>이 칸에 쓰면 글자 수를 바로 확인할 수 있어요. 연습한 글은 저장되지 않습니다.</p>
    <label htmlFor="sample-draft">연습 글 · {draft.length}자</label>
    <textarea id="sample-draft" rows={5} value={draft} onChange={event=>setDraft(event.target.value)} maxLength={6000}/>
  </section>;
}
