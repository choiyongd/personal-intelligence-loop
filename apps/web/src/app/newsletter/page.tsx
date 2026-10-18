import Link from 'next/link';
import {notFound} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {selectedDemoStories} from '@/lib/demo-stories';
import {selectionFromQuery,selectionQuery,regionLabel,industryFor} from '@/lib/newsletter';
export default async function Newsletter({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  if(process.env.ENABLE_DEMO==='false')notFound();
  const selection=selectionFromQuery(await searchParams),stories=selectedDemoStories(selection);
  return <div className="site-page"><PublicNav active="demo"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">YOUR VERY OWN EDITION</p><h1>이제, 당신의 시선으로.</h1><p>{industryFor(selection.industry).label} · {regionLabel(selection)} · 선택한 관심사로 구성한 지면입니다.</p></div><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>관심사 수정 ↗</Link></header><div className="sample-banner"><span className="live-dot">디자인 미리보기</span><span>실제 뉴스가 아닙니다. 직접 작성한 합성 콘텐츠로 선택 결과를 보여드립니다.</span><Link href="/settings">로그인 후 실제 자료 연결 →</Link></div><NewsletterPaper selection={selection} stories={stories} demo/></main><footer className="site-footer"><span>loop.</span><span>선택한 관심사가 새로운 읽기로.</span></footer></div>;
}
