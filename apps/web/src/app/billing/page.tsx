import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {BusinessInfo} from '@/components/business-info';
import {TossBillingButton} from '@/components/toss-billing-button';
import {betaReader} from '@/lib/beta';
import {currentReader} from '@/lib/beta-store';
import {billingConfigured,billingTestMode,customerKeyFor,PRICE,subscriptionActive,subscriptionFor,tossClientKey} from '@/lib/billing';
import {appOrigin} from '@/lib/env';
import {operator} from '@/lib/operator';
import {getLocale} from '@/lib/locale';

export const metadata={title:'구독하기 · Personal Intelligence Loop'};
export const dynamic='force-dynamic';
const errors:Record<string,string>={canceled:'카드 등록을 취소했어요.','card-failed':'카드를 등록하지 못했어요. 다른 카드로 다시 시도해 주세요.','payment-failed':'카드는 확인됐지만 첫 결제가 승인되지 않았어요. 한도나 카드 상태를 확인해 주세요.','not-allowed':'메일 주소 확인을 마친 뒤 다시 시도해 주세요.',signin:'로그인이 풀렸어요. 메일로 로그인한 뒤 다시 시도해 주세요.'};
export default async function Billing({searchParams}:{searchParams:Promise<{error?:string;change?:string}>}){
  if(!billingConfigured())redirect('/pricing');
  // Toss Payments takes Korean cards only, so English readers are sent back to pricing until a US payment option exists.
  if(await getLocale()==='en')redirect('/pricing?us=soon');
  const [beta,q]=await Promise.all([betaReader(),searchParams]);
  if(!beta)redirect('/login#beta');
  const reader=await currentReader().catch(()=>null);
  const sub=reader?await subscriptionFor(reader.id):null;
  const changing=subscriptionActive(sub);
  if(changing&&sub!.status!=='canceled'&&!q.change)redirect('/my/billing');
  const confirmed=Boolean(reader?.email&&reader.email_confirmed_at);
  const won=PRICE.toLocaleString('ko-KR');
  return <div className="site-page"><PublicNav active="pricing"/><main id="main" className="policy-page billing-page">
    <p className="eyebrow">SUBSCRIBE</p><h1>loop. 구독</h1>
    {changing&&<p className="delivery-notice">이미 결제한 기간은 그대로이고, 다음 결제부터 새 카드로 결제됩니다.</p>}
    <p className="muted">정한 시간에 나만의 지면을 받아 보세요. 언제든 해지할 수 있고, 결제 후 7일 안에는 전액 환불해 드려요.</p>
    {q.error&&errors[q.error]&&<p className="delivery-notice" role="alert">{errors[q.error]}</p>}
    <section className="billing-card">
      <p className="plan-name">구독 플랜</p><p className="billing-price">월 {won}원<small>부가세 포함 · 매월 자동 결제</small></p>
      <ul><li>매일 또는 매주, 정한 시간에 정기 호를 메일과 메일함으로</li><li>하루 최대 3회 새로 만들기, 한 호에 최대 15편</li><li>지난 호를 날짜·월별로 다시 보기</li></ul>
      {!operator().commerceReady&&<p className="billing-test">사업자 정보가 아직 다 채워지지 않았습니다. 실제 판매 전에 Vercel 환경 변수에 넣어 주세요.</p>}
      {!confirmed?<p className="delivery-notice">구독하려면 먼저 메일 주소를 확인해 주세요. 결제 안내와 영수증, 다른 기기 로그인이 이 주소로 갑니다. <Link href="/my#delivery">메일 주소 확인하기 →</Link></p>
      :<><TossBillingButton clientKey={tossClientKey()} customerKey={customerKeyFor(reader!.id)} origin={appOrigin()} email={reader!.email!} name={reader!.name} label={changing?(sub!.status==='canceled'?'새 카드로 구독 이어 가기':'새 카드 등록하기'):`카드 등록하고 ${won}원 결제하기`}/>
        {billingTestMode()&&<p className="billing-test">테스트 모드입니다. 실제로 돈이 빠져나가지 않아요. 본인 인증 번호는 000000을 넣으면 됩니다.</p>}</>}
    </section>
    <BusinessInfo/>
  </main><footer className="site-footer"><span>loop.</span><span>읽는 만큼, 연결됩니다.</span></footer></div>;
}
