import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {betaReader} from '@/lib/beta';
import {answersReady,isModerator,myAnswers,reviewQueue,viewer} from '@/lib/answers';
import {articleById} from '@/lib/articles';
import {moderate,removeAnswer} from '@/app/answer-actions';
import {getL} from '@/lib/locale';

export async function generateMetadata(){return {title:`${(await getL()).L('토론 답변','Discussion answers')} · loop.`};}
export const dynamic='force-dynamic';
type Row=Awaited<ReturnType<typeof myAnswers>>[number];
// Readers see the answers they left; the moderator sees reported and hidden answers first, then the newest.
export default async function Answers({searchParams}:{searchParams:Promise<{done?:string}>}){
  const [beta,{done},{loc,L}]=await Promise.all([betaReader(),searchParams,getL()]);
  if(!beta)redirect('/login#beta');
  const me=answersReady()?await viewer():null,mod=isModerator(me);
  const data=!me?null:mod?await reviewQueue():{flagged:[],latest:await myAnswers(me.id)};
  const reasons:Record<string,string>=loc==='en'?{abuse:'abuse',spam:'spam',privacy:'personal info',other:'other'}:{abuse:'욕설·비방',spam:'광고·도배',privacy:'개인정보',other:'기타'};
  const when=(iso:string)=>new Intl.DateTimeFormat(loc==='en'?'en-US':'ko-KR',{timeZone:'Asia/Seoul',dateStyle:'medium',timeStyle:'short'}).format(new Date(iso));
  const hidden=(name:string,v:string)=><input type="hidden" name={name} value={v}/>;
  const row=(a:Row)=>{const art=articleById(a.article_id);return <li key={a.id} className={`answer${a.status==='hidden'?' is-hidden':''}`}>
    <p className="answer-meta"><b>{a.author_name}</b><time dateTime={a.created_at}>{when(a.created_at)}</time>{a.report_count>0&&<span className="answer-tag">{L(`신고 ${a.report_count}건`,`${a.report_count} reports`)}{a.reasons.length>0&&` · ${[...new Set(a.reasons)].map(r=>reasons[r]||r).join(', ')}`}</span>}{a.status==='hidden'&&<span className="answer-tag">{a.hidden_reason==='moderator'?L('운영자가 가림','Hidden by moderator'):L('신고로 가려짐','Hidden by reports')}</span>}</p>
    <p className="answer-question"><Link href={`/article/${a.article_id}#answers`}>{art?.title||a.article_id}</Link> · {a.question}</p>
    <p className="answer-body">{a.body}</p>
    <div className="answer-actions">
      <form action={removeAnswer}>{hidden('from','review')}{hidden('answer',a.id)}<button className="link-button">{L('지우기','Delete')}</button></form>
      {mod&&<form action={moderate}>{hidden('from','review')}{hidden('answer',a.id)}{hidden('action',a.status==='hidden'?'show':'hide')}<button className="link-button">{a.status==='hidden'?L('다시 보이기','Unhide'):L('가리기','Hide')}</button></form>}
    </div></li>;};
  return <div className="site-page"><PublicNav/><main id="main" className="policy-page answers-page">
    <p className="eyebrow">{mod?'MODERATION':'MY ANSWERS'}</p><h1>{mod?L('토론 답변 관리','Moderate answers'):L('내가 남긴 답','My answers')}</h1>
    <p className="muted">{mod?L('신고가 3건 모인 답은 자동으로 가려집니다. 내용을 보고 다시 보이기, 가리기, 지우기 가운데 하나를 고르세요. 다시 보이게 하면 신고 수가 0으로 돌아갑니다.','Answers with three reports are hidden automatically. Review each one and unhide, hide or delete it. Unhiding resets the report count.'):L('기사 끝 토론에 남긴 답을 모아 봅니다. 지운 답은 되돌릴 수 없어요.','Your answers to the discussions at the end of articles. Deleted answers cannot be restored.')}</p>
    {done&&<p className="delivery-notice" role="status">{done==='error'?L('처리하지 못했어요. 다시 시도해 주세요.','That did not work. Please try again.'):L('처리했어요.','Done.')}</p>}
    {!answersReady()?<p className="delivery-notice">{L('독자 답변은 운영 설정이 끝나면 열립니다.','Reader answers open once the service is set up.')}</p>
    :!data?<p className="answer-empty">{L('아직 남긴 답이 없어요. 기사 끝의 ‘독자 토론’에서 첫 답을 남겨 보세요.','No answers yet. Leave one under “Reader discussion” at the end of an article.')}</p>
    :<>{mod&&<><h2>{L(`검토할 답 ${data.flagged.length}개`,`${data.flagged.length} to review`)}</h2>{data.flagged.length?<ul className="answer-list">{data.flagged.map(row)}</ul>:<p className="answer-empty">{L('신고되거나 가려진 답이 없어요.','Nothing reported or hidden.')}</p>}<h2>{L('최근 답 50개','Latest 50 answers')}</h2></>}
      {data.latest.length?<ul className="answer-list">{data.latest.map(row)}</ul>:<p className="answer-empty">{L('아직 남긴 답이 없어요.','No answers yet.')}</p>}</>}
  </main><footer className="site-footer"><span>loop.</span><span>{L('원문에서 다음 생각까지.','From the source to your next thought.')}</span></footer></div>;
}
