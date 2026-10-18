import Link from 'next/link';
import type {Reader} from '@/lib/beta-store';
import {scheduleLabel,type NewsletterSelection,type Plan} from '@/lib/newsletter';
import {resumeEmail,stopEmail,subscribeEmail} from '@/app/beta-actions';

const notices:Record<string,string>={
  check:'확인 메일을 보냈어요. 메일의 버튼을 누르면 발송이 시작됩니다.',confirmed:'메일 주소가 확인됐어요. 정한 시간에 새 호를 보내드립니다.',
  stopped:'메일 발송을 멈췄어요. 보관함은 그대로 남아 있습니다.',resumed:'메일 발송을 다시 시작했어요.',wait:'확인 메일을 방금 보냈어요. 1분 뒤에 다시 시도해 주세요.',
  'bad-email':'메일 주소 형식을 확인해 주세요.',error:'메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.',invalid:'확인 링크가 올바르지 않아요. 다시 신청해 주세요.',
  expired:'확인 링크가 만료됐어요. 다시 신청해 주세요.',unavailable:'메일 발송은 운영 설정(저장소와 메일 발송 계정)이 끝나면 열립니다.',sent:'방금 만든 호를 메일로도 보냈어요.',
};
export function DeliveryPanel({reader,selection,available,mailReady,plan,notice}:{reader:Reader|null;selection:NewsletterSelection;available:boolean;mailReady:boolean;plan:Plan;notice?:string}){
  const schedule=scheduleLabel(selection);
  const pending=reader?.email&&!reader.email_confirmed_at;
  return <section className="delivery" id="delivery" aria-label="받는 방법">
    {notice&&notices[notice]&&<p className="delivery-notice" role="status">{notices[notice]}</p>}
    <div className="delivery-grid">
      <div className="delivery-card"><p className="eyebrow">MAIL</p><h2>메일로 받기</h2>
        {!available||!mailReady?<p className="muted">메일 발송은 운영 설정(메일 발송 계정)이 연결되면 열립니다. 지금은 화면에서 읽고 보관할 수 있어요.</p>
        :reader?.delivery_enabled?<><p className="delivery-state"><b>{reader.email}</b>로 {plan==='subscriber'?<><b>{schedule}</b> 정기 호와 직접 만든 호를</>:'직접 만든 호를'} 받고 있어요.</p><form action={stopEmail}><button className="secondary small">메일 발송 멈추기</button></form></>
        :reader?.email_confirmed_at?<><p className="delivery-state"><b>{reader.email}</b> 발송이 멈춰 있어요.</p><form action={resumeEmail}><button className="primary small">다시 받기</button></form></>
        :<><p className="muted">{pending?<><b>{reader!.email}</b>로 보낸 확인 메일의 버튼을 눌러 주세요. 다른 주소로 바꾸려면 다시 입력하세요.</>:<>메일 주소를 확인해 두면 만든 호와 정기 호를 메일로 보내 드려요. 확인 메일을 한 번 거칩니다.</>}</p>
          <form action={subscribeEmail} className="delivery-form"><label htmlFor="delivery-email" className="sr-only">메일 주소</label><input id="delivery-email" name="email" type="email" required maxLength={254} placeholder="you@example.com" autoComplete="email" defaultValue={reader?.email||''}/><button className="primary small">{pending?'확인 메일 다시 받기':'메일로 받기'}</button></form></>}
        <p className="delivery-fine">받는 시간과 주기는 <Link href="/customize">관심사 설정</Link>의 마지막 단계에서 바꿉니다.</p>
      </div>
      <div className="delivery-card"><p className="eyebrow">WHAT ARRIVES</p><h2>받는 방식</h2>
        {plan==='subscriber'?<p className="muted"><b>{schedule}</b>마다 새 호가 메일함에 도착하고 오른쪽 위 메일함에 알림이 떠요. 메일을 켜 두면 같은 호가 메일로도 갑니다. 직접 새로 만든 호도 메일로 함께 보내 드려요.</p>
        :<p className="muted">무료 체험은 직접 만든 1회분만 받아요. <Link href="/pricing">구독</Link>하면 {schedule}마다 새 호가 메일함과 메일로 도착합니다.</p>}
        <Link className="text-link" href="/my/inbox">메일함에서 지난 호 보기 →</Link>
      </div>
    </div>
  </section>;
}
