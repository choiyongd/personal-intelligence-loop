import Link from 'next/link';
import {betaReader,savedOrDefaultSelection} from '@/lib/beta';
import {nextArrival,readInbox,unreadCount} from '@/lib/inbox';
import {getL} from '@/lib/locale';
import {planLabel} from '@/lib/newsletter';
import type {Locale} from '@/lib/i18n';
import {InboxBell} from './inbox-bell';
export function Brand({loc='ko'}:{loc?:Locale}){return <Link className="brand" href="/" aria-label={loc==='en'?'Loop home':'Loop 홈'}>loop<span className="brand-dot">.</span></Link>;}
// Switches the whole site (and a saved edition's mail) between Korean and English.
export function LangSwitch({loc}:{loc:Locale}){
  return <span className="lang-switch" role="group" aria-label={loc==='en'?'Language':'언어'}>{loc==='en'?<><a href="/lang?to=ko" hrefLang="ko" lang="ko">한국어</a><b aria-current="true">EN</b></>:<><b aria-current="true">KO</b><a href="/lang?to=en" hrefLang="en" lang="en">English</a></>}</span>;
}
export async function PublicNav({active}:{active?:string}){
  const [beta,{loc,L}]=await Promise.all([betaReader(),getL()]);
  const box=beta?await (async()=>{const [s,store]=await Promise.all([savedOrDefaultSelection(),readInbox()]);return {count:unreadCount(s,store),nextAt:nextArrival(s,store),plan:store.plan};})():null;
  return <header className="public-nav"><Brand loc={loc}/><nav aria-label={L('사이트 메뉴','Site menu')}><Link href="/#how-it-works">{L('서비스 소개','How it works')}</Link><Link href="/customize" aria-current={active==='customize'?'page':undefined}>{L('관심사 설정','Your interests')}</Link><Link href="/demo" aria-current={active==='demo'?'page':undefined}>{L('뉴스레터 둘러보기','Sample edition')}</Link><Link href="/pricing" aria-current={active==='pricing'?'page':undefined}>{L('요금제','Pricing')}</Link></nav><div className="nav-account"><LangSwitch loc={loc}/>{beta?<><InboxBell count={box!.count} nextAt={box!.nextAt} loc={loc}/><Link className="nav-login nav-reader" href="/my/settings" title={L('개인 설정','Settings')} aria-current={active==='settings'?'page':undefined}>{loc==='en'?beta.name:`${beta.name}님`} <small className="plan-tag">{planLabel(box!.plan,loc)}</small></Link><Link className="button primary small" href="/my" aria-current={active==='my'?'page':undefined}>{L('나의 뉴스레터','My newsletter')} <span>↗</span></Link></>:<><Link className="nav-login" href="/login">{L('로그인','Sign in')}</Link><Link className="button primary small" href="/login#beta">{L('베타로 시작하기','Join the beta')} <span>↗</span></Link></>}</div></header>;
}
