// Prompts that widen a reader's view after an edition: per field, a global lens, a personal lens and
// debate motions people can argue from two sides. {t} is replaced with the story's short title.
type Lens={world:string;personal:string;motions:[string,string,string][]};
export const lenses:Record<string,Lens>={
  technology:{world:'‘{t}’ 같은 기술 변화를 미국·중국·유럽은 각각 다른 규칙으로 다룹니다. 어느 쪽 방식이 10년 뒤 세계 표준이 될 가능성이 높다고 보나요? 그 이유는?',
    personal:'이 기술이 내 일에서 가장 먼저 대신할 일과, 오히려 더 중요해질 일은 각각 무엇일까요?',
    motions:[['AI가 만든 결과물에는 반드시 표시를 해야 한다','표시는 신뢰를 지키는 최소한의 장치다','표시 의무가 혁신과 활용을 늦춘다'],['핵심 기술은 자국에서 만들어야 한다','공급이 끊기면 경제와 안보가 함께 흔들린다','분업이 더 싸고 빠르며 기술도 더 빨리 발전한다']]},
  business:{world:'‘{t}’의 흐름이 신흥국 기업과 선진국 기업에 똑같이 기회일까요? 누가 더 빨리 움직일 수 있는 조건을 갖고 있나요?',
    personal:'내가 자주 쓰는 제품이나 서비스 가운데 이 변화로 값이나 모습이 바뀔 만한 것은 무엇인가요?',
    motions:[['기업의 첫 번째 책임은 주주 이익이다','이익을 내야 고용과 투자가 지속된다','직원·고객·지역사회를 함께 챙겨야 오래간다'],['플랫폼 대기업은 더 강하게 규제해야 한다','시장 지배력이 경쟁과 혁신을 막는다','규모가 있어야 낮은 가격과 좋은 서비스가 가능하다']]},
  science:{world:'‘{t}’ 같은 연구는 어느 나라가 비용을 대고, 그 성과는 누가 누려야 할까요? 국제 협력이 꼭 필요한 이유는 무엇일까요?',
    personal:'이 발견이 사실이라면 내가 당연하게 여기던 생각 가운데 무엇을 다시 볼 필요가 있을까요?',
    motions:[['당장 쓸모가 불분명한 기초연구에도 세금을 더 써야 한다','큰 혁신은 대부분 기초연구에서 시작됐다','성과가 보이는 응용연구에 집중하는 편이 낫다'],['우주 개발은 민간에 맡겨야 한다','경쟁이 비용을 낮추고 속도를 높인다','공공의 이익과 안전은 국가가 지켜야 한다']]},
  energy:{world:'‘{t}’의 영향은 석유를 수출하는 나라, 수입하는 나라, 광물을 가진 나라에서 어떻게 다르게 나타날까요?',
    personal:'전기요금·기름값·교통비 가운데 이 변화가 내 지출에 가장 먼저 닿을 곳은 어디일까요?',
    motions:[['원자력은 기후 대응의 핵심이 되어야 한다','안정적으로 탄소 없는 전기를 만든다','폐기물과 사고 위험, 비용 문제가 크다'],['탄소 배출에는 더 높은 가격을 매겨야 한다','가격이 바뀌어야 행동과 투자가 바뀐다','물가와 서민 부담, 산업 경쟁력이 걱정된다']]},
  health:{world:'‘{t}’ 같은 의료 변화가 부유한 나라와 가난한 나라 사이의 건강 격차를 줄일까요, 넓힐까요?',
    personal:'이 소식을 듣고 내 생활 습관이나 가족의 건강 관리에서 바꿔 볼 만한 작은 것 하나는 무엇인가요?',
    motions:[['내 의료 데이터는 연구에 기본적으로 쓰여도 된다','더 나은 치료법을 빨리 찾을 수 있다','민감한 정보이므로 명확한 동의가 먼저다'],['비싼 신약도 건강보험이 부담해야 한다','치료 기회는 소득과 상관없어야 한다','한정된 재원은 더 많은 사람에게 써야 한다']]},
  finance:{world:'‘{t}’ 같은 돈의 흐름은 국경을 넘어 다른 나라의 금리·환율·일자리에 어떻게 옮겨 갈까요? 한 가지 경로를 그려 보세요.',
    personal:'이 변화가 내 저축·대출·투자 계획에 주는 신호는 무엇일까요? 지금 당장 할 일과 지켜볼 일을 나눠 보세요.',
    motions:[['중앙은행은 물가보다 일자리를 먼저 챙겨야 한다','고용이 무너지면 회복에 오래 걸린다','물가가 흔들리면 모두의 실질 소득이 줄어든다'],['디지털 자산은 기존 금융처럼 규제해야 한다','투자자 보호와 금융 안정이 먼저다','새로운 금융 실험의 여지를 남겨야 한다']]},
  design:{world:'‘{t}’ 같은 문화 흐름은 한 나라에서 시작해 세계로 퍼질 때 무엇이 남고 무엇이 바뀔까요?',
    personal:'최근 내가 돈이나 시간을 쓴 경험 가운데 이 흐름과 닮은 것은 무엇이었나요? 왜 끌렸나요?',
    motions:[['알고리즘 추천은 문화를 획일화한다','모두가 비슷한 것을 보게 된다','오히려 작은 창작자도 발견될 기회가 생긴다'],['AI로 만든 작품도 예술로 인정해야 한다','도구가 바뀌었을 뿐 표현은 사람의 몫이다','창작의 노력과 고유성이 흐려진다']]},
  policy:{world:'‘{t}’ 같은 제도 변화를 다른 대륙의 나라가 그대로 들여온다면 잘 작동할까요? 무엇을 바꿔야 할까요?',
    personal:'이 정책이 시행되면 내 일상에서 달라지는 절차나 비용은 무엇일까요? 나는 찬성하나요, 반대하나요?',
    motions:[['국가는 이민자를 더 적극적으로 받아들여야 한다','인구 감소와 인력 부족을 메울 수 있다','사회 통합과 일자리 경쟁이 먼저 준비돼야 한다'],['선거 연령을 16세로 낮춰야 한다','미래에 영향받는 세대가 목소리를 내야 한다','판단을 위한 경험과 준비가 더 필요하다']]},
  mobility:{world:'‘{t}’의 변화는 땅이 넓은 나라와 도시가 빽빽한 나라에서 어떻게 다른 모습으로 나타날까요?',
    personal:'5년 뒤 나의 출퇴근이나 여행 방식은 지금과 무엇이 달라져 있을까요?',
    motions:[['도심에서는 자동차 이용을 강하게 제한해야 한다','공기와 안전, 공간을 사람에게 돌려준다','생계와 이동의 자유가 위축된다'],['자율주행 사고의 책임은 제조사가 져야 한다','운전을 맡긴 것은 시스템이다','이용자도 감독과 관리 책임이 있다']]},
  food:{world:'‘{t}’ 같은 식량 변화가 곡물을 수입하는 나라와 수출하는 나라의 식탁에 각각 어떤 차이를 만들까요?',
    personal:'이번 주 장바구니에서 이 변화의 영향을 받을 만한 품목은 무엇일까요?',
    motions:[['식량 자급률을 높이기 위해 농업 보조를 늘려야 한다','위기 때 먹거리를 지킬 수 있다','수입이 더 싸고 효율적이다'],['대체육과 배양육을 적극 지원해야 한다','기후와 동물 복지에 도움이 된다','안전성 검증과 농가 보호가 먼저다']]},
  education:{world:'‘{t}’ 같은 교육 변화를 다른 나라 학교와 비교하면, 우리가 배울 점과 피해야 할 점은 무엇일까요?',
    personal:'지금 내가 새로 배우고 싶은 것 하나를 고른다면 무엇이고, 이 변화는 그 배움을 쉽게 할까요 어렵게 할까요?',
    motions:[['수업에서 AI 사용을 적극 허용해야 한다','앞으로 일할 환경에 맞는 능력을 기른다','스스로 생각하는 힘이 약해진다'],['대학 입시는 시험 점수 중심이어야 한다','가장 공정하고 투명한 기준이다','다양한 재능과 성장 과정을 놓친다']]},
  entertainment:{world:'‘{t}’ 같은 콘텐츠 산업의 변화에서 한국은 세계 시장에서 어떤 자리를 차지하고 있고, 앞으로 경쟁자는 누구일까요?',
    personal:'내가 즐기는 게임·음악·영상에 쓰는 시간과 돈은 이 변화로 어떻게 달라질까요?',
    motions:[['게임 속 확률형 아이템은 금지해야 한다','도박과 비슷한 구조로 이용자를 해친다','투명하게 공개하면 선택은 이용자 몫이다'],['스트리밍 수익은 창작자에게 더 많이 돌아가야 한다','창작이 지속되려면 보상이 공정해야 한다','플랫폼 투자가 있어야 시장이 커진다']]},
  sports:{world:'‘{t}’ 같은 스포츠 이야기 뒤에는 어떤 나라와 기업의 돈과 이해관계가 움직이고 있을까요?',
    personal:'내가 응원하거나 즐기는 스포츠는 이 변화로 보는 방식이나 비용이 어떻게 바뀔까요?',
    motions:[['메가 이벤트 유치는 도시에 이익보다 손해가 크다','시설 부채와 주민 부담이 오래 남는다','관광과 기반 시설, 도시 이미지가 좋아진다'],['스포츠 중계권은 모두가 무료로 볼 수 있어야 한다','큰 경기는 공공의 문화다','중계료가 리그와 선수를 키운다']]},
  lifestyle:{world:'‘{t}’ 같은 생활 방식 변화는 관광객을 맞는 지역 주민에게 어떤 기회와 부담을 줄까요?',
    personal:'이 흐름 가운데 내 일상에 들이고 싶은 것과 거리를 두고 싶은 것은 각각 무엇인가요?',
    motions:[['인기 관광지는 방문객 수를 제한해야 한다','주민의 삶과 환경을 지킬 수 있다','지역 경제와 이동의 자유가 줄어든다'],['패스트패션에 환경 부담금을 매겨야 한다','버려지는 옷과 오염 비용을 반영해야 한다','저렴한 옷이 필요한 사람에게 부담이 된다']]},
  environment:{world:'‘{t}’의 원인을 만든 곳과 피해를 입는 곳이 다르다면, 비용은 누가 어떻게 나눠야 공정할까요?',
    personal:'이 소식을 읽고 내가 이번 달에 실천해 볼 수 있는 가장 현실적인 행동 하나는 무엇인가요?',
    motions:[['일회용 플라스틱은 전면 금지해야 한다','대체재가 있고 오염 비용이 너무 크다','위생과 비용, 생업에 미치는 영향이 크다'],['개발보다 생태 보전을 우선해야 한다','한 번 사라진 생태계는 되돌릴 수 없다','지역 주민의 생계와 개발 요구도 정당하다']]},
  career:{world:'‘{t}’ 같은 일의 변화는 노동시장이 유연한 나라와 고용 보호가 강한 나라에서 어떻게 다르게 나타날까요?',
    personal:'이 변화를 기준으로 보면 내가 3년 안에 꼭 길러야 할 역량 하나는 무엇인가요?',
    motions:[['주 4일 근무제를 도입해야 한다','생산성과 삶의 질을 함께 높인다','업종과 기업 규모에 따라 감당하기 어렵다'],['재택근무는 직원이 선택할 권리여야 한다','일의 결과가 중요하고 삶의 여유가 생긴다','협업과 배움, 조직 문화가 약해진다']]},
};
export const lensesEn:Record<string,Lens>={
  technology:{world:'The US, China and Europe each govern a change like “{t}” by different rules. Which approach is most likely to become the world standard in ten years, and why?',
    personal:'What part of your work would this technology take over first, and what would become more important instead?',
    motions:[['AI-generated content must always be labeled','Labels are the minimum it takes to keep trust','Labeling rules slow down innovation and adoption'],['Core technologies should be made at home','When supply is cut off, the economy and security shake together','Specialization is cheaper and faster, and moves technology ahead sooner']]},
  business:{world:'Is the trend behind “{t}” an equal opportunity for companies in emerging and advanced economies? Who is set up to move faster?',
    personal:'Which products or services you use often could change in price or form because of this shift?',
    motions:[['A company’s first duty is to its shareholders','Profits are what keep jobs and investment going','Companies last longer when they look after workers, customers and communities too'],['Big platform companies need tougher regulation','Market power blocks competition and innovation','Scale is what makes low prices and good service possible']]},
  science:{world:'Who should pay for research like “{t}”, and who should share in what it produces? Why does it need international cooperation?',
    personal:'If this finding holds up, which of your assumptions would be worth a second look?',
    motions:[['Taxpayers should fund more basic research, even without a clear use yet','Most breakthroughs started as basic research','It is better to focus on applied research with visible results'],['Space exploration should be left to private companies','Competition cuts costs and speeds things up','Public interest and safety are the government’s job']]},
  energy:{world:'How would the effects of “{t}” differ in countries that export oil, countries that import it, and countries rich in minerals?',
    personal:'Electricity, gas or commuting: where would this change hit your spending first?',
    motions:[['Nuclear power should be central to climate policy','It makes steady, carbon-free electricity','Waste, accident risk and cost are serious problems'],['Carbon emissions should carry a higher price','Behavior and investment change only when prices do','It raises living costs and hurts industrial competitiveness']]},
  health:{world:'Will medical advances like “{t}” narrow or widen the health gap between rich and poor countries?',
    personal:'After reading this, what is one small thing you might change in your habits or your family’s health care?',
    motions:[['Health data should be usable for research by default','Better treatments can be found faster','It is sensitive information, so clear consent must come first'],['Insurance should cover expensive new drugs','Access to treatment should not depend on income','Limited funds should go where they help the most people']]},
  finance:{world:'How does money moving like “{t}” cross borders into other countries’ interest rates, exchange rates and jobs? Sketch one path.',
    personal:'What does this change signal for your savings, loans or investments? Split it into what to do now and what to watch.',
    motions:[['Central banks should put jobs ahead of inflation','When employment collapses, recovery takes years','Unstable prices shrink everyone’s real income'],['Digital assets should be regulated like traditional finance','Investor protection and stability come first','There must be room for new financial experiments']]},
  design:{world:'When a cultural trend like “{t}” spreads from one country to the world, what stays and what changes?',
    personal:'Which recent purchase or experience of yours resembles this trend? What drew you to it?',
    motions:[['Algorithmic recommendations make culture all the same','Everyone ends up seeing similar things','They give small creators a chance to be discovered'],['AI-made works should count as art','The tool changed, but expression is still human','It blurs the effort and originality of creation']]},
  policy:{world:'If a country on another continent copied a policy change like “{t}”, would it work there? What would have to change?',
    personal:'If this policy takes effect, what procedures or costs change in your daily life? Are you for it or against it?',
    motions:[['Countries should welcome more immigrants','It eases population decline and labor shortages','Social integration and job competition need preparing first'],['The voting age should be lowered to 16','The generation living with the future should have a say','Judgment needs more experience and preparation']]},
  mobility:{world:'How would the change in “{t}” look different in a country with wide open land versus one with dense cities?',
    personal:'Five years from now, what will be different about how you commute or travel?',
    motions:[['Car use in city centers should be sharply limited','It gives air, safety and space back to people','It restricts livelihoods and freedom of movement'],['Carmakers should be liable for self-driving crashes','The system was the one driving','Users still have a duty to supervise and maintain']]},
  food:{world:'How would a food shift like “{t}” change dinner tables differently in grain-importing and grain-exporting countries?',
    personal:'Which items in this week’s grocery cart could feel the effects of this change?',
    motions:[['Farm subsidies should grow to raise food self-sufficiency','It protects food supply in a crisis','Imports are cheaper and more efficient'],['Plant-based and cultivated meat deserve strong public support','It helps the climate and animal welfare','Safety testing and farmers’ livelihoods come first']]},
  education:{world:'Compared with schools in other countries, what should we learn from an education change like “{t}”, and what should we avoid?',
    personal:'Pick one thing you want to learn next. Would this change make that easier or harder?',
    motions:[['Schools should actively allow AI in class','It builds the skills tomorrow’s work will need','It weakens the ability to think for yourself'],['College admissions should center on test scores','They are the fairest, most transparent measure','They miss diverse talents and how students grow']]},
  entertainment:{world:'Where does the US stand in a content-industry shift like “{t}”, and who are the rising competitors?',
    personal:'How will this change the time and money you spend on games, music and video?',
    motions:[['Loot boxes in games should be banned','They work like gambling and harm players','With full disclosure, the choice belongs to players'],['Streaming revenue should flow more to creators','Fair pay keeps creative work going','Platform investment is what grows the market']]},
  sports:{world:'Behind a sports story like “{t}”, whose money and interests, which countries and companies, are at play?',
    personal:'How will this change the way you watch, or what you pay for, the sports you follow?',
    motions:[['Hosting mega-events costs cities more than it earns','Venue debt and costs to residents linger for years','Tourism, infrastructure and a city’s image all improve'],['Major sports broadcasts should be free for everyone','Big games are shared public culture','Rights fees are what build leagues and players']]},
  lifestyle:{world:'What opportunities and burdens does a lifestyle shift like “{t}” bring to the people who live where tourists go?',
    personal:'What part of this trend would you bring into your life, and what would you keep at a distance?',
    motions:[['Popular destinations should cap visitor numbers','It protects residents’ lives and the environment','It shrinks local economies and freedom to travel'],['Fast fashion should pay an environmental levy','The cost of waste and pollution should be priced in','It burdens people who need affordable clothes']]},
  environment:{world:'If the places that caused “{t}” differ from the places harmed by it, how should the costs be shared fairly?',
    personal:'After reading this, what is the most realistic action you could take this month?',
    motions:[['Single-use plastics should be banned outright','Alternatives exist and pollution costs too much','Hygiene, cost and livelihoods are at stake'],['Conservation should come before development','A lost ecosystem cannot be brought back','Local livelihoods and development needs are legitimate too']]},
  career:{world:'How does a work shift like “{t}” play out in countries with flexible labor markets versus strong job protection?',
    personal:'Given this change, what is one skill you need to build in the next three years?',
    motions:[['Companies should adopt a four-day week','It raises productivity and quality of life together','Some industries and small firms cannot afford it'],['Remote work should be the employee’s right to choose','Results matter, and life gets more breathing room','Collaboration, learning and culture get weaker']]},
};
export function lensFor(industry:string,loc:'ko'|'en'='ko'){const set=loc==='en'?lensesEn:lenses;return set[industry]||set.business;}
export const fill=(text:string,title:string)=>text.replaceAll('{t}',title);
// A short, readable form of a headline: the part before a colon, cut at a word break.
export function shortTitle(t:string){
  const head=t.split(/[:…]/)[0].trim();
  if(head.length<=26)return head;
  const cut=head.slice(0,26),space=cut.lastIndexOf(' ');
  return (space>12?cut.slice(0,space):cut).replace(/[\s,.·(]+$/,'')+'…';
}
// Korean particles after a quoted title: 은/는, 이/가, 을/를, 과/와, 으로/로 depend on the final sound.
const batchimDigits=new Set(['0','1','3','6','7','8']);
function hasBatchim(word:string){
  const last=word.replace(/[’'”"…)\]\s.]+$/,'').slice(-1);
  if(!last)return false;
  const code=last.charCodeAt(0);
  if(code>=0xac00&&code<=0xd7a3)return (code-0xac00)%28!==0;
  if(/[0-9]/.test(last))return batchimDigits.has(last);
  return /[lmnLMN]/.test(last);
}
export function josa(word:string,pair:'은는'|'이가'|'을를'|'과와'){return word+(hasBatchim(word)?pair[0]:pair[1]);}
