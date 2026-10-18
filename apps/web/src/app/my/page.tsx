import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {DeliveryPanel} from '@/components/delivery-panel';
import {BetaBanner} from '@/components/beta-banner';
import {betaReader,draftSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured,listIssues} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {articleStories} from '@/lib/articles';
import {industryLabel,levelLabel,regionLabel,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {endBeta} from '../actions';

export const metadata={title:'나의 뉴스레터 · Personal Intelligence Loop'};
export default async function My({searchParams}:{searchParams:Promise<{mail?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const {mail}=await searchParams;
  const available=deliveryConfigured(),reader=available?await currentReader():null;
  const issues=reader?await listIssues(reader.id):[];
  const stories=articleStories(selection);
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">{beta.name}님의 에디션 · BETA</p><h1>{selection.name}</h1><p>{industryLabel(selection)} · {regionLabel(selection)} · {levelLabel(selection.level)} 수준 · {scheduleLabel(selection)}</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>관심사 수정 ↗</Link><form action={endBeta}><button className="quiet">로그아웃</button></form></div></header>
    <DeliveryPanel reader={reader} selection={selection} available={available} mailReady={mailConfigured()} issueCount={issues.length} notice={mail}/>
    <BetaBanner/><NewsletterPaper selection={selection} stories={stories} editorial/></main><footer className="site-footer"><span>loop.</span><span>선택한 관심사가 새로운 읽기로.</span></footer></div>;
}
