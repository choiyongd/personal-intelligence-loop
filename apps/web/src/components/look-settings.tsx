'use client';
import {useState} from 'react';
import {accents,articleStyles,levels,themes,type Accent,type ArticleStyle,type Level,type Theme} from '@/lib/newsletter';

type Look={theme:Theme;accent:Accent;articleStyle:ArticleStyle;articleAccent:Accent;level:Level;terms:'on'|'off'};
function Swatches({name,value,onChange,label}:{name:string;value:Accent;onChange:(a:Accent)=>void;label:string}){
  return <fieldset className="look-swatches"><legend>{label}</legend><div>{accents.map(([id,text,hex])=><label key={id} className={`look-swatch${value===id?' selected':''}`} title={text}>
    <input type="radio" name={name} value={id} checked={value===id} onChange={()=>onChange(id)}/><i className={`swatch-dot swatch-${id}`} style={id==='auto'?undefined:{background:hex}} aria-hidden="true"/><span>{text}</span></label>)}</div></fieldset>;
}
// Settings with a live preview: every choice repaints the small newsletter and article samples before saving.
export function LookSettings({initial,action}:{initial:Look;action:(form:FormData)=>Promise<void>}){
  const [look,setLook]=useState(initial);
  const set=<K extends keyof Look>(k:K,v:Look[K])=>setLook(l=>({...l,[k]:v}));
  const changed=JSON.stringify(look)!==JSON.stringify(initial);
  return <form action={action} className="look-settings">
    <section className="look-block look-level" aria-labelledby="look-lv"><div className="look-controls"><p className="eyebrow">LEVEL &amp; WORDS</p><h2 id="look-lv">읽는 수준과 낱말 풀이</h2>
      <p className="muted look-note">배경지식에 맞춰 고르세요. 새로 만드는 뉴스레터와 모든 기사 화면에 바로 적용돼요.</p>
      <fieldset className="level-choices"><legend className="sr-only">읽는 수준</legend>{levels.map(([id,label,description])=><label key={id} className={`level-choice${look.level===id?' selected':''}`}><input type="radio" name="level" value={id} checked={look.level===id} onChange={()=>set('level',id)}/><strong>{label}</strong><small>{description}</small></label>)}</fieldset>
      <label className={`mail-switch${look.terms==='on'?' selected':''}`}><input type="checkbox" checked={look.terms==='on'} onChange={e=>set('terms',e.target.checked?'on':'off')}/><span className="mail-switch-track" aria-hidden="true"><i/></span><span><strong>어려운 낱말 뜻 보기</strong><small>{look.terms==='on'?'점선 밑줄이 있는 낱말에 마우스를 올리거나 눌러 뜻을 확인해요. 뉴스레터 끝에 ‘이번 호의 낱말’도 붙어요.':'낱말 표시와 낱말 목록을 숨겨요.'}</small></span></label>
      <input type="hidden" name="terms" value={look.terms}/></div>
      <div className="look-preview look-term-preview" aria-hidden="true"><p className="lp-kicker">미리보기 · {levels.find(l=>l[0]===look.level)![1]}</p><p>한국은행이 <span className={look.terms==='on'?'term-word':''}>기준금리</span>를 0.25%포인트 올렸다.</p>{look.terms==='on'&&<span className="term-tip lp-open"><b>기준금리</b>중앙은행이 정하는 정책 금리. 시중 금리의 출발점이 된다.</span>}{look.level==='intro'&&<p className="nl-easy"><b>쉽게 말하면</b>돈을 빌리는 값이 조금 비싸졌다는 뜻이에요.</p>}{look.level==='expert'&&<p className="nl-easy nl-deep"><b>심화 장</b>금리 경로와 가계부채, 환율의 상호작용</p>}</div>
    </section>
    <section className="look-block" aria-labelledby="look-nl"><div className="look-controls"><p className="eyebrow">NEWSLETTER</p><h2 id="look-nl">뉴스레터 디자인과 색상</h2>
      <fieldset className="look-cards"><legend className="sr-only">뉴스레터 디자인</legend>{themes.map(([id,label,hint])=><label key={id} className={`theme-choice theme-choice-${id}${look.theme===id?' selected':''}`}><input type="radio" name="theme" value={id} checked={look.theme===id} onChange={()=>set('theme',id)}/><span className="theme-thumb" aria-hidden="true"><i/><i/><i/></span><strong>{label}</strong><small>{hint}</small></label>)}</fieldset>
      <Swatches name="accent" value={look.accent} onChange={a=>set('accent',a)} label="포인트 색상"/></div>
      <div className={`look-preview nl theme-${look.theme} accent-${look.accent}`} aria-hidden="true"><div className="lp-mast"><span>loop.</span><b>Weekly</b></div><div className="lp-title">나의 데일리 브리프</div><div className="lp-row"><span className="hot-badge">HOT</span><span className="lp-line"/></div><div className="lp-card"><em/><span className="lp-line"/><span className="lp-line short"/></div><div className="lp-card"><em/><span className="lp-line"/><span className="lp-line short"/></div></div>
    </section>
    <section className="look-block" aria-labelledby="look-art"><div className="look-controls"><p className="eyebrow">ARTICLE</p><h2 id="look-art">세부 기사 디자인과 색상</h2>
      <fieldset className="look-cards"><legend className="sr-only">세부 기사 디자인</legend>{articleStyles.map(([id,label,hint])=><label key={id} className={`art-choice art-choice-${id}${look.articleStyle===id?' selected':''}`}><input type="radio" name="articleStyle" value={id} checked={look.articleStyle===id} onChange={()=>set('articleStyle',id)}/><span className="art-thumb" aria-hidden="true"><i/><i/></span><strong>{label}</strong><small>{hint}</small></label>)}</fieldset>
      <Swatches name="articleAccent" value={look.articleAccent} onChange={a=>set('articleAccent',a)} label="포인트 색상"/></div>
      <div className={`look-preview explainer art-${look.articleStyle} accent-${look.articleAccent}`} aria-hidden="true"><div className="explainer-head lp-head"><p className="explainer-kicker">기술 · AI · 해설</p><div className="lp-h1">AI 반도체 공급망, 무엇이 바뀌나</div><div className="explainer-meta"><div><dt>분량</dt><dd>4장</dd></div><div><dt>출처</dt><dd>5개</dd></div></div></div><div className="lp-body"><p className="page-label">1장</p><div className="lp-h2">무슨 일이 있었나</div><span className="lp-line"/><span className="lp-line"/><span className="lp-line short"/><div className="key-facts lp-facts"><h3>핵심 숫자</h3><dd>7,097억 달러</dd></div></div></div>
    </section>
    <div className="look-save"><span className="muted">{changed?'저장하면 나의 뉴스레터, 메일함, 모든 기사 화면에 바로 적용돼요.':'지금 설정이 적용되어 있어요.'}</span><button className="primary" disabled={!changed}>저장하기</button></div>
  </form>;
}
