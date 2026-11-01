import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {articleStories} from '@/lib/articles';
import {inLocale,selectionFromQuery,selectionQuery,regionLabel,industryLabel,levelLabel,plans} from '@/lib/newsletter';
import {refreshLive} from '@/lib/live/registry';
import {BetaBanner} from '@/components/beta-banner';
import {getL} from '@/lib/locale';

export default async function Newsletter({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  await refreshLive();
  const {loc,L}=await getL();
  const selection=inLocale(selectionFromQuery(await searchParams,loc),loc),stories=articleStories(selection).slice(0,plans.free.stories);
  return <div className="site-page"><PublicNav active="demo"/><main id="main" className="newsletter-view"><header className="newsletter-view-heading"><div><p className="eyebrow">YOUR VERY OWN EDITION</p><h1>{L('이제, 당신의 시선으로.','Now, through your own eyes.')}</h1><p>{loc==='en'?`An edition built from ${industryLabel(selection,loc)} · ${regionLabel(selection,loc)} · ${levelLabel(selection.level,loc)} level.`:`${industryLabel(selection)} · ${regionLabel(selection)} · ${levelLabel(selection.level)} 수준으로 구성한 지면입니다.`}</p></div><div className="heading-actions"><Link className="button secondary" href={`/customize?${selectionQuery(selection)}`}>{L('관심사 수정 ↗','Edit interests ↗')}</Link><Link className="button primary" href="/login#beta">{L('베타로 저장하기 ↗','Save it with the beta ↗')}</Link></div></header><BetaBanner loc={loc}/><NewsletterPaper selection={selection} stories={stories} editorial/></main><footer className="site-footer"><span>loop.</span><span>{L('선택한 관심사가 새로운 읽기로.','Your interests, turned into new reading.')}</span></footer></div>;
}
