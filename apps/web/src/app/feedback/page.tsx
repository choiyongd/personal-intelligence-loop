import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {deliveryConfigured} from '@/lib/beta-store';
import {sendFeedback} from './actions';
import {getL} from '@/lib/locale';

export async function generateMetadata(){return {title:`${(await getL()).L('의견 보내기','Send feedback')} · Personal Intelligence Loop`};}
const errorsKo:Record<string,string>={invalid:'의견 내용을 적어 주세요. 답장 받을 주소는 메일 형식이어야 해요.',save:'의견을 저장하지 못했어요. 잠시 후 다시 보내 주세요.',setup:'의견 보내기는 운영 설정이 끝나면 열립니다.'};
const errorsEn:Record<string,string>={invalid:'Please write your feedback. The reply address must be a valid email.',save:'We could not save your feedback. Please try again shortly.',setup:'Feedback opens once the service is set up.'};
export default async function Feedback({searchParams}:{searchParams:Promise<{sent?:string;error?:string;from?:string}>}){
  const [q,{loc,L}]=await Promise.all([searchParams,getL()]),ready=deliveryConfigured(),errors=loc==='en'?errorsEn:errorsKo;
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page feedback-page">
    <p className="eyebrow">BETA FEEDBACK</p><h1>{L('의견 보내기','Send feedback')}</h1>
    <p className="muted">{L('베타 기간에 받은 의견으로 다음 호와 정식 서비스를 다듬습니다. 좋았던 점, 불편한 점, 더 읽고 싶은 주제 무엇이든 적어 주세요.','Feedback during the beta shapes the next issues and the full service. Tell us what you liked, what got in the way, or what you want to read more about.')}</p>
    {q.sent?<div className="delivery-notice" role="status">{L('의견 고맙습니다. 꼼꼼히 읽고 반영할게요.','Thank you. We read every note carefully.')} <Link href="/my">{L('나의 뉴스레터로','Back to my newsletter')}</Link></div>
    :!ready?<p className="delivery-notice" role="status">{errors.setup}</p>
    :<form action={sendFeedback} className="feedback-form">
      {q.error&&errors[q.error]&&<p className="delivery-notice" role="alert">{errors[q.error]}</p>}
      <input type="hidden" name="source" value={q.from==='mail'?'mail':'site'}/>
      <fieldset className="feedback-rating"><legend>{L('이번 뉴스레터, 얼마나 도움이 됐나요?','How useful was this newsletter?')} <small>{L('선택','Optional')}</small></legend>
        {[1,2,3,4,5].map(n=><label key={n}><input type="radio" name="rating" value={n}/><span>{n}</span></label>)}
        <p className="feedback-scale"><span>{L('별로였어요','Not much')}</span><span>{L('매우 좋았어요','Very useful')}</span></p></fieldset>
      <label className="feedback-field"><span>{L('하고 싶은 말','Your feedback')}</span><textarea name="message" required maxLength={2000} rows={7} placeholder={L('예: 에너지 기사는 좋았는데 너무 길었어요. 매일 아침 7시보다 출근길 8시가 좋겠어요.','e.g. The energy story was great but too long. 8 AM on my commute would suit me better than 7.')}/></label>
      <label className="feedback-field"><span>{L('답장 받을 메일','Reply-to email')} <small>{L('선택','Optional')}</small></span><input name="contact" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com"/></label>
      <label className="sr-only" aria-hidden="true">{L('비워 두세요','Leave empty')}<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <p className="mail-privacy">{L('적어 주신 의견과 메일 주소는 서비스 개선과 답장에만 씁니다.','We use your feedback and address only to improve the service and reply to you.')} <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></p>
      <button className="primary">{L('의견 보내기','Send feedback')}</button>
    </form>}
  </main><footer className="site-footer"><span>loop.</span><span>{L('읽는 만큼, 연결됩니다.','The more you read, the more it connects.')} · <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></span></footer></div>;
}
