import Link from 'next/link';
import {betaReader} from '@/lib/beta';
export function Brand(){return <Link className="brand" href="/" aria-label="Loop 홈">loop<span className="brand-dot">.</span></Link>;}
export async function PublicNav({active}:{active?:string}){
  const beta=await betaReader();
  return <header className="public-nav"><Brand/><nav aria-label="사이트 메뉴"><Link href="/#how-it-works">서비스 소개</Link><Link href="/customize" aria-current={active==='customize'?'page':undefined}>관심사 설정</Link><Link href="/demo" aria-current={active==='demo'?'page':undefined}>뉴스레터 둘러보기</Link></nav><div className="nav-account">{beta?<><Link className="nav-login nav-reader" href="/my">{beta.name}님</Link><Link className="button primary small" href="/my" aria-current={active==='my'?'page':undefined}>나의 뉴스레터 <span>↗</span></Link></>:<><Link className="nav-login" href="/login">로그인</Link><Link className="button primary small" href="/login#beta">베타로 시작하기 <span>↗</span></Link></>}</div></header>;
}
