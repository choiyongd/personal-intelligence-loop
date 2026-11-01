import {PublicNav} from '@/components/public-nav';
import {BusinessInfo} from '@/components/business-info';
import {operator} from '@/lib/operator';
import {plans} from '@/lib/newsletter';

export const metadata={title:'이용약관 · Personal Intelligence Loop'};
export const dynamic='force-dynamic';
const won=(n:number)=>`${n.toLocaleString('ko-KR')}원`;
export default function Terms(){
  const o=operator(),price=won(plans.subscriber.price);
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page">
    <p className="eyebrow">TERMS</p><h1>이용약관</h1>
    <p className="muted">{o.name}(이하 ‘회사’)가 제공하는 loop. 뉴스레터 서비스(이하 ‘서비스’)의 이용 조건입니다. 시행일 {o.effective}.</p>
    {!o.commerceReady&&<p className="delivery-notice" role="status">사업자 정보(대표자, 사업자등록번호, 통신판매업 신고번호, 주소, 전화)가 아직 모두 설정되지 않았습니다. 유료 판매 전에 채워야 합니다.</p>}
    <h2>제1조 서비스</h2>
    <p>회사는 이용자가 고른 관심사에 맞춰 공개 자료를 바탕으로 쓴 해설 기사를 화면과 메일로 제공합니다. 기사는 정보 제공을 위한 것이며 투자·법률·의료 조언이 아닙니다. 숫자와 날짜는 기사마다 붙은 원문 출처에서 함께 확인해 주세요.</p>
    <h2>제2조 무료 이용과 구독</h2>
    <ul><li>무료 이용자는 뉴스레터를 1회 만들어 볼 수 있습니다.</li><li>구독은 월 {price}(부가세 포함)이며, 정한 시간의 정기 호, 하루 3회 새로 만들기, 지난 호 다시 보기를 제공합니다.</li><li>구독하려면 메일 주소 확인을 마친 뒤 카드를 등록해야 합니다.</li></ul>
    <h2>제3조 결제</h2>
    <ul><li>카드를 등록하는 날 첫 달 구독료가 결제되고, 이후 매월 같은 날 자동으로 결제됩니다. 해당 날짜가 없는 달은 그 달의 마지막 날에 결제됩니다.</li><li>결제는 토스페이먼츠를 통해 이루어지며, 회사는 카드 번호를 저장하지 않습니다.</li><li>결제가 승인되지 않으면 사흘 동안 하루 한 번씩 다시 시도하고, 그래도 실패하면 구독이 종료됩니다. 재시도 기간에도 서비스는 계속 이용할 수 있습니다.</li><li>가격을 바꿀 때는 적용 30일 전에 메일로 알리고, 동의하지 않으면 다음 결제 전에 해지할 수 있습니다.</li></ul>
    <h2>제4조 해지</h2>
    <p>‘나의 뉴스레터 → 구독 관리’에서 언제든 해지할 수 있습니다. 해지하면 다음 결제가 일어나지 않고, 이미 결제한 기간이 끝날 때까지 구독 혜택을 그대로 이용할 수 있습니다.</p>
    <h2>제5조 청약 철회와 환불</h2>
    <ul><li>결제일로부터 7일 이내에 요청하면 그 결제 금액 전액을 환불합니다(전자상거래법 제17조).</li><li>7일이 지난 뒤에는 이미 시작된 달의 구독료는 환불하지 않고, 해지로 다음 결제를 멈춥니다. 다만 회사 사정으로 서비스를 제공하지 못한 기간은 일할 계산해 환불합니다.</li><li>환불은 아래 연락처로 요청하면 영업일 3일 안에 결제 취소로 처리하며, 카드사 사정에 따라 실제 반영까지 며칠 더 걸릴 수 있습니다.</li></ul>
    <h2>제6조 이용자의 의무</h2>
    <p>기사와 뉴스레터를 개인적으로 읽고 공유하는 것은 자유롭지만, 회사의 허락 없이 대량으로 복제하거나 판매할 수 없습니다. 원문 출처의 저작권은 각 원저작자에게 있습니다.</p>
    <h2>제7조 서비스 변경과 중단</h2>
    <p>회사는 서비스 내용을 바꾸거나 중단할 때 30일 전에 알립니다. 유료 구독 기간 중 서비스를 중단하면 남은 기간의 구독료를 환불합니다.</p>
    <h2>제8조 문의와 분쟁</h2>
    <p>문의와 환불 요청: {o.contact||'(연락처 설정 전)'}{o.phone&&<> · {o.phone}</>}. 분쟁이 생기면 서로 성실히 협의하며, 해결되지 않으면 민사소송법상 관할 법원에서 해결합니다.</p>
    <BusinessInfo/>
  </main><footer className="site-footer"><span>loop.</span><span>읽는 만큼, 연결됩니다.</span></footer></div>;
}
