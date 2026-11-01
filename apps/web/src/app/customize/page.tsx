import {PublicNav} from '@/components/public-nav';
import {NewsletterBuilder} from '@/components/newsletter-builder';
import {inLocale,selectionFromQuery} from '@/lib/newsletter';
import {betaReader,draftSelection} from '@/lib/beta';
import {saveBetaSelection} from '../beta-actions';
import {mailState} from '@/lib/edition-mail';
import {getLocale} from '@/lib/locale';
export default async function Customize({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const [params,beta,loc]=await Promise.all([searchParams,betaReader(),getLocale()]);
  // Beta readers coming back without a query continue from their saved choices.
  const hasChoice=Object.keys(params).some(k=>k!=='beta');
  const mail=beta?await mailState():undefined;
  const initial=inLocale(hasChoice?selectionFromQuery(params,loc):(beta&&await draftSelection())||selectionFromQuery(params,loc),loc);
  return <div className="site-page"><PublicNav active="customize"/><main id="main" className="builder-page"><NewsletterBuilder initial={initial} beta={Boolean(beta)} betaSave={saveBetaSelection} mail={mail} loc={loc}/></main><footer className="site-footer"><span>PERSONAL INTELLIGENCE LOOP</span><span>FOLLOW YOUR CURIOSITY.</span></footer></div>;
}
