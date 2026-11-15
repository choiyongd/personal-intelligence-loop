import {articleById,hasEnglish,localize,topicLabel} from '@/lib/articles';
import {ensureArticles} from '@/lib/live/registry';
import {industryName} from '@/lib/newsletter';
import {ogImage} from '@/lib/og';

// Preview image for a shared story: /og/article/<id>?lang=en uses the English translation when there is one.
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  await ensureArticles([id]).catch(()=>undefined);
  const raw=articleById(id);
  if(!raw)return ogImage({kicker:'loop.',title:'원문에서 다음 생각까지.',foot:'출처 붙은 해설 뉴스레터'});
  const en=new URL(request.url).searchParams.get('lang')==='en'&&hasEnglish(id),loc=en?'en':'ko';
  const a=localize(raw,loc);
  return ogImage({kicker:`${industryName(a.industry,loc)} · ${topicLabel(a.topic,loc)}`,title:a.title,dek:a.dek,
    en,foot:en?`${a.sources.length} sources · facts as of ${a.asOf}`:`출처 ${a.sources.length}개 · 사실 기준일 ${a.asOf}`});
}
