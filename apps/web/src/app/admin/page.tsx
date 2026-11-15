import type {Metadata} from 'next';
import {Brand} from '@/components/public-nav';
import {deliveryConfigured} from '@/lib/beta-store';
import {loadOps} from '@/lib/ops';
import {Dashboard} from '@/components/ops-dashboard';
import {PlatformMetrics} from '@/components/platform-metrics';
import {platformAdminAccess,reportMonth,validMonth} from '@/lib/platform-admin';
import {operationsLogin,operationsLogout} from './actions';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'운영 대시보드 · loop.',robots:{index:false,follow:false}};

function Gate({state,error}:{state:'setup'|'sign-in'|'denied'|'unavailable';error?:string}){
  const notice=state==='denied'?'이 계정에 운영 권한이 없습니다. 등록된 관리자 계정으로 로그인해 주세요.'
    :state==='setup'?'운영 계정 연결이 아직 준비되지 않았습니다.'
    :state==='unavailable'?'운영 권한을 확인하지 못했습니다. 잠시 후 다시 접속해 주세요.'
    :error==='wait'?'로그인 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
    :error==='sign-in'?'로그인하지 못했습니다. 이메일과 비밀번호를 확인해 주세요.':null;
  return <main id="main" className="policy-page ops-page"><p className="eyebrow">OPERATIONS</p><h1>운영 대시보드</h1>
    {notice&&<p className="delivery-notice" role="status">{notice}</p>}
    {(state==='sign-in'||state==='denied')&&<form action={operationsLogin} className="feedback-form">
      <p>등록된 관리자 계정으로 로그인하세요.</p>
      <label className="feedback-field"><span>관리자 이메일</span><input name="email" type="email" required maxLength={254} autoComplete="username"/></label>
      <label className="feedback-field"><span>비밀번호</span><input name="password" type="password" required minLength={10} maxLength={128} autoComplete="current-password"/></label>
      <button className="primary">관리자 로그인</button>
    </form>}
  </main>;
}

export default async function Admin({searchParams}:{searchParams:Promise<{error?:string;fb?:string;month?:string;finance?:string}>}){
  const q=await searchParams;
  const access=await platformAdminAccess(validMonth(q.month)?q.month:reportMonth());
  const allowed=access.state==='allowed';
  const page=(body:React.ReactNode,legacy=false)=><div className="site-page"><header className="public-nav"><Brand/>{allowed&&<nav aria-label="운영 메뉴"><a href="#accounts">고객</a><a href="#finance">수익성</a>{legacy&&<><a href="#readers">구독자</a><a href="#mail">메일</a><a href="#feedback">의견</a></>}</nav>}<div className="nav-account">{(allowed||access.state==='denied')&&<form action={operationsLogout}><button className="quiet">로그아웃</button></form>}</div></header>{body}</div>;
  if(!allowed)return page(<Gate state={access.state} error={q.error}/>);
  const fb=q.fb==='all'?'all':'open';
  const extra=<PlatformMetrics overview={access.overview} fb={fb} message={q.finance}/>;
  if(deliveryConfigured()){
    try {
      const overview=await loadOps(fb);
      return page(<Dashboard o={overview} fb={fb} extra={extra}/>,true);
    } catch { console.warn('[operations] Subscriber dashboard data unavailable'); }
  }
  return page(<main id="main" className="ops-page ops-wide">
    <p className="eyebrow">OPERATIONS · 한국 시간 기준</p><h1>운영 대시보드</h1>{extra}
    <p className="delivery-notice" role="status">구독자·메일·독자 의견 지표를 지금 불러올 수 없습니다.</p>
  </main>);
}
