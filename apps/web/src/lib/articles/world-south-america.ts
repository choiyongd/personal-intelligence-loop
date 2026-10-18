import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'critical-minerals-explainer',
    industry:'energy',
    topic:'critical-minerals',
    regions:['GLOBAL','S_AMERICA','CL','AR','BO','KR'],
    type:'article',
    title:'세계 리튬 자원의 43%가 모인 ‘리튬 삼각지대’…칠레·아르헨티나·볼리비아는 왜 서로 다른 길을 가나',
    dek:'미국지질조사국(USGS)에 따르면 아르헨티나·볼리비아·칠레 세 나라에 확인된 리튬 자원은 약 6,400만 톤으로 세계 전체(약 1억 5,000만 톤)의 40%를 넘습니다. 칠레는 국가 주도 합작, 아르헨티나는 투자 감세, 볼리비아는 정권 교체 뒤 재검토라는 서로 다른 해법을 택했고, 한국 배터리·소재 기업의 공급망도 그 사이에 걸려 있습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'리튬 삼각지대',meaning:'칠레 북부, 아르헨티나 북서부, 볼리비아 남서부의 안데스 고원 염호(소금 호수) 지대를 함께 부르는 말입니다.'},
      {term:'매장량과 자원량',meaning:'매장량은 현재 기술·가격으로 경제성 있게 캘 수 있다고 확인된 양이고, 자원량은 존재가 확인됐지만 경제성이 아직 입증되지 않은 양까지 포함한 더 큰 숫자입니다.'},
      {term:'LCE(탄산리튬 환산량)',meaning:'여러 형태의 리튬 제품을 탄산리튬 기준으로 환산한 무게 단위로, 리튬 금속 함량 기준 수치보다 약 5.3배 큽니다.'},
      {term:'RIGI',meaning:'아르헨티나가 2024년 법률 27.742호로 도입한 대규모 투자 인센티브 제도로, 2억 달러 이상 투자에 세금·외환·규제 안정성을 30년간 보장합니다.'},
      {term:'직접리튬추출(DLE)',meaning:'염수를 오랫동안 증발시키는 대신 흡착제나 막을 이용해 리튬만 골라내는 기술로, 물 사용과 생산 기간을 줄이는 대안으로 거론됩니다.'}
    ],
    pages:[
      {
        heading:'숫자로 본 삼각지대: 자원은 볼리비아·아르헨티나, 생산은 칠레',
        easy:'리튬은 전기차 배터리에 꼭 필요한 금속입니다. 남미 세 나라에 세계 리튬 자원의 큰 몫이 모여 있지만, 실제로 많이 캐서 파는 나라는 칠레이고 볼리비아는 아직 상업 생산을 하지 못하고 있습니다.',
        paragraphs:[
          'USGS의 「광물 상품 요약 2026」은 세계 리튬 자원량(측정·표시 자원 기준)이 약 1억 5,000만 톤이며, 이 가운데 아르헨티나 2,800만 톤, 볼리비아 2,300만 톤, 칠레 1,300만 톤이라고 집계했다[1]. 경제성이 확인된 매장량으로 좁히면 칠레가 920만 톤, 아르헨티나가 440만 톤이고 세계 합계는 3,700만 톤이며, 볼리비아는 매장량 수치가 제시되지 않았다[1].',
          '같은 보고서는 2025년 세계 리튬 광산 생산량(리튬 함량 기준)을 약 29만 톤으로 추정했다[1]. 국가별로는 호주 9만 2,000톤, 중국 6만 2,000톤, 칠레 5만 6,000톤, 짐바브웨 2만 8,000톤, 아르헨티나 2만 3,000톤 순이었다[1]. 즉 삼각지대는 자원 비중에 비해 생산 비중이 낮고, 그 생산도 대부분 칠레에 집중돼 있다[1].',
          '수요 쪽에서는 2025년 세계 리튬 소비가 약 26만 3,000톤으로 전년보다 20% 늘었고, 배터리가 전체 최종 용도의 약 88%를 차지한 것으로 추정됐다[1]. 반면 2025년 미국 탄산리튬 계약가격 연평균은 톤당 9,000달러로 2024년보다 31% 떨어졌다[1]. 수요는 늘지만 가격이 낮은 국면이어서, 신규 프로젝트의 투자 결정은 각국 제도의 매력도에 더 크게 좌우되는 상황이다[1].'
        ]
      },
      {
        heading:'세 나라의 서로 다른 해법: 국가 주도, 투자 감세, 재검토',
        easy:'칠레는 국영 구리회사 코델코가 민간 기업 SQM과 손잡고 리튬 사업의 과반을 쥐는 방식을 택했습니다. 아르헨티나는 세금을 깎아 외국 투자를 끌어들이고, 볼리비아는 새 정부가 이전 정부의 러시아·중국 계약을 다시 들여다보고 있습니다.',
        paragraphs:[
          '칠레의 가브리엘 보리치 대통령은 2023년 4월 20일 대국민 연설에서 「국가 리튬 전략」을 발표했다[2]. 칠레 하원은 같은 해 12월 19일 특별 회의에서 리튬을 양허 대상이 아닌 전략 광물로 유지하고, 국영 리튬 기업 설립과 코델코·에나미의 염호별 자회사 설립을 추진하는 방향을 논의했다[2].',
          '이 전략의 핵심 결과물이 코델코와 SQM의 합작사 노바안디노 리티오(NovaAndino Litio)다[3]. 코델코가 지분 50%+1주를 갖고, SQM은 2031년까지 운영을 맡은 뒤 이후 코델코가 운영권을 넘겨받으며, 이 구조로 아타카마 염호 생산은 2060년까지 보장된다[3]. 현재 연산 약 21만 톤(탄산리튬)인 능력은 2030년까지 30만 톤으로 늘릴 계획이며, SQM 지분 22.1%를 가진 중국 톈치리튬의 이의 제기는 칠레 대법원에서 기각됐다[3].',
          '아르헨티나는 2024년 7월 8일 관보에 실린 법률 27.742호로 RIGI를 도입했다[4]. 2억 달러 이상 투자 프로젝트에 법인세율을 35%에서 25%로 낮추고, 30년간 조세·관세·외환 안정성을 보장하며, 가입 3년 뒤 수출세를 면제하고 수출 대금의 해외 보유를 단계적으로 허용하는 것이 골자다[4]. 2026년에는 포스코의 살 데 오로(Sal de Oro) 확장 사업이 RIGI 승인을 받았는데, 투자 규모는 약 8억 3,900만 달러, 목표 생산량은 연 2만 3,000톤(LCE)이다[5].',
          '볼리비아는 2024년 중국 CATL 계열 컨소시엄, 러시아 우라늄원과 직접리튬추출 사업 계약을 맺었지만 상업 생산 단계에는 이르지 못했다[8]. 2025년 11월 8일 취임한 로드리고 파스 대통령 정부는 국영 리튬회사 YLB의 민영화는 부인하면서 민관 협력을 선호한다는 입장이며, 2026년 1월 기준 이 계약들을 재검토 중인 것으로 보도됐다[8]. 볼리비아 헌법은 우유니 염호를 보호하고 법률은 리튬 채굴을 국가에 유보하고 있어, 민간 참여를 넓히려면 헌법 개정이나 국민투표가 필요하다는 분석이 나온다[8].'
        ]
      },
      {
        heading:'한국 배터리 공급망에 의미하는 것',
        easy:'한국 기업들은 남미 리튬을 직접 캐거나 장기 계약으로 사 오고 있습니다. 중국산 의존을 줄이는 데 도움이 되지만, 현지 정책과 가격 변화의 위험도 함께 떠안게 됩니다.',
        paragraphs:[
          '포스코는 2018년 아르헨티나 옴브레 무에르토 염호 북부 광권을 확보했고, 2025년 11월 5일에는 같은 염호 일부 광권을 가진 현지 회사를 6,500만 달러에 100% 인수했다[6]. 포스코는 현지 법인 포스코 아르헨티나를 통해 수산화리튬 공장을 짓고 있으며, 2026년 리튬 생산능력을 9만 3,000톤으로 끌어올리겠다는 목표를 밝혔다[6]. RIGI 승인으로 살 데 오로 사업은 연 3억 달러 안팎의 수출을 기대하고 있다[5].',
          'LG에너지솔루션은 2023년 7월 SQM과의 공급 계약 물량을 2029년까지 10만 톤 이상(탄산리튬·수산화리튬)으로 늘렸는데, 이는 2021년 계약 물량 5만 5,000톤의 거의 두 배다[7]. 칠레에서 SQM의 아타카마 사업이 코델코 과반 합작사로 넘어가도 생산이 2060년까지 이어지도록 설계된 만큼, 장기 구매자에게는 공급 연속성 측면의 불확실성이 줄었다고 볼 수 있다[3].',
          '다만 한국 기업이 체감할 위험도 분명하다. 2025년 리튬 계약가격 하락은 신규 광산 수익성을 압박하고[1], 아르헨티나의 혜택은 RIGI 가입 기간과 정권의 정책 지속성에 기대고 있으며[4], 볼리비아는 기존 계약 재검토와 헌법 문제로 신규 진입 시점을 예측하기 어렵다[8].'
        ]
      }
    ],
    deepDive:{
      heading:'자원량·매장량·생산량을 구분해 읽어야 하는 이유',
      paragraphs:[
        '“삼각지대가 세계 리튬의 절반을 가졌다”는 식의 문장은 어떤 숫자를 기준으로 하느냐에 따라 크게 달라집니다. USGS 기준으로 세 나라는 자원량 1억 5,000만 톤 가운데 6,400만 톤을 차지하지만, 매장량 3,700만 톤에서는 칠레와 아르헨티나 합계 1,360만 톤이고 볼리비아는 수치가 없습니다[1]. 볼리비아의 2,300만 톤은 경제성이 확인되지 않은 자원량이라는 점을 기억해야 합니다[1].',
        '단위도 주의해야 합니다. USGS 생산량은 리튬 금속 함량 기준이고, 기업 발표는 대개 탄산리튬(LCE) 기준이어서 같은 프로젝트라도 숫자가 몇 배 차이 납니다[1][3]. 또 USGS의 2025년 국가별 수치는 추정치(e)여서 이후 개정될 수 있습니다[1].',
        '제도 평가도 논쟁적입니다. 칠레 모델은 국가 통제를 강화하지만 운영 경험이 있는 민간과의 합작에 기대고 있고[3], 아르헨티나 RIGI는 투자를 빠르게 끌어들이는 대신 30년간 세수와 외환 통제 수단을 일부 포기하는 구조입니다[4]. 볼리비아는 2026년 1월 기준 계약 재검토 결과가 공개되지 않아 방향을 단정하기 어렵습니다[8].'
      ]
    },
    keyFacts:[
      {label:'삼각지대 자원량',value:'아르헨티나 2,800만t·볼리비아 2,300만t·칠레 1,300만t',source:1},
      {label:'2025년 세계 리튬 생산(추정)',value:'약 29만t(리튬 함량)',source:1},
      {label:'코델코–SQM 합작 지분',value:'코델코 50%+1주, 2060년까지',source:3},
      {label:'포스코 살 데 오로 RIGI 사업',value:'약 8억 3,900만 달러·연 2만 3,000t LCE',source:5}
    ],
    questions:[
      '리튬 자원량과 매장량은 어떻게 다르고, 볼리비아에 매장량 수치가 없는 이유는 무엇인가요?',
      '칠레의 코델코–SQM 합작은 운영권과 지분을 시기별로 어떻게 나누나요?',
      '아르헨티나 RIGI가 투자자에게 보장하는 핵심 혜택 세 가지는 무엇인가요?',
      '내가 한국 양극재 기업의 구매 담당자라면 남미 리튬 장기 계약에서 어떤 위험 조항을 점검해야 할까요?'
    ],
    thoughts:[
      '자원 보유국이 국가 지분을 늘리는 전략과 세금을 낮춰 외국 자본을 부르는 전략 가운데, 장기적으로 어느 쪽이 지역 경제에 더 이로울까요?',
      '리튬 가격이 낮은 시기에 해외 광산 투자를 늘리는 것은 기회일까요, 위험일까요?'
    ],
    sources:[
      {title:'Mineral Commodity Summaries 2026: Lithium',publisher:'U.S. Geological Survey',year:'2026',url:'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-lithium.pdf',kind:'통계'},
      {title:'Cámara analizó Estrategia Nacional del Litio',publisher:'Cámara de Diputados de Chile',year:'2023',url:'https://www.camara.cl/cms/2023/12/19/camara-analizo-estrategia-nacional-del-litio/',kind:'공식 자료'},
      {title:'SQM’s Atacama lithium operation secured to 2060 with Codelco partnership approval',publisher:'Benchmark Mineral Intelligence',year:'2026',url:'https://source.benchmarkminerals.com/article/sqm-atacama-lithium-operation-secured-to-2060-with-codelco-partnership-approval',kind:'보도'},
      {title:'Síntesis del Régimen de Incentivo para Grandes Inversiones (RIGI)',publisher:'Cancillería Argentina',year:'2024',url:'https://esing.cancilleria.gob.ar/userfiles/2024-07-11_dnpri_sintesis_rigi_es_final.pdf',kind:'공식 자료'},
      {title:'Argentina’s RIGI backs gas pipeline, POSCO lithium project',publisher:'Industrial Info Resources',year:'2026',url:'https://www.industrialinfo.com/news/article/argentinas-rigi-backs-gas-pipeline-posco-lithium-project--358773',kind:'보도'},
      {title:'Posco to invest $818 million in lithium deals with Australia, Argentina',publisher:'Korea JoongAng Daily',year:'2025',url:'https://www.koreajoongangdaily.com/business/posco-to-invest-818-million-in-lithium-deals-with-australia-argentina/11941550',kind:'보도'},
      {title:'LG Energy Solution nearly doubles lithium order from SQM',publisher:'electrive',year:'2023',url:'https://www.electrive.com/2023/07/07/lg-energy-solution-nearly-doubles-lithium-order-from-sqm',kind:'보도'},
      {title:'New president, new policy: Bolivia’s shift against lithium protectionism',publisher:'Mining Technology',year:'2026',url:'https://www.mining-technology.com/features/new-president-new-policy-bolivias-shift-against-lithium-protectionism/',kind:'보도'}
    ]
  },
  {
    id:'public-health-explainer',
    industry:'health',
    topic:'public-health',
    regions:['GLOBAL','S_AMERICA','BR','AR'],
    type:'news',
    title:'2024년 1,300만 명 기록 뒤 2026년 59% 감소…중남미 뎅기열, 브라질 ‘1회 접종 백신’이 시험대에',
    dek:'범미보건기구(PAHO)에 따르면 2026년 1~30주 미주 지역 뎅기열 의심 환자는 약 150만 명으로 전년 같은 기간보다 59% 줄었습니다. 브라질은 2026년 1월 세계 최초의 1회 접종 뎅기 백신 Butantan-DV 접종을 시작해, 유행이 잦아든 지금이 다음 파도에 대비할 시기라는 평가가 나옵니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'뎅기열',meaning:'이집트숲모기 등이 옮기는 바이러스 감염병으로, 고열·근육통이 나타나며 일부는 출혈과 쇼크를 동반한 중증으로 진행합니다.'},
      {term:'혈청형(DENV-1~4)',meaning:'뎅기 바이러스의 네 가지 유형으로, 한 유형에 걸린 뒤 다른 유형에 감염되면 중증 위험이 커질 수 있습니다.'},
      {term:'치명률(CFR)',meaning:'환자 가운데 사망한 사람의 비율입니다.'},
      {term:'역학주(EW)',meaning:'감염병 통계를 집계하는 주 단위로, 그해 1주부터 번호를 매깁니다.'},
      {term:'Butantan-DV',meaning:'브라질 부탄탄 연구소가 개발한 1회 접종 뎅기 백신으로, 2025년 11월 브라질 보건규제청(ANVISA)의 승인을 받았습니다.'}
    ],
    pages:[
      {
        heading:'2024년의 기록적 유행, 그리고 급격한 감소',
        easy:'2024년 미주 지역에서는 뎅기열 환자가 역사상 가장 많이 나왔습니다. 그 뒤 2025년과 2026년에는 환자가 크게 줄었지만, 네 가지 바이러스 유형이 함께 돌고 있어 안심하기는 이릅니다.',
        paragraphs:[
          'PAHO는 2024년 12월 10일 기준 미주·카리브 지역의 뎅기열 의심 환자가 1,260만 명으로 전년의 약 세 배에 이르렀고, 사망자는 7,700명 이상으로 2023년(2,467명)보다 200% 넘게 늘었다고 밝혔다[3]. 이는 1980년 집계 시작 이후 최대치였으며, 국가별로는 브라질 1,000만 명 이상, 아르헨티나 58만 명 이상, 멕시코 50만 명 이상이었다[3]. 자르바스 바르보사 PAHO 사무국장은 기온 상승과 가뭄·홍수 같은 기후 현상을 주요 원인으로 지목했다[3].',
          'PAHO가 2026년 2월 20일 발표한 갱신 자료에 따르면 2025년 미주 지역 의심 환자는 445만 9,521명, 사망자는 2,207명(치명률 0.05%)으로, 연간 1,300만 명을 넘긴 2024년보다 환자는 66%, 사망자는 74% 줄었다[1]. 중증 뎅기는 8,966건이었다[1].',
          '2026년 들어 감소세는 더 뚜렷하다. PAHO 상황 보고서에 따르면 2026년 1~30주 누적 의심 환자는 149만 9,496명, 사망자 458명(치명률 0.031%)으로, 2025년 같은 기간보다 59%, 최근 5년 평균보다 66% 적었다[2]. 다만 브라질·멕시코·파나마·베네수엘라에서는 네 가지 혈청형이 동시에 유행하고 있다[2].'
        ]
      },
      {
        heading:'브라질의 백신 실험: 2회 접종 Qdenga에서 1회 접종 Butantan-DV로',
        easy:'브라질은 공공의료 체계에서 뎅기 백신을 무료로 접종한 첫 나라입니다. 2024년에는 일본산 2회 접종 백신을 아이들에게 놓기 시작했고, 2026년에는 자국에서 개발한 1회 접종 백신을 어른에게도 넓히고 있습니다.',
        paragraphs:[
          '브라질은 2024년 2월 9일 다케다의 Qdenga 백신으로 10~14세 어린이 접종을 시작했으며, 520만 회분을 구매하고 132만 회분을 무상으로 추가 공급받기로 했다[6]. 당시 2024년 첫 5주 동안 보고된 환자는 36만 4,855명으로 전년 같은 기간의 약 네 배였다[6].',
          '브라질 보건규제청(ANVISA)은 2025년 11월 26일 부탄탄 연구소의 Butantan-DV를 12~59세 대상으로 승인했고, 이는 세계 첫 1회 접종 뎅기 백신이다[4]. 8년간 1만 6,000명 이상이 참여한 임상시험에서 중증 뎅기 예방 효과는 91.6%로 보고됐다[4]. 브라질 정부는 중국 우시(WuXi)와의 협력을 통해 2026년 하반기에 약 3,000만 회분을 확보할 계획이라고 밝혔다[4].',
          '실제 접종은 2026년 1월 17일 세아라주 마랑과페와 미나스제라이스주 노바리마에서 시작됐고, 1월 18일 상파울루주 보투카투로 이어졌다[5]. 보건부는 세 도시의 15~59세 주민 절반 이상에게 접종해 효과를 평가하고, 1차 보건 인력에게도 우선 공급한 뒤 생산이 늘면 59세부터 연령을 낮춰가며 대상을 넓힐 계획이다[5].'
        ]
      },
      {
        heading:'아르헨티나와 한국 여행자에게 의미하는 것',
        easy:'남미 남쪽의 아르헨티나도 2024년 큰 유행을 겪었지만, 이번 시즌에는 환자가 크게 줄었습니다. 한국에서는 동남아에서 걸려 오는 경우가 대부분이지만, 남미 여행자도 모기 예방은 필수입니다.',
        paragraphs:[
          '아르헨티나 보건부 「국가역학회보」 제814호에 따르면 2025/26 시즌 누적 의심 환자는 2만 7,178명이었고, 실험실 확진은 69명(DENV-1·2·3 검출)에 그쳐 저위험 시나리오로 분류됐다[7]. 2024년 58만 명 이상이 보고됐던 것과 비교하면 크게 줄어든 수치다[3][7].',
          'PAHO는 감소 국면에서도 역학·임상·실험실·매개체 감시를 통합하고, 의료기관을 포함한 고위험 지역에서 모기 방제를 강화하며, 심한 복통·지속적 구토·점막 출혈 같은 경고 징후를 조기에 파악하라고 권고했다[1].',
          '한국에서는 2024년 해외 유입 뎅기열 환자가 196명으로 집계됐고, 주요 감염 지역은 필리핀·베트남·태국·인도네시아 등 동남아와 인도·방글라데시 등 남아시아였다[8]. 서울시는 출국 전 질병관리청 「해외감염병NOW」에서 현지 상황을 확인하고, 귀국 후 2주 안에 발열·발진·두통·관절통이 나타나면 여행 이력을 알리고 진료를 받으라고 안내한다[8].'
        ]
      }
    ],
    deepDive:{
      heading:'“59% 감소”를 읽을 때 주의할 점',
      paragraphs:[
        'PAHO 통계의 대부분은 의심 환자입니다. 2026년 1~30주 의심 환자 가운데 실험실 확진 비율은 30.4%에 그치며, 보고서는 국가별 신고가 수정될 수 있는 잠정치라고 밝히고 있습니다[2]. 나라마다 검사 역량과 신고 기준이 달라 국가 간 단순 비교에도 한계가 있습니다[2].',
        '감소의 원인도 하나로 단정하기 어렵습니다. 대유행 뒤에는 많은 사람이 특정 혈청형에 면역을 얻어 일시적으로 환자가 줄 수 있지만, 여러 혈청형이 동시에 돌면 다음 유행에서 중증 위험이 커질 수 있습니다[2]. PAHO가 2024년 기록의 배경으로 기후 요인을 꼽은 만큼 날씨에 따라 다시 반등할 가능성도 있습니다[3].',
        '백신의 실제 효과는 아직 평가 중입니다. Butantan-DV의 91.6%는 임상시험 수치이고[4], 브라질 보건부는 세 도시 집중 접종으로 현장 효과를 확인하려 하고 있어[5], 대규모 확대 이후 성과는 2026년 하반기 이후 자료를 봐야 판단할 수 있습니다.'
      ]
    },
    keyFacts:[
      {label:'2024년 미주 뎅기 의심 환자',value:'1,260만 명(12월 10일 기준)',source:3},
      {label:'2025년 미주 환자·사망',value:'445만 9,521명·2,207명',source:1},
      {label:'2026년 1~30주 환자',value:'149만 9,496명(전년 대비 −59%)',source:2},
      {label:'Butantan-DV 승인',value:'2025년 11월 26일, 12~59세',source:4}
    ],
    questions:[
      '2024년 미주 지역 뎅기열 유행이 역대 최대였다고 평가되는 근거는 무엇인가요?',
      '2회 접종 Qdenga와 1회 접종 Butantan-DV는 접종 대상과 방식이 어떻게 다른가요?',
      '의심 환자와 확진 환자 통계의 차이는 감소 추세 해석에 어떤 영향을 주나요?',
      '내가 남미 출장을 앞둔 직장인이라면 출국 전후로 무엇을 확인해야 할까요?'
    ],
    thoughts:[
      '환자가 줄어든 시기에 백신 접종에 예산을 쓰는 것은 효율적인 선택일까요?',
      '기후 변화로 모기 매개 감염병의 범위가 넓어진다면, 한국의 감시 체계는 무엇을 준비해야 할까요?'
    ],
    sources:[
      {title:'PAHO updates dengue situation in the Americas, recommends strengthened surveillance and health system preparedness',publisher:'Pan American Health Organization',year:'2026',url:'https://www.paho.org/en/news/20-2-2026-paho-updates-dengue-situation-americas-recommends-strengthened-surveillance-and',kind:'공식 자료'},
      {title:'Situation Report: Dengue in the Americas, Epidemiological Week 30, 2026',publisher:'Pan American Health Organization',year:'2026',url:'https://www.paho.org/sites/default/files/2026/09/2026-cde-dengue-sitrep-americas-epi-week-30-aug.pdf',kind:'통계'},
      {title:'Dengue cases set a new record in the Americas this year as deaths also surge',publisher:'Associated Press (KPRC 재게재)',year:'2024',url:'https://www.click2houston.com/health/2024/12/10/dengue-cases-set-a-new-record-in-the-americas-this-year-as-deaths-also-surge/',kind:'보도'},
      {title:'Brazil approves world’s first single-dose dengue vaccine',publisher:'Malay Mail (AFP)',year:'2025',url:'https://malaymail.com/news/life/2025/11/27/brazil-approves-worlds-first-single-dose-dengue-vaccine/199811',kind:'보도'},
      {title:'Vacina de dose única do Butantan contra dengue começa a ser aplicada em 17 de janeiro',publisher:'SBT News',year:'2026',url:'https://sbtnews.sbt.com.br/noticia/saude/vacina-de-dose-unica-do-butantan-contra-dengue-comeca-a-ser-aplicada-em-17-de-janeiro',kind:'보도'},
      {title:'Brazil commences nationwide vaccination after dengue virus surge',publisher:'ITIJ',year:'2024',url:'https://www.itij.com/latest/news/brazil-commences-nationwide-vaccination-after-dengue-virus-surge',kind:'보도'},
      {title:'Argentina reporta aumento de influenza A(H3N2) y mantiene el seguimiento sobre dengue y chikungunya',publisher:'ConsultorSalud',year:'2026',url:'https://consultorsalud.com/argentina-influenza-ah3n2-dengue-chikungunya/',kind:'보도'},
      {title:'[2025년 7월호] 해외 모기매개 바이러스감염병',publisher:'서울특별시 복지분야 누리집',year:'2025',url:'https://news.seoul.go.kr/welfare/archives/572159',kind:'공식 자료'}
    ]
  },
  {
    id:'earth-explainer',
    industry:'science',
    topic:'earth',
    regions:['GLOBAL','S_AMERICA','BR'],
    type:'research',
    title:'아마존 벌채 4년 연속 감소, 경보는 2016년 이후 최저…그래도 ‘2050년 숲의 10~47% 위험’ 경고가 유효한 이유',
    dek:'브라질 국립우주연구소(INPE) 집계로 2025년 아마존 벌채 면적은 5,796㎢로 줄었고, 2025년 8월~2026년 7월 실시간 경보 면적은 2,874㎢로 관측 이래 최저였습니다. 하지만 2024년 「네이처」 논문은 온난화와 가뭄이 겹치면 2050년까지 숲의 10~47%가 되돌리기 어려운 변화에 노출될 수 있다고 경고합니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'PRODES',meaning:'INPE가 위성영상으로 매년 8월~이듬해 7월의 아마존 개벌 면적을 산출하는 공식 연간 통계입니다.'},
      {term:'DETER',meaning:'INPE의 실시간 벌채 경보 시스템으로, 단속용 신속 자료여서 PRODES보다 덜 정밀합니다.'},
      {term:'티핑 포인트(임계점)',meaning:'작은 변화가 쌓이다 어느 선을 넘으면 시스템이 다른 상태로 급격히, 때로는 되돌릴 수 없게 바뀌는 지점입니다.'},
      {term:'TFFF(열대우림 영구기금)',meaning:'브라질이 제안한 기금으로, 숲을 보존한 열대우림 국가에 헥타르당 성과급을 지급하는 구조입니다.'},
      {term:'COP30',meaning:'2025년 11월 브라질 벨렝에서 열린 제30차 유엔기후변화협약 당사국총회입니다.'}
    ],
    pages:[
      {
        heading:'숫자로 본 아마존: 벌채는 줄고 있다',
        easy:'브라질 아마존에서 나무를 베어내는 면적이 몇 년째 줄고 있습니다. 위성으로 감시하는 경보 시스템에서도 최근 1년간 경보 면적이 관측 시작 이후 가장 작았습니다.',
        paragraphs:[
          'INPE의 PRODES 집계에 따르면 2025년 브라질 아마존 벌채 면적은 5,796㎢로 2024년 6,518㎢보다 11.08% 줄었고, 4년 연속 감소했다[1]. 최근 정점이던 2021년 1만 3,038㎢와 비교하면 절반 이하 수준이다[1]. 같은 기간 세하두(사바나) 벌채도 7,235㎢로 11.49% 감소했다[1].',
          '실시간 경보 시스템 DETER로 보면 2025년 8월~2026년 7월 아마존 경보 면적은 2,874.38㎢로 직전 주기(4,495㎢)보다 36.87% 줄어 2016년 시계열 시작 이후 가장 낮았다[2]. 주별로는 파라 987㎢(−25.5%), 마투그로수 834㎢(−49%), 아마조나스 434㎢(−46.7%)가 줄었지만, 호라이마는 273㎢로 32.5% 늘었다[2].',
          '이 수치는 2026년 8월 7일 INPE 창립 65주년 행사에서 공개됐다[2]. 루이스 이나시우 룰라 다시우바 대통령은 미국이 브라질 벌채를 추가 관세의 근거로 든 데 대해 INPE 자료를 미국에 보낼 서한에 포함하겠다고 말했다[2].'
        ]
      },
      {
        heading:'2024년 「네이처」 논문이 말하는 티핑 포인트',
        easy:'과학자들은 숲이 일정 수준 이상 망가지면 스스로 회복하지 못하고 풀밭처럼 변할 수 있다고 걱정합니다. 2024년 큰 국제 연구는 벌채뿐 아니라 더위와 가뭄이 함께 숲을 압박한다고 분석했습니다.',
        paragraphs:[
          '베르나르두 플로레스 등 국제 연구진은 2024년 2월 15일 「네이처」 626권에 「아마존 숲 시스템의 임계 전이」를 발표했다[3]. 연구진은 아마존 숲이 6,500만 년 동안 기후 변동에 비교적 강했지만, 지금은 수분 스트레스를 일으키는 다섯 가지 주요 요인이 겹치며 임계점에 가까워질 가능성이 있다고 분석했다[3].',
          '논문은 2050년까지 아마존 숲의 10~47%가 복합적인 교란에 노출될 것으로 추정하고, 앞으로 숲이 밟을 수 있는 세 가지 생태계 경로를 제시했다[3]. 위트레흐트대는 이 연구가 지구 온난화, 지역 강수 조건, 누적 벌채라는 스트레스 요인이 상호작용해 숲의 손실을 가속할 수 있다는 점을 보여준다고 설명했다[4].',
          '연구진의 처방은 두 갈래다. 현지에서는 벌채와 숲 황폐화를 끝내고 복원을 늘려야 하며, 지구 차원에서는 온실가스 배출을 멈춰야 한다는 것이다[3]. 즉 브라질의 벌채 감소만으로는 충분하지 않고, 기온과 강수 변화라는 외부 압력도 함께 줄어야 한다는 뜻이다[3][4].'
        ]
      },
      {
        heading:'COP30 벨렝: 숲 기금은 출범했지만 로드맵은 빠졌다',
        easy:'2025년 11월 아마존 도시 벨렝에서 열린 유엔 기후총회에서 숲을 지키는 나라에 돈을 주는 새 기금이 출범했습니다. 하지만 벌채를 멈추기 위한 공식 일정표는 최종 합의문에 들어가지 못했습니다.',
        paragraphs:[
          'COP30은 2025년 11월 22일 벨렝에서 13일간의 일정을 마치고, 195개 참가국이 29개 문서로 이뤄진 「벨렝 패키지」를 만장일치로 채택했다[7]. 선진국은 2035년까지 적응 재원을 세 배로 늘리기로 했고, 기후 재원을 2035년까지 연 1조 3,000억 달러 이상으로 확대하자는 내용도 담겼다[7]. 반면 화석연료 퇴출 로드맵은 80~85개국이 지지했음에도 공식 합의문에서 빠졌다[7].',
          '열대우림 영구기금(TFFF)은 정상회의에서 55억 달러 이상의 출연 약속을 받고 53개국의 지지를 얻어 출범했으며, 세계은행이 수탁 기관을 맡는다[5]. 재원의 최소 20%는 원주민과 지역 공동체에 배정된다[5]. 회의 종료 무렵 COP30 의장단 집계로 지지국은 63개국 이상, 동원 금액은 67억 달러로 늘었다[7].',
          '그러나 TFFF는 후원국 자본 250억 달러로 민간 자금 약 1,000억 달러를 끌어들여 총 1,250억 달러를 조성하는 구상인데, COP30까지 확보한 금액은 초기 필요액의 4분의 1에 못 미쳤다[6]. 국가별로는 노르웨이 30억 달러(조건부·10년 분할), 독일 11억 5,000만 달러, 인도네시아 10억 달러, 프랑스 5억 7,700만 달러를 약속했으며, 보존된 숲 1헥타르당 연 4달러를 지급하는 방식이다[6]. 벌채 감축 로드맵은 화석연료 문구와 얽히며 최종 선언에서 제외됐다[6].'
        ]
      }
    ],
    deepDive:{
      heading:'PRODES·DETER 수치와 티핑 포인트 추정의 한계',
      paragraphs:[
        'PRODES와 DETER는 목적이 다릅니다. PRODES는 연간 공식 벌채 통계이고 DETER는 단속을 위한 신속 경보여서, 2026년 8월 발표된 DETER 감소율(36.87%)을 PRODES 연간 감소율과 같은 것으로 읽으면 안 됩니다[1][2]. 같은 PRODES 2025 결과도 보도 시점에 따라 아마존 감소율이 11.08%[1] 또는 15.8%[2]로 다르게 인용되는데, 예비치와 확정치의 차이일 가능성이 있지만 이 기사들만으로는 확인되지 않습니다.',
        '「네이처」 논문의 10~47%는 범위가 넓은 추정치입니다. 연구진은 여러 스트레스 요인의 임계값을 기존 문헌에서 종합했으며, 특정 시점에 숲 전체가 한꺼번에 무너진다고 예측한 것이 아니라 국지적으로 되돌리기 어려운 변화가 일어날 수 있는 면적을 제시했습니다[3][4].',
        'TFFF의 성과는 아직 평가하기 이릅니다. 출연 약속 중 상당 부분이 조건부이고[6], 브라질은 2026년 COP 의장국 임기 말까지 100억 달러를 모으겠다는 목표를 제시한 상태입니다[6]. 한국 독자에게는 기후 재원과 공급망 규제가 강화되는 흐름 속에서, 브라질산 원자재를 쓰는 기업이 벌채와의 연관성을 설명해야 하는 상황이 늘 수 있다는 점이 관전 포인트입니다.'
      ]
    },
    keyFacts:[
      {label:'2025년 아마존 벌채(PRODES)',value:'5,796㎢(−11.08%)',source:1},
      {label:'2025.8~2026.7 경보(DETER)',value:'2,874㎢, 2016년 이후 최저',source:2},
      {label:'2050년 교란 노출 숲 비율',value:'10~47%',source:3},
      {label:'TFFF 출범 출연 약속',value:'55억 달러 이상, 53개국 지지',source:5}
    ],
    questions:[
      'PRODES와 DETER는 각각 무엇을 측정하며, 왜 수치가 다른가요?',
      '플로레스 등의 연구가 벌채 외에 주목한 스트레스 요인은 무엇인가요?',
      'TFFF는 기존의 숲 보전 원조와 어떻게 다른 방식으로 돈을 지급하나요?',
      '내가 브라질산 대두나 소고기를 수입하는 회사 담당자라면, 벌채 관련 공급망 위험을 어떻게 점검할 수 있을까요?'
    ],
    thoughts:[
      '벌채가 줄고 있는데도 아마존 티핑 포인트를 걱정해야 한다면, 국제사회의 책임은 어디까지일까요?',
      '숲을 지킨 나라에 성과급을 주는 TFFF 방식은 공정하고 지속 가능한 해법일까요?'
    ],
    sources:[
      {title:'Desmatamento na Amazônia em 2025 caiu 11,08% em relação a 2024, afirma Prodes/Inpe',publisher:'O Liberal',year:'2026',url:'https://www.oliberal.com/variedades/desmatamento-na-amazonia-em-2025-caiu-11-08-em-relacao-a-2024-afirma-prodes-inpe-1.1084212',kind:'보도'},
      {title:'Amazon deforestation falls 36.87% over past year',publisher:'Agência Brasil',year:'2026',url:'https://agenciabrasil.ebc.com.br/en/meio-ambiente/noticia/2026-08/amazon-deforestation-falls-3687-over-past-year',kind:'보도'},
      {title:'Critical transitions in the Amazon forest system (Nature 626, 555–564)',publisher:'Potsdam Institute for Climate Impact Research (PIK) Publications',year:'2024',url:'https://publications.pik-potsdam.de/pubman/item/item_29520',kind:'학술 자료'},
      {title:'Is the Amazon forest approaching a tipping point?',publisher:'Utrecht University',year:'2024',url:'https://www.uu.nl/en/news/is-the-amazon-forest-approaching-a-tipping-point',kind:'보도'},
      {title:'Over USD 5.5 billion announced for Tropical Forest Forever Facility as 53 countries endorse historic launch declaration',publisher:'IICA',year:'2025',url:'https://opsaa.iica.int/en/resource-2371-over-usd-5.5-billion-announced-for-tropical-forest-forever-facility-as-53-countries-endorse-historic-launch-declaration',kind:'공식 자료'},
      {title:'COP30 Debuts Forest Fund, Absent from Final Declaration',publisher:'Mexico Business News',year:'2025',url:'https://mexicobusiness.news/sustainability/news/cop30-debuts-forest-fund-absent-final-declaration',kind:'보도'},
      {title:'COP30: key outcomes of the summit',publisher:'ANBA',year:'2025',url:'https://anba.com.br/en/cop30-key-outcomes-of-the-summit/',kind:'보도'}
    ]
  },
  {
    id:'agriculture-explainer',
    industry:'food',
    topic:'agriculture',
    regions:['GLOBAL','S_AMERICA','BR','AR','CN','KR'],
    type:'article',
    title:'중국 대두 수입의 74%는 브라질산…곡물 강국 브라질·아르헨티나가 바꾸는 세계 식량 지도',
    dek:'브라질은 2025/26 시즌 대두 1억 8,060만 톤으로 사상 최대 수확을 기록했고, 중국은 2025년 대두 수입의 73.6%를 브라질에서 들여왔습니다. 아르헨티나는 세계 최대 대두박·대두유 수출국 자리를 지키며 수출세를 낮추고 있어, 사료 원료를 수입하는 한국도 남미 작황을 더 주의 깊게 볼 필요가 있습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'CONAB',meaning:'브라질 국가식량공급공사로, 매달 작황 조사(레반타멘투)를 발표하는 공식 기관입니다.'},
      {term:'WASDE',meaning:'미국 농무부(USDA)가 매달 내는 세계 농산물 수급 전망 보고서입니다.'},
      {term:'대두박',meaning:'대두에서 기름을 짜고 남은 부산물로, 단백질이 풍부해 가축 사료의 핵심 원료로 쓰입니다.'},
      {term:'수출세(레텐시온)',meaning:'아르헨티나가 곡물 등 수출품에 매기는 세금으로, 농가 수익과 수출 경쟁력에 직접 영향을 줍니다.'},
      {term:'LMO',meaning:'유전자변형생물체로, 한국이 수입하는 사료용 옥수수와 대두의 상당 부분이 여기에 해당합니다.'}
    ],
    pages:[
      {
        heading:'숫자로 본 남미 곡창: 브라질은 기록 경신, 아르헨티나는 가공품 강자',
        easy:'브라질은 세계에서 콩(대두)을 가장 많이 생산하고 수출하는 나라 가운데 하나이고, 해마다 기록을 다시 쓰고 있습니다. 아르헨티나는 콩을 그대로 팔기보다 기름과 사료용 찌꺼기로 가공해 수출하는 데 강합니다.',
        paragraphs:[
          'CONAB의 10차 작황 조사(2026년 7월)에 따르면 브라질의 2025/26 시즌 곡물 생산량은 3억 6,010만 톤으로 전년보다 2.2% 늘어 사상 최대였다[1]. 이 가운데 대두는 1억 8,057만 톤으로 2024/25 시즌(1억 7,150만 톤)보다 5.3% 늘어난 역대 최대였고, 옥수수는 1억 4,173만 톤으로 0.4% 증가했다[1]. 재배 면적도 8,354만 헥타르로 사상 최대였다[1].',
          'USDA는 2026년 8월 12일 WASDE에서 브라질의 2026/27 시즌 대두 생산을 1억 8,600만 톤, 수출을 1억 1,800만 톤으로 전망했고, 대두 재배 면적은 4,910만 헥타르에서 5,050만 헥타르로 늘 것으로 봤다[3]. 같은 시즌 브라질 옥수수 생산은 1억 3,400만 톤, 수출은 4,400만 톤으로 전망됐다[3].',
          '아르헨티나 로사리오 곡물거래소는 2025년 10월 15일 2025/26 시즌 밀 2,300만 톤, 옥수수 6,100만 톤(사상 최대), 대두 4,700만 톤을 예상했다[5]. USDA 부에노스아이레스 주재관은 2026/27 시즌 아르헨티나 대두 생산을 4,900만 톤, 대두박 수출을 3,000만 톤, 대두유 수출을 630만 톤으로 전망하며 아르헨티나가 세계 최대 대두박·대두유 수출국 지위를 유지할 것으로 봤다[6].'
        ]
      },
      {
        heading:'중국의 선택: 미국 대신 브라질',
        easy:'세계에서 콩을 가장 많이 사는 나라는 중국입니다. 미국과의 무역 갈등 속에서 중국은 브라질 콩을 훨씬 더 많이 사게 됐고, 미국산 비중은 크게 줄었습니다.',
        paragraphs:[
          '중국 해관 자료에 따르면 중국의 2025년 대두 수입은 사상 최대인 1억 1,182만 톤으로 전년보다 6.5% 늘었다[4]. 이 가운데 브라질산은 8,233만 톤으로 10.3% 증가해 비중이 2024년 71%에서 73.6%로 높아졌고, 미국산은 1,680만 톤으로 24.1% 줄었으며, 아르헨티나산은 789만 톤으로 92.3% 늘었다[4].',
          'USDA는 관세 때문에 2025년 6~11월 미국산 대두의 대중국 수출이 사실상 끊겼고, 2025/26 시즌 미국 대두 수출이 세계 대두 교역의 23%로 역대 최저 비중을 기록했다고 분석했다[2]. 2021/22~2023/24 시즌 중국의 미국산 대두 수입이 평균 2,870만 톤이었던 것과 대비된다[2].',
          '2025년 10월 미·중 무역 합의로 중국은 2026~2028년 매년 최소 2,500만 톤의 미국산 대두를 사기로 했다[2]. 그러나 중국은 미국산 대두에 13%, 브라질산에는 최혜국 세율 3%를 적용하고 있어, 관세 격차가 중국의 수입선을 브라질에 묶어둘 가능성이 크다는 분석이 나온다[4]. 2026년 2월 12일 USDA 자료 기준 중국이 10월 30일 이후 예약한 미국산 대두는 1,017만 톤으로 전년 대비 50.7% 적었다[4].'
        ]
      },
      {
        heading:'아르헨티나의 수출세 인하와 한국 사료 시장',
        easy:'아르헨티나는 농산물 수출에 붙이던 세금을 단계적으로 낮추고 있어 앞으로 수출이 더 늘 수 있습니다. 한국은 가축 사료용 옥수수를 대부분 수입하는데, 그 일부가 아르헨티나와 브라질에서 옵니다.',
        paragraphs:[
          '아르헨티나는 2025년 9월 곡물 수출세를 일시적으로 없앴고, 이 때문에 2025년 11월 계절과 반대되는 수출 급증이 나타났다[2]. 루이스 카푸토 경제장관은 2026년 5월 현재 24%인 대두 수출세를 2027년 말 21%, 2028년 말 15%로 낮추고, 옥수수는 8.5%에서 2028년 말 5.5%로 낮추는 일정을 발표했다[7]. 카푸토 장관은 수출세를 0으로 만드는 것이 최종 목표라고 말했다[7].',
          '한국생명공학연구원 바이오안전성정보센터의 「2025년 LMO 주요 통계」에 따르면 한국의 2025년 LMO 수입승인 물량은 1,089만 1,000톤(약 28억 8,500만 달러)으로, 이 가운데 사료용 옥수수가 910만 5,000톤이었다[8]. 수입국별로는 미국 859만 톤(78.9%), 아르헨티나 120만 9,000톤(11.1%), 브라질 103만 톤(9.5%)이었다[8].',
          '따라서 남미 두 나라는 한국 LMO 곡물 수입의 약 20%를 차지하는 보조 공급원이다[8]. 중국이 브라질 대두를 대량으로 흡수하고[4] 아르헨티나가 수출세를 낮추는 흐름[7]은 한국 사료업계에 가격과 조달선 다변화 측면의 변수가 된다.'
        ]
      }
    ],
    deepDive:{
      heading:'작황 전망 수치를 비교할 때의 함정',
      paragraphs:[
        '브라질 대두 생산량은 기관마다 다르게 나옵니다. CONAB은 2025/26 시즌을 1억 8,057만 톤으로[1], USDA는 1억 7,800만 톤으로 집계해[3] 약 260만 톤 차이가 납니다. 기관마다 조사 방식과 발표 시점이 다르므로, 두 기관 수치를 섞어 증감률을 계산하면 오해가 생길 수 있습니다.',
        '중국의 미국산 대두 구매 약속도 해석에 주의가 필요합니다. USDA는 연 2,500만 톤 구매를 무역 합의 내용으로 제시하지만[2], 실제 예약 물량은 2026년 2월 기준 전년보다 절반가량 적었고 관세 격차도 남아 있습니다[4].',
        '한국 자료의 한계도 있습니다. LMO 통계는 수입 “승인” 물량이어서 실제 통관 물량과 다를 수 있고, 비유전자변형 곡물이나 대두박 같은 가공품은 포함되지 않습니다[8]. 남미 의존도를 정확히 보려면 관세청 품목별 수입 통계와 함께 봐야 합니다.'
      ]
    },
    keyFacts:[
      {label:'브라질 2025/26 대두 생산(CONAB)',value:'1억 8,057만t(+5.3%)',source:1},
      {label:'중국 2025년 대두 수입 중 브라질 비중',value:'73.6%(8,233만t)',source:4},
      {label:'아르헨티나 대두 수출세',value:'24% → 2028년 말 15%',source:7},
      {label:'한국 LMO 수입 중 남미 비중',value:'아르헨티나 11.1%·브라질 9.5%',source:8}
    ],
    questions:[
      '중국의 대두 수입선이 미국에서 브라질로 옮겨간 주된 이유는 무엇인가요?',
      '아르헨티나가 대두 원물보다 대두박·대두유 수출에 강한 이유는 무엇일까요?',
      'CONAB과 USDA의 브라질 생산 전망이 다른 이유는 무엇인가요?',
      '내가 한국 사료회사의 원료 구매 담당자라면 남미 작황과 아르헨티나 수출세 변화를 어떻게 구매 전략에 반영할까요?'
    ],
    thoughts:[
      '세계 대두 교역이 브라질 한 나라에 집중되는 것은 식량 안보에 어떤 위험을 만들까요?',
      '한국이 사료 곡물 수입을 미국에 크게 의존하는 구조를 바꿔야 할까요, 아니면 효율적인 선택일까요?'
    ],
    sources:[
      {title:'10º Levantamento da safra de grãos 2025/26 (Conab), compilado pela FAESP',publisher:'FAESP/SENAR (Conab 자료)',year:'2026',url:'https://faespsenar.com.br/wp-content/uploads/2026/07/2026.07-10o-Levantamento-da-safra-de-graos_compressed.pdf',kind:'통계'},
      {title:'Grains and Oilseeds Outlook for 2026 (Agricultural Outlook Forum)',publisher:'U.S. Department of Agriculture',year:'2026',url:'https://www.usda.gov/sites/default/files/documents/2026AOF-grains-oilseeds-outlook.pdf',kind:'공식 자료'},
      {title:'USDA mantém previsão de 186 milhões de toneladas de soja no Brasil e aponta avanço do Matopiba',publisher:'Paraíba Business',year:'2026',url:'https://paraibabusiness.com.br/usda-mantem-previsao-de-186-milhoes-de-toneladas-de-soja-no-brasil-e-aponta-avanco-do-matopiba/',kind:'보도'},
      {title:'Tariff gap likely to keep China’s soybean imports anchored to Brazil',publisher:'S&P Global Commodity Insights',year:'2026',url:'https://www.spglobal.com/energy/en/news-research/latest-news/agriculture/021926-analysis-tariff-gap-likely-to-keep-chinas-soybean-imports-anchored-to-brazil',kind:'보도'},
      {title:'Argentina set for record wheat, corn yields in 2025/26',publisher:'Milling MEA (Reuters)',year:'2025',url:'https://millingmea.com/argentina-set-for-record-wheat-corn-yields-in-2025-26/',kind:'보도'},
      {title:'Argentina soybean production to be firm in 2026-27',publisher:'Glacier FarmMedia (AGCanada)',year:'2026',url:'https://www.agcanada.com/daily/argentina-soybean-production-to-be-firm-in-2026-27',kind:'보도'},
      {title:'Argentina to slash grain export taxes through 2028',publisher:'The Poultry Site (Reuters)',year:'2026',url:'https://www.thepoultrysite.com/news/2026/05/argentina-to-slash-grain-export-taxes-through-2028',kind:'보도'},
      {title:'韓, ‘유전자변형생물체’ 수입 1089만톤…옥수수 91% 차지',publisher:'헤럴드경제',year:'2026',url:'https://www.heraldk.com/article/2026040621463745117',kind:'보도'}
    ]
  }
];
