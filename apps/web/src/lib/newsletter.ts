import { z } from 'zod';
import type {Locale} from './i18n';

export const industries = [
  { id:'technology', label:'기술 · AI', description:'다음 변화를 만드는 기술', icon:'◈', terms:['AI','artificial intelligence','technology','model','software','인공지능','기술','모델'], topics:[['ai','인공지능','AI,artificial intelligence,model,인공지능,모델'],['semiconductor','반도체','semiconductor,chip,반도체'],['robotics','로보틱스','robot,robotics,로봇'],['software','소프트웨어','software,developer,소프트웨어,개발'],['cybersecurity','사이버 보안','security,cyber,해킹,보안'],['quantum','양자 기술','quantum,양자'],['cloud','클라우드 · 데이터센터','cloud,data center,클라우드,데이터센터']] },
  { id:'business', label:'비즈니스', description:'기업과 시장의 새로운 움직임', icon:'↗', terms:['business','startup','company','기업','스타트업'], topics:[['startup','스타트업','startup,스타트업'],['strategy','기업 전략','strategy,business,전략'],['commerce','커머스','commerce,retail,커머스,유통'],['supply-chain','공급망 · 무역','supply chain,trade,공급망,관세'],['labor','일자리 · 노동','labor,work,노동,일자리'],['esg','ESG · 지배구조','ESG,sustainability,disclosure,지속가능,공시']] },
  { id:'science', label:'과학 · 연구', description:'발견과 실험, 지식의 최전선', icon:'✳', terms:['research','science','study','연구','과학'], topics:[['space','우주','space,satellite,우주,위성'],['materials','신소재','material,신소재'],['biology','생명과학','biology,genome,생명,유전체'],['physics','기초과학 · 물리','physics,particle,물리,입자'],['earth','지구 · 환경과학','earth,forest,ecosystem,지구,생태'],['neuroscience','뇌과학','brain,neuro,뇌과학,뇌']] },
  { id:'energy', label:'에너지 · 기후', description:'지속 가능한 전환을 읽는 시선', icon:'☼', terms:['energy','climate','battery','에너지','기후','배터리'], topics:[['battery','배터리','battery,storage,배터리,저장'],['renewables','재생에너지','renewable,solar,재생에너지,태양광'],['climate','기후 정책','climate,carbon,기후,탄소'],['nuclear','원자력','nuclear,uranium,원전,원자력'],['critical-minerals','핵심 광물','lithium,mineral,리튬,광물'],['hydrogen','수소','hydrogen,수소']] },
  { id:'health', label:'헬스케어', description:'건강과 의료의 새로운 가능성', icon:'+', terms:['health','medical','clinical','의료','건강','헬스'], topics:[['digital-health','디지털 헬스','digital health,health data,디지털 헬스,의료 데이터'],['biotech','바이오','biotech,genome,바이오'],['medicine','임상 · 의약','clinical,medicine,임상,의약'],['public-health','공중보건','public health,epidemic,감염병,공중보건'],['aging','고령화 · 돌봄','aging,care,고령화,돌봄'],['mental-health','정신건강','mental health,depression,정신건강,우울']] },
  { id:'finance', label:'경제 · 금융', description:'돈의 흐름과 경제의 방향', icon:'◎', terms:['finance','economic','market','bank','금융','경제','금리'], topics:[['economy','거시경제','economy,economic,경제'],['fintech','핀테크','fintech,payment,핀테크,결제'],['investment','투자','investment,market,투자,증시'],['crypto','디지털 자산','crypto,stablecoin,가상자산,스테이블코인'],['realestate','부동산 · 주거','housing,real estate,부동산,주거'],['currency','환율 · 통화','currency,dollar,exchange rate,환율,달러']] },
  { id:'design', label:'디자인 · 문화', description:'사람과 경험을 바꾸는 생각', icon:'✦', terms:['design','culture','디자인','문화'], topics:[['product-design','제품 디자인','design,디자인'],['creative','크리에이티브','creative,creator,창작,크리에이터'],['culture','문화 트렌드','culture,trend,문화,트렌드'],['architecture','건축 · 도시','architecture,building,건축,도시'],['media','미디어 · 콘텐츠','media,streaming,미디어,스트리밍'],['ux','UX · 서비스 디자인','UX,dark pattern,사용자 경험,다크패턴']] },
  { id:'policy', label:'정책 · 사회', description:'제도와 사회 변화의 맥락', icon:'≡', terms:['policy','regulation','rule','government','정책','규제','사회'], topics:[['regulation','규제 · 법제','regulation,rule,규제,법제'],['society','사회 변화','society,사회'],['international','국제 관계','international,trade,국제,무역'],['security','안보 · 국방','defence,security,안보,국방'],['migration','이주 · 인구','migration,population,이주,인구'],['democracy','선거 · 민주주의','election,democracy,선거,민주주의']] },
  { id:'mobility', label:'모빌리티', description:'이동 방식이 바뀌는 현장', icon:'➶', terms:['mobility','vehicle','EV','aviation','모빌리티','전기차','항공'], topics:[['ev','전기차','EV,electric vehicle,전기차'],['aviation','항공 · 우주항공','aviation,airline,항공'],['autonomous','자율주행','autonomous,robotaxi,자율주행'],['shipping','해운 · 물류','shipping,port,logistics,해운,물류']] },
  { id:'food', label:'식품 · 농업', description:'먹거리와 식량의 지도', icon:'❦', terms:['food','agriculture','grain','식품','농업','식량'], topics:[['agriculture','농업 · 식량','agriculture,grain,crop,농업,식량,곡물'],['foodtech','푸드테크','foodtech,cultivated meat,대체육,푸드테크'],['food-prices','식량 가격 · 물가','food price,inflation,식량 가격,물가']] },
  { id:'education', label:'교육', description:'배우는 방식과 길의 변화', icon:'✎', terms:['education','school','university','교육','학교','대학'], topics:[['edtech','에듀테크 · AI 교육','edtech,AI education,에듀테크,교육'],['higher-ed','대학 · 유학','university,student,대학,유학'],['k12','초중등 교육 · 입시','school,PISA,학교,입시']] },
  { id:'entertainment', label:'엔터테인먼트 · 게임', description:'즐거움을 만드는 산업의 흐름', icon:'♫', terms:['game','music','film','게임','음악','영화','드라마'], topics:[['games','게임','game,gaming,게임'],['music','음악 · 공연','music,K-pop,음악,공연'],['film','영화 · 드라마','film,drama,box office,영화,드라마']] },
  { id:'sports', label:'스포츠', description:'경기장 안팎의 경제와 이야기', icon:'◐', terms:['sport','football','olympic','스포츠','축구','올림픽'], topics:[['sports-business','스포츠 비즈니스','sports business,media rights,스포츠 산업'],['mega-events','월드컵 · 올림픽','World Cup,Olympics,월드컵,올림픽']] },
  { id:'lifestyle', label:'여행 · 라이프', description:'일상과 취향이 바뀌는 방식', icon:'☾', terms:['travel','wellness','fashion','여행','웰니스','패션'], topics:[['travel','여행 · 관광','travel,tourism,여행,관광'],['wellness','웰니스 · 수면','wellness,sleep,웰니스,수면'],['fashion','패션','fashion,textile,패션,의류']] },
  { id:'environment', label:'환경 · 생태', description:'지구의 상태를 읽는 숫자들', icon:'❀', terms:['environment','biodiversity','ocean','plastic','환경','생태','해양'], topics:[['biodiversity','생물다양성','biodiversity,species,생물다양성'],['ocean','해양','ocean,sea,해양,바다'],['pollution','플라스틱 · 오염','plastic,pollution,플라스틱,오염']] },
  { id:'career', label:'일 · 커리어', description:'일하는 방식과 필요한 역량', icon:'⌘', terms:['career','skills','job','커리어','역량','일자리'], topics:[['skills','직무 역량 · 재교육','skills,reskilling,역량,재교육'],['remote-work','일하는 방식','remote work,hybrid,재택,하이브리드 근무']] },
] as const;

// Selectable regions: whole continents first, then countries grouped by the continent they belong to.
export const continents = [
  ['EUROPE','유럽'],['N_AMERICA','북미'],['S_AMERICA','남미'],['EURASIA','유라시아'],['ASIA_PACIFIC','아시아 · 태평양'],['MIDEAST_AFRICA','중동 · 아프리카'],
] as const;
export const countries = [
  ['GB','영국','EUROPE'],['DE','독일','EUROPE'],['FR','프랑스','EUROPE'],['IT','이탈리아','EUROPE'],['ES','스페인','EUROPE'],['NL','네덜란드','EUROPE'],['SE','스웨덴','EUROPE'],['PL','폴란드','EUROPE'],['NO','노르웨이','EUROPE'],['CH','스위스','EUROPE'],['EE','에스토니아','EUROPE'],['BE','벨기에','EUROPE'],['IE','아일랜드','EUROPE'],['PT','포르투갈','EUROPE'],['AT','오스트리아','EUROPE'],['FI','핀란드','EUROPE'],['DK','덴마크','EUROPE'],
  ['US','미국','N_AMERICA'],['CA','캐나다','N_AMERICA'],['MX','멕시코','N_AMERICA'],
  ['BR','브라질','S_AMERICA'],['AR','아르헨티나','S_AMERICA'],['CL','칠레','S_AMERICA'],['CO','콜롬비아','S_AMERICA'],['PE','페루','S_AMERICA'],['BO','볼리비아','S_AMERICA'],
  ['RU','러시아','EURASIA'],['KZ','카자흐스탄','EURASIA'],['TR','튀르키예','EURASIA'],['UA','우크라이나','EURASIA'],['UZ','우즈베키스탄','EURASIA'],['AZ','아제르바이잔','EURASIA'],['GE','조지아','EURASIA'],
  ['JP','일본','ASIA_PACIFIC'],['CN','중국','ASIA_PACIFIC'],['TW','대만','ASIA_PACIFIC'],['IN','인도','ASIA_PACIFIC'],['SG','싱가포르','ASIA_PACIFIC'],['VN','베트남','ASIA_PACIFIC'],['ID','인도네시아','ASIA_PACIFIC'],['PH','필리핀','ASIA_PACIFIC'],['TH','태국','ASIA_PACIFIC'],['MY','말레이시아','ASIA_PACIFIC'],['AU','호주','ASIA_PACIFIC'],
  ['AE','아랍에미리트','MIDEAST_AFRICA'],['SA','사우디아라비아','MIDEAST_AFRICA'],['IL','이스라엘','MIDEAST_AFRICA'],['ZA','남아프리카공화국','MIDEAST_AFRICA'],['NG','나이지리아','MIDEAST_AFRICA'],['EG','이집트','MIDEAST_AFRICA'],['KE','케냐','MIDEAST_AFRICA'],
] as const;
type Topic=readonly [string,string,string];
export const allTopics:readonly Topic[]=industries.flatMap(i=>i.topics as readonly Topic[]);
export const contentLabels = { article:'기사', research:'연구', news:'소식' } as const;
export const industryIds = industries.map(i=>i.id);
export type IndustryId = typeof industries[number]['id'];

const industryEnum=z.enum(industries.map(i=>i.id) as [IndustryId,...IndustryId[]]);
export type RegionCode=typeof continents[number][0]|typeof countries[number][0];
const countryEnum=z.enum([...continents.map(c=>c[0]),...countries.map(c=>c[0])] as [RegionCode,...RegionCode[]],{message:'국가를 선택하세요.'});
// Time zones a reader can receive editions in: Korea plus the US zones.
export const timeZones=[
  ['Asia/Seoul','한국 시간','Korea'],['America/New_York','미국 동부','Eastern'],['America/Chicago','미국 중부','Central'],['America/Denver','미국 산악','Mountain'],
  ['America/Phoenix','애리조나','Arizona'],['America/Los_Angeles','미국 서부','Pacific'],['America/Anchorage','알래스카','Alaska'],['Pacific/Honolulu','하와이','Hawaii'],
] as const;
const timeZoneIds=timeZones.map(t=>t[0]) as [typeof timeZones[number][0],...typeof timeZones[number][0][]];
export type TimeZone=typeof timeZones[number][0];
export function timeZoneLabel(tz:string,loc:Locale='ko'){const t=timeZones.find(x=>x[0]===tz);return t?(loc==='en'?`${t[2]} time`:t[1]):tz;}
export const levels=[
  ['intro','입문','배경지식이 없어도 괜찮아요. 쉬운 요약과 용어 풀이를 먼저, 낱말을 가장 많이 짚어 드려요.'],
  ['practitioner','실무','기본 개념은 아는 분께. 사실과 숫자 중심으로, 꼭 필요한 용어만 풀어 드려요.'],
  ['expert','심화','전문가 수준으로. 방법론과 쟁점, 한계까지 다루는 심화 장이 붙어요.'],
] as const;
export type Level=typeof levels[number][0];
// How many words each level points out in a newsletter's word list.
export const wordsPerLevel:Record<Level,number>={intro:10,practitioner:6,expert:4};

export const newsletterSelectionSchema = z.object({
  industries: z.array(industryEnum).min(1,'관심 분야를 하나 이상 선택하세요.').max(16).default(['technology']),
  subtopics: z.array(z.string()).max(16,'세부 주제는 16개까지 고를 수 있어요.').default([]),
  scope: z.enum(['global','kr','country']).default('global'),
  countries: z.array(countryEnum).max(8,'대륙과 국가는 합쳐서 8개까지 고를 수 있어요.').default(['US']),
  contentTypes: z.array(z.enum(['article','research','news'])).min(1,'읽을거리 유형을 하나 이상 선택하세요.').max(3).default(['article','research','news']),
  name: z.string().trim().min(1,'뉴스레터 이름을 입력하세요.').max(60,'이름은 60자 이내로 입력하세요.').default('나의 데일리 브리프'),
  cadence: z.enum(['daily','weekly']).default('daily'),
  level: z.enum(['intro','practitioner','expert']).default('practitioner'),
  // Delivery time in Korea time; weekday 0=일요일 is used only for weekly editions.
  sendHour: z.coerce.number().int().min(0).max(23).default(7),
  sendWeekday: z.coerce.number().int().min(0).max(6).default(1),
  theme: z.enum(['magazine','minimal','bento','night']).default('magazine'),
  accent: z.enum(['auto','violet','coral','emerald','rose','amber','graphite']).default('auto'),
  articleStyle: z.enum(['studio','paper','night']).default('studio'),
  articleAccent: z.enum(['auto','violet','coral','emerald','rose','amber','graphite']).default('auto'),
  // Hover or tap a hard term to see its meaning, in articles and newsletters.
  terms: z.enum(['on','off']).default('on'),
  // Language of the edition and its mail, and the time zone sendHour is read in.
  lang: z.enum(['ko','en']).default('ko'),
  tz: z.enum(timeZoneIds).default('Asia/Seoul'),
}).superRefine((value,ctx)=>{
  const validTopics = industries.filter(i=>(value.industries as string[]).includes(i.id)).flatMap(i=>i.topics.map(t=>t[0] as string));
  if(value.subtopics.some(t=>!validTopics.includes(t))) ctx.addIssue({code:'custom',message:'선택한 분야에 맞는 세부 주제를 고르세요.',path:['subtopics']});
  if(value.scope==='country'&&value.countries.length===0) ctx.addIssue({code:'custom',message:'국가를 하나 이상 선택하세요.',path:['countries']});
  if(new Set(value.industries).size!==value.industries.length||new Set(value.countries).size!==value.countries.length) ctx.addIssue({code:'custom',message:'같은 항목이 두 번 선택되었습니다.',path:['industries']});
});
export type NewsletterSelection = z.infer<typeof newsletterSelectionSchema>;
export const defaultSelection:NewsletterSelection = {industries:['technology'],subtopics:['ai'],scope:'global',countries:['US'],contentTypes:['article','research','news'],name:'나의 데일리 브리프',cadence:'daily',level:'practitioner',sendHour:7,sendWeekday:1,theme:'magazine',accent:'auto',articleStyle:'studio',articleAccent:'auto',terms:'on',lang:'ko',tz:'Asia/Seoul'};
export const defaultNames={ko:'나의 데일리 브리프',en:'My Daily Brief'} as const;
// Defaults for a visitor's language: an English visitor starts with an English name and US Eastern time.
export function defaultsFor(loc:Locale):NewsletterSelection{return loc==='en'?{...defaultSelection,name:defaultNames.en,lang:'en',tz:'America/New_York'}:defaultSelection;}
// Bring a saved selection into the language being used, keeping every choice the reader made on purpose.
export function inLocale(s:NewsletterSelection,loc:Locale):NewsletterSelection{
  if(s.lang===loc)return s;
  const d=defaultsFor(loc);
  return {...s,lang:loc,name:s.name===defaultNames[s.lang]?d.name:s.name,tz:s.tz===defaultsFor(s.lang).tz?d.tz:s.tz};
}
// Newsletter looks a reader can pick; the markup is shared and each theme is a stylesheet layer.
export const themes=[
  ['magazine','매거진','종이 질감과 큰 제호, 주황 포인트'],
  ['minimal','미니멀','흰 바탕과 가는 선, 글에만 집중'],
  ['bento','벤토','둥근 카드 격자와 부드러운 색면'],
  ['night','나이트','어두운 바탕과 선명한 강조색'],
] as const;
export type Theme=typeof themes[number][0];
// Point colours a reader can lay over any newsletter look or article style; "auto" keeps the look's own colour.
export const accents=[
  ['auto','기본','디자인 고유의 색'],['violet','바이올렛','#6b5cf0'],['coral','코랄','#e0612f'],['emerald','에메랄드','#12936b'],
  ['rose','로즈','#d6456f'],['amber','앰버','#c98a12'],['graphite','그래파이트','#2b2b31'],
] as const;
export type Accent=typeof accents[number][0];
// Looks for the article (explainer) pages.
export const articleStyles=[
  ['studio','스튜디오','사이트와 같은 먹색 머리, 흰 지면'],
  ['paper','페이퍼','따뜻한 종이색, 잉크 같은 검정 글자'],
  ['night','나이트','눈이 편한 어두운 지면'],
] as const;
export type ArticleStyle=typeof articleStyles[number][0];
// Plans: a free reader gets one trial edition of up to 10 stories; a subscriber gets three fresh editions a day of up to 15.
export const plans={free:{label:'무료',stories:10,generations:1,per:'total'},subscriber:{label:'구독',stories:15,generations:3,per:'day',price:4900}} as const;
export type Plan=keyof typeof plans;
export const weekdays=['일','월','화','수','목','금','토'] as const;
export const weekdaysEn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] as const;
const weekdayNamesEn=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as const;

// English labels for the edition's vocabulary, keyed by the same ids as the Korean lists above.
export const industryEn:Record<IndustryId,[string,string]>={
  technology:['Tech · AI','The technology shaping what comes next'],business:['Business','New moves by companies and markets'],science:['Science · Research','Discoveries, experiments and the frontier of knowledge'],
  energy:['Energy · Climate','A clear view of the sustainable transition'],health:['Healthcare','New possibilities in health and medicine'],finance:['Economy · Finance','Where money flows and the economy is heading'],
  design:['Design · Culture','Ideas that change people and experiences'],policy:['Policy · Society','The context behind rules and social change'],mobility:['Mobility','Where the way we move is changing'],
  food:['Food · Agriculture','A map of what we eat and grow'],education:['Education','How we learn, and where it leads'],entertainment:['Entertainment · Games','The business of having fun'],
  sports:['Sports','The money and stories in and around the game'],lifestyle:['Travel · Lifestyle','How everyday life and taste are shifting'],environment:['Environment · Ecology','The numbers that read the planet'],career:['Work · Career','How we work and the skills it takes'],
};
export const topicEn:Record<string,string>={
  ai:'Artificial intelligence',semiconductor:'Semiconductors',robotics:'Robotics',software:'Software',cybersecurity:'Cybersecurity',quantum:'Quantum tech',cloud:'Cloud · Data centers',
  startup:'Startups',strategy:'Corporate strategy',commerce:'Commerce',['supply-chain']:'Supply chains · Trade',labor:'Jobs · Labor',esg:'ESG · Governance',
  space:'Space',materials:'Advanced materials',biology:'Life sciences',physics:'Physics',earth:'Earth science',neuroscience:'Neuroscience',
  battery:'Batteries',renewables:'Renewables',climate:'Climate policy',nuclear:'Nuclear power',['critical-minerals']:'Critical minerals',hydrogen:'Hydrogen',
  ['digital-health']:'Digital health',biotech:'Biotech',medicine:'Clinical · Drugs',['public-health']:'Public health',aging:'Aging · Care',['mental-health']:'Mental health',
  economy:'Macroeconomy',fintech:'Fintech',investment:'Investing',crypto:'Digital assets',realestate:'Real estate · Housing',currency:'Currencies',
  ['product-design']:'Product design',creative:'Creative work',culture:'Culture trends',architecture:'Architecture · Cities',media:'Media · Content',ux:'UX · Service design',
  regulation:'Regulation · Law',society:'Social change',international:'International relations',security:'Security · Defense',migration:'Migration · Population',democracy:'Elections · Democracy',
  ev:'Electric vehicles',aviation:'Aviation · Aerospace',autonomous:'Autonomous driving',shipping:'Shipping · Logistics',
  agriculture:'Agriculture · Food security',foodtech:'Food tech',['food-prices']:'Food prices',
  edtech:'Edtech · AI in education',['higher-ed']:'Higher ed · Study abroad',k12:'K-12 · Admissions',
  games:'Games',music:'Music · Live',film:'Film · TV',['sports-business']:'Sports business',['mega-events']:'World Cup · Olympics',
  travel:'Travel · Tourism',wellness:'Wellness · Sleep',fashion:'Fashion',biodiversity:'Biodiversity',ocean:'Oceans',pollution:'Plastics · Pollution',
  skills:'Skills · Reskilling',['remote-work']:'Ways of working',
};
const continentEn:Record<string,string>={EUROPE:'Europe',N_AMERICA:'North America',S_AMERICA:'South America',EURASIA:'Eurasia',ASIA_PACIFIC:'Asia · Pacific',MIDEAST_AFRICA:'Middle East · Africa'};
export const levelsEn:Record<Level,[string,string]>={
  intro:['Beginner','No background needed. A plain summary and word help come first, with the most terms explained.'],
  practitioner:['Working','For readers who know the basics. Facts and numbers first, with only the key terms explained.'],
  expert:['Expert','At a specialist level. A deep-dive chapter adds methods, debates and limits.'],
};
export const contentLabelsEn={article:'Article',research:'Research',news:'News'} as const;
export const themesEn:Record<Theme,[string,string]>={magazine:['Magazine','Paper texture, a big nameplate, orange accents'],minimal:['Minimal','White page and fine rules, nothing but the words'],bento:['Bento','Rounded card grid with soft color fields'],night:['Night','Dark page with vivid highlights']};
export const accentsEn:Record<Accent,string>={auto:'Default',violet:'Violet',coral:'Coral',emerald:'Emerald',rose:'Rose',amber:'Amber',graphite:'Graphite'};
export const articleStylesEn:Record<ArticleStyle,[string,string]>={studio:['Studio','Ink-dark header like the site, white page'],paper:['Paper','Warm paper tone with ink-black type'],night:['Night','A dark page that is easy on the eyes']};
export const planLabel=(p:Plan,loc:Locale='ko')=>loc==='en'?(p==='free'?'Free':'Subscriber'):plans[p].label;

export function industryName(id:string,loc:Locale='ko'){return loc==='en'?(industryEn[id as IndustryId]||industryEn.business)[0]:industryFor(id).label;}
export function industryDescription(id:string,loc:Locale='ko'){return loc==='en'?(industryEn[id as IndustryId]||industryEn.business)[1]:industryFor(id).description;}
export function topicName(id:string,loc:Locale='ko'){return loc==='en'?topicEn[id]||id:allTopics.find(t=>t[0]===id)?.[1]||id;}
export function contentLabel(type:keyof typeof contentLabels,loc:Locale='ko'){return loc==='en'?contentLabelsEn[type]:contentLabels[type];}
export function hourLabel(h:number,loc:Locale='ko'){return loc==='en'?`${h%12===0?12:h%12} ${h<12?'AM':'PM'}`:`${h<12?'오전':'오후'} ${h%12===0?12:h%12}시`;}
export function scheduleLabel(s:NewsletterSelection,loc:Locale=s.lang){
  if(loc==='en'){const zone=s.tz==='Asia/Seoul'?' Korea time':` ${timeZoneLabel(s.tz,'en').replace(' time','')}`;return s.cadence==='daily'?`Daily at ${hourLabel(s.sendHour,'en')}${zone}`:`${weekdayNamesEn[s.sendWeekday]}s at ${hourLabel(s.sendHour,'en')}${zone}`;}
  const zone=s.tz==='Asia/Seoul'?'':` (${timeZoneLabel(s.tz)})`;
  return s.cadence==='daily'?`매일 ${hourLabel(s.sendHour)}${zone}`:`매주 ${weekdays[s.sendWeekday]}요일 ${hourLabel(s.sendHour)}${zone}`;
}
export function industryFor(id:string){return industries.find(i=>i.id===id)||industries[0];}
export function industryLabel(s:NewsletterSelection,loc:Locale='ko'){return s.industries.map(id=>industryName(id,loc)).join(' · ');}
export function levelLabel(level:Level,loc:Locale='ko'){return loc==='en'?levelsEn[level]?.[0]||'Working':levels.find(l=>l[0]===level)?.[1]||'실무';}
// A picked continent stands for its own code plus every listed country on it, so continent-wide and national stories both match.
export function selectedCountries(s:NewsletterSelection):string[]{
  if(s.scope==='global')return [];
  if(s.scope==='kr')return ['KR'];
  return [...new Set(s.countries.flatMap(c=>continents.some(k=>k[0]===c)?[c,...countries.filter(x=>x[2]===c).map(x=>x[0])]:[c]))];
}
export function continentOf(code:string){return countries.find(c=>c[0]===code)?.[2]||(code==='KR'?'ASIA_PACIFIC':continents.some(k=>k[0]===code)?code:undefined);}
let regionNamesEn:Intl.DisplayNames|undefined;
export function countryName(code:string,loc:Locale='ko'){
  if(loc==='en'){
    if(continentEn[code])return continentEn[code];
    if(code==='KR')return 'South Korea';
    try{regionNamesEn??=new Intl.DisplayNames(['en'],{type:'region'});return regionNamesEn.of(code)||code;}catch{return code;}
  }
  return code==='KR'?'대한민국':countries.find(c=>c[0]===code)?.[1]||continents.find(c=>c[0]===code)?.[1]||code;
}
export function regionLabel(s:NewsletterSelection,loc:Locale='ko'){return s.scope==='global'?(loc==='en'?'Worldwide':'전 세계'):s.scope==='kr'?countryName('KR',loc):s.countries.map(c=>countryName(c,loc)).join(' · ');}
export function topicLabels(s:NewsletterSelection,loc:Locale='ko'){return s.subtopics.map(id=>topicName(id,loc));}
// Validation messages are written in Korean in the schema; English readers see these instead.
const errorsEn:Record<string,string>={
  '국가를 선택하세요.':'Choose a country.','관심 분야를 하나 이상 선택하세요.':'Choose at least one field.','세부 주제는 16개까지 고를 수 있어요.':'You can pick up to 16 topics.',
  '대륙과 국가는 합쳐서 8개까지 고를 수 있어요.':'You can pick up to 8 continents and countries in total.','읽을거리 유형을 하나 이상 선택하세요.':'Choose at least one kind of reading.',
  '뉴스레터 이름을 입력하세요.':'Give your newsletter a name.','이름은 60자 이내로 입력하세요.':'Keep the name under 60 characters.','선택한 분야에 맞는 세부 주제를 고르세요.':'Pick topics that belong to the fields you chose.',
  '국가를 하나 이상 선택하세요.':'Choose at least one country.','같은 항목이 두 번 선택되었습니다.':'The same item was picked twice.',
};
export function localizeError(message:string,loc:Locale){return loc==='en'?errorsEn[message]||'Please check your choices.':message;}
export function selectionQuery(s:NewsletterSelection){
  return new URLSearchParams({industries:s.industries.join(','),topics:s.subtopics.join(','),scope:s.scope,countries:s.countries.join(','),types:s.contentTypes.join(','),name:s.name,cadence:s.cadence,level:s.level,hour:String(s.sendHour),weekday:String(s.sendWeekday),theme:s.theme,accent:s.accent,art:s.articleStyle,artaccent:s.articleAccent,terms:s.terms,lang:s.lang,tz:s.tz}).toString();
}
export function selectionFromQuery(p:Record<string,string|string[]|undefined>,loc?:Locale):NewsletterSelection{
  const base=defaultsFor(loc||(p.lang==='en'?'en':'ko'));
  const get=(key:string,fallback:string)=>typeof p[key]==='string'?p[key] as string:fallback;
  const list=(key:string,legacy:string,fallback:string)=>get(key,get(legacy,fallback)).split(',').filter(Boolean);
  const fresh=p.industries===undefined&&p.industry===undefined;
  const parsed=newsletterSelectionSchema.safeParse({industries:list('industries','industry','technology'),subtopics:get('topics',fresh?'ai':'').split(',').filter(Boolean),scope:get('scope','global'),countries:list('countries','country','US'),contentTypes:get('types','article,research,news').split(',').filter(Boolean),name:get('name',base.name),cadence:get('cadence','daily'),level:get('level','practitioner'),sendHour:get('hour','7'),sendWeekday:get('weekday','1'),theme:get('theme','magazine'),accent:get('accent','auto'),articleStyle:get('art','studio'),articleAccent:get('artaccent','auto'),terms:get('terms','on'),lang:get('lang',base.lang),tz:get('tz',base.tz)});
  return parsed.success?parsed.data:base;
}

export type NewsletterStory = {
  id:string; title:string; description?:string; industry:IndustryId|'unknown'; topics:string[]; countries:string[];
  type:keyof typeof contentLabels; source:string; date:string; url?:string; eventId?:string; tenant?:string; evidence:{source:string;url:string;title:string}[];
  href?:string; sourceCount?:number; questions?:string[]; thoughts?:string[]; hot?:{rank:number;reason:string};
  easy?:string; deep?:string; glossary?:{term:string;meaning:string}[];
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
