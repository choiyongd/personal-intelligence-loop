import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'nuclear-explainer',
    industry:'energy',
    topic:'nuclear',
    regions:['GLOBAL','EURASIA','KZ','RU','EUROPE','KR'],
    type:'article',
    title:'우라늄 채굴 39%는 카자흐스탄, 농축 44%는 러시아…원전 부활의 연료는 유라시아에 묶여 있다',
    dek:'원전 건설 붐이 다시 일고 있지만, 원자로에 들어갈 연료는 소수 국가에 몰려 있습니다. 카자흐스탄의 채굴, 러시아의 농축, 미국의 수입 금지, 그리고 한수원의 체코 두코바니 계약을 한 줄로 이어 봅니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'tU(우라늄 톤)',meaning:'우라늄 생산량을 우라늄 원소 무게로 환산해 표시하는 단위입니다. 정광(U3O8) 무게를 쓰는 파운드(lb) 단위와 함께 쓰입니다.'},
      {term:'농축',meaning:'천연 우라늄에 0.7% 정도 들어 있는 우라늄-235의 비율을 원전 연료에 맞게 3~5% 수준으로 높이는 공정입니다.'},
      {term:'저농축우라늄(LEU)',meaning:'우라늄-235 비율을 20% 미만으로 높인 우라늄으로, 대부분의 상업용 원전 연료가 여기에 해당합니다.'},
      {term:'지하자원이용계약',meaning:'카자흐스탄 정부가 광산별로 허용 생산량을 정해 둔 계약입니다. 카자톰프롬의 생산 계획은 이 한도에 맞춰 조정됩니다.'},
      {term:'면제(waiver)',meaning:'법으로 금지한 수입을 정부가 예외적으로 허용하는 절차입니다. 미국은 러시아산 농축우라늄에 대해 2027년 말까지 이 길을 열어 두었습니다.'}
    ],
    pages:[
      {
        heading:'원료의 지도: 세계 우라늄 10톤 중 4톤은 카자흐스탄에서',
        easy:'원전 연료의 출발점인 우라늄은 몇몇 나라에서만 많이 캐냅니다. 그중 카자흐스탄이 압도적인 1위이고, 국영기업 카자톰프롬이 그 생산을 이끕니다.',
        paragraphs:[
          '세계원자력협회(WNA)에 따르면 2024년 세계 우라늄 광산 생산량은 60,213tU였고, 이 가운데 카자흐스탄이 23,270tU로 약 39%를 차지했다[1]. 2위 캐나다(14,309tU, 약 24%)와 3위 나미비아(7,333tU, 약 12%)를 합쳐도 카자흐스탄 한 나라를 크게 넘지 못하는 구조다[1]. 같은 해 우즈베키스탄은 추정치 4,000tU, 러시아는 2,738tU를 생산했다[1].',
          '카자흐스탄 생산의 중심인 국영 카자톰프롬은 2025년 100% 지분 기준 25,839tU(정광 6,718만 파운드)를 생산했고, 회사 지분만큼의 생산량은 3,515만 파운드였다[3]. 증산의 주된 동력은 합작사 부데노프스코예 광산의 생산 확대였다[3].',
          '다만 카자톰프롬은 2025년 8월 22일 상반기 실적 발표에서 2026년 지하자원이용계약상 명목 생산량을 32,777tU에서 29,697tU로 약 3,000tU 낮췄다고 밝혔다[2]. 회사는 이 감축분이 세계 1차 공급의 약 5%에 해당한다고 설명했다[2]. 이후 제시한 2026년 생산 가이던스는 100% 기준 27,500~29,000tU이며, 황산 수급 상황에 따라 달라질 수 있다는 단서가 붙었다[3].',
          '2026년 8월 3일 공개된 2분기 운영 실적에서 카자톰프롬의 상반기 생산량은 13,291tU로 전년 동기(12,242tU)보다 9% 늘었고, 회사는 연간 가이던스를 유지했다[4]. 같은 시기 캐나다 카메코는 5월 홍수로 북부 서스캐처원의 주요 보급로 교량이 무너져 키레이크 공장을 일시 중단하는 등 차질을 겪었다[4].'
        ]
      },
      {
        heading:'병목은 농축: 러시아 의존과 미국의 수입 금지',
        easy:'캐낸 우라늄은 그대로 쓰지 못하고 ‘농축’이라는 공정을 거쳐야 합니다. 이 농축 능력의 40% 넘게를 러시아가 갖고 있어서, 서방이 러시아를 끊어내기가 쉽지 않습니다.',
        paragraphs:[
          'S&P글로벌에 따르면 러시아는 세계 우라늄 농축 설비 용량의 약 44%를 보유하고 있으며, 국영 로사톰은 세계 농축 서비스 시장의 약 36%를 차지한다[7]. 미국 에너지정보청(EIA) 자료 기준으로 2023년 미국 전력회사가 구매한 농축 서비스의 27%가 러시아산이었다[7].',
          '미국은 2024년 5월 바이든 대통령이 서명한 「러시아 우라늄 수입 금지법(H.R.1042)」으로 러시아산 저농축우라늄 수입을 막았고, 금지는 2024년 8월 11일 발효됐다[5]. 에너지부(DOE) 장관은 대체 공급원이 없거나 국익에 부합하는 경우 정해진 물량에 한해 수입을 허용하는 면제를 내줄 수 있다[5].',
          '면제는 2028년 1월 1일 이전 수입분에만 가능하며, 허용 물량 상한은 2024년 476,536kg에서 2027년 459,083kg으로 해마다 줄어들고, 금지 자체는 2040년 말까지 유지된다[6]. 실제로 DOE는 센트러스와 콘스텔레이션에 2024~2025년 수입분 면제를 내준 것으로 보도됐다[7].',
          '러시아도 맞대응에 나서 2024년 11월 15일 미국행 농축우라늄 수출을 기한 없이 일시 제한한다고 발표했고, 수출은 연방기술수출통제청의 1회성 허가가 있어야 가능해졌다[7]. 결과적으로 2028년부터 미국 원전은 러시아 외의 농축 공급원을 확보해야 하는 상황이다[6].'
        ]
      },
      {
        heading:'한국의 자리: 두코바니 계약과 연료 공급망',
        easy:'한국수력원자력은 2025년 체코에서 원전 2기를 짓는 계약을 따냈습니다. 원전을 짓는 일뿐 아니라 연료를 안정적으로 대는 일도 계약에 포함돼 있어, 세계 우라늄 공급망의 변화가 한국 기업에도 직접 영향을 줍니다.',
        paragraphs:[
          '체코 국영 두코바니II 원전회사(EDU II)는 2025년 6월 4일, 최고행정법원이 계약 서명 금지 가처분을 해제한 직후 한국수력원자력(KHNP)과 신규 원전 계약을 맺었다[8]. 체코 정부가 공개한 계약서에 따르면 두코바니 5·6호기 건설 대금은 4,070억 코루나, 핵연료 공급은 150억 코루나로 합계 4,200억 코루나를 넘는다[8].',
          '계약서의 상당 부분은 영업 비밀로 가려졌고, 첫 호기 완공 예상 시점은 2036년으로 전해졌다[8]. 체코 정부는 자국 기업 참여율을 60%까지 높이겠다는 목표를 유지하고 있으며, 유럽연합 집행위원회는 입찰의 공정성을 여전히 들여다보고 있다[8].',
          '연료 공급 계약이 별도로 들어 있다는 점은 한수원이 시공사이자 연료 공급자로서 우라늄·농축 시장의 변동에 노출된다는 뜻이다[8]. 농축 용량의 상당 부분이 러시아에 있고 미국이 2028년부터 면제 없이 러시아산을 막는 만큼[6][7], 유럽 고객을 상대하는 한국 원전 기업에는 비러시아 연료 조달 경로를 증명하는 일이 수주 경쟁력의 일부가 되고 있다.',
          '원료 측면에서도 카자흐스탄 한 나라가 세계 채굴의 약 39%를 차지하고[1], 그 생산이 황산 수급 같은 변수에 따라 흔들릴 수 있다는 점이 확인됐다[3]. 원전 수출을 늘리려는 한국으로서는 중앙아시아 원료와 서방 농축 설비를 함께 고려한 장기 계약 전략이 필요하다는 과제가 남는다.'
        ]
      }
    ],
    deepDive:{
      heading:'“감산”과 “증산”이 동시에 나오는 이유',
      paragraphs:[
        '카자톰프롬의 2026년 가이던스 27,500~29,000tU는 2025년 실제 생산량 25,839tU보다 많지만[3], 원래 지하자원이용계약에 잡혀 있던 32,777tU보다는 적습니다[2]. 그래서 같은 발표를 두고 “감산”이라는 보도와 “증산”이라는 해석이 함께 나옵니다. 어느 기준선과 비교하는지, 100% 지분 기준인지 회사 귀속분 기준인지를 확인해야 숫자를 제대로 읽을 수 있습니다[3].',
        '러시아의 농축 점유율 44%는 설비 “용량” 기준이고, 로사톰의 36%는 “시장” 점유율 기준입니다[7]. 미국 전력회사의 러시아 의존도 27%도 특정 연도(2023년)의 구매 비중이어서[7], 면제와 재고 활용, 다른 공급원 계약에 따라 해마다 달라질 수 있습니다.',
        '두코바니 계약 금액 역시 확정치가 아닙니다. 체코 언론은 공개된 4,200억 코루나가 최종 비용이 아니며, 국가 차입 비용까지 더하면 총비용이 크게 늘 수 있다는 분석을 함께 전했습니다[8]. 2036년 완공 일정도 공개 계약서에서 가려진 부분이 많아 외부에서 검증하기 어렵습니다[8].'
      ]
    },
    keyFacts:[
      {label:'카자흐스탄 세계 채굴 비중(2024)',value:'약 39% (23,270tU)',source:1},
      {label:'러시아 세계 농축 용량 비중',value:'약 44%',source:7},
      {label:'미국 면제 허용 마감',value:'2028년 1월 1일 이전 수입분',source:6},
      {label:'두코바니 5·6호기 건설 대금',value:'4,070억 코루나',source:8}
    ],
    questions:[
      '우라늄 “채굴”과 “농축”은 공급망에서 어떻게 다른 병목을 만드나요?',
      '카자톰프롬의 2026년 계획을 감산으로 볼지 증산으로 볼지는 무엇을 기준으로 정해지나요?',
      '미국의 러시아 우라늄 수입 금지법은 2028년 전후로 무엇이 달라지나요?',
      '두코바니 계약에 핵연료 공급이 포함된 것은 한수원에 어떤 위험과 기회를 주나요?'
    ],
    thoughts:[
      '원전이 “에너지 안보” 수단이라면, 연료가 소수 국가에 몰린 구조는 그 명분과 어떻게 양립할 수 있을까요?',
      '한국이 원전 수출국으로서 자체 농축 능력이나 해외 농축 지분을 가져야 한다는 주장에 대해 어떻게 생각하나요?'
    ],
    sources:[
      {title:'World Uranium Mining Production',publisher:'World Nuclear Association',year:'2025',url:'https://www.world-nuclear.org/information-library/nuclear-fuel-cycle/mining-of-uranium/world-uranium-mining-production',kind:'통계'},
      {title:'Kazatomprom to lower uranium production in 2026',publisher:'World Nuclear News',year:'2025',url:'https://world-nuclear-news.org/Articles/Kazatomprom-to-lower-uranium-production-in-2026',kind:'보도'},
      {title:'Cameco, Kazatomprom release 2025 production figures',publisher:'World Nuclear News',year:'2026',url:'https://world-nuclear-news.org/articles/Cameco-Kazatomprom-release-2025-figures',kind:'보도'},
      {title:'Mid-year updates from major uranium producers',publisher:'World Nuclear News',year:'2026',url:'https://world-nuclear-news.org/articles/mid-year-updates-from-major-uranium-producers',kind:'보도'},
      {title:'Russian Uranium Ban Waiver Guidance',publisher:'U.S. Department of Energy',year:'2024',url:'https://www.energy.gov/node/4841498',kind:'공식 자료'},
      {title:'DOE unveils process for Russian LEU import waivers',publisher:'World Nuclear News',year:'2024',url:'https://world-nuclear-news.org/articles/doe-unveils-process-for-russian-leu-import-waivers',kind:'보도'},
      {title:'Russia temporarily bans exports to US of enriched uranium after US curbed imports',publisher:'S&P Global Commodity Insights',year:'2024',url:'https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/111524-russia-temporarily-bans-exports-to-us-of-enriched-uranium-after-us-curbed-imports',kind:'보도'},
      {title:'Stát zveřejnil smlouvy s Korejci na Dukovany. Zaplatí celkem přes 420 miliard, pohlídá si subdodávky',publisher:'E15',year:'2025',url:'https://www.e15.cz/byznys/prumysl-a-energetika/stat-zverejnil-smlouvy-s-korejci-na-dukovany-zaplati-celkem-pres-420-miliard-pohlida-si-subdodavky-1426108',kind:'보도'}
    ]
  },
  {
    id:'security-explainer',
    industry:'policy',
    topic:'security',
    regions:['GLOBAL','EUROPE','EURASIA','PL','DE','UA','KR'],
    type:'news',
    title:'나토 ‘GDP 5%’ 약속 이후 1년: 1,500억 유로 SAFE 대출, 폴란드 4.8%, 한국 방산 수출 154억 달러',
    dek:'2025년 헤이그 정상회의에서 나토 동맹국은 2035년까지 국방·안보에 GDP의 5%를 쓰기로 했습니다. EU의 공동 대출과 폴란드·독일의 예산 확대가 실제로 어디까지 왔는지, 한국 방산에는 무엇을 뜻하는지 정리합니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'핵심 국방비(3.5%)',meaning:'나토의 기존 정의로 계산하는 순수 국방 지출입니다. 병력, 무기 구매, 나토 능력 목표 달성 비용이 들어갑니다.'},
      {term:'안보 관련 지출(1.5%)',meaning:'핵심 인프라 보호, 민방위, 사이버 대응, 방위산업 기반 확충처럼 군사와 민간에 걸친 지출입니다.'},
      {term:'SAFE',meaning:'Security Action for Europe의 약자로, EU가 회원국에 최대 1,500억 유로를 장기 저리로 빌려주는 국방 공동조달 대출 제도입니다.'},
      {term:'ReArm Europe / Readiness 2030',meaning:'EU 집행위원회의 재무장 계획으로, SAFE를 첫 번째 축으로 삼아 8,000억 유로 이상의 국방 지출을 끌어내는 것을 목표로 합니다.'},
      {term:'이행계약(executive contract)',meaning:'큰 틀의 기본계약 아래에서 수량과 금액을 확정해 실제로 맺는 세부 계약입니다. 폴란드의 K2 전차 도입이 이런 방식으로 진행됩니다.'}
    ],
    pages:[
      {
        heading:'헤이그 합의: 3.5% + 1.5% = 5%',
        easy:'나토 회원국들은 2035년까지 매년 나라 경제 규모(GDP)의 5%를 국방과 안보에 쓰기로 약속했습니다. 이 중 3.5%는 순수 군사비, 1.5%는 인프라·사이버 같은 넓은 의미의 안보 비용입니다.',
        paragraphs:[
          '2025년 6월 25일 채택된 헤이그 정상회의 선언에서 나토 동맹국은 2035년까지 국방 핵심 수요와 국방·안보 관련 지출에 매년 GDP의 5%를 투자하기로 약속했다[1]. 이 가운데 최소 3.5%는 나토가 합의한 정의에 따른 핵심 국방비와 나토 능력 목표에 배정하고, 최대 1.5%는 핵심 인프라·네트워크 보호, 민간 대비 태세, 방위산업 기반 강화 등에 쓰도록 했다[1].',
          '동맹국은 이 목표까지 가는 신뢰할 만한 단계적 경로를 담은 연간 계획을 제출해야 하며, 지출 궤적과 두 범주의 배분은 2029년에 전략 환경과 갱신된 능력 목표를 감안해 재검토된다[1]. 우크라이나 국방과 방위산업에 대한 직접 기여도 동맹국 국방비에 포함해 계산할 수 있도록 했다[1].',
          'EU도 별도의 재정 수단을 마련했다. EU 이사회는 2025년 5월 27일 최대 1,500억 유로의 장기 대출을 제공하는 SAFE 규정을 채택했고, 규정은 5월 29일 발효됐다[2]. SAFE는 8,000억 유로 이상의 국방 지출을 끌어내겠다는 집행위원회 ReArm Europe/Readiness 2030 계획의 첫 번째 축이다[2].',
          'SAFE 대출을 받으려면 원칙적으로 두 나라 이상이 공동으로 조달해야 하며, 최종 제품 부품 비용 가운데 EU·EEA-EFTA·우크라이나 밖에서 온 부품의 비중은 35%를 넘을 수 없다[2]. 우크라이나와 EEA-EFTA 국가는 회원국과 같은 대우를 받고, 영국처럼 EU와 안보·국방 파트너십을 맺은 나라는 공동조달에 참여할 수 있다[2].'
        ]
      },
      {
        heading:'최전선의 예산: 폴란드와 독일',
        easy:'러시아와 가까운 폴란드는 나토에서 가장 높은 비율로 국방비를 늘리고 있습니다. 독일도 빚을 내는 규칙을 바꿔 가며 군사비를 키우고 있습니다.',
        paragraphs:[
          '폴란드 정부가 2025년 8월 승인한 2026년 예산안은 국방비를 사상 최대인 2,000억 즐로티, GDP 대비 4.8%로 잡아 나토 회원국 가운데 가장 높은 비율을 제시했다[4]. 2025년 국방비 비율은 약 4.5%였고, 2026년 재정적자는 GDP의 6.5%인 2,717억 즐로티로 계획됐다[4]. 도날트 투스크 총리는 “작은 적자로는 폴란드 국경을 지킬 수 없다”며 지출 확대를 정당화했다[4].',
          'SAFE 대출에서도 폴란드 몫이 가장 크다. 폴란드는 2025년 9월 SAFE 전체의 가장 큰 몫인 437억 유로(약 1,850억 즐로티)를 배정받았고, 2026년 2월 17일 EU 재무장관 회의의 최종 승인을 받았다[3]. 폴란드 정부는 SAFE 자금의 약 80%를 국내에서 쓰겠다고 밝혔지만, 야당 법과정의당(PiS)은 자금 대부분을 유럽 안에서 써야 한다는 조건을 문제 삼았다[3].',
          '독일의 2026년 예산은 국방 핵심 예산 830억 유로에 연방군 특별기금 255억 유로를 더하는 구조로, 나토 기준 국방비는 GDP의 2.83%로 계획됐다[5]. 독일은 국방 지출을 신규 차입을 제한하는 재정 규칙의 적용에서 제외했고, 2029년에는 국방비 비율을 3.56%까지 올릴 계획이다[5].'
        ]
      },
      {
        heading:'한국 방산에 열린 문과 남은 문턱',
        easy:'폴란드는 한국산 전차·자주포·다연장로켓의 최대 고객입니다. 하지만 EU가 ‘유럽산을 사라’는 조건을 붙인 대출을 늘리면서, 한국 기업이 계속 같은 몫을 가져가기는 쉽지 않을 수 있습니다.',
        paragraphs:[
          '폴란드는 2025년 8월 1일 글리비체에서 현대로템과 약 65억 달러 규모의 K2 전차 2차 이행계약을 맺었고, 계약에는 전차 180대와 지원 차량 81대가 포함됐다[6]. 180대 중 116대는 현대로템이 만들고 나머지는 폴란드 국영 PGZ 계열사가 폴란드형으로 생산해, K2가 처음으로 폴란드 현지에서 만들어질 예정이다[6].',
          '방위사업청 집계에 따르면 한국의 방산 수출은 2024년 95억 달러에서 2025년 154억 달러로 60.4% 늘었고, 폴란드가 전체 수출의 40% 이상을 차지하는 최대 고객이었다[7]. 2025년 실적에는 12월 30일 폴란드와 맺은 5조6,000억 원(41억 달러) 규모의 천무 유도탄 계약이 크게 기여했다[7]. 다만 이 실적은 정부의 당초 목표였던 200억 달러에는 미치지 못했다[7].',
          '문제는 SAFE의 역외 부품 35% 상한이다[2]. 한국은 2024년 11월 EU와 안보·국방 파트너십을 맺었고, 2025년 9월 한국 기업이 SAFE 재원 사업에 더 폭넓게 참여할 수 있게 해 달라는 협정을 집행위원회에 신청했지만, 2026년 6월 기준으로 합의는 이뤄지지 않았다[8]. 비슷한 협정을 맺은 제3국은 캐나다뿐이다[8].',
          '루마니아도 K9 자주포 54문과 K10 탄약운반차 36대를 주문하고 한화에어로스페이스의 현지 생산을 계획하는 등, 한국 방산의 유럽 진출은 현지 생산과 결합하는 방향으로 움직이고 있다[7][8]. 유럽의 국방비 증가는 한국 기업에 기회지만, 자금 조건이 “유럽산 우선”으로 짜일수록 현지화 비율이 수주의 관건이 될 가능성이 크다[2][6].'
        ]
      }
    ],
    deepDive:{
      heading:'“5%”를 그대로 믿기 어려운 이유',
      paragraphs:[
        '5% 목표 가운데 1.5%는 핵심 인프라 보호, 민간 대비 태세, 방위산업 기반처럼 범위가 넓은 항목입니다[1]. 이미 다른 예산으로 집행하던 사업을 “안보 관련”으로 재분류하면 실제 군사력 증강 없이도 숫자를 채울 여지가 있다는 지적이 나오는 이유입니다. 2029년 재검토 조항은 목표와 배분 자체가 바뀔 수 있음을 열어 둔 것이기도 합니다[1].',
        '국가별 국방비 비율도 나토 정의냐 국가 예산 기준이냐에 따라 달라집니다. 독일의 2026년 수치는 본예산과 별도의 특별기금을 합쳐 나토 기준으로 계산한 것이고[5], 폴란드의 4.8%는 정부 예산안 단계의 계획치입니다[4]. 실제 집행률과 물가를 감안하면 결산 수치는 달라질 수 있습니다.',
        'SAFE는 보조금이 아니라 갚아야 하는 대출입니다[2]. 폴란드처럼 재정적자가 GDP의 6%를 넘는 나라가 대출로 무기를 사는 구조가 장기적으로 지속 가능한지[3][4], 그리고 한국 방산 수출 실적이 대형 계약 몇 건에 따라 해마다 크게 출렁인다는 점도[7] 함께 고려해야 합니다.'
      ]
    },
    keyFacts:[
      {label:'나토 국방·안보 지출 목표',value:'2035년까지 GDP 5% (핵심 3.5% + 관련 1.5%)',source:1},
      {label:'EU SAFE 대출 한도',value:'최대 1,500억 유로',source:2},
      {label:'폴란드 SAFE 배정액',value:'437억 유로 (최대)',source:3},
      {label:'한국 방산 수출(2025)',value:'154억 달러, 전년 대비 60.4% 증가',source:7}
    ],
    questions:[
      '헤이그 선언의 3.5%와 1.5%는 각각 어떤 지출을 포함하나요?',
      'SAFE 대출의 “역외 부품 35% 상한”은 한국 방산 기업에 어떤 의미인가요?',
      '폴란드는 왜 나토에서 가장 높은 비율로 국방비를 늘리고 있나요?',
      'K2 전차의 폴란드 현지 생산은 한국 기업에 기회일까요, 기술·일감 유출의 위험일까요?'
    ],
    thoughts:[
      '유럽이 “유럽산 무기 우선”을 강화할 때, 한국은 어떤 협상 카드를 가질 수 있을까요?',
      '국방비 5% 목표가 복지·기후 등 다른 공공 지출과 충돌할 때, 유럽 시민의 지지는 얼마나 오래 유지될까요?'
    ],
    sources:[
      {title:'The Hague Summit Declaration',publisher:'NATO Communications and Information Agency',year:'2025',url:'https://www.ncia.nato.int/newsroom/news/the-hague-summit-declaration',kind:'원문'},
      {title:'SAFE: Council adopts €150 billion boost for joint procurement on European security and defence',publisher:'European External Action Service',year:'2025',url:'https://www.eeas.europa.eu/delegations/ukraine/safe-council-adopts-%E2%82%AC150-billion-boost-joint-procurement-european-security-and-defence_en',kind:'공식 자료'},
      {title:'EU approves €44 billion in SAFE defence loans for Poland',publisher:'Notes from Poland',year:'2026',url:'https://notesfrompoland.com/2026/02/17/eu-approves-e44-billion-in-safe-defence-loans-for-poland/',kind:'보도'},
      {title:'Poland plans record defence spending of 4.8% GDP in 2026 budget along with lower deficit',publisher:'Notes from Poland',year:'2025',url:'https://notesfrompoland.com/2025/08/29/poland-plans-record-defence-spending-of-4-8-gdp-in-2026-budget-along-with-lower-deficit/',kind:'보도'},
      {title:'Germany: 2026 budget and rising debt',publisher:'OSW Centre for Eastern Studies',year:'2025',url:'https://www.osw.waw.pl/en/publikacje/analyses/2025-12-05/germany-2026-budget-and-rising-debt',kind:'학술 자료'},
      {title:'Poland signs $6.5 billion deal to purchase second batch of K2 tanks',publisher:'Korea JoongAng Daily',year:'2025',url:'https://www.koreajoongangdaily.com/korea/poland-signs-65-billion-deal-to-purchase-second-batch-of-k2-tanks/12091921',kind:'보도'},
      {title:'Korea\'s Defense Exports Hit $15.4 Billion in 2025, Set to Grow Further',publisher:'Seoul Economic Daily',year:'2026',url:'https://en.sedaily.com/politics/2026/03/25/koreas-defense-exports-hit-154b-in-2025-set-to-grow-further',kind:'보도'},
      {title:'Defense, here is how South Korea will seek an agreement with the EU on the Safe',publisher:'Start Magazine',year:'2026',url:'https://en.startmag.it/spazio-e-difesa-2/defense-here-is-how-south-korea-will-seek-an-agreement-with-the-eu-on-the-safe/',kind:'보도'}
    ]
  },
  {
    id:'migration-explainer',
    industry:'policy',
    topic:'migration',
    regions:['GLOBAL','EUROPE','EURASIA','TR','IT','KR'],
    type:'article',
    title:'유럽행 비정규 입국 2년 새 절반 아래로…2026년 6월 12일 적용된 EU 이주·난민 협약은 무엇을 바꾸나',
    dek:'튀르키예와 지중해를 거쳐 유럽으로 향하는 비정규 입국은 2023년 이후 크게 줄었지만, 경로는 계속 바뀌고 있습니다. 숫자의 흐름과 2016년 EU–튀르키예 합의, 새 EU 협약, 그리고 한국의 외국인력 정책까지 함께 봅니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'비정규 국경 통과',meaning:'정식 입국 절차를 거치지 않고 국경을 넘는 것을 말합니다. 프론텍스는 사람 수가 아니라 적발 건수로 집계합니다.'},
      {term:'프론텍스(Frontex)',meaning:'EU 회원국의 외부 국경 관리를 지원하는 유럽 국경·해안경비청입니다.'},
      {term:'국경 절차',meaning:'보호 필요성이 낮거나 안보 위험이 있는 신청자를 국경 지역에서 신속히 심사하고, 거부되면 입국시키지 않은 채 돌려보내는 절차입니다.'},
      {term:'연대 메커니즘',meaning:'이주민이 몰리는 회원국을 다른 회원국이 난민 재배치나 재정 지원 등으로 돕도록 의무화한 제도입니다.'},
      {term:'E-9 비자',meaning:'한국 고용허가제로 들어오는 비전문 외국인 근로자의 체류 자격입니다. 정부가 해마다 도입 규모(쿼터)를 정합니다.'}
    ],
    pages:[
      {
        heading:'숫자의 흐름: 2023년 정점 이후 3년 연속 감소',
        easy:'유럽에 정식 절차 없이 들어오려는 시도는 최근 몇 년 사이 크게 줄었습니다. 하지만 한 경로가 막히면 다른 경로가 늘어나는 ‘풍선 효과’가 반복되고 있습니다.',
        paragraphs:[
          '프론텍스 집계에서 2024년 EU 외부 국경의 비정규 통과는 23만9,000건을 조금 넘어 전년보다 38% 줄었다[3]. 2025년에는 약 17만8,000건으로 다시 26% 감소해 2023년의 절반에도 못 미쳤고, 2021년 이후 가장 낮은 수준을 기록했다[1].',
          '2025년 경로별로 보면 중부 지중해(리비아·튀니지→이탈리아)는 전년과 비슷한 수준으로 여전히 가장 붐비는 경로였고, 동부 지중해(튀르키예→그리스 등)는 전체적으로 줄었지만 리비아 동부에서 크레타섬으로 가는 횡단은 세 배 넘게 늘었다[1]. 서부 지중해는 알제리발 출발이 늘면서 증가했고, 서아프리카(대서양) 경로는 약 3분의 2가 줄어 가장 큰 감소 폭을 보였다[1].',
          '2025년 국적별로는 방글라데시, 이집트, 아프가니스탄 출신이 가장 많았고, 국제이주기구(IOM) 추정 지중해 사망자는 최소 1,878명으로 2024년의 2,573명보다 줄었다[1].',
          '2026년 1~7월 잠정 집계는 약 6만1,000건으로 전년 같은 기간보다 37% 줄었다[2]. 동부 지중해가 20,232건으로 가장 많았고(-28%), 중부 지중해는 16,454건으로 55% 급감했으며, 서부 지중해만 11,217건으로 37% 늘었다[2]. 이 수치에는 7월 말 스페인령 세우타에서 벌어진 사건이 빠져 있다[2].'
        ]
      },
      {
        heading:'튀르키예라는 관문: 2016년 합의의 구조',
        easy:'2015년 시리아 내전 등으로 많은 사람이 튀르키예를 거쳐 그리스로 건너가자, EU는 튀르키예와 합의를 맺었습니다. 돈을 지원하는 대신 튀르키예가 이주민을 받아들이고 국경 관리를 강화하는 구조입니다.',
        paragraphs:[
          'EU와 튀르키예는 2016년 3월 18일 공동성명을 발표해, 3월 20일부터 튀르키예에서 그리스 섬으로 새로 들어온 비정규 이주민을 튀르키예로 돌려보내기로 했다[5]. 그리스 섬에서 튀르키예로 송환된 시리아인 1명마다 튀르키예에 있는 시리아인 1명을 EU로 재정착시키는 ‘1 대 1’ 방식이 도입됐고, 재정착 규모는 최대 7만2,000명으로 정해졌다[5].',
          '대가로 EU는 튀르키예 난민 지원기구(Facility for Refugees in Türkiye)를 통해 모두 60억 유로를 집행했고, 2021~2023년에는 이 기구 밖에서 30억 유로를 추가로 마련했다[6]. EU 이사회는 이 지원으로 400만 명의 난민이 무상 의료를 이용하고, 70만1,000명의 난민 아동이 학교에 다닐 수 있었다고 밝혔다[6].',
          '당시 성명에는 2016년 6월 말까지 튀르키예 국민의 EU 비자 면제를 추진한다는 목표도 담겼지만, 이는 모든 기준 충족을 전제로 한 것이었다[5]. EU 이사회는 튀르키예와의 협력 이후 동부 지중해 도착이 크게 줄었다고 평가하지만[6], 2025~2026년 통계는 여전히 이 경로가 유럽행 주요 통로임을 보여 준다[2].'
        ]
      },
      {
        heading:'새 규칙과 한국에 주는 시사점',
        easy:'EU는 2026년 6월 12일부터 난민 심사와 국경 관리 방식을 바꾼 새 협약을 모든 회원국에 적용했습니다. 한국도 외국인 근로자를 얼마나 받을지 해마다 정하는데, 2026년에는 규모를 크게 줄였습니다.',
        paragraphs:[
          '2024년 5월 채택된 EU 이주·난민 협약은 2026년 6월 12일부터 모든 회원국에서 전면 적용됐다[4]. 외부 국경을 비정규로 넘은 사람은 의무적으로 등록과 보안 심사(선별 절차)를 거치고, 보호 필요성이 낮거나 안보 위험이 있는 사람은 국경 지역의 신속 절차를 거쳐 입국 허가 없이 송환될 수 있다[4].',
          '협약은 난민 절차의 기한을 줄이고 반복·남용 신청과 회원국 간 2차 이동을 막는 규정을 담았으며, 신청자가 6개월 뒤 노동시장에 접근할 수 있도록 EU 공통 수용 기준도 정했다[4]. 또 이주민이 몰리는 회원국을 다른 회원국이 의무적으로 돕되 기여 방식은 유연하게 고를 수 있는 상설 연대 메커니즘을 만들었다[4].',
          '한국의 외국인력 정책은 방향이 다르다. 정부 외국인력정책위원회는 2025년 12월 22일 2026년 고용허가제(E-9) 도입 규모를 8만 명(업종별 7만 명, 탄력 배정 1만 명)으로 정해, 2025년 13만 명보다 38% 줄였다[7]. 정부는 경기 전망과 고용 여건, 2025년 11월까지의 실제 비자 발급 실적(4만8,668명) 등을 감축 이유로 들었다[7].',
          '반면 계절근로(E-8)는 10만9,000명으로 1만3,000명 늘려, 2026년 비전문 외국인력 전체 도입 규모는 19만1,000명으로 잡혔다[7]. 유럽이 비정규 이주를 줄이는 데 집중하는 사이 한국은 합법 취업 이민의 규모와 업종을 해마다 조정하는 방식으로 노동력 부족에 대응하고 있다는 점에서, 두 지역의 정책 과제는 출발점이 다르다.'
        ]
      }
    ],
    deepDive:{
      heading:'“감소”라는 통계를 읽을 때 주의할 점',
      paragraphs:[
        '프론텍스 수치는 사람 수가 아니라 국경 통과 “적발” 건수입니다. 같은 사람이 여러 번 시도하면 중복 집계될 수 있고, 적발되지 않은 통과는 빠집니다. 연초 발표치는 잠정치여서 이후 수정될 수 있으며, 2026년 1~7월 수치처럼 특정 사건(세우타)을 뺀 집계도 있습니다[2].',
        '전체 숫자가 줄어도 경로별로는 반대 흐름이 나타납니다. 2025년 리비아 동부→크레타 경로가 세 배 넘게 늘었고[1], 2026년에는 서부 지중해만 37% 증가했습니다[2]. 감소가 송출국 협력, 국경 통제, 기상, 출발국 정세 가운데 무엇 때문인지는 통계만으로 판별하기 어렵습니다.',
        '새 EU 협약의 효과도 아직 평가하기 이릅니다. 2026년 6월 12일 적용 이후 몇 달밖에 지나지 않았고[4], 국경 절차의 인권 보호 장치와 회원국 간 연대 의무가 실제로 어떻게 이행되는지가 쟁점입니다. 2016년 EU–튀르키예 합의처럼 제3국 협력에 의존하는 구조는 상대국과의 관계 변화에 취약하다는 한계도 있습니다[5][6].'
      ]
    },
    keyFacts:[
      {label:'EU 비정규 국경 통과(2025)',value:'약 17만8,000건, 전년 대비 26% 감소',source:1},
      {label:'2026년 1~7월 잠정치',value:'약 6만1,000건, 37% 감소',source:2},
      {label:'EU 이주·난민 협약 적용일',value:'2026년 6월 12일',source:4},
      {label:'한국 2026년 E-9 도입 규모',value:'8만 명 (2025년 13만 명에서 38% 감소)',source:7}
    ],
    questions:[
      '전체 비정규 입국이 줄어드는 동안 왜 일부 경로는 오히려 늘어났을까요?',
      '2016년 EU–튀르키예 공동성명의 ‘1 대 1’ 방식은 어떻게 작동하도록 설계됐나요?',
      '새 EU 협약의 ‘국경 절차’는 기존 난민 심사와 무엇이 다른가요?',
      '한국 정부가 2026년 E-9 쿼터를 줄이면서 계절근로(E-8)는 늘린 이유는 무엇일까요?'
    ],
    thoughts:[
      '이주 관리를 제3국에 맡기는 대가로 재정을 지원하는 방식은 효과와 인권 사이에서 어떻게 평가해야 할까요?',
      '인구가 줄어드는 한국은 유럽의 이주 정책 논쟁에서 어떤 교훈을 얻을 수 있을까요?'
    ],
    sources:[
      {title:'Frontex: Irregular border crossings down 26% in 2025, Europe must stay prepared',publisher:'Frontex',year:'2026',url:'https://www.frontex.europa.eu/media-centre/news/news-release/frontex-irregular-border-crossings-down-26-in-2025-europe-must-stay-prepared-lyKpVb?etrans=en',kind:'통계'},
      {title:'Frontex: Preliminary data show irregular border crossings into EU down 37% in first seven months of 2026',publisher:'Frontex',year:'2026',url:'https://www.frontex.europa.eu/media-centre/news/news-release/frontex-preliminary-data-show-irregular-border-crossings-into-eu-down-37-in-first-seven-months-of-2026-mffdGl?etrans=el',kind:'통계'},
      {title:'Nearly 40% fewer irregular arrivals in the EU in 2024',publisher:'European Migration Network Belgium',year:'2025',url:'https://emnbelgium.be/news/nearly-40-fewer-irregular-arrivals-eu-2024',kind:'공식 자료'},
      {title:'Pact on Migration and Asylum enters into application on 12 June 2026',publisher:'European Commission Representation in Malta',year:'2026',url:'https://malta.representation.ec.europa.eu/news/pact-migration-and-asylum-enters-application-12-june-2026-06-11_en',kind:'공식 자료'},
      {title:'EU-Turkey statement, 18 March 2016',publisher:'European Council',year:'2016',url:'https://www.consilium.europa.eu/en/press/press-releases/2016/03/18/eu-turkey-statement',kind:'원문'},
      {title:'Eastern Mediterranean route',publisher:'Council of the European Union',year:'2025',url:'https://www.consilium.europa.eu/en/policies/eastern-mediterranean-route/',kind:'공식 자료'},
      {title:'올해 13만보다 38% 감소…전체 비전문 외국인력 19만 도입',publisher:'뉴시스',year:'2025',url:'https://mobile.newsis.com/view/NISX20251222_0003451086',kind:'보도'}
    ]
  }
];
