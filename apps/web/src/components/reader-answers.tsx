import Link from 'next/link';
import {betaReader} from '@/lib/beta';
import {answersFor,answersReady,isModerator,MAX_BODY,promptsFor,viewer,type Answer} from '@/lib/answers';
import {flagAnswer,moderate,postAnswer,removeAnswer} from '@/app/answer-actions';
import type {Locale} from '@/lib/i18n';

const notices={
  ko:{sent:'답을 남겼어요. 다른 독자들도 볼 수 있어요.',deleted:'답을 지웠어요.',reported:'신고를 받았어요. 여러 독자가 신고한 답은 검토 전까지 가려집니다.',hidden:'답을 가렸어요.',shown:'답을 다시 보이게 했어요.',
    invalid:`답은 2자 이상 ${MAX_BODY}자 이하로 적어 주세요.`,limit:'하루에 남길 수 있는 답을 모두 썼어요. 내일 다시 남겨 주세요.',question:'답할 질문을 골라 주세요.',save:'답을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',error:'처리하지 못했어요. 다시 시도해 주세요.',setup:'독자 답변은 운영 설정이 끝나면 열립니다.'},
  en:{sent:'Your answer is posted. Other readers can see it.',deleted:'Your answer was deleted.',reported:'Thanks for the report. Answers reported by several readers are hidden until reviewed.',hidden:'The answer is hidden.',shown:'The answer is visible again.',
    invalid:`Please write between 2 and ${MAX_BODY} characters.`,limit:'You have reached today’s limit for answers. Please come back tomorrow.',question:'Please pick a question to answer.',save:'We could not save your answer. Please try again shortly.',error:'That did not work. Please try again.',setup:'Reader answers open once the service is set up.'},
};
const reasonLabels={ko:{abuse:'욕설·비방',spam:'광고·도배',privacy:'개인정보 노출',other:'기타'},en:{abuse:'Abuse or insults',spam:'Spam or ads',privacy:'Personal information',other:'Other'}};

function when(iso:string,loc:Locale){
  return new Intl.DateTimeFormat(loc==='en'?'en-US':'ko-KR',{timeZone:'Asia/Seoul',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(iso));
}

// The end-of-article discussion: pick a question, leave an answer, read what other readers wrote.
export async function ReaderAnswers({articleId,level,loc,status,pick}:{articleId:string;level:string;loc:Locale;status?:string;pick?:string}){
  const L=<T,>(ko:T,en:T)=>loc==='en'?en:ko,N=notices[loc],R=reasonLabels[loc];
  const prompts=promptsFor(articleId,loc);
  if(prompts.length===0)return null;
  const head=<><p className="page-label">{L('독자 토론','Reader discussion')}</p><h2 id="answers-title">{L('다른 독자는 어떻게 생각할까요?','What do other readers think?')}</h2></>;
  if(!answersReady())return <section className="reader-answers" id="answers" aria-labelledby="answers-title">{head}<p className="muted">{N.setup}</p></section>;
  const [me,beta]=await Promise.all([viewer(),betaReader()]);
  const answers:Answer[]=await answersFor(articleId,me).catch(()=>[]);
  const mod=isModerator(me);
  const selected=prompts.some(p=>p.key===pick)?pick:prompts[0].key;
  const hidden=(name:string,v:string)=><input type="hidden" name={name} value={v}/>;
  const base=<>{hidden('article',articleId)}{hidden('level',level)}</>;
  const groups=prompts.map(p=>({p,list:answers.filter(a=>a.question_key===p.key)})).filter(g=>g.list.length>0);
  // Answers to a prompt the article no longer has still show, under the question the reader saw.
  const orphans=answers.filter(a=>!prompts.some(p=>p.key===a.question_key));
  const item=(a:Answer)=><li key={a.id} className={`answer${a.status==='hidden'?' is-hidden':''}${a.mine?' is-mine':''}`}>
    <p className="answer-meta"><b>{a.author_name}</b>{a.mine&&<span className="answer-tag">{L('내 답','You')}</span>}<time dateTime={a.created_at}>{when(a.created_at,loc)}</time></p>
    {a.status==='hidden'&&<p className="answer-note" role="note">{a.mine?L('신고가 모여 검토 중이라 지금은 나에게만 보여요.','This answer was reported and is visible only to you while it is reviewed.'):L(`가려진 답 · 신고 ${a.report_count}건`,`Hidden · ${a.report_count} reports`)}</p>}
    <p className="answer-body">{a.body}</p>
    <div className="answer-actions">
      {(a.mine||mod)&&<form action={removeAnswer}>{base}{hidden('answer',a.id)}<button className="link-button">{L('지우기','Delete')}</button></form>}
      {mod&&<form action={moderate}>{base}{hidden('answer',a.id)}{hidden('action',a.status==='hidden'?'show':'hide')}<button className="link-button">{a.status==='hidden'?L('다시 보이기','Unhide'):L('가리기','Hide')}</button></form>}
      {!a.mine&&(me||beta)&&<details className="answer-report"><summary>{L('신고','Report')}</summary><form action={flagAnswer}>{base}{hidden('answer',a.id)}
        <fieldset><legend className="sr-only">{L('신고 이유','Reason')}</legend>{(Object.keys(R) as (keyof typeof R)[]).map((k,i)=><label key={k}><input type="radio" name="reason" value={k} defaultChecked={i===0}/> {R[k]}</label>)}</fieldset>
        <button className="link-button">{L('신고하기','Send report')}</button></form></details>}
    </div></li>;
  return <section className="reader-answers" id="answers" aria-labelledby="answers-title">{head}
    <p className="muted">{L('위의 질문 가운데 하나를 골라 내 생각을 남겨 보세요. 정답은 없어요. 서로 다른 생각을 읽는 것이 이 코너의 목적입니다.','Pick one of the questions above and share your view. There are no right answers; the point is to read how others see it.')}</p>
    {status&&N[status as keyof typeof N]&&<p className="delivery-notice" role={['sent','deleted','reported','hidden','shown'].includes(status)?'status':'alert'}>{N[status as keyof typeof N]}</p>}
    {beta||me?<form action={postAnswer} className="answer-form">{base}
      <label className="feedback-field"><span>{L('답할 질문','Question')}</span><select name="question" defaultValue={selected}>{prompts.map(p=><option key={p.key} value={p.key}>{p.kind==='question'?L('확인 질문','Check'):L('생각거리','Think')} · {p.text.length>70?p.text.slice(0,70)+'…':p.text}</option>)}</select></label>
      <label className="feedback-field"><span>{L('내 생각','Your answer')}</span><textarea name="body" required minLength={2} maxLength={MAX_BODY} rows={4} placeholder={L('예: 저는 이렇게 봐요. 기사 2장의 숫자를 보면…','e.g. Here is how I see it. Looking at the figure in chapter 2…')}/></label>
      <label className="sr-only" aria-hidden="true">{L('비워 두세요','Leave empty')}<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <p className="mail-privacy">{L(`‘${(me?.name||beta?.name||'베타 독자')}’ 이름으로 모든 독자에게 공개됩니다. 연락처나 남의 개인정보는 적지 마세요. 욕설·광고는 지워질 수 있어요.`,`Posted publicly as “${me?.name||beta?.name||'Reader'}”. Do not include contact details or anyone’s personal information. Abuse and ads may be removed.`)} <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></p>
      <div className="answer-form-foot"><button className="primary">{L('답 남기기','Post answer')}</button><Link className="text-link" href="/my/answers">{mod?L('답변 관리 →','Moderate answers →'):L('내가 남긴 답 모아 보기 →','See all my answers →')}</Link></div>
    </form>:<p className="delivery-notice"><Link href="/login#beta">{L('베타로 시작하면','Start the beta')}</Link>{L(' 답을 남길 수 있어요. 가입은 필요 없어요.',' to leave an answer. No sign-up needed.')}</p>}
    {answers.length===0?<p className="answer-empty">{L('아직 남겨진 답이 없어요. 첫 번째 생각을 들려주세요.','No answers yet. Be the first to share a thought.')}</p>
    :<div className="answer-groups">{groups.map(({p,list})=><div key={p.key} className="answer-group"><h3><span>{p.kind==='question'?L('확인 질문','Check question'):L('생각거리','Think about')}</span>{p.text}</h3><ul>{list.map(item)}</ul></div>)}
      {[...new Set(orphans.map(a=>a.question))].map(q=><div key={q} className="answer-group"><h3><span>{L('예전 질문','Earlier question')}</span>{q}</h3><ul>{orphans.filter(a=>a.question===q).map(item)}</ul></div>)}</div>}
  </section>;
}
