import type {MailState} from '@/lib/edition-mail';

// "Also by mail" inside the make form. A confirmed address needs nothing more; a new one is typed right here
// and confirmed once by mail. The address field shows only while the box is ticked (CSS :has).
export function MailChoice({mail,loc='ko'}:{mail:MailState;loc?:'ko'|'en'}){
  const L=<T,>(ko:T,en:T)=>loc==='en'?en:ko;
  if(!mail.available)return <p className="mail-choice-off">{L('메일로 받기는 운영 메일 설정이 연결되면 열려요. 지금은 메일함에 저장됩니다.','Email delivery opens once mail is set up. For now, issues are saved to your mailbox.')}</p>;
  const ready=mail.confirmed;
  return <div className="mail-choice">
    <label className="mail-choice-toggle"><input type="checkbox" name="mail" defaultChecked={mail.enabled||!ready}/><span>{L('메일로도 받기','Email it to me too')}</span>{ready&&<small>{mail.email}</small>}</label>
    {!ready&&<div className="mail-choice-address"><label htmlFor="make-email" className="sr-only">{L('받을 메일 주소','Email address')}</label><input id="make-email" name="email" type="email" maxLength={254} placeholder={L('받을 메일 주소','Your email address')} autoComplete="email" defaultValue={mail.email}/><small>{mail.email?L('확인 메일의 버튼을 누르면 이 호가 바로 도착해요.','Press the button in the confirmation email and this issue arrives right away.'):L('처음 한 번만 확인 메일의 버튼을 눌러 주세요. 누르면 이 호가 바로 도착해요.','Just once, press the button in the confirmation email. This issue arrives as soon as you do.')}</small><p className="mail-privacy">{L('메일 주소는 뉴스레터를 보내는 데에만 쓰고, 언제든 수신 거부·삭제할 수 있어요.','We use your address only to send the newsletter. Unsubscribe or delete it any time.')} <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></p></div>}
  </div>;
}
