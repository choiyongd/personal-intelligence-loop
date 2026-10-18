import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'ev-explainer',
    industry:'mobility',
    topic:'ev',
    regions:['GLOBAL','EUROPE','DE','NO','CN','KR'],
    type:'article',
    title:'EU 전기차 점유율 21.7%, 2035년 ‘내연기관 금지’는 ‘90% 감축’으로…유럽 전기차 규칙이 바뀐다',
    dek:'2026년 1~8월 EU 신차 다섯 대 중 한 대 이상이 순수 전기차였습니다. 같은 시기 EU는 탄소 규제를 유연하게 고치고 중국산 전기차에는 관세를 매기며, 시장과 규칙이 동시에 움직이고 있습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'BEV·PHEV·HEV',meaning:'BEV는 배터리로만 달리는 순수 전기차, PHEV는 충전도 되는 플러그인 하이브리드, HEV는 충전 없이 엔진과 모터를 함께 쓰는 하이브리드입니다.'},
      {term:'CO2 배출 기준(플릿 규제)',meaning:'제조사가 한 해 판매한 신차 전체의 평균 탄소 배출량에 상한을 두는 EU 규칙입니다. 넘으면 벌금을 냅니다.'},
      {term:'3년 평균(유연성) 조항',meaning:'2025~2027년 목표를 해마다 따로 맞추지 않고 3년 평균으로 맞출 수 있게 한 2025년 개정 내용입니다.'},
      {term:'상계관세',meaning:'수출국 정부 보조금으로 가격이 낮아진 수입품에 그 보조금 효과만큼 매기는 관세입니다.'},
      {term:'최저수입가격(가격 약속)',meaning:'관세 대신 수출 기업이 일정 가격 아래로 팔지 않겠다고 약속하는 무역 구제 수단입니다.'}
    ],
    pages:[
      {
        heading:'시장: EU 신차 21.7%가 순수 전기차, 노르웨이는 96%',
        easy:'유럽에서 전기차 판매가 다시 빠르게 늘고 있습니다. EU 전체로는 신차 다섯 대 중 한 대꼴이고, 노르웨이에서는 새로 팔린 차가 거의 다 전기차입니다.',
        paragraphs:[
          '유럽자동차제조협회(ACEA)에 따르면 2026년 1~8월 EU 신차 등록은 전년 동기보다 5.3% 늘었고, 이 가운데 순수 전기차(BEV)는 164만1,333대로 점유율 21.7%를 기록했다[1]. 1년 전 같은 기간 점유율은 15.8%였다[1]. 플러그인 하이브리드(PHEV)는 75만8,082대로 10.0%를 차지했다[1].',
          '가장 큰 비중은 여전히 하이브리드(HEV)로, 같은 기간 275만9,718대·36.6%였다[1]. 반면 휘발유차 점유율은 28%에서 21.7%로, 디젤차는 9.4%에서 7.3%로 내려갔다[1]. 국가별로는 프랑스(+74.2%)와 독일(+53.1%), 덴마크(+40.9%)가 순수 전기차 증가를 이끌었다[1].',
          'EU 밖이지만 유럽경제지역(EEA)에 속한 노르웨이는 2025년 신차 17만9,550대 중 17만2,233대가 순수 전기차여서 점유율이 95.9%에 이르렀다[6]. 2024년 88.9%에서 더 오른 수치이며, 12월 한 달만 보면 97.6%였다[6]. 다만 노르웨이도 승용차 보유 대수 기준으로는 여전히 셋 중 두 대가량이 화석연료차라는 점에서, 신차 점유율과 전체 차량 구성의 전환 속도는 다르다[6].'
        ]
      },
      {
        heading:'규칙: 3년 평균, 2035년 ‘90% 감축’, 그리고 중국산 관세',
        easy:'EU는 자동차 회사들이 탄소 목표를 맞추기 쉽도록 규칙을 조금 느슨하게 바꾸고 있습니다. 동시에 중국 정부 보조금을 받은 전기차에는 추가 관세를 매기고 있습니다.',
        paragraphs:[
          'EU는 2025년부터 신차 평균 CO2 배출을 2021년 대비 15% 줄이도록 했는데, 유럽의회는 2025년 5월 찬성 458표, 반대 101표, 기권 14표로 2025~2027년 성과를 3년 평균으로 계산할 수 있게 하는 개정안을 통과시켰다[2]. 한 해 초과 배출을 다음 해 초과 감축으로 메울 수 있게 된 것이며, 이사회도 2025년 5월 7일 같은 내용을 승인했다[2].',
          '유럽연합 집행위원회는 2025년 12월 16일 ‘자동차 패키지’를 내놓고, 2035년 신차 CO2 100% 감축 목표를 90% 감축으로 낮추는 안을 제안했다[3]. 남는 10%는 EU산 저탄소 철강이나 e-연료·바이오연료 같은 지속가능 연료로 상쇄할 수 있고, 2035년 이후에도 플러그인 하이브리드·주행거리 연장형·마일드 하이브리드 차량 판매가 가능해진다[3]. EU 역내에서 생산한 소형 저가 전기차에는 ‘슈퍼 크레딧’이 주어지며, 이를 위해 길이 4.2m 이하 소형 전기차 범주(M1E)가 새로 만들어진다[3][4].',
          '같은 패키지는 2030년 목표 달성에 2030~2032년 크레딧 이월·차입을 허용하고, 밴(소형 상용차)의 2030년 감축 목표를 50%에서 40%로 낮췄다[4]. 이 제안은 유럽의회와 이사회의 협상을 거쳐야 하며, 2026년 1월부터 키프로스 의장국이 중재를 맡았다[3]. 2026년 10월 현재 최종 확정 여부는 협상 결과를 지켜봐야 한다.',
          '무역 측면에서 EU는 2024년 10월 30일부터 5년간 중국산 순수 전기차에 상계관세를 부과하고 있다[5]. 세율은 BYD 17.0%, 지리 18.8%, SAIC 35.3%, 테슬라(상하이) 7.8%, 기타 협조 기업 20.7%, 비협조 기업 35.3%다[5].'
        ]
      },
      {
        heading:'한국 기업에 의미하는 것: 완성차는 순항, 배터리는 경고등',
        easy:'현대차와 기아는 유럽에서 소형 전기차를 앞세워 판매를 늘리고 있습니다. 반면 한국 배터리 회사들은 값싼 중국산 배터리에 밀려 유럽 점유율이 크게 줄었습니다.',
        paragraphs:[
          '현대차와 기아는 2026년 상반기 유럽에서 전기차 13만1,032대를 팔았는데, 이는 직전 반기(9만2,365대)보다 41.8% 많은 수치다[7]. 차종별로는 기아 EV3(2만7,121대), 현대 인스터(1만6,594대), 기아 EV4(1만4,502대)가 앞섰으며, 두 회사는 연간 유럽 전기차 판매가 처음으로 20만 대를 넘을 것으로 내다봤다[7]. 소형 전기차 중심의 판매 구성은 EU가 소형 저가 전기차를 우대하는 방향과 맞물려 있지만, 슈퍼 크레딧은 EU 역내 생산 차량에 한정되어 있다[3].',
          '배터리 쪽 흐름은 반대다. SNE리서치 집계로 LG에너지솔루션·삼성SDI·SK온의 EU 시장 합산 점유율은 2023년 60.4%에서 2025년 약 30%로 떨어졌고, 같은 기간 중국 업체는 약 20%에서 약 60%로 올라섰다[8]. 가격 경쟁과 저가 리튬인산철(LFP) 배터리 수요 증가가 주된 원인으로 꼽힌다[8].',
          'EU는 공공조달과 보조금에서 역내 생산·저탄소 제품을 우대하는 산업가속화법(Industrial Accelerator Act)과 핵심원자재법을 추진하고 있어, 폴란드 브로츠와프(LG), 헝가리 괴드(삼성SDI), 헝가리 코마롬·이반차(SK온)에 공장을 둔 한국 업체에는 기회가 될 수 있다[8]. 다만 업계에서는 실제 효과가 ‘원산지’ 정의 등 세부 규정에 달려 있다고 본다[8].'
        ]
      }
    ],
    deepDive:{
      heading:'“규제 완화”인가 “현실화”인가: 숫자를 읽는 법',
      paragraphs:[
        '21.7%라는 점유율은 EU 27개국 신차 등록 기준이며, 노르웨이·영국 등 비EU 국가는 포함되지 않습니다[1]. 또 국가별 편차가 커서, 독일·프랑스·덴마크의 빠른 증가가 평균을 끌어올리고 있습니다[1]. 노르웨이의 95.9%도 신차 기준이어서, 전체 보유 차량의 전환은 훨씬 느리다는 점을 함께 봐야 합니다[6].',
        '2035년 ‘90% 감축’ 안을 두고 평가는 엇갈립니다. 보크 훅스트라 기후 담당 집행위원은 “윈윈”이라고 했지만, 전기차 업계 단체 E-모빌리티 유럽은 투자자에게 불확실성을 더한다고 비판했습니다[3]. 남은 10%를 철강·연료 크레딧으로 상쇄하는 방식은 실제 차량 배출이 얼마나 줄었는지와 크레딧의 인정 범위를 어떻게 검증할지라는 방법론적 쟁점을 남깁니다[3][4].',
        '중국산 관세도 고정된 상수가 아닙니다. 관세는 5년간 유지되지만[5], 세율이 기업별로 7.8%에서 35.3%까지 달라 실제 부담은 기업마다 크게 다릅니다[5]. 한국 배터리 점유율 수치(약 30%)는 한 조사기관의 추정이어서, 집계 범위(EU 판매 차량 탑재 기준 여부 등)에 따라 다른 결과가 나올 수 있습니다[8].'
      ]
    },
    keyFacts:[
      {label:'EU 순수 전기차 점유율(2026년 1~8월)',value:'21.7%(전년 15.8%)',source:1},
      {label:'노르웨이 순수 전기차 점유율(2025년)',value:'95.9%',source:6},
      {label:'2035년 CO2 목표(집행위 제안)',value:'100% → 90% 감축',source:3},
      {label:'한국 배터리 3사 EU 점유율',value:'60.4%(2023) → 약 30%(2025)',source:8}
    ],
    questions:[
      'EU 순수 전기차 점유율 21.7%에 비해 하이브리드 점유율이 더 높은 이유는 무엇일까요?',
      '2025~2027년 3년 평균 조항은 제조사의 벌금 부담을 어떻게 줄여 주나요?',
      '2035년 목표가 90% 감축으로 바뀌면 남는 10%는 어떤 방법으로 상쇄하게 되나요?',
      '내가 한국 배터리 회사의 유럽 담당자라면 EU의 역내 생산 우대 정책에 어떻게 대응해야 할까요?'
    ],
    thoughts:[
      '규제를 유연하게 바꾸는 것이 전기차 전환을 늦추는 신호일까요, 지속 가능하게 만드는 조정일까요?',
      '중국산 저가 전기차에 대한 관세는 유럽 소비자에게 득일까요, 실일까요?'
    ],
    sources:[
      {title:'New car registrations: +5.3% in August 2026 year-to-date; battery-electric 21.7% market share',publisher:'ACEA',year:'2026',url:'https://www.acea.auto/pc-registrations/new-car-registrations-5-3-in-august-2026-year-to-date-battery-electric-21-7-market-share/',kind:'통계'},
      {title:'CO2 emissions: EP adopts flexibility measures for carmakers',publisher:'European Parliament',year:'2025',url:'https://www.europarl.europa.eu/news/en/press-room/20250502IPR28225/co2-emissions-ep-adopts-flexibility-measures-for-carmakers',kind:'공식 자료'},
      {title:'EU carmakers to comply with 90% emissions reduction by 2035',publisher:'Euronews',year:'2025',url:'https://euronews.com/green/2025/12/16/eu-carmakers-to-comply-with-90-emissions-reduction-by-2035-as-full-combustion-engine-ban-s',kind:'보도'},
      {title:'EU Commission releases Automotive Package proposals',publisher:'DieselNet',year:'2025',url:'https://dieselnet.com/news/2025/12eu.php',kind:'보도'},
      {title:'EU Commission imposes countervailing duties on imports of battery electric vehicles (BEVs) from China',publisher:'European Commission, Access2Markets',year:'2024',url:'https://trade.ec.europa.eu/access-to-markets/en/news/eu-commission-imposes-countervailing-duties-imports-battery-electric-vehicles-bevs-china',kind:'공식 자료'},
      {title:'Battery-electric cars dominate Norway – and its fleets',publisher:'electrive',year:'2026',url:'https://www.electrive.com/2026/01/03/battery-electric-cars-dominate-norway-and-its-fleets',kind:'보도'},
      {title:'Hyundai, Kia sell over 100,000 EVs in Europe in H1',publisher:'The Korea Times',year:'2026',url:'https://koreatimes.co.kr/business/companies/20260802/hyundai-kia-sell-over-100000-evs-in-europe-in-h1',kind:'보도'},
      {title:'Korean battery makers lose EU market share to Chinese rivals (Asia Today report)',publisher:'UPI',year:'2026',url:'https://www.upi.com/Top_News/World-News/2026/09/02/batteries-eu-china/6081788395075/',kind:'보도'}
    ]
  },
  {
    id:'aviation-explainer',
    industry:'mobility',
    topic:'aviation',
    regions:['GLOBAL','EUROPE','KR'],
    type:'research',
    title:'지속가능항공유(SAF), 전체 항공유의 0.8%…EU 의무 2%·한국 2027년 1% 혼합 의무의 현실',
    dek:'EU는 2025년부터 공항에서 공급되는 항공유의 2%를 SAF로 채우도록 했고, 한국도 2027년 1% 의무화를 예고했습니다. 그러나 2026년 세계 SAF 생산은 240만 톤, 전체 항공유의 0.8%에 그칠 전망입니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'SAF(지속가능항공유)',meaning:'폐식용유·바이오매스·포집한 탄소 등으로 만든 항공유로, 기존 제트연료에 섞어 씁니다. 생애주기 기준으로 탄소 배출을 줄이는 것이 목적입니다.'},
      {term:'e-SAF(합성 항공유)',meaning:'재생에너지로 만든 수소와 포집한 CO2를 합성해 만든 항공유입니다. 아직 매우 비쌉니다.'},
      {term:'ReFuelEU Aviation',meaning:'EU 공항에서 항공유 공급사가 일정 비율 이상 SAF를 섞어 공급하도록 한 EU 규정입니다.'},
      {term:'CORSIA',meaning:'국제민간항공기구(ICAO)가 만든 국제선 탄소 상쇄·감축 제도로, 기준선을 넘는 배출을 상쇄하도록 합니다.'},
      {term:'탱커링(tankering)',meaning:'연료가 싼 공항에서 필요 이상으로 연료를 실어 오는 관행으로, 무게가 늘어 배출이 증가합니다.'}
    ],
    pages:[
      {
        heading:'규칙: EU 2% → 2050년 70%, ICAO는 2030년 5% 감축',
        easy:'유럽은 비행기 연료에 친환경 연료를 일정 비율 이상 섞도록 법으로 정했습니다. 국제기구도 2030년까지 국제선 배출을 5% 줄이자는 목표를 세웠습니다.',
        paragraphs:[
          'EU의 ReFuelEU Aviation 규정(Regulation (EU) 2023/2405)은 2023년 11월 20일 발효됐고, 핵심 의무는 2025년 1월 1일부터 적용됐다[1]. 이 규정은 EU 공항에 공급되는 항공유 가운데 SAF 최소 비율을 2025년 2%, 2030년 6%, 2035년 20%, 2040년 34%, 2045년 42%, 2050년 70%로 정했다[1].',
          '합성 항공유(e-SAF)에는 별도 하위 의무가 붙어 2030년 1.2%, 2032년 2%, 2035년 5%를 거쳐 2050년 35%까지 늘어난다[1]. 항공사가 SAF 비용을 피하려 역외에서 연료를 실어 오지 못하도록, EU 공항에서 필요한 연간 연료의 최소 90%를 해당 공항에서 급유하도록 한 탱커링 방지 조항도 들어 있다[1].',
          '국제 차원에서는 2023년 11월 20~24일 두바이에서 열린 ICAO 제3차 항공·대체연료 회의(CAAF/3)가 SAF 등 청정 에너지로 2030년까지 국제선 CO2를 5% 줄인다는 ‘열망적’ 목표를 채택했다[3]. 이 목표는 개별 국가에 구체적 감축 의무를 부과하지 않으며, 어떤 연료를 청정 에너지로 인정할지는 CORSIA 기준을 따르도록 했다[3].',
          'CORSIA는 2021~2023년 시범 단계, 2024~2026년 1단계(자발적 참여)를 거쳐 2027~2035년 2단계에서 일부 예외를 빼고 의무화된다[4]. 1·2단계 기준선은 2019년 배출량의 85%이며, 이를 넘는 배출분을 상쇄해야 한다[4]. SAF 구매는 이 의무를 이행하는 핵심 수단으로 꼽힌다[4].'
        ]
      },
      {
        heading:'현실: 생산은 목표에 못 미치고 가격은 최대 5배',
        easy:'SAF 생산량은 늘고 있지만 전체 항공유에 비하면 아주 적습니다. 값도 일반 항공유의 두 배 이상이어서 항공사 부담이 커지고 있습니다.',
        paragraphs:[
          '국제항공운송협회(IATA)는 2025년 12월 9일, 2025년 세계 SAF 생산량을 190만 톤(24억 리터)으로 추정했다[2]. 이는 2024년 100만 톤의 약 두 배이지만 이전 전망보다 하향 조정된 수치이며, 전체 제트연료 소비에서 차지하는 비중은 0.6%에 그쳤다[2].',
          'IATA는 2026년 생산량을 240만 톤, 항공유 대비 0.8%로 내다봤고, 2026년 6월 9일 연차총회에서도 이 전망을 유지하며 항공사 비용을 43억 달러로 추산했다[2][5]. 윌리 월시 IATA 사무총장은 “순서가 잘못 짜인 정부 정책”과 정유사의 낮은 관심을 문제로 지목했다[5].',
          '가격 격차가 핵심 장애물이다. IATA에 따르면 SAF는 일반 항공유의 약 두 배이고, 의무가 있는 시장에서는 최대 다섯 배까지 비싸며, 항공사들은 2025년 190만 톤에 대해 29억 달러의 웃돈을 냈다[2]. e-SAF는 일반 항공유의 최대 12배에 이를 수 있고, 생산 인센티브가 없으면 2032년까지 EU 의무 미달에 따른 비용이 290억 유로에 달할 수 있다고 IATA는 경고했다[2].'
        ]
      },
      {
        heading:'한국: 2027년 1%, 2035년 7~10%',
        easy:'한국도 2027년부터 국제선 비행기 연료에 SAF를 1% 섞도록 할 계획입니다. 국내 정유사들은 수출 경험을 바탕으로 국내 수요의 상당 부분을 감당할 수 있을 것으로 보입니다.',
        paragraphs:[
          '국토교통부는 2025년 5월 22일 2027년까지 SAF 1% 혼합 의무를 도입하겠다고 밝혔다[6]. 1% 기준 2027년 국내 SAF 수요는 약 7만6,000톤(약 55만6,000배럴)으로 추산되며, 한국의 2024년 제트연료 소비량은 3,290만 배럴이었다[6].',
          '이후 발표된 로드맵에 따르면 한국발 국제선은 2027년 1%, 2030년 3~5%, 2035년 7~10%의 SAF 혼합 의무를 지게 되며, 2030·2035년 비율은 국제 동향과 국내 산업 여건을 보고 확정한다[7]. 연간 의무량의 최대 20%를 이후 3년 안에 이행하도록 미룰 수 있고, 신규 항공사는 상업 운항 첫 3년간 면제되며, 미이행 과징금은 초기에는 유예된다[7].',
          '공급 측면에서 SK이노베이션은 캐세이퍼시픽에 2027년까지 SAF 2만 톤을 공급하는 계약을 맺어 2024년 11월부터 인천공항에서 공급하고 있고, S-OIL은 국내 정유사 가운데 처음으로 ISCC CORSIA 인증을 받았다[6]. S&P글로벌 플래츠는 국내 4대 정유사가 2027년 예상 수요의 약 80%인 40만 배럴 이상을 공급할 수 있다고 계산했다[6]. 다만 EU의 사례처럼 의무 비율이 오를수록 원료 확보와 가격 부담이 항공권 가격으로 전가될 수 있다는 점은 한국 소비자와 항공사 모두가 지켜볼 대목이다[2][7].'
        ]
      }
    ],
    deepDive:{
      heading:'“SAF 1톤”이 줄이는 탄소는 얼마일까: 측정과 쟁점',
      paragraphs:[
        'SAF의 감축 효과는 연소 시점이 아니라 원료 재배·수집부터 정제·운송까지의 생애주기로 계산합니다. 그래서 같은 SAF라도 원료와 공정에 따라 감축률이 크게 달라지고, CORSIA는 이를 판단하는 공통 기준 역할을 합니다[3]. 다만 CORSIA 계산이 사실상 SAF 연소 배출을 0으로 취급한다는 비판도 있어, 감축량이 과대평가될 수 있다는 지적이 나옵니다[4].',
        'IATA의 생산량 수치는 업계 단체의 추정치이며, 매년 하향 조정되어 왔다는 점에 유의해야 합니다[2]. 또 IATA는 항공사 입장을 대변하는 단체여서 EU 의무 제도의 비용을 강조하는 경향이 있습니다[2][5]. 반대로 의무가 없으면 수요가 불확실해 생산 설비 투자가 이뤄지지 않는다는 논리도 EU 규정의 배경이 됐습니다[1].',
        'ICAO의 2030년 5% 목표는 법적 구속력이 없는 ‘열망적’ 목표여서[3], 실제 이행은 EU·영국·한국처럼 각국이 만드는 혼합 의무에 달려 있습니다. 한국의 2030·2035년 비율이 범위로만 제시된 것도 국제 동향과 업계 부담을 보고 조정하겠다는 뜻이어서, 최종 수치는 아직 확정되지 않았습니다[7].'
      ]
    },
    keyFacts:[
      {label:'EU SAF 최소 혼합 비율',value:'2025년 2% → 2030년 6% → 2050년 70%',source:1},
      {label:'세계 SAF 생산(2025년 추정)',value:'190만 톤, 항공유의 0.6%',source:2},
      {label:'세계 SAF 생산(2026년 전망)',value:'240만 톤, 항공유의 0.8%',source:5},
      {label:'한국 SAF 혼합 의무',value:'2027년 1%, 2035년 7~10%',source:7}
    ],
    questions:[
      'SAF와 e-SAF는 원료와 비용 면에서 어떻게 다른가요?',
      'EU가 탱커링 방지 조항을 함께 둔 이유는 무엇인가요?',
      'CORSIA의 기준선이 2019년 배출량의 85%라는 것은 무슨 뜻인가요?',
      '내가 국내 항공사의 연료 구매 담당자라면 2027년 1% 의무에 대비해 무엇부터 준비해야 할까요?'
    ],
    thoughts:[
      'SAF 의무화 비용이 항공권 가격에 반영된다면, 그 부담은 누가 지는 것이 공정할까요?',
      '생산이 부족한 상황에서 의무 비율을 먼저 높이는 정책은 시장을 키울까요, 가격만 올릴까요?'
    ],
    sources:[
      {title:'Sustainable aviation fuels (ReFuelEU Aviation Initiative) – document summary',publisher:'European Parliament Legislative Observatory',year:'2023',url:'https://oeil.europarl.europa.eu/oeil/en/document-summary?id=1764144',kind:'공식 자료'},
      {title:'SAF production growth slowing (press release, 9 December 2025)',publisher:'IATA',year:'2025',url:'https://www.iata.org/en/pressroom/2025-releases/2025-12-09-04/',kind:'공식 자료'},
      {title:'We delivered a strong global framework for aviation’s clean energy transition',publisher:'ICAO Uniting Aviation',year:'2023',url:'https://unitingaviation.com/amp/news/environment/we-delivered-a-strong-global-framework-for-aviations-clean-energy-transition/',kind:'공식 자료'},
      {title:'Taking stock of CORSIA',publisher:'Mondaq',year:'2024',url:'https://www.mondaq.com/uk/aviation/1412086/taking-stock-of-corsia',kind:'보도'},
      {title:'IATA AGM: Another disappointing year for SAF production',publisher:'Aviation Business News',year:'2026',url:'https://www.aviationbusinessnews.com/sustainability/green-sky/iata-agm-another-disappointing-year-for-saf-production/',kind:'보도'},
      {title:'South Korea to mandate 1% sustainable aviation fuel by 2027',publisher:'S&P Global Commodity Insights',year:'2025',url:'https://www.spglobal.com/energy/en/news-research/latest-news/refined-products/052225-south-korea-to-mandate-1-sustainable-aviation-fuel-by-2027',kind:'보도'},
      {title:'South Korea Mandates Use of Sustainable Aviation Fuel on Flights Beginning 2027',publisher:'ESG Today',year:'2025',url:'https://www.esgtoday.com/south-korea-mandates-use-of-sustainable-aviation-fuel-on-flights-beginning-2027/',kind:'보도'}
    ]
  },
  {
    id:'foodtech-explainer',
    industry:'food',
    topic:'foodtech',
    regions:['GLOBAL','ASIA_PACIFIC','SG','US','N_AMERICA','GB','EUROPE','KR'],
    type:'news',
    title:'배양육, 싱가포르 첫 승인 6년…미국 7개 주는 금지, 영국은 샌드박스, 한국은 아직 심사 중',
    dek:'세포를 키워 만든 고기는 2020년 싱가포르에서 처음 판매 허가를 받았습니다. 그 뒤 나라마다 ‘허가·금지·실험’으로 길이 갈리면서, 규제가 시장의 속도를 정하고 있습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'배양육(세포배양식품)',meaning:'동물에서 떼어 낸 세포를 배양기(바이오리액터)에서 키워 만든 고기나 지방입니다.'},
      {term:'신규식품(Novel Food)',meaning:'EU에서 1997년 이전에 널리 먹지 않던 식품으로, 판매 전에 안전성 평가와 승인을 받아야 합니다.'},
      {term:'규제 샌드박스',meaning:'새 기술이 기존 규제에 막히지 않도록 정부가 일정 기간 시험·평가를 지원하는 제도입니다.'},
      {term:'한시적 기준·규격 인정',meaning:'한국 식약처가 아직 기준이 없는 새 원료를 심사해 임시로 식품 원료로 인정하는 절차입니다.'}
    ],
    pages:[
      {
        heading:'허가한 나라들: 싱가포르에서 미국까지',
        easy:'실험실에서 키운 고기를 처음 팔 수 있게 한 나라는 싱가포르입니다. 미국도 2023년 두 회사의 닭고기 판매를 허가했습니다.',
        paragraphs:[
          '싱가포르 식품청(SFA)은 2020년 12월 2일 미국 기업 잇저스트(Eat Just)의 배양 닭고기 판매를 승인해, 세계 최초로 배양육 상업 판매를 허용한 국가가 됐다[1]. 잇저스트는 1,200리터 바이오리액터에서 20회 이상 생산을 진행했고 항생제는 쓰지 않았다고 밝혔다[1].',
          '미국에서는 2023년 농무부(USDA)가 캘리포니아 기반 두 회사의 배양 닭고기를 전국에서 판매할 수 있도록 허용했고, 같은 해 두 식당 메뉴에 잠시 올랐다[2]. 다만 2025년 6월 기준으로 배양육은 아직 일반 매장에서 판매되지 않고 있다[2].',
          '영국에서는 미틀리(Meatly)가 반려동물 사료용 배양육 판매 허가를 받았고, 2025년 2월 무렵 영국 반려동물용품점 체인 펫츠앳홈에서 배양육이 들어간 개 간식이 처음 판매됐다[3]. 이는 사람 식품이 아닌 반려동물 사료 분야의 첫 사례다[3].'
        ]
      },
      {
        heading:'금지한 곳과 실험하는 곳: 미국 주 정부, 영국, EU',
        easy:'미국 연방정부는 허가했지만 일부 주는 판매를 아예 금지했습니다. 영국과 EU는 금지 대신 안전성을 먼저 따져 보는 절차를 밟고 있습니다.',
        paragraphs:[
          '미국 주 차원에서는 2024년 플로리다와 앨라배마가 배양육 판매를 금지했고, 2025년에는 인디애나·미시시피·몬태나·네브래스카·텍사스가 뒤따라 금지 주가 7곳이 됐다[2]. 텍사스의 금지법은 2025년 9월 시행되어 2년 뒤 만료되며, 인디애나도 2년 한시 금지를 택했다[2]. 업사이드푸즈는 플로리다 금지법에 소송을 냈고, 2025년 6월 기준 소송은 진행 중이다[2].',
          '영국 식품기준청(FSA)은 과학혁신기술부로부터 160만 파운드를 받아 2년짜리 배양식품 규제 샌드박스를 시작했고, 2025년 3월 기준 영국의 후시턴팜스·로슬린테크놀로지스·언커먼바이오, 미국 블루날루, 호주 바우, 네덜란드 모사미트, 프랑스 구르메이·바이탈미트 등 8개사가 참여했다[3]. FSA와 스코틀랜드 식품기준청(FSS)은 2025년 12월 영국 최초의 배양식품 안전성 지침을 내놓았고, 2026년 내내 추가 지침을 낼 계획이라고 밝혔다[4].',
          'EU에서는 유럽식품안전청(EFSA)이 2023년 5월까지 배양 동물세포 식품 신청을 한 건도 받지 않았지만, 기존 신규식품 지침으로 평가할 준비가 돼 있다고 밝혔다[5]. EFSA는 과학적 평가만 맡고, 판매 승인과 표시 결정은 집행위원회와 회원국이 동물복지·사회적 요인까지 고려해 내린다[5]. 이후 프랑스 구르메이가 2024년 배양 푸아그라를, 네덜란드 모사미트가 2025년 1월 배양 지방을 신청했으며, 평가에는 약 18개월이 걸릴 것으로 예상됐다[6].'
        ]
      },
      {
        heading:'한국: 제도는 열렸지만 첫 승인은 아직',
        easy:'한국도 2024년부터 배양육을 식품 원료로 인정받을 수 있는 길을 열었습니다. 여러 국내 스타트업이 준비 중이지만 아직 판매 허가를 받은 제품은 없습니다.',
        paragraphs:[
          '식품의약품안전처는 2024년 2월 21일 ‘식품등의 한시적 기준 및 규격 인정 기준’을 고쳐 세포배양 원료를 인정 대상에 넣었다[7]. 신청자는 세포 출처, 이물질, 제조 방법, 주요 성분, 잔류물, 알레르기 유발성, 유전적 안정성, 독성 등의 자료를 내야 하며, 처리 기간은 최대 270일이다[7].',
          '2025년 10월 보도 기준 국내에서 배양육 판매 승인을 받은 제품은 없으며, 스페이스에프는 승인 절차의 막바지 단계로 이듬해 하반기 승인 가능성이 거론됐다[8]. 씨위드는 상업용 배치 생산과 동물 독성시험을 준비하며 경북 의성 세포배양식품 규제자유특구에 생산 시설을 짓고 있다[8].',
          '국내 기업에는 해외 규제 지형이 곧 수출 전략이 된다. 싱가포르처럼 일찍 허가한 시장[1], 영국처럼 샌드박스로 해외 기업까지 받아들이는 시장[3], 미국 일부 주처럼 문을 닫은 시장[2]이 공존하기 때문에, 어느 나라에서 먼저 허가를 받을지가 사업 계획의 핵심 변수다.'
        ]
      }
    ],
    deepDive:{
      heading:'금지의 근거와 허가의 근거는 무엇이 다를까',
      paragraphs:[
        '미국 주 정부의 금지는 대체로 과학적 안전성 평가 결과보다는 축산업 보호와 소비자 우려를 앞세운 입법입니다. 인디애나 의원들이 2년 한시 금지를 두고 “연구할 시간을 벌기 위해서”라고 설명한 것이 그 예입니다[2]. 반면 싱가포르·영국·EU는 세포 출처, 배양 배지, 오염 관리 같은 공정 자료를 바탕으로 사례별 안전성 평가를 하는 방식을 택했습니다[1][4][5].',
        '“승인”이 곧 “시장”이라는 뜻은 아닙니다. 미국은 2023년 연방 승인을 했지만 2025년 기준 매장 판매는 없었고[2], 영국의 첫 사례도 사람 식품이 아닌 반려동물 간식이었습니다[3]. 생산 단가와 대량 배양 기술이 아직 상업화의 병목이라는 점은 각 기업 발표 수치로 직접 검증하기 어렵습니다.',
        '한국의 처리 기간 270일은 법정 기한이며[7], 자료 보완 요청이 있으면 실제 기간은 더 길어질 수 있습니다. 이 글의 국내 기업 진행 상황은 2025년 10월 보도에 근거하므로[8], 2026년 10월 현재 상황과 다를 수 있습니다.'
      ]
    },
    keyFacts:[
      {label:'세계 첫 배양육 판매 승인',value:'싱가포르, 2020년 12월 2일',source:1},
      {label:'배양육 판매 금지 미국 주',value:'7곳(2025년 6월 기준)',source:2},
      {label:'영국 규제 샌드박스',value:'160만 파운드, 2년, 8개사',source:3},
      {label:'한국 식약처 심사 기간',value:'최대 270일',source:7}
    ],
    questions:[
      '싱가포르가 세계 최초로 배양육을 승인할 수 있었던 배경은 무엇일까요?',
      '미국에서 연방 승인과 주 정부 금지가 동시에 존재하는 이유는 무엇인가요?',
      'EU에서 EFSA와 집행위원회의 역할은 어떻게 나뉘나요?',
      '내가 국내 배양육 스타트업 대표라면 첫 허가 시장으로 어느 나라를 고르고, 그 이유는 무엇일까요?'
    ],
    thoughts:[
      '안전성 평가를 통과한 식품을 산업 보호를 이유로 금지하는 것은 정당할까요?',
      '배양육이 상용화된다면 ‘고기’라는 이름을 쓸 수 있어야 할까요?'
    ],
    sources:[
      {title:'Eat Just Inc. gets approval in Singapore for lab-grown chicken',publisher:'Food Safety News',year:'2020',url:'https://www.foodsafetynews.com/2020/12/eat-just-inc-gets-approval-in-singapore-for-lab-grown-chicken/',kind:'보도'},
      {title:'Texas becomes seventh state to ban lab-grown meat',publisher:'Stateline',year:'2025',url:'https://stateline.org/2025/06/30/texas-becomes-seventh-state-to-ban-lab-grown-meat/',kind:'보도'},
      {title:'UK Govt Opens First-of-A-Kind ‘Sandbox’ to Fast-Track Cultivated Meat Approval',publisher:'Green Queen',year:'2025',url:'https://www.greenqueen.com.hk/uk-fsa-lab-grown-cultivated-meat-regulatory-approval-sandbox/',kind:'보도'},
      {title:'FSA and FSS publish first UK safety guidance on cell-cultivated products',publisher:'Food Standards Agency',year:'2025',url:'https://www.food.gov.uk/news-alerts/news/fsa-and-fss-publish-first-uk-safety-guidance-on-cell-cultivated-products',kind:'공식 자료'},
      {title:'The safety of cell culture-derived food: ready for scientific evaluation',publisher:'EFSA',year:'2023',url:'https://www.efsa.europa.eu/en/news/safety-cell-culture-derived-food-ready-scientific-evaluation',kind:'공식 자료'},
      {title:'Mosa Meat submits application for EU market authorisation of cultivated fat',publisher:'Cultivated X',year:'2025',url:'https://cultivated-x.com/approvals/mosa-meat-eu-market-authorisation-cultivated-fat/',kind:'보도'},
      {title:'세포배양물, 이제 식품원료로 인정신청할 수 있다',publisher:'돼지와 사람',year:'2024',url:'https://www.pigpeople.net/news/article.html?no=14468',kind:'보도'},
      {title:'그린바이오 첨병 ‘배양육’, 언제쯤 우리 식탁 오를까',publisher:'비즈한국',year:'2025',url:'https://www.bizhankook.com/bk/article/30538',kind:'보도'}
    ]
  },
  {
    id:'quantum-explainer',
    industry:'technology',
    topic:'quantum',
    regions:['GLOBAL','N_AMERICA','US','CA','EUROPE'],
    type:'research',
    title:'양자컴퓨터 경쟁, 구글 ‘윌로우’ 이후 무엇이 증명됐나…IBM 2029년 목표와 캐나다·EU의 국가 전략',
    dek:'2024년 12월 구글은 큐비트를 늘릴수록 오류가 줄어드는 실험 결과를 내놓았고, 2025년 마이크로소프트는 위상 큐비트를 주장했다가 거센 검증 논란에 휩싸였습니다. 기업의 발표와 학계의 검증, 정부 전략을 나란히 놓고 지금 어디까지 왔는지 정리합니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'큐비트(qubit)',meaning:'0과 1을 동시에 겹쳐 가질 수 있는 양자 정보의 기본 단위입니다. 외부 잡음에 매우 약합니다.'},
      {term:'양자 오류 정정',meaning:'여러 물리 큐비트를 묶어 하나의 ‘논리 큐비트’를 만들어 오류를 찾아 고치는 기술입니다.'},
      {term:'임계값 이하(below threshold)',meaning:'큐비트를 더 묶을수록 논리 큐비트의 오류율이 오히려 줄어드는 상태로, 대형 양자컴퓨터의 전제 조건입니다.'},
      {term:'위상 큐비트·마요라나 영모드',meaning:'특수한 준입자(마요라나 영모드)를 이용해 잡음에 본질적으로 강하도록 설계한 큐비트입니다. 존재 입증 자체가 논쟁 중입니다.'},
      {term:'양자 우위',meaning:'양자컴퓨터가 특정 문제를 최고 성능 기존 컴퓨터보다 현실적으로 빨리 푸는 상태입니다.'}
    ],
    pages:[
      {
        heading:'구글 윌로우: “큐비트를 늘리면 오류가 줄었다”',
        easy:'양자컴퓨터는 큐비트가 많아질수록 오류도 늘어나는 것이 큰 문제였습니다. 구글은 큐비트를 더 묶을수록 오류가 오히려 줄어드는 결과를 처음으로 보여 줬습니다.',
        paragraphs:[
          '구글 퀀텀 AI는 2024년 12월 9일 105큐비트 칩 ‘윌로우(Willow)’를 공개했다[1]. 부호화된 큐비트 배열을 3×3에서 5×5, 7×7로 키울 때마다 오류율이 대략 절반씩 줄어, 수십 년간 목표로 해 온 ‘임계값 이하’ 동작을 보였다고 밝혔으며 이 결과는 학술지 네이처에 실렸다[1].',
          '구글은 또 무작위 회로 샘플링(RCS) 벤치마크를 윌로우가 5분 안에 끝냈지만, 슈퍼컴퓨터 프런티어로는 약 10^25년이 걸릴 것으로 추정했다[1]. 큐비트가 들뜬 상태를 유지하는 시간(T1)은 100마이크로초에 가까워져 이전 칩보다 약 5배 늘었다[1].',
          '다만 무작위 회로 샘플링은 양자컴퓨터의 성능을 보여 주기 위한 시험 문제이며, 신약 개발이나 소재 설계 같은 실제 응용 문제는 아니다[1]. 구글 자신도 다음 과제로 실용적 계산에서의 우위를 꼽았다[1].'
        ]
      },
      {
        heading:'마이크로소프트·IBM·캐나다 기업: 서로 다른 길',
        easy:'회사마다 양자컴퓨터를 만드는 방식이 다릅니다. 마이크로소프트는 새로운 종류의 큐비트를, IBM은 오류 정정 효율을, 캐나다 기업들은 빛과 자석을 이용한 방식을 내세웁니다.',
        paragraphs:[
          '마이크로소프트는 2025년 2월 8개의 위상 큐비트를 담은 칩 ‘마요라나 1’을 공개하고, 장차 100만 큐비트까지 확장하도록 설계했다고 밝혔다[2]. 그러나 함께 실린 네이처 논문은 위상 큐비트를 주장하지 않았고, 네이처 편집진은 논문 결과가 “마요라나 영모드의 존재 증거가 되지는 않는다”고 명시했다[2]. 서식스대 윈프리드 헨싱어 교수는 보도자료가 논문 내용을 과장했다고 비판했고, 2018년 관련 주장이 철회된 전례도 신중론의 근거로 거론됐다[2].',
          'IBM은 2025년 6월 10일 미국 뉴욕주 포킵시의 새 양자 데이터센터에서 2029년까지 논리 큐비트 200개로 1억 회 양자 연산을 수행하는 내결함성 양자컴퓨터 ‘스탈링(Starling)’을 만들겠다는 로드맵을 발표했다[3]. IBM은 qLDPC 오류 정정 부호로 다른 주요 부호보다 오버헤드를 약 90% 줄일 수 있다고 밝혔고, 2025년 룬(Loon), 2026년 쿠카부라(Kookaburra), 2027년 코카투(Cockatoo) 프로세서를 중간 단계로 제시했다[3].',
          '다른 하드웨어 경로를 택한 기업도 있다. 캐나다 토론토의 자나두(Xanadu)는 2025년 1월 22일 광자 칩 35개, 서버 랙 4개, 광섬유 13km로 연결한 12큐비트 광자 양자컴퓨터 ‘오로라’를 공개했으며, 상온에서 작동해 극저온 냉각이 필요 없다[5]. 양자 어닐링 방식의 D-웨이브는 2025년 3월 12일 사이언스 논문에서 자성 물질 시뮬레이션을 약 20분 만에 풀었고 최고 성능 슈퍼컴퓨터로는 100만 년 가까이 걸린다고 주장했다[6].'
        ]
      },
      {
        heading:'정부 전략: 캐나다·EU, 그리고 한국',
        easy:'각국 정부도 양자 기술을 미래 산업으로 보고 돈과 인력을 투자하고 있습니다. 한국도 2035년까지 3조 원 규모의 계획을 세웠습니다.',
        paragraphs:[
          '캐나다는 2023년 1월 13일 3억6,000만 캐나다달러 규모의 국가 양자 전략을 발표했고, 양자컴퓨팅 하드웨어·소프트웨어, 국가 양자 보안 통신망과 양자내성암호, 양자 센싱 지원을 3대 임무로 제시했다[4]. 예산은 연구 1억4,100만, 인재 4,500만, 상용화 1억6,900만 캐나다달러로 나뉘며, 국립연구위원회(NRC) 의뢰 연구는 2045년 캐나다 양자 산업 규모를 1,390억 캐나다달러, 일자리 20만9,200개로 추정했다[4].',
          'EU 집행위원회는 2025년 7월 2일 ‘양자 유럽 전략’을 발표하고 연구·혁신, 양자 인프라, 생태계 강화, 우주·이중용도 기술, 인재 등 5개 분야를 제시했다[7]. 양자 칩 설계 시설과 6개 시범 생산라인에 최대 5,000만 유로의 공공 자금을 지원하기로 했으며, 2026년에 ‘양자법(Quantum Act)’을 제안할 계획이다[7]. EU는 연구 인력과 논문에서는 앞서지만 이를 경제적 성과로 연결하지 못했다는 점을 스스로 과제로 꼽았다[7].',
          '한국 과학기술정보통신부는 2023년 6월 27일 2035년까지 민관 합산 약 3조 원을 투자하는 양자 전략을 내놓고, 2031년까지 1,000큐비트급 초전도 양자컴퓨터를 개발하며 핵심 인력을 384명에서 2,500명으로 늘리겠다고 밝혔다[8]. 미국·캐나다·EU가 각기 다른 기술 경로에 대규모 투자를 하는 상황에서, 한국 기업과 연구자에게는 특정 방식에 대한 독자 개발보다 해외 플랫폼과의 협력 전략이 중요한 선택지가 될 수 있다[4][7][8].'
        ]
      }
    ],
    deepDive:{
      heading:'“우위”와 “돌파” 주장은 어떻게 검증되나',
      paragraphs:[
        '양자 우위 주장은 “기존 컴퓨터로 얼마나 걸리는가”라는 추정에 의존하는데, 이 추정은 더 나은 고전 알고리즘이 나오면 쉽게 무너집니다. D-웨이브 발표 직후 뉴욕대 연구진은 텐서 네트워크로 노트북에서 약 2시간 만에 일부 계산을 재현했다고 했고, 스위스 EPFL 연구진은 GPU 4개로 사흘 만에 풀었다고 반박했습니다[6]. D-웨이브는 이들이 모든 문제와 크기를 다루지 않았다고 맞섰습니다[6].',
        '마이크로소프트 사례는 기업 보도자료와 동료 심사 논문의 주장 수위가 다를 수 있음을 보여 줍니다. 회사 측은 논문 제출(2024년 3월) 이후 추가 증거를 모았다고 설명했지만[2], 2025년 상반기까지 학계 다수는 위상 큐비트의 존재가 충분히 입증되지 않았다고 봤습니다[2]. 2026년 10월 현재까지 이 논쟁이 완전히 정리됐다고 보기는 어렵습니다.',
        '로드맵의 연도도 약속이 아닌 목표라는 점을 기억해야 합니다. IBM의 2029년 스탈링[3], 한국의 2031년 1,000큐비트[8]는 모두 계획 수치이며, 큐비트 수보다 오류율과 논리 큐비트 수, 실제 응용에서의 성능이 진전을 판단하는 더 정확한 지표입니다[1][3].'
      ]
    },
    keyFacts:[
      {label:'구글 윌로우 공개',value:'2024년 12월 9일, 105큐비트',source:1},
      {label:'IBM 스탈링 목표',value:'2029년, 논리 큐비트 200개·연산 1억 회',source:3},
      {label:'캐나다 국가 양자 전략',value:'3억6,000만 캐나다달러(2023년 1월)',source:4},
      {label:'한국 양자 전략',value:'2035년까지 약 3조 원',source:8}
    ],
    questions:[
      '‘임계값 이하’ 오류 정정이 대형 양자컴퓨터에 왜 필수적인가요?',
      '네이처 편집진이 마이크로소프트 논문에 단서를 단 이유는 무엇인가요?',
      'D-웨이브의 양자 우위 주장에 대해 연구자들은 어떤 방식으로 반박했나요?',
      '내가 국내 제약사의 연구개발 책임자라면 지금 양자컴퓨팅에 어느 정도 투자해야 할까요?'
    ],
    thoughts:[
      '기업이 동료 심사 전에 큰 돌파를 발표하는 관행은 과학과 투자자에게 득일까요, 실일까요?',
      '한국은 특정 큐비트 방식에 집중해야 할까요, 여러 방식에 분산 투자해야 할까요?'
    ],
    sources:[
      {title:'Meet Willow, our state-of-the-art quantum chip',publisher:'Google',year:'2024',url:'https://blog.google/technology/research/google-willow-quantum-chip/',kind:'원문'},
      {title:'Experts weigh in on Microsoft’s topological qubit claim',publisher:'Physics World',year:'2025',url:'https://physicsworld.com/a/experts-weigh-in-on-microsofts-topological-qubit-claim',kind:'보도'},
      {title:'IBM Offers Roadmap Toward Large-Scale, Fault-Tolerant Quantum Computer at New IBM Quantum Data Center',publisher:'The Quantum Insider',year:'2025',url:'https://thequantuminsider.com/2025/06/10/ibm-offers-roadmap-toward-large-scale-fault-tolerant-quantum-computer-at-new-ibm-quantum-data-center/',kind:'보도'},
      {title:'Government of Canada launches National Quantum Strategy to create jobs and advance quantum technologies',publisher:'Innovation, Science and Economic Development Canada',year:'2023',url:'https://www.canada.ca/en/innovation-science-economic-development/news/2023/01/government-of-canada-launches-national-quantum-strategy-to-create-jobs-and-advance-quantum-technologies.html',kind:'공식 자료'},
      {title:'Xanadu Announces Aurora, A Universal Photonic Quantum Computer',publisher:'The Quantum Insider',year:'2025',url:'https://thequantuminsider.com/2025/01/22/xanadu-announces-aurora-a-universal-photonic-quantum-computer/',kind:'보도'},
      {title:'D-Wave claims it has achieved quantum supremacy at last, but others disagree',publisher:'SiliconANGLE',year:'2025',url:'https://siliconangle.com/2025/03/12/d-wave-claims-achieved-quantum-supremacy-last-others-disagree/',kind:'보도'},
      {title:'New Quantum Europe Strategy aims to transform Europe’s scientific excellence into economic success',publisher:'ERA Portal Austria',year:'2025',url:'https://era.gv.at/news-items/new-quantum-europe-strategy-aims-to-transform-europes-scientific-excellence-into-economic-success/',kind:'공식 자료'},
      {title:'양자기술로 경제 ‘퀀텀점프’…“2035년까지 3조원, 인력 1만명 육성”',publisher:'머니투데이',year:'2023',url:'https://www.mt.co.kr/tech/2023/06/27/2023062714515526412',kind:'보도'}
    ]
  }
];
