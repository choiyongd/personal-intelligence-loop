import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {LookSettings} from '@/components/look-settings';
import {DeliveryPanel} from '@/components/delivery-panel';
import {betaReader,draftSelection} from '@/lib/beta';
import {currentReader,deliveryConfigured} from '@/lib/beta-store';
import {mailConfigured} from '@/lib/mailer';
import {readInbox} from '@/lib/inbox';
import {planLabel,scheduleLabel,selectionQuery} from '@/lib/newsletter';
import {getL} from '@/lib/locale';
import {clearReadingHistory,saveLook,setReadingHistory} from '@/app/beta-actions';
import {readReading} from '@/lib/reading';
import {readingProfile} from '@/lib/recommend';
import {topicName} from '@/lib/newsletter';

export async function generateMetadata(){return {title:`${(await getL()).L('개인 설정','Settings')} · Personal Intelligence Loop`};}
export default async function Settings({searchParams}:{searchParams:Promise<{saved?:string;mail?:string;reading?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const [{saved,mail,reading},{loc,L}]=await Promise.all([searchParams,getL()]);
  const available=deliveryConfigured(),reader=available?await currentReader():null,store=await readInbox();
  const reads=await readReading(),profile=readingProfile(reads.r);
  const top=[...profile.topics].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([t])=>topicName(t,loc));
  const readingNotice:Record<string,[string,string]>={on:['읽은 기록으로 추천하기를 켰어요.','Recommendations from your reading are on.'],off:['읽은 기록으로 추천하기를 끄고, 쌓인 기록을 지웠어요. 추천은 고른 관심 주제만 봅니다.','Recommendations from your reading are off and your history was erased. Picks now use your chosen topics only.'],cleared:['읽은 기록을 모두 지웠어요.','Your reading history was erased.']};
  return <div className="site-page"><PublicNav active="settings"/><main id="main" className="settings-view">
    <header className="newsletter-view-heading"><div><p className="eyebrow">{loc==='en'?`${beta.name} · ${planLabel(store.plan,loc)} plan`:`${beta.name}님 · ${planLabel(store.plan)} 플랜`}</p><h1>{L('개인 설정','Settings')}</h1><p>{L('읽는 수준과 낱말 풀이, 뉴스레터와 세부 기사의 디자인·색상, 받는 방법을 한곳에서 바꿉니다.','Change your reading level, word help, the design and colors of your newsletter and articles, and how you receive them, all in one place.')}</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>{L('관심사 · 받는 시간','Interests · delivery time')} ({scheduleLabel(selection,loc)}) ↗</Link><Link className="button secondary" href="/my">{L('나의 뉴스레터 ↗','My newsletter ↗')}</Link></div></header>
    {saved&&<p className="delivery-notice" role="status">{L('저장했어요. 이제 뉴스레터와 기사 화면이 새 디자인으로 보입니다.','Saved. Your newsletter and articles now use the new design.')}</p>}
    <LookSettings key={`${selection.theme}${selection.accent}${selection.articleStyle}${selection.articleAccent}${selection.level}${selection.terms}`} initial={{theme:selection.theme,accent:selection.accent,articleStyle:selection.articleStyle,articleAccent:selection.articleAccent,level:selection.level,terms:selection.terms}} action={saveLook} loc={loc}/>
    <section className="reading-settings" id="reading" aria-labelledby="reading-title"><p className="eyebrow">READING HISTORY</p><h2 id="reading-title">{L('읽은 기록과 추천','Reading history and picks')}</h2>
      {reading&&readingNotice[reading]&&<p className="delivery-notice" role="status">{readingNotice[reading][loc==='en'?1:0]}</p>}
      <p className="muted">{L('기사를 열면 어떤 글을 읽었는지(글 번호와 주제, 날짜)만 이 브라우저에 남겨, 나를 위한 추천과 새로 만드는 호의 순서를 맞춥니다. 서버로 보내지 않고, 최근 120편까지만 보관해요. 정기 호는 메일로 받는 내용과 같도록 이 기록을 쓰지 않아요.','When you open a story, only which one you read (its number, topic and date) is kept in this browser to tune your picks and the order of editions you make. It is not sent to our server, and only the latest 120 are kept. Scheduled issues do not use it, so they match what is emailed.')}</p>
      <p>{reads.on?(loc==='en'?`${profile.count} stor${profile.count===1?'y':'ies'} so far${top.length?` · most read: ${top.join(', ')}`:''}`:`지금까지 읽은 글 ${profile.count}편${top.length?` · 많이 읽은 주제: ${top.join(', ')}`:''}`):L('지금은 꺼져 있어요. 추천은 고른 관심 주제만 보고 골라요.','Off right now. Picks use your chosen topics only.')}</p>
      <div className="heading-actions"><form action={setReadingHistory}><input type="hidden" name="on" value={reads.on?'off':'on'}/><button className="button secondary">{reads.on?L('읽은 기록 쓰지 않기','Stop using my reading'):L('읽은 기록으로 추천하기','Use my reading for picks')}</button></form>{reads.on&&profile.count>0&&<form action={clearReadingHistory}><button className="quiet">{L('기록 지우기','Erase history')}</button></form>}</div>
    </section>
    <DeliveryPanel reader={reader} selection={selection} available={available} mailReady={mailConfigured()} plan={store.plan} notice={mail} loc={loc}/>
  </main><footer className="site-footer"><span>loop.</span><span>{L('나에게 맞는 읽기.','Reading that fits you.')}</span></footer></div>;
}
