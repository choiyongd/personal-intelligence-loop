// Paid plans for card billing. Prices are read from the environment so the final price can be set after the beta
// without a code change (PRICE_BASIC, PRICE_PRO, PRICE_YEARLY, in won, VAT included). A price change applies to new
// subscriptions and plan changes; readers already subscribed keep the amount they agreed to until they change plans.
export type PaidPlanId='basic'|'pro'|'yearly';
export type Tier='basic'|'pro';
export type PaidPlan={id:PaidPlanId;label:string;tier:Tier;months:1|12;price:number;stories:number;generations:number;blurb:string;features:string[]};

export const PAID_PLAN_IDS:PaidPlanId[]=['basic','pro','yearly'];
export const isPaidPlanId=(v:unknown):v is PaidPlanId=>typeof v==='string'&&(PAID_PLAN_IDS as string[]).includes(v);

// What each tier gets on top of the free trial. Basic matches the beta subscription; Pro adds more fresh editions a day
// and bigger issues, which cost nothing extra in AI because the stories are written once a day for everyone.
export const tierLimits:Record<Tier,{stories:number;generations:number}>={basic:{stories:15,generations:3},pro:{stories:20,generations:10}};

function price(name:string,fallback:number){
  const n=Number(process.env[name]);
  return Number.isInteger(n)&&n>=100&&n<=1_000_000?n:fallback;
}
export function paidPlans():Record<PaidPlanId,PaidPlan>{
  const common=['매일 또는 매주, 정한 시간에 정기 호를 메일과 메일함으로','지난 호를 날짜·월별로 다시 보기'];
  return {
    basic:{id:'basic',label:'기본',tier:'basic',months:1,price:price('PRICE_BASIC',4900),...tierLimits.basic,blurb:'매일 받아 보는 나만의 지면',
      features:[...common,`하루 최대 ${tierLimits.basic.generations}회 새로 만들기, 한 호에 최대 ${tierLimits.basic.stories}편`]},
    pro:{id:'pro',label:'프로',tier:'pro',months:1,price:price('PRICE_PRO',9900),...tierLimits.pro,blurb:'더 자주, 더 많이 읽는 분께',
      features:[...common,`하루 최대 ${tierLimits.pro.generations}회 새로 만들기, 한 호에 최대 ${tierLimits.pro.stories}편`]},
    yearly:{id:'yearly',label:'연간',tier:'basic',months:12,price:price('PRICE_YEARLY',49000),...tierLimits.basic,blurb:'기본 플랜을 1년 단위로, 더 저렴하게',
      features:[...common,`기본과 같은 혜택 (하루 ${tierLimits.basic.generations}회, 한 호 ${tierLimits.basic.stories}편)`]},
  };
}
export const paidPlan=(id:PaidPlanId)=>paidPlans()[id];
export const won=(n:number)=>`${n.toLocaleString('ko-KR')}원`;
export const periodWord=(p:Pick<PaidPlan,'months'>)=>p.months===12?'연':'월';
export const priceLabel=(p:Pick<PaidPlan,'months'|'price'>)=>`${periodWord(p)} ${won(p.price)}`;
// "2달 무료" style saving for the yearly plan against twelve months of Basic.
export function yearlySaving(){
  const p=paidPlans(),full=p.basic.price*12;
  return full>p.yearly.price?full-p.yearly.price:0;
}
