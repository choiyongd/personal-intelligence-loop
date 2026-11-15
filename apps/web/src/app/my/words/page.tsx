import {PublicNav} from '@/components/public-nav';
import {WordBook} from '@/components/word-book';
import {getL} from '@/lib/locale';

export async function generateMetadata(){return {title:`${(await getL()).L('단어장','Word book')} · Personal Intelligence Loop`};}
// Open to every visitor: the words are collected in the reader's own browser, and synced for readers with an account.
export default async function Words(){
  const {loc,L}=await getL();
  return <div className="site-page"><PublicNav/><main id="main" className="word-book-view">
    <header className="newsletter-view-heading"><div><p className="eyebrow">{L('나의 단어장','MY WORD BOOK')}</p><h1>{L('단어장','Word book')}</h1><p>{L('기사에서 뜻을 본 낱말이 모이고, 잊을 때쯤 다시 보여 드립니다.','Words whose meaning you opened in a story, brought back just before you forget them.')}</p></div></header>
    <WordBook loc={loc}/>
  </main><footer className="site-footer"><span>loop.</span><span>{L('읽은 만큼 남습니다.','What you read, kept.')}</span></footer></div>;
}
