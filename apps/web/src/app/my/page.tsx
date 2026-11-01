import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {DeliveryPanel} from '@/components/delivery-panel';
import {ThemePicker} from '@/components/theme-picker';
import {BetaBanner} from '@/components/beta-banner';
import {betaReader,draftSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured} from '@/lib/beta-store';
import {mailState} from '@/lib/edition-mail';
import {MailChoice} from '@/components/mail-choice';
import {mailConfigured} from '@/lib/mailer';
import {editionStories} from '@/lib/articles';
import {ensureArticles,refreshLive} from '@/lib/live/registry';
import {generationsLeft,inboxIssues,readInbox} from '@/lib/inbox';
import {industryLabel,levelLabel,planLabel,plans,regionLabel,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {getL} from '@/lib/locale';
import {intlLocale} from '@/lib/i18n';
import {endBeta} from '../actions';
import {generateEdition} from '../beta-actions';

const notices:Record<string,[string,string]>={limit:['오늘 새로 만들 수 있는 3회를 모두 썼어요. 내일 다시 만들 수 있고, 지난 호는 메일함에서 다시 볼 수 있어요.','You have used all three of today’s editions. You can make more tomorrow, and past issues stay in your mailbox.'],empty:['고른 관심사에 맞는 읽을거리가 없어요. 분야나 주제를 넓혀 보세요.','Nothing matches your interests yet. Try widening your fields or topics.']};
export async function generateMetadata(){return {title:`${(await getL()).L('나의 뉴스레터','My newsletter')} · Personal Intelligence Loop`};}
export default async function My({searchParams}:{searchParams:Promise<{mail?:string;notice?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const [{mail,notice},{loc,L}]=await Promise.all([searchParams,getL()]),en=loc==='en';
  const available=deliveryConfigured(),reader=available?await currentReader():null;
  const mailNow=await mailState(),store=await readInbox(),plan=plans[store.plan],left=generationsLeft(store,new Date(),selection.tz);
  await refreshLive();
  const issues=inboxIssues(selection,store),latest=issues[0];
  if(latest)await ensureArticles(latest.articleIds);
  const quota=store.plan==='free'?(left?L('무료 체험으로 뉴스레터를 1회 만들 수 있어요.','Your free trial lets you make one newsletter.'):L('무료 체험 1회를 사용했어요. 구독하면 하루 3번 새로 만들 수 있어요.','You have used your free trial. Subscribers can make three new editions a day.')):en?`Editions left today: ${left}/${plan.generations}.`:`오늘 새로 만들 수 있는 횟수 ${left}/${plan.generations}회`;
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">{en?`${beta.name}’s edition · ${planLabel(store.plan,loc)} plan`:`${beta.name}님의 에디션 · ${plan.label} 플랜`}</p><h1>{selection.name}</h1><p>{industryLabel(selection,loc)} · {regionLabel(selection,loc)} · {en?`${levelLabel(selection.level,loc)} level`:`${levelLabel(selection.level)} 수준`} · {scheduleLabel(selection,loc)}</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>{L('관심사 수정 ↗','Edit interests ↗')}</Link><form action={endBeta}><button className="quiet">{L('로그아웃','Sign out')}</button></form></div></header>
    {notice&&notices[notice]&&<p className="delivery-notice" role="status">{notices[notice][en?1:0]}</p>}
    <section className="make-edition" aria-label={L('뉴스레터 만들기','Make a newsletter')}>
      <div><p className="eyebrow">{store.plan==='free'?'FREE TRIAL':'SUBSCRIBER'}</p><h2>{latest?L('새 뉴스레터를 만들까요?','Make a new newsletter?'):L('첫 뉴스레터를 만들어 보세요','Make your first newsletter')}</h2><p className="muted">{quota} {en?`Each issue holds up to ${plan.stories} stories.`:`한 호에는 읽을거리가 최대 ${plan.stories}편 담깁니다.`}</p></div>
      <div className="make-actions">{left>0?<form action={generateEdition} className="make-form"><MailChoice mail={mailNow} loc={loc}/><button className="primary">{latest?L('새로 만들기','Make a new one'):L('뉴스레터 만들기','Make my newsletter')} →</button></form>:store.plan==='free'?<Link className="button primary" href="/pricing">{L('구독하고 계속 만들기 →','Subscribe to keep going →')}</Link>:<span className="muted">{L('내일 다시 만들 수 있어요','You can make more tomorrow')}</span>}<Link className="text-link" href="/my/inbox">{L('메일함 열기','Open mailbox')} ({issues.length}) →</Link></div>
    </section>
    <DeliveryPanel reader={reader} selection={selection} available={available} mailReady={mailConfigured()} plan={store.plan} notice={mail} loc={loc}/>
    {latest?<><div className="paper-tools"><p className="muted">{L('가장 최근 호','Latest issue')} · {new Intl.DateTimeFormat(intlLocale(loc),{timeZone:selection.tz,month:'long',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(latest.at))}</p><ThemePicker current={selection.theme} loc={loc}/></div>
      <BetaBanner loc={loc}/><NewsletterPaper selection={selection} stories={editionStories(selection,latest.articleIds)} editorial issuedAt={new Date(latest.at).toISOString()}/></>
    :<div className="paper-tools"><p className="muted">{L('만들기 전에 지면 디자인을 골라 두세요.','Choose a page design before you make it.')}</p><ThemePicker current={selection.theme} loc={loc}/></div>}
    </main><footer className="site-footer"><span>loop.</span><span>{L('선택한 관심사가 새로운 읽기로.','Your interests, turned into new reading.')} · <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></span></footer></div>;
}
