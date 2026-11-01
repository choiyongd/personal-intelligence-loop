import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {deliveryConfigured} from '@/lib/beta-store';
import {sendFeedback} from './actions';

export const metadata={title:'의견 보내기 · Personal Intelligence Loop'};
const errors:Record<string,string>={invalid:'의견 내용을 적어 주세요. 답장 받을 주소는 메일 형식이어야 해요.',save:'의견을 저장하지 못했어요. 잠시 후 다시 보내 주세요.',setup:'의견 보내기는 운영 설정이 끝나면 열립니다.'};
export default async function Feedback({searchParams}:{searchParams:Promise<{sent?:string;error?:string;from?:string}>}){
  const q=await searchParams,ready=deliveryConfigured();
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page feedback-page">
    <p className="eyebrow">BETA FEEDBACK</p><h1>의견 보내기</h1>
    <p className="muted">베타 기간에 받은 의견으로 다음 호와 정식 서비스를 다듬습니다. 좋았던 점, 불편한 점, 더 읽고 싶은 주제 무엇이든 적어 주세요.</p>
    {q.sent?<div className="delivery-notice" role="status">의견 고맙습니다. 꼼꼼히 읽고 반영할게요. <Link href="/my">나의 뉴스레터로</Link></div>
    :!ready?<p className="delivery-notice" role="status">{errors.setup}</p>
    :<form action={sendFeedback} className="feedback-form">
      {q.error&&errors[q.error]&&<p className="delivery-notice" role="alert">{errors[q.error]}</p>}
      <input type="hidden" name="source" value={q.from==='mail'?'mail':'site'}/>
      <fieldset className="feedback-rating"><legend>이번 뉴스레터, 얼마나 도움이 됐나요? <small>선택</small></legend>
        {[1,2,3,4,5].map(n=><label key={n}><input type="radio" name="rating" value={n}/><span>{n}</span></label>)}
        <p className="feedback-scale"><span>별로였어요</span><span>매우 좋았어요</span></p></fieldset>
      <label className="feedback-field"><span>하고 싶은 말</span><textarea name="message" required maxLength={2000} rows={7} placeholder="예: 에너지 기사는 좋았는데 너무 길었어요. 매일 아침 7시보다 출근길 8시가 좋겠어요."/></label>
      <label className="feedback-field"><span>답장 받을 메일 <small>선택</small></span><input name="contact" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com"/></label>
      <label className="sr-only" aria-hidden="true">비워 두세요<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <p className="mail-privacy">적어 주신 의견과 메일 주소는 서비스 개선과 답장에만 씁니다. <a href="/privacy">개인정보 처리방침</a></p>
      <button className="primary">의견 보내기</button>
    </form>}
  </main><footer className="site-footer"><span>loop.</span><span>읽는 만큼, 연결됩니다. · <a href="/privacy">개인정보 처리방침</a></span></footer></div>;
}
