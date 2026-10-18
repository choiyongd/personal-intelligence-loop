import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {betaReader,draftSelection} from '@/lib/beta';
import {articleStories} from '@/lib/articles';
import {industryLabel,levelLabel,regionLabel,selectionQuery} from '@/lib/newsletter';
import {endBeta} from '../actions';
import {BetaBanner} from '@/components/beta-banner';

export const metadata={title:'나의 뉴스레터 · Personal Intelligence Loop'};
export default async function My(){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const stories=articleStories(selection);
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">{beta.name}님의 에디션 · BETA</p><h1>{selection.name}</h1><p>{industryLabel(selection)} · {regionLabel(selection)} · {levelLabel(selection.level)} 수준으로 읽기</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>관심사 수정 ↗</Link><form action={endBeta}><button className="quiet">로그아웃</button></form></div></header><BetaBanner/><NewsletterPaper selection={selection} stories={stories} editorial/></main><footer className="site-footer"><span>loop.</span><span>선택한 관심사가 새로운 읽기로.</span></footer></div>;
}
