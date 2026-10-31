import type {MailState} from '@/lib/edition-mail';

// "Also by mail" inside the make form. A confirmed address needs nothing more; a new one is typed right here
// and confirmed once by mail. The address field shows only while the box is ticked (CSS :has).
export function MailChoice({mail}:{mail:MailState}){
  if(!mail.available)return <p className="mail-choice-off">메일로 받기는 운영 메일 설정이 연결되면 열려요. 지금은 메일함에 저장됩니다.</p>;
  const ready=mail.confirmed;
  return <div className="mail-choice">
    <label className="mail-choice-toggle"><input type="checkbox" name="mail" defaultChecked={mail.enabled||!ready}/><span>메일로도 받기</span>{ready&&<small>{mail.email}</small>}</label>
    {!ready&&<div className="mail-choice-address"><label htmlFor="make-email" className="sr-only">받을 메일 주소</label><input id="make-email" name="email" type="email" maxLength={254} placeholder="받을 메일 주소" autoComplete="email" defaultValue={mail.email}/><small>{mail.email?'확인 메일의 버튼을 누르면 이 호가 바로 도착해요.':'처음 한 번만 확인 메일의 버튼을 눌러 주세요. 누르면 이 호가 바로 도착해요.'}</small></div>}
  </div>;
}
