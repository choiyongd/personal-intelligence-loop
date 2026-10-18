import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {betaReader} from '@/lib/beta';
import {readInbox} from '@/lib/inbox';
import {plans} from '@/lib/newsletter';
import {choosePlan} from '../beta-actions';

export const metadata={title:'요금제 · Personal Intelligence Loop'};
const rows:[string,string,string][]=[
  ['뉴스레터 만들기','최초 1회 체험','하루 최대 3회 새로 만들기'],
  ['한 호의 읽을거리','최대 10편','최대 15편'],
  ['정기 발송 (매일·매주 정한 시간)','—','메일함 도착 알림 + 메일'],
  ['메일함 다시 보기','체험 호','일자·날짜·월별로 모두'],
  ['디자인 테마','4종 모두','4종 모두'],
  ['읽는 수준 · 대륙과 국가 선택','모두','모두'],
];
export default async function Pricing({searchParams}:{searchParams:Promise<{plan?:string;from?:string}>}){
  const [beta,store,q]=await Promise.all([betaReader(),readInbox(),searchParams]);
  const current=beta?store.plan:null;
  const Choose=({plan,label,primary}:{plan:'free'|'subscriber';label:string;primary?:boolean})=>!beta?<Link className={`button ${primary?'primary':'secondary'}`} href="/login#beta">베타로 시작하기 →</Link>
    :current===plan?<span className="plan-current">사용 중인 플랜</span>
    :<form action={choosePlan}><input type="hidden" name="plan" value={plan}/><button className={primary?'primary':'secondary'}>{label}</button></form>;
  return <div className="site-page"><PublicNav active="pricing"/><main id="main" className="pricing-page">
    <header className="pricing-head"><p className="eyebrow">PLANS</p><h1>필요한 만큼,<br/>읽는 만큼.</h1><p className="muted">무료로 한 번 만들어 보고, 매일 받아 보고 싶을 때 구독하세요.</p></header>
    {q.from==='limit'&&<p className="delivery-notice" role="status">무료 체험 1회를 사용했어요. 구독하면 하루 3번 새로 만들고, 정한 시간에 정기 호를 받을 수 있어요.</p>}
    {q.plan&&<p className="delivery-notice" role="status">{q.plan==='subscriber'?'구독을 시작했어요. 오늘부터 정기 호가 메일함에 도착합니다.':'무료 플랜으로 바꿨어요.'}</p>}
    <div className="plan-grid">
      <article className={`plan-card${current==='free'?' current':''}`}><p className="plan-name">{plans.free.label}</p><p className="plan-price"><b>0원</b></p><p className="muted">관심사를 골라 한 번 만들어 보는 체험</p><ul><li>뉴스레터 1회 만들기</li><li>읽을거리 최대 {plans.free.stories}편</li><li>디자인 테마 4종</li></ul><Choose plan="free" label="무료로 쓰기"/></article>
      <article className={`plan-card featured${current==='subscriber'?' current':''}`}><p className="plan-name">{plans.subscriber.label} <span className="plan-badge">베타 기간 무료</span></p><p className="plan-price"><b>월 4,900원</b><small>정식 출시 후 예정가</small></p><p className="muted">매일 또는 매주, 정한 시간에 받는 나만의 지면</p><ul><li>하루 최대 3회 새로 만들기</li><li>읽을거리 최대 {plans.subscriber.stories}편</li><li>정기 호 메일함 알림과 메일 발송</li><li>일자·날짜·월별 다시 보기</li></ul><Choose plan="subscriber" label="베타 구독 시작하기" primary/></article>
    </div>
    <table className="plan-table"><caption className="sr-only">플랜 비교</caption><thead><tr><th scope="col">기능</th><th scope="col">무료</th><th scope="col">구독</th></tr></thead><tbody>{rows.map(([f,a,b])=><tr key={f}><th scope="row">{f}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
    <p className="muted pricing-fine">베타 기간에는 결제 없이 구독을 켜고 끌 수 있어요. 정식 출시 전에 결제 방식과 가격을 다시 알려 드립니다. 플랜 정보는 이 브라우저에 저장됩니다.</p>
  </main><footer className="site-footer"><span>loop.</span><span>읽는 만큼, 연결됩니다.</span></footer></div>;
}
