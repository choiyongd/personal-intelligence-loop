import {PublicNav} from '@/components/public-nav';
import {NewsletterBuilder} from '@/components/newsletter-builder';
import {selectionFromQuery} from '@/lib/newsletter';
export default async function Customize({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  return <div className="site-page"><PublicNav active="customize"/><main id="main" className="builder-page"><NewsletterBuilder initial={selectionFromQuery(await searchParams)}/></main><footer className="site-footer"><span>PERSONAL INTELLIGENCE LOOP</span><span>FOLLOW YOUR CURIOSITY.</span></footer></div>;
}
