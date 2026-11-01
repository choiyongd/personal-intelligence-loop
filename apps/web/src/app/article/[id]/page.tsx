import Link from 'next/link';
import {TermFit} from '@/components/term-fit';
import {notFound} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {articleById,hasEnglish,localize,topicLabel} from '@/lib/articles';
import {ensureArticles} from '@/lib/live/registry';
import {betaReader,draftSelection} from '@/lib/beta';
import {withTerms,type Gloss} from '@/components/terms';
import {contentLabel,countryName,industryName,levels,levelsEn,levelLabel,type Level} from '@/lib/newsletter';
import {getL,getLocale} from '@/lib/locale';
import type {Locale} from '@/lib/i18n';

export async function generateMetadata({params}:{params:Promise<{id:string}>}){
  const {id}=await params;await ensureArticles([id]);
  const [raw,loc]=[articleById(id),await getLocale()];
  const a=raw&&localize(raw,loc);
  return {title:a?`${a.title} · loop.`:loc==='en'?'Story not found':'기사 없음'};
}
const kindEn:Record<string,string>={'원문':'Primary source','공식 자료':'Official','학술 자료':'Academic','통계':'Statistics','보도':'News report'};

// "[3]" markers become links to the numbered source list at the end of the article.
// Hard terms are marked at their first appearance in the article when the reader keeps word help on.
function Cited({text,glossary,seen,loc}:{text:string;glossary?:Gloss[];seen?:Set<string>;loc:Locale}){
  return <>{text.split(/(\[\d+\])/).map((part,i)=>{const m=/^\[(\d+)\]$/.exec(part);return m?<sup key={i}><a href={`#source-${m[1]}`} aria-label={loc==='en'?`Source ${m[1]}`:`출처 ${m[1]}`}>[{m[1]}]</a></sup>:seen?<span key={i}>{withTerms(part,glossary,seen,`p${i}`)}</span>:part;})}</>;
}
export default async function ArticlePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{level?:string}>}){
  const [{id},{level:raw},{loc:siteLoc,L:siteL}]=await Promise.all([params,searchParams,getL()]);
  await ensureArticles([id]);
  const original=articleById(id);if(!original)notFound();
  // An English reader gets the translation when there is one; otherwise the Korean original with a note.
  const translated=siteLoc==='en'&&hasEnglish(id),koreanOnly=siteLoc==='en'&&!translated;
  const loc:Locale=translated?'en':'ko';
  const a=localize(original,loc);
  const L=<T,>(ko:T,en:T)=>loc==='en'?en:ko;
  const level:Level=raw==='intro'||raw==='expert'?raw:'practitioner';
  const beta=await betaReader();
  // The reader's chosen article look; visitors without saved choices get the default studio style.
  const look=(beta?await draftSelection():null)||{articleStyle:'studio',articleAccent:'auto',terms:'on'};
  const seen=look.terms==='off'?undefined:new Set<string>();
  // Page numbers come from the layout, so drop any number the writer put in the heading.
  const bare=(h:string)=>h.replace(/^\s*\d+\s*장\s*[.:·]?\s*/,'').replace(/^\s*Chapter\s+\d+\s*[.:·]?\s*/i,'');
  const pages=[...a.pages.map(p=>({...p,heading:bare(p.heading),deep:false})),...(level==='expert'?[{heading:bare(a.deepDive.heading),easy:'',paragraphs:a.deepDive.paragraphs,deep:true}]:[])];
  const total=pages.length+1;
  const regions=a.regions.map(r=>r==='GLOBAL'?L('전 세계','Worldwide'):countryName(r,loc)).join(' · ');
  return <div className="site-page article-site"><PublicNav/><TermFit/><div className="reading-progress" aria-hidden="true"/><main id="main" className="article-view">
    <nav className="article-back" aria-label={siteL('기사 이동','Article navigation')}><Link href={beta?'/my':'/newsletter'}>{siteLoc==='en'?`← Back to ${beta?'my newsletter':'the newsletter'}`:`← ${beta?'나의 뉴스레터':'뉴스레터'}로`}</Link><div className="level-switch" role="group" aria-label={siteL('읽는 수준','Reading level')}>{levels.map(([lv,label])=><Link key={lv} href={`/article/${a.id}?level=${lv}`} aria-current={lv===level?'true':undefined}>{siteLoc==='en'?levelsEn[lv][0]:label}</Link>)}</div></nav>
    {koreanOnly&&<p className="delivery-notice" role="status" lang="en">This explainer is available in Korean only for now. English editions use translated stories; more are on the way.</p>}
    <article className={`explainer art-${look.articleStyle} accent-${look.articleAccent}`} lang={loc}>
      <header className="explainer-head"><p className="explainer-kicker">{industryName(a.industry,loc)} · {topicLabel(a.topic,loc)} · {contentLabel(a.type,loc)}</p><h1>{a.title}</h1><p className="explainer-dek">{a.dek}</p>{a.live&&<p className="explainer-dek muted" role="note">{L(`${a.asOf}에 새로 나온 공식 발표를 바탕으로 AI가 쓴 소식입니다. 모든 사실에는 아래 원문 출처 번호가 붙어 있고, 발표 원문이 기준입니다.`,`Written by AI on ${a.asOf} from new official releases. Every fact carries a numbered source below; the original release prevails.`)}</p>}<dl className="explainer-meta"><div><dt>{L('읽는 수준','Level')}</dt><dd>{levelLabel(level,loc)}</dd></div><div><dt>{L('분량','Length')}</dt><dd>{L(`${total}장`,`${total} chapters`)}</dd></div><div><dt>{L('지역','Region')}</dt><dd>{regions}</dd></div><div><dt>{L('사실 기준일','Facts as of')}</dt><dd>{a.asOf}</dd></div><div><dt>{L('출처','Sources')}</dt><dd><a href="#sources">{L(`${a.sources.length}개`,String(a.sources.length))}</a></dd></div></dl></header>
      <div className="explainer-inner">
      {level==='intro'&&<aside className="glossary" aria-label={L('먼저 알아둘 말','Words to know first')}><h2>{L('먼저 알아둘 말','Words to know first')}</h2><dl>{a.glossary.map(g=><div key={g.term}><dt>{g.term}</dt><dd>{g.meaning}</dd></div>)}</dl></aside>}
      {pages.map((p,i)=><section className={`explainer-page${p.deep?' deep':''}`} key={p.heading} aria-labelledby={`page-${i+1}`}><p className="page-label">{L(`${i+1}장`,`Chapter ${i+1}`)}{p.deep?L(' · 심화',' · Deep dive'):''}</p><h2 id={`page-${i+1}`}>{p.heading}</h2>
        {level==='intro'&&p.easy&&<p className="easy-box"><b>{L('쉽게 말하면','In plain words')}</b> {p.easy}</p>}
        <div className="explainer-body">{p.paragraphs.map((t,j)=><p key={j}><Cited text={t} glossary={a.glossary} seen={seen} loc={loc}/></p>)}</div>
        {i===0&&a.keyFacts.length>0&&<aside className="key-facts" aria-label={L('핵심 숫자','Key numbers')}><h3>{L('핵심 숫자','Key numbers')}</h3><dl>{a.keyFacts.map(f=><div key={f.label}><dt>{f.label}</dt><dd>{f.value}<sup><a href={`#source-${f.source}`}>[{f.source}]</a></sup></dd></div>)}</dl></aside>}
      </section>)}
      <section className="explainer-page think" aria-labelledby="page-think"><p className="page-label">{L(`${total}장 · 질문과 생각거리`,`Chapter ${total} · Questions and ideas`)}</p><h2 id="page-think">{L('읽고 나서, 스스로에게.','After reading, ask yourself.')}</h2><div className="think-grid"><div><h3>{L('확인 질문','Check questions')}</h3><ol>{a.questions.map(q=><li key={q}>{q}</li>)}</ol></div><div><h3>{L('생각거리','Things to think about')}</h3><ul>{a.thoughts.map(t=><li key={t}>{t}</li>)}</ul></div></div></section>
      {level!=='intro'&&a.glossary.length>0&&<details className="glossary glossary-end"><summary>{L(`이 글의 낱말 ${a.glossary.length}개`,`${a.glossary.length} words in this story`)} <small>{L('뜻 확인하기','See meanings')}</small></summary><dl>{a.glossary.map(g=><div key={g.term}><dt>{g.term}</dt><dd>{g.meaning}</dd></div>)}</dl></details>}
      <footer className="sources" id="sources"><h2>{L('참고한 자료','Sources')}</h2><p className="muted">{L('본문의 [번호]는 아래 자료를 가리킵니다. 숫자와 날짜는 원문에서 다시 확인하세요.','Each [number] in the text points to a source below. Check numbers and dates against the originals.')}</p><ol>{a.sources.map((s,i)=><li key={s.url} id={`source-${i+1}`}><span className="source-kind">{loc==='en'?kindEn[s.kind]||s.kind:s.kind}</span><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a><small>{s.publisher} · {s.year}</small></li>)}</ol><p className="quiet-note">{a.live?L(`이 소식은 위 공식 발표를 바탕으로 AI(${a.live.model})가 ${a.asOf}에 새로 쓴 글이며 원문의 문장을 옮기지 않았습니다. 틀린 곳이 있으면 원문이 기준입니다.`,`This story was newly written by AI (${a.live.model}) on ${a.asOf} from the official releases above, without copying their sentences. Where it differs, the original prevails.`):L('이 해설은 위 자료를 바탕으로 loop. 베타 편집진이 다시 쓴 글이며 원문의 문장을 옮기지 않았습니다.','This explainer was rewritten by the loop. beta editors from the sources above and does not copy their sentences. It was first written in Korean and translated into English.')}</p></footer>
      </div>
      <footer className="explainer-foot"><b>loop.</b><span>{L('원문에서 다음 생각까지.','From the source to your next thought.')}</span></footer>
    </article></main><footer className="site-footer"><span>loop.</span><span>{siteL('원문에서 다음 생각까지.','From the source to your next thought.')}</span></footer></div>;
}
