import {PublicNav} from '@/components/public-nav';
import {operator} from '@/lib/operator';

export const metadata={title:'개인정보 처리방침 · Personal Intelligence Loop'};
export const dynamic='force-dynamic';
export default function Privacy(){
  const o=operator();
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page">
    <p className="eyebrow">PRIVACY</p><h1>개인정보 처리방침</h1>
    <p className="muted">{o.name}(이하 ‘loop.’)는 독자의 개인정보를 뉴스레터를 만들고 보내는 데에만 씁니다. 시행일 {o.effective}.</p>
    {!o.complete&&<p className="delivery-notice" role="status">운영자 이름과 연락처가 아직 설정되지 않았습니다. 정식 운영 전에 채워야 합니다.</p>}
    <h2>1. 처리하는 개인정보와 목적</h2>
    <table className="policy-table"><thead><tr><th scope="col">항목</th><th scope="col">목적</th><th scope="col">보유 기간</th></tr></thead><tbody>
      <tr><td>메일 주소</td><td>수신 확인 메일과 뉴스레터 발송, 수신 거부 처리</td><td>메일 주소 삭제를 누르거나 삭제를 요청할 때까지</td></tr>
      <tr><td>표시 이름, 관심 분야·주제·지역, 읽는 수준, 받는 시간</td><td>나만의 뉴스레터 편집</td><td>베타 종료 또는 삭제 요청 시까지</td></tr>
      <tr><td>발송 기록(날짜, 보낸 기사 목록, 성공 여부)</td><td>중복 발송 방지와 오류 확인</td><td>독자 정보와 함께 삭제</td></tr>
    </tbody></table>
    <p>회원 가입을 받지 않으며, 이름·전화번호·주민등록번호·결제 정보는 받지 않습니다. 메일 주소는 뉴스레터를 보내 달라는 독자의 요청을 이행하기 위해 처리하고, 확인 메일의 버튼을 누른 주소로만 보냅니다. 광고나 제3자 마케팅에 쓰지 않습니다.</p>
    <h2>2. 브라우저에 저장하는 정보</h2>
    <p>베타 이용 여부, 고른 관심사, 메일함(직접 만든 호와 읽음 표시), 플랜은 이 브라우저의 쿠키에 저장됩니다. 브라우저에서 쿠키를 지우면 함께 사라집니다.</p>
    <h2>3. 처리 위탁과 국외 이전</h2>
    <table className="policy-table"><thead><tr><th scope="col">받는 곳</th><th scope="col">맡기는 일</th><th scope="col">이전되는 항목 · 국가</th></tr></thead><tbody>
      <tr><td>Supabase Inc.</td><td>독자 정보와 발송 기록 저장</td><td>1번의 모든 항목 · 데이터베이스가 있는 지역</td></tr>
      <tr><td>Resend (Plus Five Five, Inc.)</td><td>메일 발송</td><td>메일 주소, 메일 본문 · 미국</td></tr>
      <tr><td>Vercel Inc.</td><td>웹사이트 운영</td><td>접속 기록(IP 주소 등) · 미국 등</td></tr>
    </tbody></table>
    <p>이전은 서비스를 이용할 때 네트워크로 이루어지며, 각 회사는 위의 일에만 정보를 씁니다. 국외 이전을 원하지 않으면 메일로 받기를 켜지 않고 화면에서만 읽을 수 있습니다.</p>
    <h2>4. 독자의 권리</h2>
    <ul><li>모든 메일 아래의 ‘수신 거부’를 누르면 즉시 발송이 멈춥니다.</li><li>‘나의 뉴스레터 → 메일로 받기’에서 <b>메일 주소 삭제</b>를 누르면 저장된 메일 주소가 바로 지워집니다.</li><li>그 밖의 열람·정정·삭제·처리 정지는 아래 연락처로 요청하면 지체 없이 처리합니다.</li></ul>
    <h2>5. 파기</h2>
    <p>보유 기간이 끝나거나 삭제를 요청하면 데이터베이스에서 바로 지우며, 복구할 수 없게 처리합니다.</p>
    <h2>6. 안전성 확보 조치</h2>
    <p>독자 정보는 서버 전용 키로만 접근할 수 있는 표에 저장하고, 브라우저용 키로는 읽을 수 없게 막아 둡니다. 확인·수신 거부 링크는 추측할 수 없는 임의 값으로 만들고, 모든 통신은 HTTPS로 암호화합니다.</p>
    <h2>7. 개인정보 보호책임자</h2>
    <p>{o.officer}{o.contact&&<> · <a href={o.contact.includes('@')?`mailto:${o.contact}`:undefined}>{o.contact}</a></>}{o.bizNo&&<> · 사업자등록번호 {o.bizNo}</>}{o.address&&<> · {o.address}</>}</p>
    <p className="muted">개인정보 침해 신고·상담: 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118), 개인정보분쟁조정위원회(kopico.go.kr, 1833-6972).</p>
    <h2>8. 바뀌는 경우</h2>
    <p>이 방침을 바꾸면 시행 7일 전에 이 화면에 알립니다.</p>
  </main><footer className="site-footer"><span>loop.</span><span>읽는 만큼, 연결됩니다.</span></footer></div>;
}
