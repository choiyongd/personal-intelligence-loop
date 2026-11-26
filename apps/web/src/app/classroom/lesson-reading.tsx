import Link from 'next/link';
import type {LessonContent} from '@/lib/education';

function sourceHref(value:string){
  try {
    const url=new URL(value);
    if(['https:','http:'].includes(url.protocol)&&!url.username&&!url.password)return url.href;
  } catch {}
  return undefined;
}

export function LessonReading({content}:{content:LessonContent}){
  return <section className="education-paper" aria-label="수업 자료">
    <header className="education-paper-head">
      <span className="education-paper-mark" aria-hidden="true">loop.</span>
      <span>{content.reading_label} 읽기 자료</span>
    </header>
    {content.teacher_note&&<p className="education-teacher-note">{content.teacher_note}</p>}
    {content.stories.map(story=><article key={story.article_id}>
      <header className="education-reading-head"><p>기사 읽기</p><h2>{story.title}</h2>
        <p><time dateTime={story.as_of}>{story.as_of}</time> 기준
          {/^[a-z0-9-]+$/.test(story.article_id)&&<> · <Link href={`/article/${story.article_id}?level=${content.reading_level==='upper_elementary'?'intro':content.reading_level==='high_school'?'expert':'practitioner'}`}>기사 전문 읽기</Link></>}
        </p>
      </header>
      {story.sections.map((section,index)=><section className="education-reading-section" key={index}>
        <h3>{section.heading}</h3>
        {section.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
      </section>)}
      <div className="education-reference">
        {story.vocabulary.length>0&&<details><summary>낱말 도움</summary><dl>{story.vocabulary.map(term=><div key={term.term}><dt>{term.term}</dt><dd>{term.meaning}</dd></div>)}</dl></details>}
        {story.facts.length>0&&<details><summary>근거와 수치</summary><ul>{story.facts.map((fact,index)=><li key={index}>{fact.label} · {fact.value} [{fact.source}]</li>)}</ul></details>}
        <details><summary>근거 출처 {story.sources.length}개</summary><ol>{story.sources.map(source=>{
          const href=sourceHref(source.url);
          const title=source.publisher+' · '+source.title;
          return <li key={source.number} value={source.number}>{href?<a href={href} target="_blank" rel="noreferrer">{title}</a>:title}</li>;
        })}</ol></details>
      </div>
      <section className="education-discussion"><h3>사실 확인과 토론</h3>
        <ul>{[...story.questions.comprehension,...story.questions.discussion].map((question,index)=><li key={index}>{question}</li>)}</ul>
      </section>
    </article>)}
    <section className="education-writing-guide" aria-label="글쓰기 과제">
      <h2>글쓰기 과제</h2><p>{content.writing.prompt}</p>
      <p>권장 {content.writing.suggested_min_chars}~{content.writing.suggested_max_chars}자</p>
      <ol>{content.writing.outline.map(item=><li key={item}>{item}</li>)}</ol>
      <details><summary>첫 문장 도움과 제출 전 점검</summary>
        <h3>이렇게 시작해 보세요</h3><ul>{content.writing.sentence_starters.map(item=><li key={item}>{item}</li>)}</ul>
        <h3>내 글 점검</h3><ul>{content.writing.checklist.map(item=><li key={item}>{item}</li>)}</ul>
      </details>
    </section>
  </section>;
}
