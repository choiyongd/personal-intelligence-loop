import { z } from 'zod';

export const industries = [
  { id:'technology', label:'기술 · AI', description:'다음 변화를 만드는 기술', icon:'◈', terms:['AI','artificial intelligence','technology','model','software','인공지능','기술','모델'], topics:[['ai','인공지능','AI,artificial intelligence,model,인공지능,모델'],['semiconductor','반도체','semiconductor,chip,반도체'],['robotics','로보틱스','robot,robotics,로봇'],['software','소프트웨어','software,developer,소프트웨어,개발']] },
  { id:'business', label:'비즈니스', description:'기업과 시장의 새로운 움직임', icon:'↗', terms:['business','startup','company','기업','스타트업'], topics:[['startup','스타트업','startup,스타트업'],['strategy','기업 전략','strategy,business,전략'],['commerce','커머스','commerce,retail,커머스,유통']] },
  { id:'science', label:'과학 · 연구', description:'발견과 실험, 지식의 최전선', icon:'✳', terms:['research','science','study','연구','과학'], topics:[['space','우주','space,satellite,우주,위성'],['materials','신소재','material,신소재'],['biology','생명과학','biology,genome,생명,유전체']] },
  { id:'energy', label:'에너지 · 기후', description:'지속 가능한 전환을 읽는 시선', icon:'☼', terms:['energy','climate','battery','에너지','기후','배터리'], topics:[['battery','배터리','battery,storage,배터리,저장'],['renewables','재생에너지','renewable,solar,재생에너지,태양광'],['climate','기후 정책','climate,carbon,기후,탄소']] },
  { id:'health', label:'헬스케어', description:'건강과 의료의 새로운 가능성', icon:'+', terms:['health','medical','clinical','의료','건강','헬스'], topics:[['digital-health','디지털 헬스','digital health,health data,디지털 헬스,의료 데이터'],['biotech','바이오','biotech,genome,바이오'],['medicine','임상 · 의약','clinical,medicine,임상,의약']] },
  { id:'finance', label:'경제 · 금융', description:'돈의 흐름과 경제의 방향', icon:'◎', terms:['finance','economic','market','bank','금융','경제','금리'], topics:[['economy','거시경제','economy,economic,경제'],['fintech','핀테크','fintech,payment,핀테크,결제'],['investment','투자','investment,market,투자,증시']] },
  { id:'design', label:'디자인 · 문화', description:'사람과 경험을 바꾸는 생각', icon:'✦', terms:['design','culture','디자인','문화'], topics:[['product-design','제품 디자인','design,디자인'],['creative','크리에이티브','creative,creator,창작,크리에이터'],['culture','문화 트렌드','culture,trend,문화,트렌드']] },
  { id:'policy', label:'정책 · 사회', description:'제도와 사회 변화의 맥락', icon:'≡', terms:['policy','regulation','rule','government','정책','규제','사회'], topics:[['regulation','규제 · 법제','regulation,rule,규제,법제'],['society','사회 변화','society,사회'],['international','국제 관계','international,trade,국제,무역']] },
] as const;

export const countries = [
  ['US','미국'],['JP','일본'],['CN','중국'],['GB','영국'],['DE','독일'],['FR','프랑스'],
  ['CA','캐나다'],['AU','호주'],['SG','싱가포르'],['IN','인도'],['TW','대만'],['VN','베트남'],
] as const;
export const contentLabels = { article:'기사', research:'연구', news:'소식' } as const;
export const industryIds = industries.map(i=>i.id);
export type IndustryId = typeof industries[number]['id'];

export const newsletterSelectionSchema = z.object({
  industry: z.enum(['technology','business','science','energy','health','finance','design','policy']),
  subtopics: z.array(z.string()).max(6).default([]),
  scope: z.enum(['global','kr','country']).default('global'),
  country: z.string().default('US'),
  contentTypes: z.array(z.enum(['article','research','news'])).min(1,'읽을거리 유형을 하나 이상 선택하세요.').max(3).default(['article','research','news']),
  name: z.string().trim().min(1,'뉴스레터 이름을 입력하세요.').max(60,'이름은 60자 이내로 입력하세요.').default('나의 데일리 브리프'),
  cadence: z.enum(['daily','weekly']).default('daily'),
}).superRefine((value,ctx)=>{
  const validTopics = industries.find(i=>i.id===value.industry)!.topics.map(t=>t[0] as string);
  if(value.subtopics.some(t=>!validTopics.includes(t))) ctx.addIssue({code:'custom',message:'분야에 맞는 세부 주제를 선택하세요.',path:['subtopics']});
  if(value.scope==='country'&&!countries.some(c=>c[0]===value.country)) ctx.addIssue({code:'custom',message:'국가를 선택하세요.',path:['country']});
});
export type NewsletterSelection = z.infer<typeof newsletterSelectionSchema>;
export const defaultSelection:NewsletterSelection = {industry:'technology',subtopics:['ai'],scope:'global',country:'US',contentTypes:['article','research','news'],name:'나의 데일리 브리프',cadence:'daily'};
export function industryFor(id:string){return industries.find(i=>i.id===id)||industries[0];}
export function regionLabel(s:NewsletterSelection){return s.scope==='global'?'전 세계':s.scope==='kr'?'대한민국':countries.find(c=>c[0]===s.country)?.[1]||s.country;}
export function countryName(code:string){return code==='KR'?'대한민국':countries.find(c=>c[0]===code)?.[1]||code;}
export function topicLabels(s:NewsletterSelection){const topics=industryFor(s.industry).topics;return s.subtopics.map(id=>topics.find(t=>t[0]===id)?.[1]||id);}
export function selectionQuery(s:NewsletterSelection){
  return new URLSearchParams({industry:s.industry,topics:s.subtopics.join(','),scope:s.scope,country:s.country,types:s.contentTypes.join(','),name:s.name,cadence:s.cadence}).toString();
}
export function selectionFromQuery(p:Record<string,string|string[]|undefined>):NewsletterSelection{
  const get=(key:string,fallback:string)=>typeof p[key]==='string'?p[key] as string:fallback;
  const parsed=newsletterSelectionSchema.safeParse({industry:get('industry','technology'),subtopics:get('topics',p.industry===undefined?'ai':'').split(',').filter(Boolean),scope:get('scope','global'),country:get('country','US'),contentTypes:get('types','article,research,news').split(',').filter(Boolean),name:get('name','나의 데일리 브리프'),cadence:get('cadence','daily')});
  return parsed.success?parsed.data:defaultSelection;
}

export type NewsletterStory = {
  id:string; title:string; description?:string; industry:IndustryId|'unknown'; topics:string[]; countries:string[];
  type:keyof typeof contentLabels; source:string; date:string; url?:string; eventId?:string; tenant?:string; evidence:{source:string;url:string;title:string}[];
};
function matchesTerm(text:string,term:string){
  const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return /^[a-z0-9 ]+$/i.test(term)?new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`,'iu').test(text):text.toLocaleLowerCase().includes(term.toLocaleLowerCase());
}
export function matchesSelection(story:NewsletterStory,s:NewsletterSelection){
  if(!s.contentTypes.includes(story.type))return false;
  const country=s.scope==='kr'?'KR':s.country;
  if(s.scope!=='global'&&!story.countries.includes(country))return false;
  if(story.industry!=='unknown'&&story.industry!==s.industry)return false;
  const i=industryFor(s.industry);
  const title=[story.title,...story.evidence.map(e=>e.title)].join(' ');
  if(s.subtopics.length){
    return s.subtopics.some(id=>story.topics.includes(id)||i.topics.find(t=>t[0]===id)?.[2].split(',').some(term=>matchesTerm(title,term)));
  }
  return story.industry===s.industry||i.terms.some(term=>matchesTerm(title,term));
}
