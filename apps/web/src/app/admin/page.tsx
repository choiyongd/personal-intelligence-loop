import type {Metadata} from 'next';
import {Brand} from '@/components/public-nav';
import {deliveryConfigured} from '@/lib/beta-store';
import {loadOps} from '@/lib/ops';
import {Dashboard} from '@/components/ops-dashboard';
import {isOwner,ownerConfigured} from '@/lib/owner';
import {ownerLogin,ownerLogout} from './actions';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'운영 대시보드 · loop.',robots:{index:false,follow:false}};

function Gate({error}:{error?:string}){
  return <main id="main" className="policy-page ops-page"><p className="eyebrow">OPERATIONS</p><h1>운영 대시보드</h1>
    {!ownerConfigured()?<p className="delivery-notice" role="status">운영 비밀번호가 아직 없습니다. 호스팅(Vercel) 환경 변수에 <code>OPS_PASSWORD</code>를 12자 이상으로 넣고 다시 배포하면 열립니다.</p>
    :<form action={ownerLogin} className="feedback-form">
      {error&&<p className="delivery-notice" role="alert">비밀번호가 맞지 않습니다.</p>}
      <label className="feedback-field"><span>운영 비밀번호</span><input name="password" type="password" required autoComplete="current-password" autoFocus/></label>
      <button className="primary">들어가기</button>
    </form>}
  </main>;
}

export default async function Admin({searchParams}:{searchParams:Promise<{error?:string;fb?:string}>}){
  const [q,owner]=await Promise.all([searchParams,isOwner()]);
  const page=(body:React.ReactNode)=><div className="site-page"><header className="public-nav"><Brand/><nav aria-label="운영 메뉴"><a href="#readers">구독자</a><a href="#mail">메일</a><a href="#feedback">의견</a></nav><div className="nav-account">{owner&&<form action={ownerLogout}><button className="quiet">나가기</button></form>}</div></header>{body}</div>;
  if(!owner)return page(<Gate error={q.error}/>);
  if(!deliveryConfigured())return page(<main id="main" className="policy-page ops-page"><h1>운영 대시보드</h1><p className="delivery-notice">Supabase 서버 키(SUPABASE_SECRET_KEY)가 없어 지표를 읽을 수 없습니다.</p></main>);
  const fb=q.fb==='all'?'all':'open';
  return page(<Dashboard o={await loadOps(fb)} fb={fb}/>);
}
