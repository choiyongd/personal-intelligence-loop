import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {DeliveryPanel} from '@/components/delivery-panel';
import {ThemePicker} from '@/components/theme-picker';
import {BetaBanner} from '@/components/beta-banner';
import {betaReader,draftSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {editionStories} from '@/lib/articles';
import {generationsLeft,inboxIssues,readInbox} from '@/lib/inbox';
import {industryLabel,levelLabel,plans,regionLabel,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {endBeta} from '../actions';
import {generateEdition} from '../beta-actions';

const notices:Record<string,string>={limit:'오늘 새로 만들 수 있는 3회를 모두 썼어요. 내일 다시 만들 수 있고, 지난 호는 메일함에서 다시 볼 수 있어요.',empty:'고른 관심사에 맞는 읽을거리가 없어요. 분야나 주제를 넓혀 보세요.'};
export const metadata={title:'나의 뉴스레터 · Personal Intelligence Loop'};
export default async function My({searchParams}:{searchParams:Promise<{mail?:string;notice?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const {mail,notice}=await searchParams;
  const available=deliveryConfigured(),reader=available?await currentReader():null;
  const store=await readInbox(),plan=plans[store.plan],left=generationsLeft(store);
  const issues=inboxIssues(selection,store),latest=issues[0];
  const quota=store.plan==='free'?(left?'무료 체험으로 뉴스레터를 1회 만들 수 있어요.':'무료 체험 1회를 사용했어요. 구독하면 하루 3번 새로 만들 수 있어요.'):`오늘 새로 만들 수 있는 횟수 ${left}/${plan.generations}회`;
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">{beta.name}님의 에디션 · {plan.label} 플랜</p><h1>{selection.name}</h1><p>{industryLabel(selection)} · {regionLabel(selection)} · {levelLabel(selection.level)} 수준 · {scheduleLabel(selection)}</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>관심사 수정 ↗</Link><form action={endBeta}><button className="quiet">로그아웃</button></form></div></header>
    {notice&&notices[notice]&&<p className="delivery-notice" role="status">{notices[notice]}</p>}
    <section className="make-edition" aria-label="뉴스레터 만들기">
      <div><p className="eyebrow">{store.plan==='free'?'FREE TRIAL':'SUBSCRIBER'}</p><h2>{latest?'새 뉴스레터를 만들까요?':'첫 뉴스레터를 만들어 보세요'}</h2><p className="muted">{quota} 한 호에는 읽을거리가 최대 {plan.stories}편 담깁니다.</p></div>
      <div className="make-actions">{left>0?<form action={generateEdition}><button className="primary">{latest?'새로 만들기':'뉴스레터 만들기'} →</button></form>:store.plan==='free'?<Link className="button primary" href="/pricing">구독하고 계속 만들기 →</Link>:<span className="muted">내일 다시 만들 수 있어요</span>}<Link className="text-link" href="/my/inbox">메일함 열기 ({issues.length}) →</Link></div>
    </section>
    <DeliveryPanel reader={reader} selection={selection} available={available} mailReady={mailConfigured()} plan={store.plan} notice={mail}/>
    {latest?<><div className="paper-tools"><p className="muted">가장 최근 호 · {new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(latest.at))}</p><ThemePicker current={selection.theme}/></div>
      <BetaBanner/><NewsletterPaper selection={selection} stories={editionStories(selection,latest.articleIds)} editorial issuedAt={new Date(latest.at).toISOString()}/></>
    :<div className="paper-tools"><p className="muted">만들기 전에 지면 디자인을 골라 두세요.</p><ThemePicker current={selection.theme}/></div>}
    </main><footer className="site-footer"><span>loop.</span><span>선택한 관심사가 새로운 읽기로.</span></footer></div>;
}
