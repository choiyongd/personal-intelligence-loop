// Editorial "global hot" ranking for world editions. There is no live view-count feed in the beta, so the
// order is an editorial judgment of reach and consequence: how many countries, companies or people the story
// touches and how directly it changes laws, markets or daily life. Revisit whenever explainers are added.
export const HOT_BASIS='편집진 평가 기준: 영향을 받는 나라·기업·사람의 규모, 법·시장·일상에 미치는 파급력, 국제적 관심도. 실시간 조회수 데이터는 아직 연결되지 않았습니다.';
export const hotPicks:{id:string;reason:string}[]=[
  {id:'ai-explainer',reason:'EU 27개국과 한국의 AI 규제 일정이 동시에 바뀌어 세계 AI 기업 전체가 영향을 받습니다.'},
  {id:'medicine-explainer',reason:'WHO가 처음 지침을 낸 비만 치료제로, 세계 보건과 제약 시장의 최대 화제입니다.'},
  {id:'international-explainer',reason:'미국 관세와 대법원 판결이 세계 교역 질서와 수출 기업을 흔들고 있습니다.'},
  {id:'semiconductor-explainer',reason:'AI 수요가 세계 반도체 시장을 사상 최대로 끌어올리고 있습니다.'},
  {id:'economy-explainer',reason:'IMF 세계경제 전망은 각국 정부와 시장이 함께 보는 기준점입니다.'},
  {id:'creative-explainer',reason:'AI 생성물의 저작권은 창작 산업 전반의 규칙을 다시 쓰는 문제입니다.'},
];
export const HOT_PER_EDITION=2;
