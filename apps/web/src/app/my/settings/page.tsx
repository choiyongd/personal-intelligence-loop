import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {LookSettings} from '@/components/look-settings';
import {DeliveryPanel} from '@/components/delivery-panel';
import {betaReader,draftSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {readInbox} from '@/lib/inbox';
import {planLabel,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {getL} from '@/lib/locale';
import {saveLook} from '@/app/beta-actions';

export async function generateMetadata(){return {title:`${(await getL()).L('개인 설정','Settings')} · Personal Intelligence Loop`};}
export default async function Settings({searchParams}:{searchParams:Promise<{saved?:string;mail?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const [{saved,mail},{loc,L}]=await Promise.all([searchParams,getL()]);
  const available=deliveryConfigured(),reader=available?await currentReader():null,store=await readInbox();
  return <div className="site-page"><PublicNav active="settings"/><main id="main" className="settings-view">
    <header className="newsletter-view-heading"><div><p className="eyebrow">{loc==='en'?`${beta.name} · ${planLabel(store.plan,loc)} plan`:`${beta.name}님 · ${planLabel(store.plan)} 플랜`}</p><h1>{L('개인 설정','Settings')}</h1><p>{L('읽는 수준과 낱말 풀이, 뉴스레터와 세부 기사의 디자인·색상, 받는 방법을 한곳에서 바꿉니다.','Change your reading level, word help, the design and colors of your newsletter and articles, and how you receive them, all in one place.')}</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>{L('관심사 · 받는 시간','Interests · delivery time')} ({scheduleLabel(selection,loc)}) ↗</Link><Link className="button secondary" href="/my">{L('나의 뉴스레터 ↗','My newsletter ↗')}</Link></div></header>
    {saved&&<p className="delivery-notice" role="status">{L('저장했어요. 이제 뉴스레터와 기사 화면이 새 디자인으로 보입니다.','Saved. Your newsletter and articles now use the new design.')}</p>}
    <LookSettings key={`${selection.theme}${selection.accent}${selection.articleStyle}${selection.articleAccent}${selection.level}${selection.terms}`} initial={{theme:selection.theme,accent:selection.accent,articleStyle:selection.articleStyle,articleAccent:selection.articleAccent,level:selection.level,terms:selection.terms}} action={saveLook} loc={loc}/>
    <DeliveryPanel reader={reader} selection={selection} available={available} mailReady={mailConfigured()} plan={store.plan} notice={mail} loc={loc}/>
  </main><footer className="site-footer"><span>loop.</span><span>{L('나에게 맞는 읽기.','Reading that fits you.')}</span></footer></div>;
}
