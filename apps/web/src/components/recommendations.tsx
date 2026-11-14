import Link from 'next/link';
import {localize} from '@/lib/articles';
import {lx,type Locale} from '@/lib/i18n';
import {industryName,topicName,type NewsletterSelection} from '@/lib/newsletter';
import {topicField,type Reason,type Recommendation} from '@/lib/recommend';
import {addInterestTopic} from '@/app/beta-actions';

// Why a story was picked, in one short line under its title.
export function reasonText(r:Reason,loc:Locale){
  const t=topicName(r.topic,loc),f=industryName(topicField.get(r.topic)||'technology',loc);
  switch(r.kind){
    case 'topic':return loc==='en'?`Your topic: ${t}`:`관심 주제 · ${t}`;
    case 'read':return loc==='en'?`Because you read about ${t}`:`${t} 글을 자주 읽으셔서`;
    case 'field':return loc==='en'?`In your field: ${f}`:`관심 분야 · ${f}`;
    case 'new':return loc==='en'?`Just in · ${t}`:`새로 나온 소식 · ${t}`;
    case 'region':return loc==='en'?`From your region · ${t}`:`고른 지역 소식 · ${t}`;
  }
}
function Card({rec,selection,loc}:{rec:Recommendation;selection:NewsletterSelection;loc:Locale}){
  const a=localize(rec.article,loc);
  return <li className="rec-card"><Link href={`/article/${a.id}?level=${selection.level}`}>
    <span className={`rec-reason rec-${rec.reason.kind}`}>{reasonText(rec.reason,loc)}</span>
    <strong>{a.title}</strong>
    <span className="rec-dek">{a.dek}</span>
  </Link></li>;
}
// "For you" on My newsletter: unread stories ranked by chosen topics and reading history, plus topics worth adding.
export function Recommendations({items,suggestions,selection,reads,loc}:{items:Recommendation[];suggestions:string[];selection:NewsletterSelection;reads:number;loc:Locale}){
  const L=lx(loc);
  if(!items.length&&!suggestions.length)return null;
  return <section className="recs" id="for-you" aria-labelledby="recs-title">
    <div className="recs-head"><div><p className="eyebrow">FOR YOU</p><h2 id="recs-title">{L('나를 위한 추천','Picked for you')}</h2>
      <p className="muted">{reads?(loc==='en'?`Based on your topics and the ${reads} stor${reads===1?'y':'ies'} you have opened. Stories you already read are left out.`:`고른 관심 주제와 지금까지 읽은 글 ${reads}편을 바탕으로 골랐어요. 이미 읽은 글은 빼고 보여 드려요.`):L('고른 관심 주제를 바탕으로 골랐어요. 글을 읽을수록 추천이 더 잘 맞춰져요.','Picked from the topics you chose. The more you read, the better these fit.')}</p></div>
      <Link className="text-link" href="/my/settings#reading">{L('읽은 기록 관리','Reading history')} →</Link></div>
    {items.length>0&&<ol className="rec-list">{items.map(r=><Card key={r.article.id} rec={r} selection={selection} loc={loc}/>)}</ol>}
    {suggestions.length>0&&<div className="rec-suggest"><p>{L('자주 읽는데 아직 관심사에 없는 주제예요. 넣으면 다음 호부터 담겨요.','You read these often but they are not in your interests yet. Add one and it joins your next issue.')}</p>
      <div className="rec-chips">{suggestions.map(t=><form key={t} action={addInterestTopic}><input type="hidden" name="topic" value={t}/><button className="chip-button">＋ {topicName(t,loc)}</button></form>)}</div></div>}
  </section>;
}
// "Start with these" on an issue: the unread stories in it that fit the reader best.
export function IssuePicks({items,selection,loc}:{items:Recommendation[];selection:NewsletterSelection;loc:Locale}){
  const L=lx(loc);
  if(!items.length)return null;
  return <section className="recs recs-issue" aria-labelledby="picks-title">
    <div className="recs-head"><div><p className="eyebrow">START HERE</p><h2 id="picks-title">{L('이번 호에서 먼저 읽어 볼 글','Start with these')}</h2><p className="muted">{L('읽은 기록과 관심 주제에 가장 잘 맞는, 아직 읽지 않은 글이에요.','The unread stories in this issue that best fit your topics and reading.')}</p></div></div>
    <ol className="rec-list">{items.map(r=><Card key={r.article.id} rec={r} selection={selection} loc={loc}/>)}</ol>
  </section>;
}
