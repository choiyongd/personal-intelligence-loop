import 'server-only';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {newsletterSelectionSchema,defaultSelection,selectionFromQuery,type NewsletterSelection,type NewsletterStory,matchesSelection} from './newsletter';
import {context,eventSchema} from './data';

export async function newsletterProfile(tenant:string):Promise<NewsletterSelection>{
  const c=await context(tenant);
  const {data,error}=await c.client.from('newsletter_profiles').select('*').eq('tenant_id',tenant).eq('user_id',c.user.id).maybeSingle();
  if(error)throw new Error('뉴스레터 설정을 불러오지 못했습니다. 새 migration 적용 여부를 확인해 주세요.');
  if(!data){
    // No saved profile yet: start from the choices made in the public preview, if any.
    const draft=(await cookies()).get('pil_draft_selection')?.value;
    return draft?selectionFromQuery(Object.fromEntries(new URLSearchParams(draft))):defaultSelection;
  }
  return newsletterSelectionSchema.parse({...data,contentTypes:data.content_types});
}
export async function personalizedStories(tenant:string,selection:NewsletterSelection){
  const c=await context(tenant);
  // Bound the candidate set, then filter verified fields; no inferred country assignments.
  const {data,error}=await c.client.from('events').select('id,title,last_seen_at,articles(id,title,published_at,canonical_url,country_codes,content_type,observations(id,source_id,title,published_at,original_url,excerpt))')
    .eq('tenant_id',tenant).order('last_seen_at',{ascending:false}).order('id').limit(100);
  if(error)throw new Error('뉴스레터 자료를 불러오지 못했습니다.');
  const extended=eventSchema.extend({articles:eventSchema.shape.articles.element.extend({country_codes:z.array(z.string()),content_type:z.enum(['article','research','news'])}).array()}).array().parse(data||[]);
  // One story per event: the first article that fits the selection, with every source's observation as evidence.
  const stories:NewsletterStory[]=extended.flatMap(event=>{
    const evidence=event.articles.flatMap(a=>a.observations.map(o=>({source:o.source_id,url:o.original_url,title:o.title})));
    const candidates=event.articles.map(article=>({
      id:article.id,eventId:event.id,tenant,title:article.title,industry:'unknown' as const,topics:[],countries:article.country_codes,
      type:article.content_type,source:[...new Set(evidence.map(e=>e.source))].join(' · '),
      date:article.published_at,url:article.canonical_url,evidence,
    }));
    const match=candidates.find(c=>matchesSelection(c,selection));
    return match?[match]:[];
  });
  return {stories,examined:extended.length};
}
