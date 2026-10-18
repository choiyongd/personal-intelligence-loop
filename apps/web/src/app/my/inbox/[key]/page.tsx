import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {ThemePicker} from '@/components/theme-picker';
import {MarkRead} from '@/components/mark-read';
import {betaReader,draftSelection} from '@/lib/beta';
import {editionStories} from '@/lib/articles';
import {inboxIssues,readInbox} from '@/lib/inbox';
import {mailThisEdition} from '@/app/beta-actions';

const mailNotice:Record<string,string>={sent:'이 호를 확인된 메일 주소로 보냈어요.','need-email':'메일로 받으려면 먼저 나의 뉴스레터에서 메일 주소를 확인해 주세요.',unavailable:'메일 발송은 운영 설정(저장소와 메일 발송 계정)이 끝나면 열립니다.',error:'메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.'};
export const metadata={title:'다시 보기 · Personal Intelligence Loop'};
export default async function InboxIssuePage({params,searchParams}:{params:Promise<{key:string}>;searchParams:Promise<{mail?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const [{key},{mail}]=await Promise.all([params,searchParams]);
  const issues=inboxIssues(selection,await readInbox()),index=issues.findIndex(i=>i.key===key);
  if(index<0)notFound();
  const issue=issues[index],newer=issues[index-1],older=issues[index+1];
  const when=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'long',hour:'numeric',minute:'2-digit'}).format(new Date(issue.at));
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view">
    <MarkRead editionKey={issue.key} unread={!issue.read}/>
    <header className="newsletter-view-heading"><div><p className="eyebrow">{issue.kind==='scheduled'?'정기 호':'직접 만든 호'} · 다시 보기</p><h1>{selection.name}</h1><p>{when} · 읽을거리 {issue.articleIds.length}편</p></div>
      <div className="heading-actions"><Link className="button secondary" href="/my/inbox">메일함 ↗</Link><form action={mailThisEdition.bind(null,issue.key)}><button className="primary">이 호 메일로 받기</button></form></div></header>
    {mail&&mailNotice[mail]&&<p className="delivery-notice" role="status">{mailNotice[mail]}</p>}
    <div className="paper-tools"><nav className="issue-nav" aria-label="다른 호">{older?<Link href={`/my/inbox/${older.key}`}>← 이전 호</Link>:<span/>}{newer?<Link href={`/my/inbox/${newer.key}`}>다음 호 →</Link>:<span/>}</nav><ThemePicker current={selection.theme}/></div>
    <NewsletterPaper selection={selection} stories={editionStories(selection,issue.articleIds)} editorial issuedAt={new Date(issue.at).toISOString()}/>
  </main><footer className="site-footer"><span>loop.</span><span>읽은 만큼 쌓입니다.</span></footer></div>;
}
