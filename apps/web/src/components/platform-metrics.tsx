import {saveOperationsFinance} from '@/app/admin/actions';
import {MAX_KRW,reportMonth,type PlatformSnapshot} from '@/lib/platform-admin';

const number=new Intl.NumberFormat('ko-KR');
const percentage=new Intl.NumberFormat('ko-KR',{style:'percent',maximumFractionDigits:1});
const won=(value:number)=>`${number.format(value)}원`;
const status:Record<string,string>={
  saved:'월 실적을 저장했습니다.',
  invalid:'조회 월과 금액을 확인해 주세요.',
  failed:'월 실적을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
};
function Tile({label,value,note}:{label:string;value:string;note?:string}){
  return <div className="ops-tile"><span>{label}</span><b>{value}</b>{note&&<small>{note}</small>}</div>;
}

export function PlatformMetrics({overview,fb,message}:{
  overview:PlatformSnapshot;fb:'all'|'open';message?:string;
}){
  const {customers,finance}=overview,month=overview.month.slice(0,7);
  const net=finance?finance.gross-finance.refunds:0;
  const profit=finance?net-finance.costs:0;
  return <>
    <section id="accounts" aria-labelledby="h-accounts">
      <h2 id="h-accounts">이메일 가입 고객</h2>
      <p className="muted">개인 계정으로 가입하고 이메일을 인증한 고객을 집계합니다. 베타 독자와 운영 계정은 이 집계에 포함되지 않습니다.</p>
      <div className="ops-tiles">
        <Tile label="전체 가입 고객" value={`${number.format(customers.total)}명`}/>
        <Tile label="최근 30일 신규 가입" value={`${number.format(customers.new30)}명`}/>
        <Tile label="최근 30일 로그인" value={`${number.format(customers.active30)}명`}/>
      </div>
    </section>
    <section id="finance" aria-labelledby="h-finance">
      <h2 id="h-finance">월별 수익성</h2>
      <p className="muted">운영자가 입력한 금액 · KRW · 한국 시간 기준</p>
      {message&&Object.hasOwn(status,message)&&<p className="delivery-notice" role="status">{status[message]}</p>}
      <form className="feedback-form" method="get" action="/admin#finance">
        <input name="fb" type="hidden" value={fb}/>
        <label className="feedback-field"><span>조회 월</span><input name="month" type="month" min="2000-01" max={reportMonth()} defaultValue={month} required/></label>
        <button className="secondary">조회</button>
      </form>
      {finance?<div className="ops-tiles">
        <Tile label="순매출" value={won(net)} note="총매출 − 환불"/>
        <Tile label="운영 손익" value={won(profit)} note="순매출 − 운영비"/>
        <Tile label="운영 이익률" value={net>0?percentage.format(profit/net):'—'} note="순매출이 양수인 달에 계산"/>
      </div>:<p className="empty">이 달의 수익성 자료가 없습니다.</p>}
      <form className="feedback-form" action={saveOperationsFinance}>
        <input name="month" type="hidden" value={month}/>
        <input name="fb" type="hidden" value={fb}/>
        <fieldset>
          <legend>{month} 운영 실적 입력</legend>
          <div className="ops-tiles">
            {([
              ['gross','총매출 (원)',finance?.gross],
              ['refunds','환불 (원)',finance?.refunds],
              ['costs','운영비 (원)',finance?.costs],
            ] as const).map(([name,label,value])=><label className="feedback-field" key={name}>
              <span>{label}</span><input name={name} type="number" inputMode="numeric" min={0} max={MAX_KRW} step={1} defaultValue={value} required/>
            </label>)}
          </div>
        </fieldset>
        <button className="primary">월 실적 저장</button>
      </form>
    </section>
  </>;
}
