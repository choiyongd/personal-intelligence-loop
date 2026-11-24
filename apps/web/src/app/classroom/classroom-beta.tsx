import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {localizedArticle} from '@/lib/articles';
import {buildLesson,educationLevels,type ReadingLevel} from '@/lib/education';
import {LessonReading} from './lesson-reading';
import {ClassroomSampleWriting} from './classroom-sample-writing';

export function ClassroomBeta({level}:{level:ReadingLevel}){
  const article=localizedArticle('ai-explainer','ko')!;
  const sample=buildLesson([article],level,{title:'인공지능에 규칙이 필요한 이유',article_ids:[article.id]});
  return <div className="site-page"><PublicNav active="classroom"/>
    <main id="main" className="education-page education-beta" lang="ko">
      <header className="education-beta-hero">
        <p className="eyebrow">루프 교육용 · 베타</p>
        <h1>뉴스 한 편으로 시작하는<br/> 읽기와 글쓰기 수업</h1>
        <p>학생 수준에 맞춘 기사로 읽고, 출처를 확인하고, 토론에서 나온 생각을 근거 있는 글로 발전시켜 보세요.</p>
        <div className="education-actions">
          <a href="#sample" className="button primary">예시 수업 열기</a>
          <Link href="/login?next=classroom" className="button secondary">학급에 로그인</Link>
        </div>
      </header>
      <section className="education-beta-roles" aria-label="교사와 학생 안내">
        <div><h2>교사</h2><p>학급을 만들고 기사와 난이도를 고르세요. 수업을 발행한 뒤 학생 글을 읽고 피드백을 줄 수 있습니다.</p></div>
        <div><h2>학생</h2><p>교사가 준 코드로 학급에 들어가세요. 글을 제출하기 전에는 초안으로 저장할 수 있습니다.</p></div>
      </section>
      <section id="sample" className="education-sample" aria-label="예시 수업">
        <header className="education-sample-head">
          <div><h2>예시 수업</h2><p>같은 기사가 수준별로 어떻게 달라지는지 살펴보세요.</p></div>
          <nav className="education-levels" aria-label="예시 읽기 수준">
            {educationLevels.map(item=><Link key={item.id} href={`/classroom?sample=1&level=${item.id}#sample`} aria-current={item.id===level?'true':undefined}>{item.label}</Link>)}
          </nav>
        </header>
        <LessonReading content={sample}/>
        <ClassroomSampleWriting/>
      </section>
    </main>
    <footer className="site-footer"><span>loop.</span><Link href="/privacy">개인정보 처리방침</Link></footer>
  </div>;
}
