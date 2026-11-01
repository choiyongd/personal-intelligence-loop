import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {LookSettings} from '@/components/look-settings';
import {DeliveryPanel} from '@/components/delivery-panel';
import {betaReader,draftSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {readInbox} from '@/lib/inbox';
import {plans,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {saveLook} from '@/app/beta-actions';

export const metadata={title:'개인 설정 · Personal Intelligence Loop'};
export default async function Settings({searchParams}:{searchParams:Promise<{saved?:string;mail?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const {saved,mail}=await searchParams;
  const available=deliveryConfigured(),reader=available?await currentReader():null,store=await readInbox();
  return <div className="site-page"><PublicNav active="settings"/><main id="main" className="settings-view">
    <header className="newsletter-view-heading"><div><p className="eyebrow">{beta.name}님 · {plans[store.plan].label} 플랜</p><h1>개인 설정</h1><p>읽는 수준과 낱말 풀이, 뉴스레터와 세부 기사의 디자인·색상, 받는 방법을 한곳에서 바꿉니다.</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>관심사 · 받는 시간 ({scheduleLabel(selection)}) ↗</Link><Link className="button secondary" href="/my">나의 뉴스레터 ↗</Link></div></header>
    {saved&&<p className="delivery-notice" role="status">저장했어요. 이제 뉴스레터와 기사 화면이 새 디자인으로 보입니다.</p>}
    <LookSettings key={`${selection.theme}${selection.accent}${selection.articleStyle}${selection.articleAccent}${selection.level}${selection.terms}`} initial={{theme:selection.theme,accent:selection.accent,articleStyle:selection.articleStyle,articleAccent:selection.articleAccent,level:selection.level,terms:selection.terms}} action={saveLook}/>
    <DeliveryPanel reader={reader} selection={selection} available={available} mailReady={mailConfigured()} plan={store.plan} notice={mail}/>
  </main><footer className="site-footer"><span>loop.</span><span>나에게 맞는 읽기.</span></footer></div>;
}
