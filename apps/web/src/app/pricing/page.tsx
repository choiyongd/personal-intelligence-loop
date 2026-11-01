import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {betaReader} from '@/lib/beta';
import {readInbox} from '@/lib/inbox';
import {planLabel,plans} from '@/lib/newsletter';
import {choosePlan} from '../beta-actions';
import {billingConfigured} from '@/lib/billing';
import {BusinessInfo} from '@/components/business-info';
import {getL} from '@/lib/locale';

export async function generateMetadata(){return {title:`${(await getL()).L('요금제','Pricing')} · Personal Intelligence Loop`};}
const rowsKo:[string,string,string][]=[
  ['뉴스레터 만들기','최초 1회 체험','하루 최대 3회 새로 만들기'],
  ['한 호의 읽을거리','최대 10편','최대 15편'],
  ['정기 발송 (매일·매주 정한 시간)','—','메일함 도착 알림 + 메일'],
  ['메일함 다시 보기','체험 호','일자·날짜·월별로 모두'],
  ['디자인 테마','4종 모두','4종 모두'],
  ['읽는 수준 · 대륙과 국가 선택','모두','모두'],
];
const rowsEn:[string,string,string][]=[
  ['Make a newsletter','One trial edition','Up to 3 new editions a day'],
  ['Stories per issue','Up to 10','Up to 15'],
  ['Scheduled delivery (daily or weekly, at your time)','—','Mailbox notice + email'],
  ['Reread in your mailbox','Trial edition','Everything, by day, date or month'],
  ['Design themes','All 4','All 4'],
  ['Reading level · continents and countries','All','All'],
];
export default async function Pricing({searchParams}:{searchParams:Promise<{plan?:string;from?:string;us?:string}>}){
  const [beta,store,q,{loc,L}]=await Promise.all([betaReader(),readInbox(),searchParams,getL()]);
  const en=loc==='en',current=beta?store.plan:null;
  // Paid billing runs on Toss Payments (Korean cards only); English readers stay on the free beta until a US option exists.
  const paid=billingConfigured()&&!en,usWaiting=billingConfigured()&&en;
  const Choose=({plan,label,primary}:{plan:'free'|'subscriber';label:string;primary?:boolean})=>!beta?<Link className={`button ${primary?'primary':'secondary'}`} href="/login#beta">{L('베타로 시작하기 →','Join the beta →')}</Link>
    :usWaiting&&plan==='subscriber'&&current!=='subscriber'?<span className="plan-current">Coming soon for US readers</span>
    :current===plan?(paid&&plan==='subscriber'?<Link className="button secondary" href="/my/billing">구독 관리 →</Link>:<span className="plan-current">{L('사용 중인 플랜','Your current plan')}</span>)
    :<form action={choosePlan}><input type="hidden" name="plan" value={plan}/><button className={primary?'primary':'secondary'}>{label}</button></form>;
  const rows=en?rowsEn:rowsKo;
  return <div className="site-page"><PublicNav active="pricing"/><main id="main" className="pricing-page">
    <header className="pricing-head"><p className="eyebrow">PLANS</p><h1>{L(<>필요한 만큼,<br/>읽는 만큼.</>,<>As much as you need,<br/>as much as you read.</>)}</h1><p className="muted">{L('무료로 한 번 만들어 보고, 매일 받아 보고 싶을 때 구독하세요.','Make one for free, and subscribe when you want it every day.')}</p></header>
    {q.us&&<p className="delivery-notice" role="status">Paid subscriptions currently take Korean cards only. A US payment option is on the way; until then, enjoy loop. free during the beta.</p>}
    {q.from==='limit'&&<p className="delivery-notice" role="status">{L('무료 체험 1회를 사용했어요. 구독하면 하루 3번 새로 만들고, 정한 시간에 정기 호를 받을 수 있어요.','You have used your free trial. Subscribers make three new editions a day and get scheduled issues at their chosen time.')}</p>}
    {q.plan&&<p className="delivery-notice" role="status">{q.plan==='subscriber'?L('구독을 시작했어요. 오늘부터 정기 호가 메일함에 도착합니다.','You are subscribed. Scheduled issues start arriving in your mailbox today.'):L('무료 플랜으로 바꿨어요.','You are now on the free plan.')}</p>}
    <div className="plan-grid">
      <article className={`plan-card${current==='free'?' current':''}`}><p className="plan-name">{planLabel('free',loc)}</p><p className="plan-price"><b>{L('0원','$0')}</b></p><p className="muted">{L('관심사를 골라 한 번 만들어 보는 체험','Pick your interests and try one edition')}</p><ul><li>{L('뉴스레터 1회 만들기','Make 1 newsletter')}</li><li>{en?`Up to ${plans.free.stories} stories`:`읽을거리 최대 ${plans.free.stories}편`}</li><li>{L('디자인 테마 4종','4 design themes')}</li></ul><Choose plan="free" label={L('무료로 쓰기','Use it free')}/></article>
      <article className={`plan-card featured${current==='subscriber'?' current':''}`}><p className="plan-name">{planLabel('subscriber',loc)} <span className="plan-badge">{paid?'언제든 해지':L('베타 기간 무료','Free during beta')}</span></p><p className="plan-price">{en?<><b>Free in beta</b><small>US pricing will be announced before launch</small></>:<><b>월 {plans.subscriber.price.toLocaleString('ko-KR')}원</b><small>{paid?'부가세 포함 · 결제 후 7일 안 전액 환불':'정식 출시 후 예정가'}</small></>}</p><p className="muted">{L('매일 또는 매주, 정한 시간에 받는 나만의 지면','Your own edition, daily or weekly, at the time you choose')}</p><ul><li>{L('하루 최대 3회 새로 만들기','Up to 3 new editions a day')}</li><li>{en?`Up to ${plans.subscriber.stories} stories`:`읽을거리 최대 ${plans.subscriber.stories}편`}</li><li>{L('정기 호 메일함 알림과 메일 발송','Scheduled issues in your mailbox and inbox')}</li><li>{L('일자·날짜·월별 다시 보기','Reread by day, date or month')}</li></ul><Choose plan="subscriber" label={paid?'구독하기':L('베타 구독 시작하기','Start the beta subscription')} primary/></article>
    </div>
    <table className="plan-table"><caption className="sr-only">{L('플랜 비교','Plan comparison')}</caption><thead><tr><th scope="col">{L('기능','Feature')}</th><th scope="col">{planLabel('free',loc)}</th><th scope="col">{planLabel('subscriber',loc)}</th></tr></thead><tbody>{rows.map(([f,a,b])=><tr key={f}><th scope="row">{f}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
    {paid?<BusinessInfo/>:<p className="muted pricing-fine">{L('베타 기간에는 결제 없이 구독을 켜고 끌 수 있어요. 정식 출시 전에 결제 방식과 가격을 다시 알려 드립니다. 플랜 정보는 이 브라우저에 저장됩니다.','During the beta you can turn the subscription on and off without paying. We will tell you about payment and pricing before launch. Your plan is saved in this browser.')}</p>}
  </main><footer className="site-footer"><span>loop.</span><span>{L('읽는 만큼, 연결됩니다.','The more you read, the more it connects.')} · <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></span></footer></div>;
}
