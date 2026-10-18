import {industries,type NewsletterStory,type NewsletterSelection,matchesSelection} from './newsletter';

// Original, synthetic editorial examples. These are not reports of actual events.
const themes:Record<string,[string,string,string]>={
  ai:['AI의 다음 질문은 성능이 아니라 신뢰다','작은 모델은 어떻게 더 적은 자원으로 배우는가','기업의 AI 도입, 실험에서 일상의 도구로'],
  semiconductor:['반도체의 경쟁력, 공정 너머의 연결에서 찾다','차세대 칩 설계에 필요한 새로운 소재의 조건','컴퓨팅 인프라 투자가 바꾸는 공급망'],
  robotics:['로봇이 일하는 공간에는 새로운 기준이 필요하다','사람의 움직임에서 배우는 로봇 제어 실험','물류 현장으로 향하는 협동 로봇'],
  software:['소프트웨어 개발의 무게중심이 이동하고 있다','개발 생산성을 다시 측정하는 방법','작은 팀을 위한 소프트웨어 도구의 진화'],
};
// Distinct synthetic angles per country so a global edition never repeats one headline.
const countryTitles:Record<'US'|'JP',[(t:string)=>string,(t:string)=>string,(t:string)=>string]>={
  US:[t=>`미국 시장이 ${t} 앞에서 먼저 묻는 세 가지`,t=>`${t} 연구, 대학과 기업 연구소가 함께 푸는 다음 과제`,t=>`미국 기업들이 ${t} 현장에서 바꾸고 있는 것`],
  JP:[t=>`일본이 ${t}에서 택한 느리지만 단단한 전략`,t=>`${t} 분야 일본 연구진의 실용적 접근`,t=>`일본 제조 현장에서 시작된 ${t} 실험`],
};
const dates=['2026-10-17T08:00:00Z','2026-10-16T08:00:00Z','2026-10-15T08:00:00Z'];
export const demoStories:NewsletterStory[]=industries.flatMap(industry=>industry.topics.flatMap(topic=>{
  const titles=themes[topic[0]]||[`${topic[1]}, 지금 주목해야 할 변화의 방향`,`${topic[1]}의 다음 가능성을 탐색하는 연구`,`${topic[1]} 현장에서 시작된 새로운 시도`];
  return (['KR','US','JP'] as const).flatMap((country,countryIndex)=>(['article','research','news'] as const).map((type,index)=>({
    id:`sample-${topic[0]}-${country}-${type}`,industry:industry.id,topics:[topic[0]],countries:[country],type,
    title:country==='KR'?titles[index]:countryTitles[country][index](topic[1]),
    description: index===0?'변화의 배경을 읽고, 서로 다른 근거를 나란히 확인하는 편집 예시입니다.':index===1?'새로운 접근의 가능성과 한계를 원문에서 함께 검토하는 연구 읽기 예시입니다.':'현장의 소식이 나의 업무와 어떻게 연결되는지 살펴보는 예시입니다.',
    source:index===1?'RESEARCH NOTES':index===0?'LOOP EDITORIAL':'FIELD NOTES',date:dates[index],
    evidence:[],
  })));
}));
export function selectedDemoStories(selection:NewsletterSelection){return demoStories.filter(s=>matchesSelection(s,selection));}
