import type {loadOps} from '@/lib/ops';
import {toggleFeedback} from '@/app/admin/actions';

export type OpsData=Awaited<ReturnType<typeof loadOps>>;
const n=(v:number|null)=>v===null?'—':v.toLocaleString('ko-KR');
const pct=(v:number|null)=>v===null?'—':`${(v*100).toFixed(v>=.995||v===0?0:1)}%`;
const md=(day:string)=>`${Number(day.slice(5,7))}/${Number(day.slice(8,10))}`;
const when=(s:string|null)=>s?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(s)):'—';
const deliveryKo:Record<string,string>={sent:'보냄',pending:'보내는 중',failed:'실패',saved:'저장만'};

function Tile({label,value,note}:{label:string;value:string;note?:string}){
  return <div className="ops-tile"><span>{label}</span><b>{value}</b>{note&&<small>{note}</small>}</div>;
}
// One series per chart, so no legend: the heading names it. Each bar shows its value on hover or focus, and the table below repeats every number.
function Bars({title,rows,format,caption}:{title:string;rows:{day:string;value:number|null;label:string}[];format:(v:number)=>string;caption:string}){
  const max=Math.max(1,...rows.map(r=>r.value??0));
  return <figure className="ops-chart"><figcaption>{title}</figcaption>
    <div className="ops-bars" role="img" aria-label={`${title}: ${caption}`}>
      {rows.map(r=><div key={r.day} className="ops-bar" tabIndex={0} aria-label={`${md(r.day)} ${r.label}`}>
        <i style={{height:`${r.value?Math.max(3,(r.value/max)*100):0}%`}} data-empty={r.value===null?'1':undefined}/>
        <span className="ops-tip" role="tooltip">{md(r.day)} · {r.label}</span>
      </div>)}
    </div>
    <div className="ops-axis"><span>{md(rows[0].day)}</span><span>최대 {format(max)}</span><span>{md(rows[rows.length-1].day)}</span></div>
    <details className="ops-table"><summary>표로 보기</summary><table><thead><tr><th>날짜</th><th>값</th></tr></thead><tbody>{rows.map(r=><tr key={r.day}><td>{r.day}</td><td>{r.label}</td></tr>)}</tbody></table></details>
  </figure>;
}

export function Dashboard({o,fb}:{o:OpsData;fb:'open'|'all'}){
  const r=o.readers,m=o.mail,f=o.feedback;
  return <main id="main" className="ops-page ops-wide">
    <p className="eyebrow">OPERATIONS · 한국 시간 기준 · 최근 30일</p><h1>운영 대시보드</h1>

    <section id="readers" aria-labelledby="h-readers"><h2 id="h-readers">구독자</h2>
      <div className="ops-tiles">
        <Tile label="전체 독자" value={n(r.total)} note={`최근 30일 새로 ${n(r.new30)}명`}/>
        <Tile label="메일 확인 완료" value={n(r.confirmed)} note="확인 링크를 누른 주소"/>
        <Tile label="정기 메일 받는 중" value={n(r.subscribers)} note={`수신 켬 ${n(r.receiving)}명 중 구독 플랜`}/>
        <Tile label="유료 구독" value={n(r.paid)} note={r.paid===null?'결제 설정 전':'결제 중인 구독'}/>
      </div>
      <Bars title="하루 새 독자" caption={`최근 30일 ${r.new30}명`} format={v=>`${v}명`} rows={r.daily.map(d=>({day:d.day,value:d.value,label:`${d.value}명`}))}/>
    </section>

    <section id="mail" aria-labelledby="h-mail"><h2 id="h-mail">메일 열람</h2>
      {m.sent>0&&m.tracked===0&&<p className="delivery-notice" role="status">보낸 메일에 열람 기록이 아직 없습니다. Resend 웹훅을 연결한 뒤 보내는 메일부터 집계됩니다.</p>}
      <div className="ops-tiles">
        <Tile label="보낸 정기 메일" value={n(m.sent)} note={m.delivered?`도착 확인 ${n(m.delivered)}통`:'도착 기록 없음'}/>
        <Tile label="열람률" value={pct(m.openRate)} note={`${n(m.opened)}통 열람`}/>
        <Tile label="클릭률" value={pct(m.clickRate)} note={`${n(m.clicked)}통에서 링크 클릭`}/>
        <Tile label="문제" value={n(m.bounced+m.complained+m.failed7)} note={`반송 ${m.bounced} · 스팸 신고 ${m.complained} · 발송 실패(7일) ${m.failed7}`}/>
      </div>
      <Bars title="날짜별 열람률 (최근 14일)" caption="열지 않은 날은 0, 보낸 메일이 없는 날은 빈 칸" format={v=>pct(v)}
        rows={m.daily.map(d=>({day:d.day,value:d.rate,label:d.rate===null?'보낸 메일 없음':`${pct(d.rate)} (${d.opened}/${d.sent}통)`}))}/>
      <p className="muted">열람은 메일 속 보이지 않는 이미지가 불릴 때 기록됩니다. 애플 메일처럼 이미지를 미리 받는 앱은 열지 않아도 열람으로 잡히고, 이미지를 막은 앱은 열어도 빠지므로 클릭률을 함께 보세요.</p>
      <h3>최근 정기 발송</h3>
      <div className="table-scroll"><table><thead><tr><th>날짜</th><th>호 제목</th><th>상태</th><th>보낸 시각</th><th>열람</th><th>클릭</th></tr></thead><tbody>
        {m.recent.map((i,k)=><tr key={k}><td>{i.issue_date}</td><td>{i.title}</td><td title={i.last_error||undefined}>{i.bounced_at?'반송':deliveryKo[i.delivery]||i.delivery}</td><td>{when(i.sent_at)}</td><td>{i.opened_at?when(i.opened_at):'—'}</td><td>{i.clicked_at?'예':'—'}</td></tr>)}
      </tbody></table>{!m.recent.length&&<div className="empty">아직 보낸 정기 메일이 없습니다.</div>}</div>
    </section>

    <section id="feedback" aria-labelledby="h-feedback"><h2 id="h-feedback">독자 의견</h2>
      <div className="ops-tiles">
        <Tile label="받은 의견" value={n(f.total)} note={`확인 안 한 의견 ${n(f.open)}개`}/>
        <Tile label="평균 만족도" value={f.average===null?'—':`${f.average.toFixed(1)} / 5`} note={`${n(f.rated)}명이 점수 남김`}/>
      </div>
      {f.rated>0&&<div className="ops-ratings" aria-label="만족도 분포">{f.byRating.map((c,i)=><div key={i}><span>{i+1}점</span><i><b style={{width:`${(c/Math.max(1,...f.byRating))*100}%`}}/></i><span>{c}명</span></div>)}</div>}
      <nav className="ops-filter" aria-label="의견 보기"><a href="/admin?fb=open#feedback" aria-current={fb==='open'?'page':undefined}>확인 안 한 의견</a><a href="/admin?fb=all#feedback" aria-current={fb==='all'?'page':undefined}>전체</a></nav>
      <ul className="ops-feedback">{f.list.map(x=><li key={x.id} className={x.handled_at?'done':undefined}>
        <div className="ops-feedback-meta"><b>{x.rating?`${x.rating}점`:'점수 없음'}</b><span>{x.source==='mail'?'메일에서':'사이트에서'}</span><span>{when(x.created_at)}</span>{x.contact&&<a href={`mailto:${x.contact}`}>{x.contact}에게 답장</a>}</div>
        <p>{x.message}</p>
        <form action={toggleFeedback}><input type="hidden" name="id" value={x.id}/><input type="hidden" name="fb" value={fb}/><input type="hidden" name="done" value={x.handled_at?'0':'1'}/><button className="quiet">{x.handled_at?'다시 확인할 의견으로':'확인함으로 표시'}</button></form>
      </li>)}</ul>
      {!f.list.length&&<div className="empty">{fb==='open'?'확인할 의견이 없습니다.':'아직 받은 의견이 없습니다.'}</div>}
    </section>
  </main>;
}
