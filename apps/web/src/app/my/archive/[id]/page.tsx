import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {betaReader} from '@/lib/beta';
import {currentReader,deliveryConfigured,getIssue} from '@/lib/beta-store';
import {editionStories} from '@/lib/articles';

export default async function ArchivedIssue({params}:{params:Promise<{id:string}>}){
  if(!(await betaReader()))redirect('/login#beta');
  const reader=deliveryConfigured()?await currentReader():null;
  const issue=reader?await getIssue(reader.id,(await params).id):null;
  if(!issue)notFound();
  // The issue keeps the article ids and selection it was made with, so it reads the same later.
  const stories=editionStories(issue.selectionParsed,issue.article_ids);
  return <div className="site-page"><PublicNav active="my"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">ARCHIVED ISSUE · {issue.issue_date.replaceAll('-','.')}</p><h1>{issue.title}</h1><p>{issue.kind==='scheduled'?'정기 호':'직접 보관한 호'} · {stories.length}편</p></div><Link className="button secondary" href="/my/archive">지난 호 목록</Link></header>
    <NewsletterPaper selection={issue.selectionParsed} stories={stories} editorial issuedAt={`${issue.issue_date}T09:00:00+09:00`}/></main><footer className="site-footer"><span>loop.</span><span>읽은 만큼 쌓입니다.</span></footer></div>;
}
