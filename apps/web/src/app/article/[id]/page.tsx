import Link from 'next/link';
import {notFound} from 'next/navigation';
import {PublicNav} from '@/components/public-nav';
import {articleById,topicLabel} from '@/lib/articles';
import {betaReader} from '@/lib/beta';
import {contentLabels,countryName,industryFor,levels,levelLabel,type Level} from '@/lib/newsletter';

export async function generateMetadata({params}:{params:Promise<{id:string}>}){const a=articleById((await params).id);return {title:a?`${a.title} · loop.`:'기사 없음'};}

// "[3]" markers become links to the numbered source list at the end of the article.
function Cited({text}:{text:string}){
  return <>{text.split(/(\[\d+\])/).map((part,i)=>{const m=/^\[(\d+)\]$/.exec(part);return m?<sup key={i}><a href={`#source-${m[1]}`} aria-label={`출처 ${m[1]}`}>[{m[1]}]</a></sup>:part;})}</>;
}
export default async function ArticlePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{level?:string}>}){
  const [{id},{level:raw}]=await Promise.all([params,searchParams]);
  const a=articleById(id);if(!a)notFound();
  const level:Level=raw==='intro'||raw==='expert'?raw:'practitioner';
  const beta=await betaReader();
  // Page numbers come from the layout, so drop any number the writer put in the heading.
  const bare=(h:string)=>h.replace(/^\s*\d+\s*장\s*[.:·]?\s*/,'');
  const pages=[...a.pages.map(p=>({...p,heading:bare(p.heading),deep:false})),...(level==='expert'?[{heading:bare(a.deepDive.heading),easy:'',paragraphs:a.deepDive.paragraphs,deep:true}]:[])];
  const total=pages.length+1;
  const regions=a.regions.map(r=>r==='GLOBAL'?'전 세계':countryName(r)).join(' · ');
  return <div className="site-page article-site"><PublicNav/><div className="reading-progress" aria-hidden="true"/><main id="main" className="article-view">
    <nav className="article-back" aria-label="기사 이동"><Link href={beta?'/my':'/newsletter'}>← {beta?'나의 뉴스레터':'뉴스레터'}로</Link><div className="level-switch" role="group" aria-label="읽는 수준">{levels.map(([lv,label])=><Link key={lv} href={`/article/${a.id}?level=${lv}`} aria-current={lv===level?'true':undefined}>{label}</Link>)}</div></nav>
    <article className="explainer">
      <header className="explainer-head"><p className="explainer-kicker">{industryFor(a.industry).label} · {topicLabel(a.topic)} · {contentLabels[a.type]}</p><h1>{a.title}</h1><p className="explainer-dek">{a.dek}</p><dl className="explainer-meta"><div><dt>읽는 수준</dt><dd>{levelLabel(level)}</dd></div><div><dt>분량</dt><dd>{total}장</dd></div><div><dt>지역</dt><dd>{regions}</dd></div><div><dt>사실 기준일</dt><dd>{a.asOf}</dd></div><div><dt>출처</dt><dd><a href="#sources">{a.sources.length}개</a></dd></div></dl></header>
      <div className="explainer-inner">
      {level==='intro'&&<aside className="glossary" aria-label="먼저 알아둘 말"><h2>먼저 알아둘 말</h2><dl>{a.glossary.map(g=><div key={g.term}><dt>{g.term}</dt><dd>{g.meaning}</dd></div>)}</dl></aside>}
      {pages.map((p,i)=><section className={`explainer-page${p.deep?' deep':''}`} key={p.heading} aria-labelledby={`page-${i+1}`}><p className="page-label">{i+1}장{p.deep?' · 심화':''}</p><h2 id={`page-${i+1}`}>{p.heading}</h2>
        {level==='intro'&&p.easy&&<p className="easy-box"><b>쉽게 말하면</b> {p.easy}</p>}
        <div className="explainer-body">{p.paragraphs.map((t,j)=><p key={j}><Cited text={t}/></p>)}</div>
        {i===0&&a.keyFacts.length>0&&<aside className="key-facts" aria-label="핵심 숫자"><h3>핵심 숫자</h3><dl>{a.keyFacts.map(f=><div key={f.label}><dt>{f.label}</dt><dd>{f.value}<sup><a href={`#source-${f.source}`}>[{f.source}]</a></sup></dd></div>)}</dl></aside>}
      </section>)}
      <section className="explainer-page think" aria-labelledby="page-think"><p className="page-label">{total}장 · 질문과 생각거리</p><h2 id="page-think">읽고 나서, 스스로에게.</h2><div className="think-grid"><div><h3>확인 질문</h3><ol>{a.questions.map(q=><li key={q}>{q}</li>)}</ol></div><div><h3>생각거리</h3><ul>{a.thoughts.map(t=><li key={t}>{t}</li>)}</ul></div></div></section>
      <footer className="sources" id="sources"><h2>참고한 자료</h2><p className="muted">본문의 [번호]는 아래 자료를 가리킵니다. 숫자와 날짜는 원문에서 다시 확인하세요.</p><ol>{a.sources.map((s,i)=><li key={s.url} id={`source-${i+1}`}><span className="source-kind">{s.kind}</span><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a><small>{s.publisher} · {s.year}</small></li>)}</ol><p className="quiet-note">이 해설은 위 자료를 바탕으로 loop. 베타 편집진이 다시 쓴 글이며 원문의 문장을 옮기지 않았습니다.</p></footer>
      </div>
      <footer className="explainer-foot"><b>loop.</b><span>원문에서 다음 생각까지.</span></footer>
    </article></main><footer className="site-footer"><span>loop.</span><span>원문에서 다음 생각까지.</span></footer></div>;
}
