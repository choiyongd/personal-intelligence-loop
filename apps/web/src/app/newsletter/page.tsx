import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {articleStories} from '@/lib/articles';
import {selectionFromQuery,selectionQuery,regionLabel,industryLabel,levelLabel,plans} from '@/lib/newsletter';
import {BetaBanner} from '@/components/beta-banner';

export default async function Newsletter({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const selection=selectionFromQuery(await searchParams),stories=articleStories(selection).slice(0,plans.free.stories);
  return <div className="site-page"><PublicNav active="demo"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">YOUR VERY OWN EDITION</p><h1>이제, 당신의 시선으로.</h1><p>{industryLabel(selection)} · {regionLabel(selection)} · {levelLabel(selection.level)} 수준으로 구성한 지면입니다.</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>관심사 수정 ↗</Link><Link className="button primary" href="/login#beta">베타로 저장하기 ↗</Link></div></header><BetaBanner/><NewsletterPaper selection={selection} stories={stories} editorial/></main><footer className="site-footer"><span>loop.</span><span>선택한 관심사가 새로운 읽기로.</span></footer></div>;
}
