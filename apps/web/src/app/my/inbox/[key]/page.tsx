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
import {getL} from '@/lib/locale';
import {intlLocale} from '@/lib/i18n';

const mailNotice:Record<string,[string,string]>={sent:['이 호를 메일로도 보냈어요.','We also emailed this issue.'],check:['확인 메일을 보냈어요. 메일의 버튼을 누르면 이 호가 바로 메일로 도착합니다.','We sent a confirmation email. Press its button and this issue arrives right away.'],wait:['확인 메일을 방금 보냈어요. 1분 뒤에 다시 시도해 주세요.','We just sent a confirmation email. Please try again in a minute.'],'bad-email':['메일 주소 형식을 확인해 주세요. 이 호는 메일함에 저장됐어요.','Please check the email address. This issue is saved in your mailbox.'],'need-email':['메일로 받으려면 나의 뉴스레터의 만들기 칸에서 메일 주소를 적어 주세요.','To get it by email, add your address in the make box on My newsletter.'],unavailable:['메일 발송은 운영 설정(저장소와 메일 발송 계정)이 끝나면 열립니다.','Email delivery opens once storage and the sending account are set up.'],error:['메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.','We could not send the email. Please try again shortly.']};
export async function generateMetadata(){return {title:`${(await getL()).L('다시 보기','Reread')} · Personal Intelligence Loop`};}
export default async function InboxIssuePage({params,searchParams}:{params:Promise<{key:string}>;searchParams:Promise<{mail?:string}>}){
  const beta=await betaReader();
  if(!beta)redirect('/login#beta');
  const selection=await draftSelection();
  if(!selection)redirect('/customize?beta=1');
  const [{key},{mail},{loc,L}]=await Promise.all([params,searchParams,getL()]),en=loc==='en';
  const issues=inboxIssues(selection,await readInbox()),index=issues.findIndex(i=>i.key===key);
  if(index<0)notFound();
  const issue=issues[index],newer=issues[index-1],older=issues[index+1];
  const when=new Intl.DateTimeFormat(intlLocale(loc),{timeZone:selection.tz,year:'numeric',month:'long',day:'numeric',weekday:'long',hour:'numeric',minute:'2-digit'}).format(new Date(issue.at));
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view">
    <MarkRead editionKey={issue.key} unread={!issue.read}/>
    <header className="newsletter-view-heading"><div><p className="eyebrow">{issue.kind==='scheduled'?L('정기 호','Scheduled issue'):L('직접 만든 호','Your edition')} · {L('다시 보기','Reread')}</p><h1>{selection.name}</h1><p>{when} · {en?`${issue.articleIds.length} stories`:`읽을거리 ${issue.articleIds.length}편`}</p></div>
      <div className="heading-actions"><Link className="button secondary" href="/my/inbox">{L('메일함 ↗','Mailbox ↗')}</Link><form action={mailThisEdition.bind(null,issue.key)}><button className="primary">{L('이 호 메일로 받기','Email me this issue')}</button></form></div></header>
    {mail&&mailNotice[mail]&&<p className="delivery-notice" role="status">{mailNotice[mail][en?1:0]}</p>}
    <div className="paper-tools"><nav className="issue-nav" aria-label={L('다른 호','Other issues')}>{older?<Link href={`/my/inbox/${older.key}`}>{L('← 이전 호','← Older')}</Link>:<span/>}{newer?<Link href={`/my/inbox/${newer.key}`}>{L('다음 호 →','Newer →')}</Link>:<span/>}</nav><ThemePicker current={selection.theme} loc={loc}/></div>
    <NewsletterPaper selection={selection} stories={editionStories(selection,issue.articleIds)} editorial issuedAt={new Date(issue.at).toISOString()}/>
  </main><footer className="site-footer"><span>loop.</span><span>{L('읽은 만큼 쌓입니다.','What you read adds up.')}</span></footer></div>;
}
