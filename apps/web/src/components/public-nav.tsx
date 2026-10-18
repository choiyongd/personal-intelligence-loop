import Link from 'next/link';
export function Brand(){return <Link className="brand" href="/" aria-label="Loop 홈">loop<span className="brand-dot">.</span></Link>;}
export function PublicNav({active}:{active?:string}){
  return <header className="public-nav"><Brand/><nav aria-label="사이트 메뉴"><Link href="/#how-it-works">서비스 소개</Link><Link href="/customize" aria-current={active==='customize'?'page':undefined}>관심사 설정</Link><Link href="/demo" aria-current={active==='demo'?'page':undefined}>뉴스레터 둘러보기</Link></nav><div className="nav-account"><Link className="nav-login" href="/login">로그인</Link><Link className="button primary small" href="/customize">나의 뉴스레터 만들기 <span>↗</span></Link></div></header>;
}
