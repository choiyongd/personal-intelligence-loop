'use client';
import Link from 'next/link';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {dueWords,nextDue,reviewWord,stageOf,wordKey,WORDS_EVENT,type Stage,type Word} from '@/lib/words';
import {deleteRemote,loadLocal,pushWords,saveLocal,syncAll} from '@/lib/word-store';

type Loc='ko'|'en';
const SESSION=20;
const stageText:Record<Stage,[string,string]>={new:['새 낱말','New'],learning:['익히는 중','Learning'],known:['익숙함','Known']};
type Session={queue:Word[];index:number;shown:boolean;knew:number;again:number;practice:boolean;total:number};

export function WordBook({loc}:{loc:Loc}){
  const en=loc==='en',L=<T,>(ko:T,e:T)=>en?e:ko;
  const [words,setWords]=useState<Word[]|null>(null);
  const [synced,setSynced]=useState(false);
  const [session,setSession]=useState<Session|null>(null);
  const [query,setQuery]=useState('');
  const [sort,setSort]=useState<'recent'|'abc'|'stage'>('recent');
  const [now,setNow]=useState(0);
  useEffect(()=>{
    const local=loadLocal();setWords(local);setNow(Date.now());
    syncAll(local).then(r=>{setWords(r.list);setSynced(r.synced);});
    const read=()=>setWords(loadLocal());
    window.addEventListener('storage',read);
    return ()=>window.removeEventListener('storage',read);
  },[]);

  const due=useMemo(()=>words?dueWords(words,now):[],[words,now]);
  const known=words?.filter(w=>stageOf(w)==='known').length||0;
  const next=words?nextDue(words,now):null;
  const date=(t:number)=>new Intl.DateTimeFormat(en?'en-US':'ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date(t));

  const start=(practice:boolean)=>{
    const t=Date.now(),list=loadLocal().length?loadLocal():words||[];
    setNow(t);
    const pool=practice?[...list].sort(()=>Math.random()-.5):dueWords(list,t);
    const queue=pool.slice(0,SESSION);
    setSession(queue.length?{queue,index:0,shown:false,knew:0,again:0,practice,total:queue.length}:null);
  };
  const reveal=()=>setSession(s=>s&&{...s,shown:true});
  const answer=useCallback((knew:boolean)=>{
    const s=session;
    if(!s||!s.shown||s.index>=s.queue.length)return;
    const w=s.queue[s.index];
    if(!s.practice){
      const t=Date.now(),updated=reviewWord(w,knew,t),base=loadLocal();
      const list=(base.length?base:words||[]).map(x=>wordKey(x)===wordKey(w)?updated:x);
      saveLocal(list);setWords(list);void pushWords([updated]);
    }
    // A forgotten word comes back once more at the end of this round.
    const queue=!knew&&!s.queue.slice(s.index+1).some(x=>wordKey(x)===wordKey(w))?[...s.queue,w]:s.queue;
    setSession({...s,queue,index:s.index+1,shown:false,knew:s.knew+(knew?1:0),again:s.again+(knew?0:1)});
  },[session,words]);
  const remove=(w:Word)=>{
    const list=loadLocal().filter(x=>wordKey(x)!==wordKey(w));
    saveLocal(list);setWords(list);void deleteRemote(w);
  };

  // Keyboard: Space or Enter shows the meaning, → means "I knew it", ← means "again".
  const box=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!session||session.index>=session.queue.length)return;
    box.current?.focus();
    const key=(e:KeyboardEvent)=>{
      if((e.target as HTMLElement)?.tagName==='INPUT')return;
      if(!session.shown&&(e.key===' '||e.key==='Enter')){e.preventDefault();reveal();}
      else if(session.shown&&e.key==='ArrowRight'){e.preventDefault();answer(true);}
      else if(session.shown&&e.key==='ArrowLeft'){e.preventDefault();answer(false);}
    };
    window.addEventListener('keydown',key);return ()=>window.removeEventListener('keydown',key);
  },[session,answer]);
  useEffect(()=>{const t=()=>setNow(Date.now());window.addEventListener(WORDS_EVENT,t);return ()=>window.removeEventListener(WORDS_EVENT,t);},[]);

  if(words===null)return <p className="muted" role="status">{L('단어장을 불러오는 중…','Loading your word book…')}</p>;

  if(session){
    const finished=session.index>=session.queue.length,w=session.queue[session.index];
    return <section className="word-review" aria-label={L('낱말 복습','Word review')}>
      <div className="word-review-top"><p className="eyebrow">{session.practice?L('연습 · 일정은 그대로','PRACTICE · SCHEDULE UNCHANGED'):L('오늘의 복습','TODAY’S REVIEW')}</p>
        <button type="button" className="quiet" onClick={()=>{setSession(null);setNow(Date.now());}}>{L('그만하기','Stop')}</button></div>
      <div className="word-progress" role="progressbar" aria-valuemin={0} aria-valuemax={session.queue.length} aria-valuenow={Math.min(session.index,session.queue.length)} aria-label={L('진행','Progress')}><span style={{width:`${Math.min(100,session.index/session.queue.length*100)}%`}}/></div>
      {finished?<div className="word-card word-done" ref={box} tabIndex={-1}>
        <h2>{L('이번 복습을 마쳤어요','Review done')}</h2>
        <p>{en?`${session.knew} answers you knew · ${session.again} to see again`:`알았던 답 ${session.knew}번 · 다시 본 낱말 ${session.again}번`}</p>
        {!session.practice&&<p className="muted">{(()=>{const n=nextDue(words,Date.now());const left=dueWords(words,Date.now()).length;return left?(en?`${left} more words are still due.`:`아직 복습할 낱말이 ${left}개 남았어요.`):n?(en?`Next review: ${date(n)}`:`다음 복습: ${date(n)}`):'';})()}</p>}
        <div className="word-actions">{!session.practice&&dueWords(words,Date.now()).length>0&&<button type="button" className="primary" onClick={()=>start(false)}>{L('이어서 복습하기','Keep reviewing')}</button>}<button type="button" className="secondary" onClick={()=>{setSession(null);setNow(Date.now());}}>{L('단어장으로','Back to the word book')}</button></div>
      </div>:<div className="word-card" ref={box} tabIndex={-1} aria-live="polite">
        <p className="word-card-count">{session.index+1} / {session.queue.length}</p>
        <p className="word-card-term" lang={w.lang}>{w.term}</p>
        {w.articleTitle&&<p className="word-card-from">{L('나온 글','From')} · {w.articleTitle}</p>}
        {session.shown?<>
          <p className="word-card-meaning" lang={w.lang}>{w.meaning}</p>
          <div className="word-actions"><button type="button" className="secondary" onClick={()=>answer(false)}>← {L('다시 볼래요','Again')}</button><button type="button" className="primary" onClick={()=>answer(true)}>{L('알았어요','I knew it')} →</button></div>
        </>:<div className="word-actions"><button type="button" className="primary" onClick={reveal}>{L('뜻 보기','Show meaning')}</button></div>}
        <p className="word-keys muted">{session.shown?L('키보드: → 알았어요 · ← 다시','Keys: → knew it · ← again'):L('뜻을 먼저 떠올려 본 뒤 눌러 보세요. (스페이스)','Try to recall it first, then press. (Space)')}</p>
      </div>}
    </section>;
  }

  const q=query.trim().toLocaleLowerCase();
  const shown=words.filter(w=>!q||w.term.toLocaleLowerCase().includes(q)||w.meaning.toLocaleLowerCase().includes(q)||(w.articleTitle||'').toLocaleLowerCase().includes(q))
    .sort(sort==='abc'?(a,b)=>a.term.localeCompare(b.term,en?'en':'ko'):sort==='stage'?(a,b)=>a.box-b.box||b.lastAt-a.lastAt:(a,b)=>b.lastAt-a.lastAt);

  return <>
    <section className="word-summary" aria-label={L('단어장 요약','Word book summary')}>
      <dl><div><dt>{L('모은 낱말','Words')}</dt><dd>{words.length}</dd></div><div><dt>{L('지금 복습할 낱말','Due now')}</dt><dd>{due.length}</dd></div><div><dt>{L('익숙해진 낱말','Known')}</dt><dd>{known}</dd></div></dl>
      <div className="word-actions">
        {due.length>0?<button type="button" className="primary" onClick={()=>start(false)}>{en?`Review ${Math.min(due.length,SESSION)} words →`:`복습 시작 (${Math.min(due.length,SESSION)}개) →`}</button>
          :words.length>0&&<p className="muted">{next?(en?`Nothing due now. Next review: ${date(next)}.`:`지금 복습할 낱말은 없어요. 다음 복습은 ${date(next)}입니다.`):''}</p>}
        {words.length>0&&<button type="button" className="secondary" onClick={()=>start(true)}>{L('아무 낱말이나 연습하기','Practice any words')}</button>}
      </div>
      <p className="muted word-sync">{synced?L('이 단어장은 계정에 저장되어 다른 기기에서도 이어서 볼 수 있어요.','Saved to your account, so it follows you to other devices.'):L('이 단어장은 이 브라우저에만 저장돼요. 메일 주소를 등록하고 로그인하면 계정에도 저장됩니다.','This word book is kept in this browser only. Register your email and sign in to keep it in your account too.')}</p>
    </section>
    {words.length===0?<div className="word-empty">
      <h2>{L('아직 모은 낱말이 없어요','No words yet')}</h2>
      <p>{L('기사에서 점선 밑줄이 있는 낱말을 누르거나 잠시 가리키면 뜻이 보이고, 그 낱말이 여기에 자동으로 모입니다. 모은 낱말은 1일 · 3일 · 7일 · 14일 · 30일 간격으로 다시 보여 드려요.','Tap or rest on a word with a dotted underline in a story to see its meaning, and it is saved here. Saved words come back for review after 1, 3, 7, 14 and 30 days.')}</p>
      <Link className="button primary" href="/my">{L('나의 뉴스레터에서 읽기 →','Read in my newsletter →')}</Link>
    </div>:<section className="word-list" aria-label={L('모은 낱말','Your words')}>
      <div className="word-tools">
        <label className="word-search"><span className="sr-only">{L('낱말 찾기','Search words')}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={L('낱말이나 뜻으로 찾기','Search words or meanings')}/></label>
        <label className="word-sort"><span className="sr-only">{L('정렬','Sort')}</span><select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}><option value="recent">{L('최근에 본 순','Recently seen')}</option><option value="stage">{L('덜 익힌 순','Least known first')}</option><option value="abc">{L('가나다순','A to Z')}</option></select></label>
      </div>
      {shown.length===0&&<p className="muted">{L('찾는 낱말이 없어요.','No matching words.')}</p>}
      <ul>{shown.map(w=><li key={wordKey(w)} className={`word-row stage-${stageOf(w)}`}>
        <div className="word-row-main"><p className="word-row-term" lang={w.lang}>{w.term}<span className="word-stage">{stageText[stageOf(w)][en?1:0]}</span></p><p className="word-row-meaning" lang={w.lang}>{w.meaning}</p>
          <p className="word-row-meta">{w.articleId?<Link href={`/article/${w.articleId}`}>{w.articleTitle||L('나온 글 보기','See the story')}</Link>:null}<span>{en?`Seen ${w.seen}×`:`${w.seen}번 봄`}</span><span>{w.dueAt<=now?L('복습할 때','Due'):(en?`Next ${date(w.dueAt)}`:`다음 ${date(w.dueAt)}`)}</span></p></div>
        <button type="button" className="quiet word-remove" onClick={()=>remove(w)} aria-label={en?`Remove ${w.term}`:`${w.term} 지우기`}>{L('지우기','Remove')}</button>
      </li>)}</ul>
    </section>}
  </>;
}
