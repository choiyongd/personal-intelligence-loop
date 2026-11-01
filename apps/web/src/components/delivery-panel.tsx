import Link from 'next/link';
import type {Reader} from '@/lib/beta-store';
import {scheduleLabel,type NewsletterSelection,type Plan} from '@/lib/newsletter';
import {lx,type Locale} from '@/lib/i18n';
import {forgetEmail,resumeEmail,stopEmail,subscribeEmail} from '@/app/beta-actions';

const notices:Record<string,[string,string]>={
  check:['확인 메일을 보냈어요. 메일의 버튼을 한 번 누르면 발송이 시작됩니다.','We sent a confirmation email. Press its button once and delivery starts.'],confirmed:['메일 주소가 확인됐어요. 이제 만든 호를 메일로 보내드립니다.','Your address is confirmed. We will now email the editions you make.'],'confirmed-sent':['메일 주소가 확인됐고, 가장 최근에 만든 호를 방금 메일로 보냈어요.','Your address is confirmed, and we just emailed your latest edition.'],on:['메일로 받기를 켰어요.','Email delivery is on.'],
  stopped:['메일 발송을 멈췄어요. 보관함은 그대로 남아 있습니다.','Email delivery is paused. Your mailbox stays as it is.'],resumed:['메일 발송을 다시 시작했어요.','Email delivery has resumed.'],wait:['확인 메일을 방금 보냈어요. 1분 뒤에 다시 시도해 주세요.','We just sent a confirmation email. Please try again in a minute.'],
  'bad-email':['메일 주소 형식을 확인해 주세요.','Please check the email address.'],error:['메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.','We could not send the email. Please try again shortly.'],invalid:['확인 링크가 올바르지 않아요. 다시 신청해 주세요.','That confirmation link is not valid. Please sign up again.'],
  expired:['확인 링크가 만료됐어요. 다시 신청해 주세요.','That confirmation link has expired. Please sign up again.'],forgotten:['저장된 메일 주소를 지웠어요. 더 이상 메일을 보내지 않습니다.','We deleted your saved address. No more emails will be sent.'],unavailable:['메일 발송은 운영 설정(저장소와 메일 발송 계정)이 끝나면 열립니다.','Email delivery opens once storage and the sending account are set up.'],sent:['방금 만든 호를 메일로도 보냈어요.','We also emailed the edition you just made.'],
};
export function DeliveryPanel({reader,selection,available,mailReady,plan,notice,loc='ko'}:{reader:Reader|null;selection:NewsletterSelection;available:boolean;mailReady:boolean;plan:Plan;notice?:string;loc?:Locale}){
  const L=lx(loc),en=loc==='en';
  const schedule=scheduleLabel(selection,loc);
  const pending=reader?.email&&!reader.email_confirmed_at;
  return <section className="delivery" id="delivery" aria-label={L('받는 방법','How you receive it')}>
    {notice&&notices[notice]&&<p className="delivery-notice" role="status">{notices[notice][en?1:0]}</p>}
    <div className="delivery-grid">
      <div className="delivery-card"><p className="eyebrow">MAIL</p><h2>{L('메일로 받기','Email delivery')}</h2>
        {!available||!mailReady?<p className="muted">{L('메일 발송은 운영 설정(메일 발송 계정)이 연결되면 열립니다. 지금은 화면에서 읽고 보관할 수 있어요.','Email delivery opens once the sending account is connected. For now you can read and keep issues on the site.')}</p>
        :reader?.delivery_enabled?<><p className="delivery-state">{en?<>Sending {plan==='subscriber'?<>scheduled issues (<b>{schedule}</b>) and editions you make</>:'editions you make'} to <b>{reader.email}</b>.</>:<><b>{reader.email}</b>로 {plan==='subscriber'?<><b>{schedule}</b> 정기 호와 직접 만든 호를</>:'직접 만든 호를'} 받고 있어요.</>}</p><form action={stopEmail}><button className="secondary small">{L('메일 발송 멈추기','Pause email')}</button></form></>
        :reader?.email_confirmed_at?<><p className="delivery-state">{en?<>Email to <b>{reader.email}</b> is paused.</>:<><b>{reader.email}</b> 발송이 멈춰 있어요.</>}</p><form action={resumeEmail}><button className="primary small">{L('다시 받기','Resume')}</button></form></>
        :<><p className="muted">{pending?(en?<>Press the button in the confirmation email we sent to <b>{reader!.email}</b>. To use another address, enter it again.</>:<><b>{reader!.email}</b>로 보낸 확인 메일의 버튼을 눌러 주세요. 다른 주소로 바꾸려면 다시 입력하세요.</>):L('메일 주소를 확인해 두면 만든 호와 정기 호를 메일로 보내 드려요. 확인 메일을 한 번 거칩니다.','Confirm your address and we will email the editions you make and your scheduled issues. It takes one confirmation email.')}</p>
          <form action={subscribeEmail} className="delivery-form"><label htmlFor="delivery-email" className="sr-only">{L('메일 주소','Email address')}</label><input id="delivery-email" name="email" type="email" required maxLength={254} placeholder="you@example.com" autoComplete="email" defaultValue={reader?.email||''}/><button className="primary small">{pending?L('확인 메일 다시 받기','Resend confirmation'):L('메일로 받기','Email it to me')}</button></form><p className="mail-privacy">{L('메일 주소는 뉴스레터를 보내는 데에만 쓰고, 언제든 수신 거부·삭제할 수 있어요.','We use your address only to send the newsletter. Unsubscribe or delete it any time.')} <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></p></>}
        {reader?.email&&<form action={forgetEmail} className="mail-forget"><button className="text-button">{L('메일 주소 삭제','Delete my email address')}</button></form>}
        <p className="delivery-fine">{en?<>Change delivery time and frequency in the last step of <Link href="/customize">Your interests</Link>.</>:<>받는 시간과 주기는 <Link href="/customize">관심사 설정</Link>의 마지막 단계에서 바꿉니다.</>}</p>
      </div>
      <div className="delivery-card"><p className="eyebrow">WHAT ARRIVES</p><h2>{L('받는 방식','What you get')}</h2>
        {plan==='subscriber'?<p className="muted">{en?<>A new issue lands in your mailbox <b>{schedule}</b>, with a notice on the mailbox at the top right. With email on, the same issue goes to your inbox. Editions you make yourself are emailed too.</>:<><b>{schedule}</b>마다 새 호가 메일함에 도착하고 오른쪽 위 메일함에 알림이 떠요. 메일을 켜 두면 같은 호가 메일로도 갑니다. 직접 새로 만든 호도 메일로 함께 보내 드려요.</>}</p>
        :<p className="muted">{en?<>The free trial covers one edition you make yourself. <Link href="/pricing">Subscribe</Link> and a new issue arrives in your mailbox and inbox {schedule.replace(/^Daily/,'daily')}.</>:<>무료 체험은 직접 만든 1회분만 받아요. <Link href="/pricing">구독</Link>하면 {schedule}마다 새 호가 메일함과 메일로 도착합니다.</>}</p>}
        <Link className="text-link" href="/my/inbox">{L('메일함에서 지난 호 보기 →','See past issues in your mailbox →')}</Link>
      </div>
    </div>
  </section>;
}
