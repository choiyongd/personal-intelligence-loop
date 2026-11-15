import Link from 'next/link';
import type {Metadata} from 'next';
import {PublicNav} from '@/components/public-nav';
import {getL} from '@/lib/locale';
import {inviterName} from '@/lib/referral';
import {isReferralCode} from '@/lib/referral-code';

// A friend's invite link. The visit itself is noted by the proxy; this page welcomes the friend and points to the beta.
async function who(code:string){return isReferralCode(code)?await inviterName(code):null;}
export async function generateMetadata({params}:{params:Promise<{code:string}>}):Promise<Metadata>{
  const [{code},{loc}]=await Promise.all([params,getL()]),en=loc==='en',name=await who(code);
  const title=en?(name?`${name} invited you to loop.`:'You’re invited to loop.'):(name?`${name}님이 loop.에 초대했어요`:'loop.에 초대받았어요');
  const description=en?'A newsletter built from your interests: sourced explainers, written at your level. Free during the beta.':'관심 있는 분야를 고르면 출처 붙은 해설이 내 수준에 맞춰 뉴스레터로 옵니다. 베타 기간 무료.';
  const image=`/og/site${en?'?lang=en':''}`;
  return {title,description,robots:{index:false},openGraph:{type:'website',siteName:'loop.',title,description,images:[{url:image,width:1200,height:630}]},twitter:{card:'summary_large_image',title,description,images:[image]}};
}
export default async function Invite({params}:{params:Promise<{code:string}>}){
  const [{code},{L}]=await Promise.all([params,getL()]),name=await who(code);
  return <div className="site-page"><PublicNav/><main id="main"><section className="landing-hero invite-hero"><p className="eyebrow">{L('친구의 초대','AN INVITE FROM A FRIEND')}</p>
    <h1>{name?L(<>{name}님이<br/>함께 읽자고 초대했어요.</>,<>{name} wants you<br/>to read along.</>):L(<>함께 읽자는<br/>초대가 도착했어요.</>,<>You’ve been invited<br/>to read along.</>)}</h1>
    <p className="hero-description">{L(<>관심 있는 분야와 지역을 고르면, 출처가 붙은 해설이<br/>내 수준에 맞춰 나만의 뉴스레터로 옵니다. 베타 기간에는 무료예요.</>,<>Pick the fields and places you care about, and sourced explainers<br/>arrive as a newsletter written at your level. Free during the beta.</>)}</p>
    <div className="hero-actions"><Link className="button primary" href="/login#beta">{L('가입 없이 베타로 시작','Start the beta, no sign-up')} <span>↗</span></Link><Link className="text-link" href="/demo">{L('먼저 둘러보기','Take a look first')} <span>→</span></Link></div>
    <p className="hero-footnote">{L('메일로 받기를 켜면 초대해 준 친구에게도 함께하게 됐다고 숫자로만 알려져요. 메일 주소나 읽은 글은 알려지지 않습니다.','When you turn on mail delivery, your friend only sees a count of friends who joined. Your address and reading stay private.')}</p></section></main>
    <footer className="site-footer"><span className="brand">loop.</span><span>PERSONAL INTELLIGENCE LOOP · <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></span></footer></div>;
}
