import {PublicNav} from '@/components/public-nav';
import {operator,type Operator} from '@/lib/operator';
import {getLocale} from '@/lib/locale';

export async function generateMetadata(){return {title:`${await getLocale()==='en'?'Privacy policy':'개인정보 처리방침'} · Personal Intelligence Loop`};}
export const dynamic='force-dynamic';
export default async function Privacy(){
  const o=operator();
  if(await getLocale()==='en')return <PrivacyEn o={o}/>;
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

// English policy for US readers, including the disclosures California law (CCPA/CPRA) asks for.
function PrivacyEn({o}:{o:Operator}){
  const mail=o.contact.includes('@')?`mailto:${o.contact}`:undefined;
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page" lang="en">
    <p className="eyebrow">PRIVACY</p><h1>Privacy policy</h1>
    <p className="muted">{o.nameEn} (“loop.”, “we”) uses readers’ personal information only to make and send your newsletter. Effective {o.effective}.</p>
    {!o.complete&&<p className="delivery-notice" role="status">The operator name and contact are not set yet. They must be filled in before taking real readers.</p>}
    <h2>1. What we collect and why</h2>
    <table className="policy-table"><thead><tr><th scope="col">Information</th><th scope="col">Purpose</th><th scope="col">How long we keep it</th></tr></thead><tbody>
      <tr><td>Email address</td><td>Confirmation email, newsletter delivery and unsubscribe handling</td><td>Until you press “Delete my email address” or ask us to delete it</td></tr>
      <tr><td>Display name; chosen fields, topics and regions; reading level; delivery time and time zone; language</td><td>Building your personal newsletter</td><td>Until the beta ends or you ask us to delete it</td></tr>
      <tr><td>Delivery records (date, stories sent, success or failure)</td><td>Preventing duplicate mail and fixing errors</td><td>Deleted together with your reader record</td></tr>
      <tr><td>Feedback you send, and an optional reply address</td><td>Improving the service and replying to you</td><td>Until you ask us to delete it</td></tr>
    </tbody></table>
    <p>We do not ask for an account, phone number, government ID or payment details during the beta. We send mail only to an address that pressed the button in our confirmation email, and we never use it for ads or third-party marketing.</p>
    <h2>2. What stays in your browser</h2>
    <p>Whether you joined the beta, your chosen interests, your mailbox (editions you made and what you have read), your plan and your language are stored in cookies in this browser. Clearing your cookies removes them. We use no advertising or cross-site tracking cookies.</p>
    <h2>3. Service providers</h2>
    <table className="policy-table"><thead><tr><th scope="col">Provider</th><th scope="col">What they do for us</th><th scope="col">Information · Location</th></tr></thead><tbody>
      <tr><td>Supabase Inc.</td><td>Stores reader records and delivery logs</td><td>Everything in section 1 · the region where our database runs</td></tr>
      <tr><td>Resend (Plus Five Five, Inc.)</td><td>Sends email</td><td>Email address and message content · United States</td></tr>
      <tr><td>Vercel Inc.</td><td>Hosts the website</td><td>Access logs such as IP address · United States and elsewhere</td></tr>
    </tbody></table>
    <p>Each provider processes information only to do the work above for us. The service is operated from the Republic of Korea, so your information may be processed in Korea and the United States.</p>
    <h2>4. Your choices and rights</h2>
    <ul><li>Every email has an <b>Unsubscribe</b> link; it stops delivery at once, and mail clients’ one-click unsubscribe works too.</li><li>In <b>My newsletter → Email delivery</b>, <b>Delete my email address</b> erases your stored address immediately.</li><li>You can ask us to tell you what we hold about you, to correct it, or to delete it by writing to the contact below. We answer within 45 days.</li></ul>
    <h2>5. California residents (CCPA/CPRA)</h2>
    <ul>
      <li><b>Categories collected in the last 12 months:</b> identifiers (email address, display name), internet activity on our site (access logs, which stories you were sent), and inferences from your chosen interests and reading level. Sources: you, and your use of the site.</li>
      <li><b>Business purposes:</b> providing the newsletter you asked for, security and debugging, and improving the service.</li>
      <li><b>No sale or sharing:</b> we do not sell your personal information, and we do not share it for cross-context behavioral advertising. We do not knowingly collect information from anyone under 16. We do not use sensitive personal information.</li>
      <li><b>Your rights:</b> to know and access, to delete, to correct, and to opt out of sale or sharing (which we do not do). You will not be treated differently for using these rights. You may use an authorized agent; we may ask to verify your request through the email address on file.</li>
    </ul>
    <h2>6. Security</h2>
    <p>Reader records sit in tables that only a server-side key can reach; the browser key cannot read them. Confirmation and unsubscribe links use random values that cannot be guessed, and all traffic is encrypted with HTTPS.</p>
    <h2>7. Contact</h2>
    <p>{o.nameEn}{o.addressEn&&<> · {o.addressEn}</>}{o.contact&&<> · <a href={mail}>{o.contact}</a></>}</p>
    <h2>8. Changes</h2>
    <p>If we change this policy, we will post the change on this page at least 7 days before it takes effect, and email you if the change is material.</p>
  </main><footer className="site-footer"><span>loop.</span><span>The more you read, the more it connects.</span></footer></div>;
}
