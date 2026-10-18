import Link from 'next/link';
import type {Reader} from '@/lib/beta-store';
import {scheduleLabel,type NewsletterSelection} from '@/lib/newsletter';
import {archiveCurrentIssue,resumeEmail,stopEmail,subscribeEmail} from '@/app/beta-actions';

const notices:Record<string,string>={
  check:'확인 메일을 보냈어요. 메일의 버튼을 누르면 발송이 시작됩니다.',confirmed:'메일 주소가 확인됐어요. 정한 시간에 새 호를 보내드립니다.',
  stopped:'메일 발송을 멈췄어요. 보관함은 그대로 남아 있습니다.',resumed:'메일 발송을 다시 시작했어요.',wait:'확인 메일을 방금 보냈어요. 1분 뒤에 다시 시도해 주세요.',
  'bad-email':'메일 주소 형식을 확인해 주세요.',error:'메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.',invalid:'확인 링크가 올바르지 않아요. 다시 신청해 주세요.',
  expired:'확인 링크가 만료됐어요. 다시 신청해 주세요.',unavailable:'메일 발송과 보관함은 서버 설정이 끝나면 열립니다.',empty:'보관할 기사가 없어요. 관심사를 넓혀 보세요.',
};
export function DeliveryPanel({reader,selection,available,mailReady,issueCount,notice}:{reader:Reader|null;selection:NewsletterSelection;available:boolean;mailReady:boolean;issueCount:number;notice?:string}){
  const schedule=scheduleLabel(selection);
  const pending=reader?.email&&!reader.email_confirmed_at;
  return <section className="delivery" id="delivery" aria-label="받는 방법">
    {notice&&notices[notice]&&<p className="delivery-notice" role="status">{notices[notice]}</p>}
    <div className="delivery-grid">
      <div className="delivery-card"><p className="eyebrow">MAIL</p><h2>메일로 받기</h2>
        {!available||!mailReady?<p className="muted">메일 발송은 운영 설정(메일 발송 계정)이 연결되면 열립니다. 지금은 화면에서 읽고 보관할 수 있어요.</p>
        :reader?.delivery_enabled?<><p className="delivery-state"><b>{reader.email}</b>로 <b>{schedule}</b>에 받고 있어요.</p><form action={stopEmail}><button className="secondary small">메일 발송 멈추기</button></form></>
        :reader?.email_confirmed_at?<><p className="delivery-state"><b>{reader.email}</b> 발송이 멈춰 있어요.</p><form action={resumeEmail}><button className="primary small">다시 받기</button></form></>
        :<><p className="muted">{pending?<><b>{reader!.email}</b>로 보낸 확인 메일의 버튼을 눌러 주세요. 다른 주소로 바꾸려면 다시 입력하세요.</>:<>{schedule}에 새 호를 메일로 보내드려요. 확인 메일을 한 번 거칩니다.</>}</p>
          <form action={subscribeEmail} className="delivery-form"><label htmlFor="delivery-email" className="sr-only">메일 주소</label><input id="delivery-email" name="email" type="email" required maxLength={254} placeholder="you@example.com" autoComplete="email" defaultValue={reader?.email||''}/><button className="primary small">{pending?'확인 메일 다시 받기':'메일로 받기'}</button></form></>}
        <p className="delivery-fine">받는 시간과 주기는 <Link href="/customize">관심사 설정</Link>의 마지막 단계에서 바꿉니다.</p>
      </div>
      <div className="delivery-card"><p className="eyebrow">ARCHIVE</p><h2>보관함</h2>
        {available?<><p className="muted">정한 시간에 만들어진 호와 직접 보관한 호가 여기에 쌓여요.</p><div className="delivery-actions"><form action={archiveCurrentIssue}><button className="primary small">오늘 호 보관하기</button></form><Link className="text-link" href="/my/archive">지난 호 {issueCount}개 보기 →</Link></div></>
        :<p className="muted">보관함은 서버 저장소가 연결되면 열립니다.</p>}
      </div>
    </div>
  </section>;
}
