import Link from 'next/link';
import {signOut} from '@/app/actions';
import {Brand} from './public-nav';
export function Shell({children,tenant,active,workspace='나의 읽기 공간',demo=false}:{children:React.ReactNode;tenant?:string;active:string;workspace?:string;demo?:boolean}){
  const suffix=tenant?'?tenant='+tenant:'';
  const links=[['/feed','브리핑'],['/settings','관심사 · 출처'],['/saved','저장함'],['/publish','나의 뉴스레터'],['/operations','수집 현황']];
  return <div className="app-shell"><header className="app-nav"><Brand/><nav aria-label="주 메뉴">{links.map(([href,label])=><Link key={href} href={demo?'/newsletter':href+suffix} aria-current={active===href?'page':undefined}>{label}</Link>)}</nav><div className="app-account"><span>{workspace}</span>{demo?<Link href="/login">로그인 ↗</Link>:<form action={signOut}><button className="quiet">로그아웃 ↗</button></form>}</div></header><main id="main" className="app-main">{children}</main><footer className="app-footer"><span>PERSONAL INTELLIGENCE LOOP</span><span>읽는 만큼, 연결됩니다.</span></footer></div>;
}
