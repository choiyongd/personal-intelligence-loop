import Link from 'next/link';
import {PublicNav} from '@/components/public-nav';
import {NewsletterPaper} from '@/components/newsletter-paper';
import {defaultsFor} from '@/lib/newsletter';
import {articleStories} from '@/lib/articles';
import {getL} from '@/lib/locale';
export default async function Home(){
  const {loc,L}=await getL(),base=defaultsFor(loc);
  return <div className="site-page"><PublicNav/><main id="main"><section className="landing-hero"><p className="eyebrow">YOUR CURIOSITY. YOUR DAILY EDITION.</p>
    <h1>{L(<>세상의 모든 소식보다,<br/>나에게 필요한 이야기.</>,<>Not every story in the world.<br/>The ones you need.</>)}</h1>
    <p className="hero-description">{L(<>관심 있는 분야와 지역을 고르면,<br/>기사와 연구, 새로운 소식이 당신만의 뉴스레터가 됩니다.</>,<>Pick the fields and places you care about,<br/>and articles, research and news become a newsletter of your own.</>)}</p>
    <div className="hero-actions"><Link className="button primary" href="/login#beta">{L('가입 없이 베타로 시작','Start the beta, no sign-up')} <span>↗</span></Link><Link className="text-link" href="/demo">{L('먼저 둘러보기','Take a look first')} <span>→</span></Link></div>
    <p className="hero-footnote">{L('나의 관심사에서 시작하는, 조금 더 깊은 읽기.','Deeper reading that starts from what you care about.')}</p>
    <div className="hero-paper-frame"><div className="product-frame-bar"><span>● ● ●</span><span>YOUR PERSONAL EDITION</span><span>↗</span></div><NewsletterPaper compact selection={{...base,name:'The Curiosity Brief'}} stories={articleStories({...base,industries:['technology','energy','finance'],subtopics:[]}).slice(0,7)} editorial/></div></section>
    <section className="how-it-works" id="how-it-works"><header><p className="eyebrow">A BETTER WAY TO STAY CURIOUS</p><h2>{L(<>읽는 시간은 줄이고,<br/>생각의 깊이는 더하세요.</>,<>Spend less time reading,<br/>and think more deeply.</>)}</h2></header><div className="how-columns">
      <article><span>01</span><h3>{L('관심을 고르세요.','Choose your interests.')}</h3><p>{L('기술, 과학, 비즈니스. 넓은 분야에서 시작해 나만의 세부 주제로 좁혀갑니다.','Tech, science, business. Start broad, then narrow down to the topics that are yours.')}</p></article>
      <article><span>02</span><h3>{L('시야를 정하세요.','Set your view.')}</h3><p>{L('전 세계의 흐름부터 대한민국, 원하는 나라까지. 지금 내게 필요한 범위를 정합니다.','From worldwide trends to the US or any country you want. Choose the range you need right now.')}</p></article>
      <article><span>03</span><h3>{L('나만의 지면으로 읽으세요.','Read your own edition.')}</h3><p>{L('나의 수준에 맞게 다시 쓴 두세 장의 해설과 질문, 생각거리. 모든 사실에는 원문과 학술 자료 출처가 붙습니다.','Two or three chapters of explanation written at your level, with questions and things to think about. Every fact links to its original or academic source.')}</p></article>
    </div></section>
    <section className="closing-note"><h2>{L(<>다음 관심사는,<br/>어떤 이야기인가요?</>,<>What are you<br/>curious about next?</>)}</h2><Link className="button primary" href="/customize">{L('나만의 읽기 시작하기 ↗','Start your own reading ↗')}</Link></section></main>
    <footer className="site-footer"><span className="brand">loop.</span><p>{L('읽는 만큼, 연결됩니다.','The more you read, the more it connects.')}</p><span>PERSONAL INTELLIGENCE LOOP · <a href="/privacy">{L('개인정보 처리방침','Privacy policy')}</a></span></footer></div>;
}
