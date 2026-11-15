import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {BusinessInfo} from '@/components/business-info';
import {betaReader} from '@/lib/beta';
import {currentReader} from '@/lib/beta-store';
import {billingConfigured,paymentsFor,subscriptionActive,subscriptionFor} from '@/lib/billing';
import {cancelPlan,changeBillingPlan,resumePlan} from '../../beta-actions';
import {PAID_PLAN_IDS,paidPlans,priceLabel,won} from '@/lib/billing-plans';

export const metadata={title:'구독 관리 · Personal Intelligence Loop'};
export const dynamic='force-dynamic';
const notices:Record<string,string>={'card-updated':'새 카드를 등록했어요. 다음 결제부터 이 카드로 결제됩니다.',started:'구독을 시작했어요. 결제 확인 메일을 보냈어요.',canceled:'해지했어요. 이미 결제한 기간이 끝날 때까지 계속 받아 보실 수 있어요.',resumed:'구독을 이어 가요. 다음 결제일에 자동으로 결제됩니다.','resume-failed':'구독을 이어 가지 못했어요. 카드를 새로 등록해 주세요.','plan-changed':'요금제 변경을 저장했어요. 지금 기간이 끝나는 날부터 적용됩니다.','plan-failed':'요금제를 바꾸지 못했어요. 해지 예약 중이라면 먼저 해지를 취소해 주세요.'};
const day=(s:string)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric'}).format(new Date(s));
const statusLabel={active:'구독 중',past_due:'결제 재시도 중',canceled:'해지 예약됨',ended:'종료됨'} as const;
const payLabel={pending:'처리 중',paid:'결제 완료',failed:'실패',refunded:'환불됨'} as const;
export default async function MyBilling({searchParams}:{searchParams:Promise<{state?:string}>}){
  if(!billingConfigured())redirect('/pricing');
  const [beta,q]=await Promise.all([betaReader(),searchParams]);
  if(!beta)redirect('/login#beta');
  const reader=await currentReader().catch(()=>null);
  const [sub,payments]=reader?await Promise.all([subscriptionFor(reader.id),paymentsFor(reader.id)]):[null,[]];
  const active=subscriptionActive(sub),all=paidPlans();
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page billing-page">
    <p className="eyebrow">MY PLAN</p><h1>구독 관리</h1>
    {q.state&&notices[q.state]&&<p className="delivery-notice" role="status">{notices[q.state]}</p>}
    <section className="billing-card">
      {!sub||!active?<><p>지금은 무료 플랜이에요.</p><Link className="button primary" href="/billing">구독하기 →</Link></>
      :<><dl className="billing-facts">
          <dt>상태</dt><dd>{statusLabel[sub.status]}</dd>
          <dt>요금제</dt><dd>{all[sub.plan_id].label}</dd>
          <dt>요금</dt><dd>{all[sub.plan_id].months===12?'연':'월'} {won(sub.amount)}</dd>
          {sub.next_plan_id&&<><dt>다음 결제부터</dt><dd>{all[sub.next_plan_id].label} ({priceLabel(all[sub.next_plan_id])})</dd></>}
          <dt>{sub.status==='canceled'?'이용 종료일':'다음 결제일'}</dt><dd>{day(sub.next_attempt_at&&sub.status==='past_due'?sub.next_attempt_at:sub.current_period_end)}</dd>
          <dt>결제 카드</dt><dd>{sub.card_label||'등록된 카드'}</dd>
        </dl>
        <div className="billing-actions">
          {sub.status==='canceled'?<form action={resumePlan}><button className="primary small">해지 취소하고 이어 가기</button></form>
          :<form action={cancelPlan}><button className="secondary small">구독 해지</button></form>}
          <Link className="text-link" href="/billing?change=1">카드 바꾸기</Link>
        </div>
        {sub.status!=='canceled'&&<form action={changeBillingPlan} className="billing-change"><label htmlFor="plan-change">요금제 바꾸기</label>
          <select id="plan-change" name="plan" defaultValue={sub.next_plan_id||sub.plan_id}>{PAID_PLAN_IDS.map(id=><option key={id} value={id}>{all[id].label} · {priceLabel(all[id])}{id===sub.plan_id?' (지금)':''}</option>)}</select>
          <button className="secondary small">저장</button><span className="muted">이미 결제한 기간이 끝나는 날부터 새 요금제로 결제돼요.</span></form>}
        {sub.status==='past_due'&&<p className="delivery-notice">지난 결제가 승인되지 않아 다시 시도하고 있어요. 카드를 바꾸면 바로 반영됩니다.</p>}</>}
    </section>
    {payments.length>0&&<section><h2>결제 내역</h2><table className="policy-table"><thead><tr><th scope="col">날짜</th><th scope="col">요금제 · 금액</th><th scope="col">상태</th><th scope="col">영수증</th></tr></thead><tbody>
      {payments.map(p=><tr key={p.id}><td>{day(p.created_at)}</td><td>{all[p.plan_id]?.label||''} {won(p.amount)}</td><td>{payLabel[p.status]}</td><td>{p.receipt_url?<a href={p.receipt_url} target="_blank" rel="noreferrer">보기</a>:'—'}</td></tr>)}
    </tbody></table></section>}
    <p className="muted">결제 후 7일 안에 환불을 원하시면 아래 연락처로 알려 주세요. <Link href="/terms">환불 규정</Link></p>
    <BusinessInfo/>
  </main><footer className="site-footer"><span>loop.</span><span>읽는 만큼, 연결됩니다.</span></footer></div>;
}
