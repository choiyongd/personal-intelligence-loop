import Link from 'next/link';
import {redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {betaReader} from '@/lib/beta';
import {currentReader,deliveryConfigured,listIssues} from '@/lib/beta-store';

export const metadata={title:'지난 호 · Personal Intelligence Loop'};
const states={saved:'보관',pending:'발송 대기',sent:'메일 발송',failed:'발송 실패'} as const;
export default async function Archive(){
  if(!(await betaReader()))redirect('/login#beta');
  const reader=deliveryConfigured()?await currentReader():null;
  const issues=reader?await listIssues(reader.id):[];
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view archive-view"><header className="newsletter-view-heading"><div><p className="eyebrow">ARCHIVE</p><h1>지난 호</h1><p>정한 시간에 만들어진 호와 직접 보관한 호입니다. 최근 60개까지 보여요.</p></div><Link className="button secondary" href="/my">나의 뉴스레터로</Link></header>
    {issues.length?<ol className="archive-list">{issues.map(i=><li key={i.id}><Link href={`/my/archive/${i.id}`}><time dateTime={i.issue_date}>{i.issue_date.replaceAll('-','.')}</time><strong>{i.title}</strong><span>{i.article_ids.length}편 · {i.kind==='scheduled'?'정기 호':'직접 보관'} · {states[i.delivery]}</span></Link></li>)}</ol>
    :<p className="archive-empty">{reader?'아직 보관된 호가 없어요. 나의 뉴스레터에서 “오늘 호 보관하기”를 누르거나, 메일 발송을 켜면 정한 시간마다 쌓입니다.':'보관함은 서버 저장소가 연결되고, 이 브라우저에서 한 번 보관하거나 메일을 신청하면 만들어집니다.'}</p>}
  </main><footer className="site-footer"><span>loop.</span><span>읽은 만큼 쌓입니다.</span></footer></div>;
}
