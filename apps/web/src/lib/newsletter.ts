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
type Topic=readonly [string,string,string];
export const allTopics:readonly Topic[]=industries.flatMap(i=>i.topics as readonly Topic[]);
export const contentLabels = { article:'기사', research:'연구', news:'소식' } as const;
export const industryIds = industries.map(i=>i.id);
export type IndustryId = typeof industries[number]['id'];

const industryEnum=z.enum(['technology','business','science','energy','health','finance','design','policy']);
const countryEnum=z.enum(['US','JP','CN','GB','DE','FR','CA','AU','SG','IN','TW','VN'],{message:'국가를 선택하세요.'});
export const levels=[
  ['intro','입문','처음 읽는 분야예요. 쉬운 설명과 용어 풀이부터.'],
  ['practitioner','실무','일과 연결해 읽어요. 사실과 숫자 중심으로.'],
  ['expert','심화','방법론과 쟁점까지. 한계와 논쟁을 함께.'],
] as const;
export type Level=typeof levels[number][0];

export const newsletterSelectionSchema = z.object({
  industries: z.array(industryEnum).min(1,'관심 분야를 하나 이상 선택하세요.').max(8).default(['technology']),
  subtopics: z.array(z.string()).max(16,'세부 주제는 16개까지 고를 수 있어요.').default([]),
  scope: z.enum(['global','kr','country']).default('global'),
  countries: z.array(countryEnum).max(5,'국가는 5개까지 고를 수 있어요.').default(['US']),
  contentTypes: z.array(z.enum(['article','research','news'])).min(1,'읽을거리 유형을 하나 이상 선택하세요.').max(3).default(['article','research','news']),
  name: z.string().trim().min(1,'뉴스레터 이름을 입력하세요.').max(60,'이름은 60자 이내로 입력하세요.').default('나의 데일리 브리프'),
  cadence: z.enum(['daily','weekly']).default('daily'),
  level: z.enum(['intro','practitioner','expert']).default('practitioner'),
  // Delivery time in Korea time; weekday 0=일요일 is used only for weekly editions.
  sendHour: z.coerce.number().int().min(0).max(23).default(7),
  sendWeekday: z.coerce.number().int().min(0).max(6).default(1),
}).superRefine((value,ctx)=>{
  const validTopics = industries.filter(i=>(value.industries as string[]).includes(i.id)).flatMap(i=>i.topics.map(t=>t[0] as string));
  if(value.subtopics.some(t=>!validTopics.includes(t))) ctx.addIssue({code:'custom',message:'선택한 분야에 맞는 세부 주제를 고르세요.',path:['subtopics']});
  if(value.scope==='country'&&value.countries.length===0) ctx.addIssue({code:'custom',message:'국가를 하나 이상 선택하세요.',path:['countries']});
  if(new Set(value.industries).size!==value.industries.length||new Set(value.countries).size!==value.countries.length) ctx.addIssue({code:'custom',message:'같은 항목이 두 번 선택되었습니다.',path:['industries']});
});
export type NewsletterSelection = z.infer<typeof newsletterSelectionSchema>;
export const defaultSelection:NewsletterSelection = {industries:['technology'],subtopics:['ai'],scope:'global',countries:['US'],contentTypes:['article','research','news'],name:'나의 데일리 브리프',cadence:'daily',level:'practitioner',sendHour:7,sendWeekday:1};
export const weekdays=['일','월','화','수','목','금','토'] as const;
export function hourLabel(h:number){return `${h<12?'오전':'오후'} ${h%12===0?12:h%12}시`;}
export function scheduleLabel(s:NewsletterSelection){return s.cadence==='daily'?`매일 ${hourLabel(s.sendHour)}`:`매주 ${weekdays[s.sendWeekday]}요일 ${hourLabel(s.sendHour)}`;}
export function industryFor(id:string){return industries.find(i=>i.id===id)||industries[0];}
export function industryLabel(s:NewsletterSelection){return s.industries.map(id=>industryFor(id).label).join(' · ');}
export function levelLabel(level:Level){return levels.find(l=>l[0]===level)?.[1]||'실무';}
export function selectedCountries(s:NewsletterSelection){return s.scope==='global'?[]:s.scope==='kr'?['KR']:s.countries;}
export function countryName(code:string){return code==='KR'?'대한민국':countries.find(c=>c[0]===code)?.[1]||code;}
export function regionLabel(s:NewsletterSelection){return s.scope==='global'?'전 세계':selectedCountries(s).map(countryName).join(' · ');}
export function topicLabels(s:NewsletterSelection){return s.subtopics.map(id=>allTopics.find(t=>t[0]===id)?.[1]||id);}
export function selectionQuery(s:NewsletterSelection){
  return new URLSearchParams({industries:s.industries.join(','),topics:s.subtopics.join(','),scope:s.scope,countries:s.countries.join(','),types:s.contentTypes.join(','),name:s.name,cadence:s.cadence,level:s.level,hour:String(s.sendHour),weekday:String(s.sendWeekday)}).toString();
}
export function selectionFromQuery(p:Record<string,string|string[]|undefined>):NewsletterSelection{
  const get=(key:string,fallback:string)=>typeof p[key]==='string'?p[key] as string:fallback;
  const list=(key:string,legacy:string,fallback:string)=>get(key,get(legacy,fallback)).split(',').filter(Boolean);
  const fresh=p.industries===undefined&&p.industry===undefined;
  const parsed=newsletterSelectionSchema.safeParse({industries:list('industries','industry','technology'),subtopics:get('topics',fresh?'ai':'').split(',').filter(Boolean),scope:get('scope','global'),countries:list('countries','country','US'),contentTypes:get('types','article,research,news').split(',').filter(Boolean),name:get('name','나의 데일리 브리프'),cadence:get('cadence','daily'),level:get('level','practitioner'),sendHour:get('hour','7'),sendWeekday:get('weekday','1')});
  return parsed.success?parsed.data:defaultSelection;
}

export type NewsletterStory = {
  id:string; title:string; description?:string; industry:IndustryId|'unknown'; topics:string[]; countries:string[];
  type:keyof typeof contentLabels; source:string; date:string; url?:string; eventId?:string; tenant?:string; evidence:{source:string;url:string;title:string}[];
  href?:string; sourceCount?:number; questions?:string[]; hot?:{rank:number;reason:string};
};
function matchesTerm(text:string,term:string){
  const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return /^[a-z0-9 ]+$/i.test(term)?new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`,'iu').test(text):text.toLocaleLowerCase().includes(term.toLocaleLowerCase());
}
export function matchesSelection(story:NewsletterStory,s:NewsletterSelection){
  if(!s.contentTypes.includes(story.type))return false;
  const wanted=selectedCountries(s);
  if(wanted.length&&!story.countries.some(c=>wanted.includes(c)))return false;
  if(story.industry!=='unknown'&&!(s.industries as string[]).includes(story.industry))return false;
  const chosen=industries.filter(i=>(s.industries as string[]).includes(i.id));
  const title=[story.title,...story.evidence.map(e=>e.title)].join(' ');
  if(s.subtopics.length){
    const topics=chosen.flatMap(i=>i.topics as readonly Topic[]);
    return s.subtopics.some(id=>story.topics.includes(id)||topics.find(t=>t[0]===id)?.[2].split(',').some(term=>matchesTerm(title,term)));
  }
  return chosen.some(i=>story.industry===i.id||i.terms.some(term=>matchesTerm(title,term)));
}
