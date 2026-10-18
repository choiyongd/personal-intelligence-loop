import {PublicNav} from '@/components/public-nav';
import {NewsletterBuilder} from '@/components/newsletter-builder';
import {selectionFromQuery} from '@/lib/newsletter';
import {betaReader,draftSelection} from '@/lib/beta';
import {saveBetaSelection} from '../beta-actions';
export default async function Customize({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams,beta=await betaReader();
  // Beta readers coming back without a query continue from their saved choices.
  const hasChoice=Object.keys(params).some(k=>k!=='beta');
  const initial=hasChoice?selectionFromQuery(params):(beta&&await draftSelection())||selectionFromQuery(params);
  return <div className="site-page"><PublicNav active="customize"/><main id="main" className="builder-page"><NewsletterBuilder initial={initial} beta={Boolean(beta)} betaSave={saveBetaSelection}/></main><footer className="site-footer"><span>PERSONAL INTELLIGENCE LOOP</span><span>FOLLOW YOUR CURIOSITY.</span></footer></div>;
}
