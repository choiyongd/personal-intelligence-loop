import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'cloud-explainer',
    industry:'technology',
    topic:'cloud',
    regions:['GLOBAL','US','KR','N_AMERICA','EUROPE','ASIA_PACIFIC'],
    type:'article',
    title:'빅테크 4사 2026년 설비투자 7,000억 달러…AI 데이터센터 경쟁의 병목은 전기다',
    dek:'알파벳·아마존·마이크로소프트·메타가 2026년 한 해에만 7,000억 달러가 넘는 설비투자를 예고했습니다. 국제에너지기구(IEA)는 데이터센터 전력 소비가 2030년까지 두 배 이상 늘 것으로 보며, 한국은 울산·서남권 데이터센터와 메모리 공급으로 이 경쟁에 들어섰습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'하이퍼스케일러',meaning:'아마존(AWS), 마이크로소프트(애저), 구글 같은 초대형 클라우드 사업자를 가리킵니다. 수십만 대 규모의 서버를 직접 짓고 운영합니다.'},
      {term:'설비투자(capex)',meaning:'건물·서버·반도체처럼 여러 해에 걸쳐 쓰는 자산을 사들이는 지출입니다. AI 경쟁에서는 데이터센터와 GPU 구매가 대부분을 차지합니다.'},
      {term:'TWh(테라와트시)',meaning:'전력량 단위로 1TWh는 10억kWh입니다. 한 나라의 연간 전력 소비를 말할 때 주로 씁니다.'},
      {term:'스타게이트',meaning:'오픈AI가 소프트뱅크·오라클 등과 2025년 1월 발표한 미국 AI 인프라 합작 사업으로, 4년간 5,000억 달러·10GW를 목표로 합니다.'},
      {term:'AI 기가팩토리',meaning:'EU가 추진하는 초대형 AI 학습용 연산 시설로, 최신 AI 프로세서를 대량으로 갖춘 공공·민간 합작 데이터센터입니다.'}
    ],
    pages:[
      {
        heading:'얼마나 쏟아붓나: 7,000억 달러와 10GW',
        easy:'미국의 큰 IT 기업 네 곳이 올해 데이터센터와 AI 반도체에 우리 돈 1,000조원 가까운 돈을 쓰겠다고 밝혔습니다. 오픈AI도 협력사들과 미국 곳곳에 대형 데이터센터를 짓고 있고, 유럽도 공공 자금으로 따라붙고 있습니다.',
        paragraphs:[
          '2026년 4월 말 실적 발표에서 알파벳은 올해 설비투자 전망을 1,750억~1,850억 달러에서 1,800억~1,900억 달러로, 메타는 1,150억~1,350억 달러에서 1,250억~1,450억 달러로 올렸다[3]. 마이크로소프트는 2026년 한 해 1,900억 달러, 아마존은 2,000억 달러 전망을 유지했다[3]. 네 회사를 합친 2026년 설비투자 계획은 7,000억 달러를 넘어, 한 분기 전 예상보다 약 1,000억 달러 늘었다[3].',
          '오픈AI·오라클·소프트뱅크는 2025년 9월 23일 텍사스 섀클퍼드 카운티, 뉴멕시코 도냐아나 카운티, 오하이오 로즈타운, 텍사스 밀럼 카운티, 미국 중서부(이후 위스콘신으로 확정) 등 스타게이트 신규 부지 다섯 곳을 발표했다[4]. 이로써 스타게이트의 계획 용량은 텍사스 애빌린 본거지를 포함해 약 7GW, 향후 3년 투자액은 4,000억 달러 이상이 됐다[4]. 세 회사는 2025년 1월 백악관에서 발표한 5,000억 달러·10GW 약속을 2025년 말까지 확보하는 일정보다 앞서 있다고 밝혔다[4].',
          '애빌린 캠퍼스는 이미 오라클 클라우드 인프라 위에서 가동 중이며, 오라클은 2025년 6월부터 엔비디아 GB200 랙을 공급하기 시작했다[4]. 오픈AI와 오라클의 별도 계약은 5년간 3,000억 달러를 넘는 규모로, 최대 4.5GW의 추가 용량을 다룬다[4].',
          '유럽은 공공이 앵커 고객이 되는 방식을 택했다. 유럽고성능컴퓨팅공동사업(EuroHPC JU)은 2026년 7월 30일 최소 7개 회원국에 최대 7곳의 AI 기가팩토리를 세우는 조달 공고를 냈고, EU 전역에서 200억 유로 이상의 민간 투자를 끌어낼 것으로 기대했다[7]. 제안서 마감은 2026년 11월 12일, 선정은 2027년 초로 예정돼 있으며 선정 후 18개월 안에 가동을 시작해야 한다[7].'
        ]
      },
      {
        heading:'전력이라는 병목: IEA가 본 2030년',
        easy:'데이터센터는 엄청난 전기를 씁니다. 국제에너지기구는 2030년이면 전 세계 데이터센터가 지금 일본 한 나라가 쓰는 전기보다 조금 더 많이 쓰게 될 것이라고 봅니다.',
        paragraphs:[
          'IEA는 2025년 4월 10일 특별보고서 「에너지와 AI」를 내고, 전 세계 데이터센터 전력 소비가 2030년 약 945TWh로 두 배 이상 늘 것으로 전망했다[2]. 이는 현재 일본 전체의 연간 전력 소비를 조금 웃도는 규모다[2]. 같은 기간 AI에 최적화된 데이터센터의 전력 수요는 네 배 넘게 늘 것으로 봤다[2].',
          '출발점은 2024년 415TWh로, 세계 전력 소비의 약 1.5%다[1]. 2024년 기준 소비 비중은 미국 45%, 중국 25%, 유럽 15% 순이며, 데이터센터 전력 소비는 2017년 이후 연평균 약 12%씩 늘어 전체 전력 소비 증가율의 네 배를 넘었다[1]. 2024년 전 세계 데이터센터 투자는 약 5,000억 달러로 2022년의 거의 두 배였다[1].',
          '지역별 충격은 더 크다. IEA는 2030년까지 미국 전력 수요 증가분의 거의 절반을 데이터센터가 차지하고, 일본은 증가분의 절반 이상, 말레이시아는 최대 5분의 1을 차지할 것으로 봤다[2]. 늘어나는 수요는 재생에너지와 천연가스가 주로 채울 것으로 전망됐다[2].',
          'IEA 기준 시나리오에서 2035년 데이터센터 전력 소비는 약 1,200TWh지만, 시나리오에 따라 700~1,700TWh로 폭이 넓다[1]. 2035년까지 늘어나는 수요의 약 절반은 재생에너지(450TWh 이상)가 맡고, 천연가스와 원자력이 각각 약 175TWh를 보탤 것으로 추정됐다[1]. 데이터센터 전력 관련 배출량은 현재 약 1억 8,000만t에서 2035년 3억t, 고성장 시나리오에서는 5억t까지 늘 수 있다[1].'
        ]
      },
      {
        heading:'한국의 자리: 울산, 서남권, 그리고 메모리',
        easy:'한국은 직접 대형 데이터센터를 짓는 한편, AI 서버에 꼭 필요한 메모리 반도체를 공급하는 나라로서 이 경쟁에 참여하고 있습니다. 다만 전기와 송전망을 얼마나 빨리 확보하느냐가 관건입니다.',
        paragraphs:[
          'SK그룹과 아마존웹서비스(AWS)는 2025년 6월 20일 울산에 AI 데이터센터를 짓는 15년 협력 계약을 맺었고, 2027년 가동을 목표로 한다[5]. AWS는 이와 별도로 2027년까지 한국에 58억 8,000만 달러(약 7조 8,500억원)를 장기 투자하기로 했다[5].',
          '2025년 10월 1일에는 이재명 대통령과 샘 올트먼 오픈AI 최고경영자, 삼성전자·SK하이닉스 회장의 서울 회동 뒤 삼성전자·SK하이닉스가 스타게이트에 메모리를 공급하는 의향서에 서명했다[6]. 당시 발표에서 스타게이트의 메모리 수요는 월 90만 장의 D램 웨이퍼 규모로 제시됐다[6]. SK텔레콤은 오픈AI와 서남권 AI 데이터센터 개발 양해각서를 맺었고, 삼성물산·삼성중공업은 해상(부유식) 데이터센터 등에서 협력하기로 했다[6].',
          '한국 기업에 이 흐름은 두 갈래로 작동한다. 하이퍼스케일러 설비투자가 7,000억 달러를 넘을수록[3] 고대역폭메모리(HBM)와 D램 공급사의 수요 기반은 넓어지지만, 국내 데이터센터 유치는 IEA가 지적한 전력 병목과 같은 문제에 부딪힌다[1][2]. 말레이시아처럼 데이터센터가 전력 수요 증가의 상당 부분을 차지하게 되는 사례는[2] 수도권 전력망 여유가 적은 한국에도 참고가 된다.'
        ]
      }
    ],
    deepDive:{
      heading:'설비투자 수치와 전력 전망을 읽을 때 주의할 점',
      paragraphs:[
        '빅테크의 설비투자 “7,000억 달러”는 회사별 회계연도와 공시 범위가 다른 숫자를 더한 값입니다. 마이크로소프트의 1,900억 달러는 달력 기준 2026년 수치로 보도됐고, 알파벳과 메타는 범위로 제시했습니다[3]. 또 이 금액에는 AI와 무관한 일반 클라우드·물류 설비가 섞여 있어, 전액을 AI 데이터센터 투자로 읽으면 과대평가가 됩니다.',
        'IEA 전망은 하나의 숫자가 아니라 시나리오 묶음입니다. 2035년 전망치가 700~1,700TWh로 두 배 넘게 벌어지는 것은 AI 보급 속도, 반도체 효율 개선, 전력망 확충 속도에 대한 가정이 크게 다르기 때문입니다[1]. 고효율 시나리오에서는 기준 시나리오보다 2035년 수요가 20% 낮아집니다[1].',
        '스타게이트의 GW와 투자액은 회사가 밝힌 계획 용량이며, 모든 부지의 전력 연결과 자금 조달이 확정된 것은 아닙니다[4]. EU 기가팩토리 역시 2026년 10월 현재 공모 단계로, 실제 부지와 규모는 2027년 선정 결과를 봐야 알 수 있습니다[7].'
      ]
    },
    keyFacts:[
      {label:'빅테크 4사 2026년 설비투자 계획',value:'7,000억 달러 이상',source:3},
      {label:'2030년 데이터센터 전력 소비 전망',value:'약 945TWh (2024년 415TWh)',source:1},
      {label:'스타게이트 계획 용량',value:'약 7GW, 3년간 4,000억 달러+',source:4},
      {label:'EU AI 기가팩토리 공모 마감',value:'2026년 11월 12일',source:7}
    ],
    questions:[
      '2026년 4월 실적 발표에서 설비투자 전망을 올린 회사는 어디이고, 얼마로 올렸나요?',
      'IEA는 2024년 데이터센터 전력 소비가 세계 전체의 몇 %라고 추정했나요?',
      'IEA가 2035년 데이터센터 전력 전망을 하나의 숫자가 아니라 700~1,700TWh의 범위로 제시한 이유는 무엇인가요?',
      '빅테크의 설비투자가 늘어날 때 한국 메모리 반도체 기업과 국내 데이터센터 사업자가 받는 영향은 어떻게 다를까요?',
      '미국(민간 주도 스타게이트)과 EU(공공이 앵커 고객인 기가팩토리)의 접근 방식은 각각 어떤 장단점이 있을까요?',
      '내가 일하는 조직이 클라우드 AI 사용량을 크게 늘린다면, 비용과 전력·탄소 배출 측면에서 어떤 지표를 새로 관리해야 할까요?'
    ],
    thoughts:[
      'AI 데이터센터에 우선적으로 전력망을 배정하는 것은 산업 경쟁력을 위한 합리적 선택일까요, 가정과 제조업의 전기요금 부담을 키우는 특혜일까요?',
      '7,000억 달러 규모의 설비투자가 몇 년 안에 매출로 회수되지 않는다면, 그 부담은 빅테크·반도체 공급망·전력회사 가운데 누가 가장 크게 지게 될까요?',
      '한국이 대형 AI 데이터센터를 국내에 유치하는 것과 메모리·전력기기 공급에 집중하는 것 중 어느 쪽이 더 지속 가능한 전략일까요?'
    ],
    sources:[
      {title:'Energy and AI: Executive summary',publisher:'International Energy Agency',year:'2025',url:'https://www.iea.org/reports/energy-and-ai/executive-summary',kind:'공식 자료'},
      {title:'AI is set to drive surging electricity demand from data centres while offering the potential to transform how the energy sector works',publisher:'International Energy Agency',year:'2025',url:'https://www.iea.org/news/ai-is-set-to-drive-surging-electricity-demand-from-data-centres-while-offering-the-potential-to-transform-how-the-energy-sector-works',kind:'공식 자료'},
      {title:'Alphabet, Amazon, Microsoft, and Meta plan more than $700 billion on capex this year',publisher:'Sherwood News',year:'2026',url:'https://sherwood.news/tech/alphabet-amazon-microsoft-meta-plan-more-than-700-billion-on-capex-this-year/',kind:'보도'},
      {title:'OpenAI, Oracle, and SoftBank expand Stargate with five new AI data center sites',publisher:'OpenAI',year:'2025',url:'https://openai.com/index/five-new-stargate-sites/',kind:'원문'},
      {title:'SK Group and AWS Team Up to Build Cloud Computing Infrastructure to Support AI Innovation',publisher:'SK Group',year:'2025',url:'https://eng.sk.com/news/sk-group-and-aws-team-up-to-build-cloud-computing-infrastructure-to-support-ai-innovation',kind:'원문'},
      {title:'OpenAI plans Stargate data center in South Korea, Samsung Electronics and SK Hynix to supply memory chips',publisher:'DatacenterDynamics',year:'2025',url:'https://www.datacenterdynamics.com/en/news/openai-plans-stargate-data-center-in-south-korea-samsung-electronics-sk-hynix-to-supply-memory-chips/',kind:'보도'},
      {title:'The EuroHPC Joint Undertaking launches the AI Gigafactories Call',publisher:'EuroHPC JU',year:'2026',url:'https://www.eurohpc-ju.europa.eu/eurohpc-joint-undertaking-launches-ai-gigafactories-call-2026-07-30_en',kind:'공식 자료'}
    ]
  },
  {
    id:'esg-explainer',
    industry:'business',
    topic:'esg',
    regions:['GLOBAL','KR','US','DE','FR','BR','JP','EUROPE','N_AMERICA','S_AMERICA','ASIA_PACIFIC'],
    type:'news',
    title:'EU는 줄이고 미국은 멈추고 한국은 2028년 시작…갈라진 ESG 공시 지도',
    dek:'EU는 2026년 2월 옴니버스 개정으로 지속가능성 공시 대상 기업을 대폭 줄였고, 미국 SEC는 2025년 3월 기후공시 규칙 방어를 포기했습니다. 반면 한국은 2026년 7월 자산 10조원 이상 코스피 상장사부터 2028년 의무공시를 시작하는 최종안을 내놨습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'ISSB',meaning:'국제지속가능성기준위원회. IFRS재단 산하 기구로, 기후 등 지속가능성 정보 공시의 국제 기준(IFRS S1·S2)을 만듭니다.'},
      {term:'CSRD',meaning:'EU 기업지속가능성보고지침. 기업이 환경·사회 정보를 경영보고서에 공시하도록 한 EU 법입니다.'},
      {term:'CSDDD',meaning:'EU 기업지속가능성실사지침. 기업이 공급망의 인권·환경 피해를 찾아내고 줄이도록 의무를 지우는 EU 법입니다.'},
      {term:'옴니버스(Omnibus)',meaning:'여러 법을 한 번에 고치는 일괄 개정 법안으로, EU는 2025~2026년 CSRD와 CSDDD를 묶어 간소화했습니다.'},
      {term:'스코프 3',meaning:'기업이 직접 배출하지 않지만 공급망과 제품 사용 단계에서 생기는 간접 온실가스 배출입니다.'}
    ],
    pages:[
      {
        heading:'EU: 대상 기업을 줄인 옴니버스 I',
        easy:'유럽연합은 기업들이 환경·인권 정보를 보고해야 하는 규칙을 크게 줄였습니다. 이제 직원 1,000명 넘고 매출이 큰 대기업만 보고 의무를 집니다.',
        paragraphs:[
          'EU의 지속가능성 옴니버스 I은 2025년 12월 9일 잠정 합의, 12월 16일 유럽의회 본회의 채택, 2026년 2월 24일 이사회 최종 승인을 거쳐 2월 26일 관보에 실렸고 3월 18일 발효됐다[1]. 개정 CSRD의 적용 대상은 직원 1,000명 초과이면서 순매출 4억 5,000만 유로를 넘는 EU 기업·그룹으로 좁혀졌다[1]. 종전에는 직원 250명, 자산 2,500만 유로, 매출 5,000만 유로 가운데 두 가지만 넘어도 대상이었다[1].',
          '비EU 그룹은 2개 회계연도 연속 EU 내 순매출 4억 5,000만 유로 초과에 더해 EU 자회사나 지점의 순매출이 2억 유로를 넘을 때 대상이 된다[1]. 보고 기업이 직원 1,000명 미만 공급망 협력사에 요구할 수 있는 정보에도 상한이 생겼다[1].',
          '공급망 실사법인 CSDDD는 대상이 직원 5,000명 초과·전 세계 순매출 15억 유로 초과 EU 기업, 그리고 EU 내 순매출 15억 유로를 넘는 비EU 기업으로 축소됐다[1]. 기후 전환계획 수립·이행 의무는 삭제됐고, EU 차원의 통일된 민사책임 규정도 빠져 각국 법에 맡겨졌다[1]. 과징금 상한은 전 세계 순매출의 3%로 정해졌으며, 각국은 2028년 7월 26일까지 법을 옮겨 담고 기업은 2029년 7월 26일부터 준수해야 한다[1].'
        ]
      },
      {
        heading:'미국: 연방은 철수, 캘리포니아는 진행',
        easy:'미국 증권당국은 상장사에 기후 정보를 공개하라는 규칙을 더 이상 법정에서 지키지 않기로 했습니다. 대신 캘리포니아주가 대기업에 온실가스 배출량 공개를 요구하는 자체 법을 시행하고 있습니다.',
        paragraphs:[
          '미국 증권거래위원회(SEC)는 2024년 3월 6일 기후 관련 위험과 온실가스 배출량 공시 규칙을 채택했지만, 2025년 3월 27일 이 규칙에 대한 소송 방어를 중단하기로 의결했다[2]. 규칙은 제8순회항소법원에 병합된 아이오와주 대 SEC 소송이 진행되는 동안 이미 효력이 정지된 상태였다[2]. 마크 우예다 당시 위원장 대행은 SEC가 규칙 방어에 관여하는 것을 끝내려는 것이라고 밝혔다[2].',
          '연방 규칙이 멈춘 자리에서 캘리포니아주 법이 움직이고 있다. SB 253은 연매출 10억 달러 초과 기업에 스코프 1·2 배출량 공시를, SB 261은 연매출 5억 달러 초과 기업에 기후 관련 재무위험 보고를 요구한다[6]. 제9순회항소법원은 2025년 11월 18일 항소심이 끝날 때까지 SB 261 집행을 임시로 막았지만 SB 253에는 영향을 주지 않았다[6].',
          '캘리포니아 대기자원위원회(CARB)는 2026년 2월 26일 초기 규정을 만장일치로 승인하면서 SB 253의 첫 스코프 1·2 보고 기한을 2026년 8월 10일로 정했고, 자료가 부족한 기업에는 집행 재량을 쓰도록 권고했다[7]. CARB는 기업당 연간 수수료를 2,000~7,000달러로 추정했으며, 120곳이 넘는 기업이 SB 261 보고서를 자발적으로 공개했다[7].'
        ]
      },
      {
        heading:'ISSB 확산과 한국의 2028년 로드맵',
        easy:'세계 여러 나라는 국제 공통 기준(ISSB)을 바탕으로 자국 공시 규칙을 만들고 있습니다. 한국도 2028년부터 큰 상장사부터 차례로 의무 공시를 시작합니다.',
        paragraphs:[
          'IFRS재단은 2026년 9월 행사 자료에서 45개가 넘는 관할권이 ISSB 기준을 채택하거나 활용하는 과정에 있다고 밝혔다[3]. 확정된 22개 관할권 프로필 가운데 18곳은 완전 채택, 3곳은 기후 요구사항 채택, 1곳은 부분 반영을 목표로 한다[3]. 같은 자료는 브라질·대만·필리핀을 2026년, 뉴질랜드·페루·나이지리아를 2027년, 한국·일본·칠레·카자흐스탄을 2028년 이후 그룹으로 분류했다[3].',
          '금융위원회는 2026년 7월 8일 지속가능성 공시 제도화 최종안을 발표했다[4]. 연결 자산총액 10조원 이상 코스피 상장사가 2028년(2027 사업연도분)부터, 5조원 이상 기업이 2029년부터 공시하며, 공시는 사업보고서에 들어가는 법정공시가 된다[4]. 초기 3년간은 고의적 그린워싱을 제외하고 손해배상·행정제재·형사처벌을 포괄적으로 면제하고, 스코프 3 공시는 대상별로 3년 유예하며, 제3자 인증은 2030년부터 의무화한다[5].',
          '한국 수출기업에는 규제 지도가 겹친다는 점이 중요하다. EU 내 매출이 4억 5,000만 유로를 넘고 현지 법인 매출이 2억 유로를 넘는 그룹은 EU 기준 공시 대상이 될 수 있고[1], 캘리포니아에서 사업하는 매출 10억 달러 초과 기업은 SB 253 대상이 된다[6]. 국내 기준이 ISSB를 바탕으로 하더라도 법인·시장별로 다른 기준과 일정을 동시에 관리해야 하는 셈이다[3][4].'
        ]
      }
    ],
    deepDive:{
      heading:'“후퇴”인가 “정리”인가: 해석이 갈리는 지점',
      paragraphs:[
        'EU 옴니버스를 두고는 해석이 엇갈립니다. 대상 기업 기준이 직원 250명에서 1,000명으로 올라가 중견기업 부담은 크게 줄었지만[1], 그만큼 투자자가 비교할 수 있는 데이터도 줄어듭니다. 기후 전환계획 의무 삭제와 민사책임 규정 삭제는 실사 의무의 실효성을 약하게 만든다는 비판이 나오는 대목입니다[1].',
        '미국은 연방 규칙이 사실상 폐기 수순이지만 캘리포니아 법이 매출 기준으로 대상을 정하기 때문에[6], 상장 여부와 상관없이 비상장 대기업도 적용받을 수 있습니다. 다만 CARB의 보고 기한과 SB 261 소송 결과는 2026년 들어서도 바뀌어 왔으므로[6][7], 실무에서는 최신 공지를 다시 확인해야 합니다.',
        'IFRS재단의 “45개 이상”이라는 숫자는 채택 완료와 검토 단계를 모두 포함한 것이어서 실제 의무화 국가 수와는 다릅니다[3]. 한국 로드맵의 시기·대상은 금융위 발표를 옮긴 보도와 회계법인 자료를 근거로 했으며[4][5], 세부 기준과 인증 범위는 후속 법령에서 확정됩니다.'
      ]
    },
    keyFacts:[
      {label:'EU 옴니버스 I 발효',value:'2026년 3월 18일',source:1},
      {label:'개정 CSRD 대상',value:'직원 1,000명 초과 + 매출 4.5억 유로 초과',source:1},
      {label:'SEC 기후공시 규칙 방어 중단',value:'2025년 3월 27일',source:2},
      {label:'한국 의무공시 1단계',value:'2028년, 자산 10조원 이상 코스피 상장사',source:4}
    ],
    questions:[
      '개정 CSRD에서 EU 기업이 공시 대상이 되는 기준은 무엇이며, 종전 기준과 어떻게 다른가요?',
      '한국 금융위원회 최종안에서 2028년과 2029년의 공시 대상은 각각 어떤 기업인가요?',
      'SEC가 2024년에 스스로 채택한 기후공시 규칙을 1년 만에 법정에서 방어하지 않기로 한 배경은 무엇일까요?',
      '한국이 초기 3년간 제재를 면제하고 스코프 3 공시를 유예한 이유는 무엇이며, 이것이 공시 품질에 어떤 영향을 줄까요?',
      'EU·미국 캘리포니아·한국의 공시 대상 기준(직원 수, 매출, 자산)을 비교하면 각 제도가 누구를 규제하려 하는지 어떻게 드러나나요?',
      '내 회사나 거래처가 유럽·미국에 매출이 있다면, 어떤 제도의 적용 여부를 먼저 확인해야 하고 어떤 데이터를 지금부터 모아야 할까요?'
    ],
    thoughts:[
      'EU가 공시 대상을 줄여 기업 부담을 낮춘 결정은 유럽 산업 경쟁력을 지키는 현실적 선택일까요, 아니면 투자자와 시민이 받을 정보를 희생시킨 후퇴일까요?',
      '연방 정부가 손을 뗀 기후공시를 주 정부가 사실상 전국 기준처럼 운영하는 미국의 구조는 기업에 더 나은가요, 더 혼란스러운가요?',
      '한국이 2028년 첫 공시부터 3년간 제재를 면제하는 대신 고의적 그린워싱만 책임을 묻는 방식은 신뢰할 만한 공시 문화를 만드는 데 충분할까요?'
    ],
    sources:[
      {title:'EU Sustainability Omnibus Published in the Official Journal',publisher:'Latham & Watkins',year:'2026',url:'https://www.lw.com/en/insights/EU-Sustainability-Omnibus-Published-in-the-Official-Journal',kind:'보도'},
      {title:'SEC Votes to End Defense of Climate Disclosure Rules',publisher:'U.S. Securities and Exchange Commission',year:'2025',url:'https://sec.gov/newsroom/press-releases/2025-58',kind:'공식 자료'},
      {title:'Plenary session: Adoption of IFRS Sustainability Disclosure Standards',publisher:'IFRS Foundation',year:'2026',url:'https://www.ifrs.org/content/dam/ifrs/events-and-conferences/2026/september/wss-conference/plenary-session-adoption-of-ifrs-sustainability-disclosure-standards.pdf',kind:'공식 자료'},
      {title:'지속가능성 의무공시 시대 (Emerging Trends, 2026년 8월)',publisher:'삼정KPMG',year:'2026',url:'https://kpmg.com/kr/ko/media/newsletter/202608/emerging-trends.html',kind:'보도'},
      {title:'[기고] 지속가능성 공시 의무화 로드맵',publisher:'경향신문',year:'2026',url:'https://www.khan.co.kr/article/202608051959005/amp',kind:'보도'},
      {title:'California SB 253 and SB 261: Developments and Litigation',publisher:'Cooley',year:'2026',url:'https://www.cooley.com/news/insight/2026/2026-01-26-californias-sb-253-and-sb-261-developments-and-litigation',kind:'보도'},
      {title:'California Air Resources Board unanimously approves initial climate disclosure regulation',publisher:'Hogan Lovells',year:'2026',url:'https://www.hlc.com/en/publications/california-air-resources-board-unanimously-approves-initial-climate-disclosure-regulation',kind:'보도'}
    ]
  },
  {
    id:'neuroscience-explainer',
    industry:'science',
    topic:'neuroscience',
    regions:['GLOBAL','US','CN','GB','AU','N_AMERICA','EUROPE','ASIA_PACIFIC'],
    type:'research',
    title:'뇌를 읽고 뇌를 그리다: 초파리 뉴런 13만 9,255개 지도와 임상 단계에 들어선 뇌-컴퓨터 인터페이스',
    dek:'2024년 초파리 뇌 전체 배선도, 2025년 생쥐 시각피질 1㎣ 지도가 잇따라 발표되며 뇌 지도 연구가 새 단계에 들어섰습니다. 같은 시기 뉴럴링크·싱크론의 임상과 중국의 국가 로드맵으로 뇌-컴퓨터 인터페이스(BCI)도 실험실 밖으로 나오고 있습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'커넥톰(connectome)',meaning:'뇌 속 신경세포(뉴런)들이 어떤 시냅스로 서로 연결돼 있는지를 모두 그린 배선도입니다.'},
      {term:'시냅스',meaning:'뉴런과 뉴런이 신호를 주고받는 접점입니다. 커넥톰 연구에서는 이 접점의 수와 위치를 셉니다.'},
      {term:'뇌-컴퓨터 인터페이스(BCI)',meaning:'뇌의 전기 신호를 읽어 컴퓨터나 로봇 팔 같은 기기를 조작하게 하는 기술입니다.'},
      {term:'초기 타당성 연구',meaning:'의료기기를 소수의 환자에게 처음 적용해 안전성과 기본 기능을 확인하는 초기 임상시험입니다.'},
      {term:'전자현미경 연속 절편',meaning:'뇌 조직을 아주 얇게 잘라 한 장씩 전자현미경으로 찍은 뒤 이어 붙여 3차원 구조를 복원하는 방법입니다.'}
    ],
    pages:[
      {
        heading:'뇌 지도: 초파리 한 마리와 생쥐 뇌 1㎣',
        easy:'과학자들이 초파리 뇌 속 신경세포 13만여 개가 서로 어떻게 연결돼 있는지 처음으로 모두 그려냈습니다. 이어 생쥐 뇌의 모래알만 한 조각에서 세포 20만 개와 연결 5억 개를 지도로 만들었습니다.',
        paragraphs:[
          '프린스턴대 스벤 도르켄발트 등 FlyWire 컨소시엄은 2024년 10월 2일 Nature에 성체 초파리 뇌 전체의 신경 배선도를 발표했다[1]. 지도에는 검수를 마친 뉴런 13만 9,255개와 화학적 시냅스 약 5,450만 개가 담겼고, 동반 논문은 8,400가지가 넘는 세포 유형을 분류했다[1].',
          '지도는 기존에 공개된 전자현미경 연속 절편 영상을 바탕으로 자동 분할·시냅스 검출을 거친 뒤 사람이 오류를 고치는 방식으로 만들어졌다[1]. 연구진은 수작업 검수에 약 33인년이 들었다고 추산했으며, 초기에는 각국 초파리 연구실이 나눠 맡고 이후 프린스턴·케임브리지 팀과 시민 과학자들이 나머지를 채웠다[1].',
          '2025년 4월 9일 미국 국립보건원(NIH)은 MICrONS 프로젝트가 생쥐 시각피질 1㎣에서 세포 20만 개 이상, 시냅스 5억 2,400만 개 이상, 축삭 약 4km를 지도화했다고 발표했다[2]. 전자현미경 영상 약 2만 8,000장을 이어 붙인 데이터는 1.6페타바이트에 이르며, 150명이 넘는 연구자가 Nature 계열 학술지에 논문 10편을 함께 냈다[2]. 이 연구는 미국 정보고등연구계획국(IARPA)의 MICrONS 프로그램과 NIH BRAIN 이니셔티브의 지원을 받았다[2].'
        ]
      },
      {
        heading:'뇌를 읽는 기기: 미국·영국·호주의 임상',
        easy:'목 아래가 마비된 환자가 생각만으로 컴퓨터를 움직이게 하는 기기가 여러 나라에서 시험되고 있습니다. 머리를 열어 심는 방식과 혈관을 통해 넣는 방식이 경쟁하고 있습니다.',
        paragraphs:[
          '뉴럴링크는 2025년 6월 6억 5,000만 달러를 새로 조달해 누적 조달액이 약 12억 달러가 됐고, 당시 중증 마비 환자 5명이 이식을 받은 상태였다[6]. 임상은 미국 배로신경학연구소와 마이애미대, 캐나다 토론토웨스턴병원, 아랍에미리트 클리블랜드클리닉 아부다비에서 진행됐고, 미국 식품의약국(FDA)은 시각·언어 장애 용도에 혁신기기 지정을 내줬다[6].',
          '영국에서는 런던대병원(UCLH) 국립신경과·신경외과병원이 2025년 10월 운동신경질환 환자에게 뉴럴링크 N1 임플란트를 처음 이식했고, 환자는 수술 몇 시간 뒤 생각으로 컴퓨터를 조작했다[7]. N1은 1,000개가 넘는 전극을 가진 완전 이식형 기기이며, GB-PRIME 초기 타당성 연구는 UCLH와 뉴캐슬 병원 두 곳에서 진행된다[7]. UCLH는 2026년 1월 29일 2025년 10~12월에 7명의 이식 수술을 마쳤다고 밝혔다[8].',
          '싱크론은 2025년 11월 6일 2억 달러의 시리즈 D 투자를 유치해 누적 조달액이 3억 4,500만 달러가 됐다고 발표했다[5]. 싱크론의 스텐트로드는 개두술 없이 카테터로 혈관을 통해 운동피질 근처에 넣는 방식으로, 미국과 호주 임상에서 마비 환자 10명에게 이식됐다[5]. 회사는 이 자금을 핵심(pivotal) 임상과 상업화 준비에 쓰겠다고 밝혔다[5].'
        ]
      },
      {
        heading:'중국의 국가 로드맵과 한국 독자에게 남는 질문',
        easy:'중국 정부는 2030년까지 뇌-컴퓨터 인터페이스 분야 세계 선두권에 들겠다는 계획을 내놓았습니다. 뇌 데이터는 매우 민감한 정보여서 기술과 함께 규칙도 필요합니다.',
        paragraphs:[
          '중국 공업정보화부 등 7개 부처는 2025년 8월 BCI 산업 혁신 지침을 내놓고, 2027년까지 핵심 기술을 돌파해 의료·산업·소비 분야 활용을 앞당기겠다고 밝혔다[3]. 2030년까지는 안전하고 신뢰할 수 있는 산업 생태계를 만들고 세계적 영향력을 가진 기업 2~3곳을 키워 세계 선두권에 오르는 것이 목표다[3].',
          '지침은 2027년까지 전극·칩·기기 성능을 국제 수준으로 끌어올리고 산업 클러스터 2~3곳을 만드는 내용도 담았다[4]. 중국뇌과학연구소와 뉴사이버(NeuCyber)가 함께 개발한 반침습형 완전 이식 무선 BCI ‘베이나오 1호’는 임상 검증 단계에 들어섰다[4]. 다만 개념 증명에서 대규모 임상 적용까지는 시간이 더 필요하다는 평가도 같은 보도에 실렸다[4].',
          '한국 독자에게 이 흐름은 의료기기·반도체·데이터 규제가 겹치는 영역이라는 점에서 의미가 있다. 1,000개가 넘는 전극에서 신호를 읽는 이식형 기기[7]와 1.6페타바이트에 이르는 뇌 지도 데이터[2]는 저전력 칩, 무선 통신, 대용량 데이터 처리 기술을 함께 요구한다. 동시에 뇌 신호는 개인의 의도와 건강 상태를 담는 정보여서, 임상 규모가 커질수록 데이터 보호 기준이 기술 경쟁만큼 중요해진다[3][8].'
        ]
      }
    ],
    deepDive:{
      heading:'“완전한 지도”와 “생각으로 조작”이라는 표현의 한계',
      paragraphs:[
        'FlyWire 지도는 암컷 초파리 한 마리의 뇌에서 나왔습니다. 연구진도 암수 차이와 개체 간 연결 차이가 있다는 점을 인정했고, 전기적 시냅스는 이 데이터로 식별할 수 없으며 신경전달물질 종류는 직접 측정이 아닌 통계적 예측이라고 밝혔습니다[1]. 놓친 시냅스가 주된 오류여서 분석에서는 시냅스 5개 이상의 연결만 쓰도록 권고했습니다[1].',
        'MICrONS의 1㎣는 생쥐 뇌 전체의 극히 일부입니다[2]. 배선도만으로 뇌의 작동을 설명할 수는 없기 때문에, 이 프로젝트는 같은 조직에서 시각 자극에 대한 활동을 먼저 기록한 뒤 구조를 그려 둘을 연결하려 했습니다[2].',
        'BCI 임상은 대부분 초기 타당성 단계로, 참여자가 한 자릿수에서 수십 명 수준입니다[5][6][8]. 회사 발표와 병원 보도자료는 성공 사례를 중심으로 공개되므로, 장기 안전성과 신호 품질 저하 여부는 동료 심사를 거친 임상 결과가 나와야 판단할 수 있습니다. 뉴럴링크의 전 세계 누적 이식 인원은 이 글이 확인한 공식 자료에서 2025년 6월 5명 이후 갱신된 수치를 찾지 못했습니다[6].'
      ]
    },
    keyFacts:[
      {label:'초파리 뇌 커넥톰 뉴런 수',value:'13만 9,255개 (2024년 10월)',source:1},
      {label:'MICrONS 생쥐 피질 1㎣ 시냅스',value:'5억 2,400만 개 이상',source:2},
      {label:'싱크론 시리즈 D',value:'2억 달러 (2025년 11월)',source:5},
      {label:'영국 GB-PRIME 이식 인원',value:'7명 (2025년 10~12월)',source:8}
    ],
    questions:[
      'FlyWire 초파리 커넥톰에는 몇 개의 뉴런과 시냅스가 담겼고, 수작업 검수에는 얼마나 걸렸나요?',
      '싱크론의 스텐트로드는 뉴럴링크 N1과 이식 방식에서 어떻게 다른가요?',
      '커넥톰 연구가 수작업 검수와 시민 과학자의 참여에 의존해야 했던 이유는 무엇일까요?',
      '배선도를 완성해도 뇌가 어떻게 작동하는지 곧바로 알 수 없는 이유는 무엇이며, MICrONS는 이 문제를 어떻게 풀려고 했나요?',
      '미국(민간 스타트업 주도)과 중국(정부 로드맵 주도)의 BCI 육성 방식은 임상 속도와 안전성 측면에서 어떤 차이를 낳을까요?',
      '내가 의료기기나 반도체, 데이터 분야에서 일한다면 BCI 확산이 내 업무에 어떤 새로운 요구(전력, 보안, 인증)를 만들까요?'
    ],
    thoughts:[
      '마비 환자를 위한 BCI가 언젠가 건강한 사람의 기억·집중력 향상용 소비자 제품으로 확장된다면, 그 경계는 누가 어떤 기준으로 그어야 할까요?',
      '뇌 신호 데이터는 지문이나 유전체 정보보다 더 강하게 보호해야 할까요, 아니면 기존 의료 데이터 규칙으로 충분할까요?',
      '수십 명 규모의 초기 임상 결과가 수억 달러 투자와 국가 목표로 이어지는 지금의 속도는 환자에게 기회일까요, 과도한 기대일까요?'
    ],
    sources:[
      {title:'Neuronal wiring diagram of an adult brain (Nature 634, 124–138)',publisher:'Nature / PubMed Central',year:'2024',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC11446842',kind:'학술 자료'},
      {title:'Scientists map unprecedented detail of connections and visual perception in the mouse brain',publisher:'National Institutes of Health',year:'2025',url:'https://www.nih.gov/news-events/news-releases/scientists-map-unprecedented-detail-connections-visual-perception-mouse-brain',kind:'공식 자료'},
      {title:'Guideline draws road map for BCI tech',publisher:'China Daily',year:'2025',url:'https://govt.chinadaily.com.cn/s/202508/09/WS68a58a0e498e1dad3fa0976a/guideline-draws-road-map-for-bci-tech.html',kind:'보도'},
      {title:'New Policy to Spur BCI Industry',publisher:'Science and Technology Daily',year:'2025',url:'https://www.stdaily.com/web/English/2025-08/26/content_390710.html',kind:'보도'},
      {title:'Synchron Raises $200 Million Series D to Advance Brain-Computer Interface Technology',publisher:'Synchron (Business Wire)',year:'2025',url:'https://businesswire.com/news/home/20251106150841/en/Synchron-Raises-%24200-Million-Series-D-to-Advance-Brain-Computer-Interface-Technology',kind:'원문'},
      {title:'Neuralink raises $650m to widen use of brain implants',publisher:'pharmaphorum',year:'2025',url:'https://pharmaphorum.com/news/neuralink-raises-650m-widen-use-brain-implants',kind:'보도'},
      {title:'First UK patient uses thought to control computer hours after Neuralink implant',publisher:'University College London',year:'2025',url:'https://www.ucl.ac.uk/news/2025/oct/first-uk-patient-uses-thought-control-computer-hours-after-neuralink-implant',kind:'공식 자료'},
      {title:'Seven GB-PRIME patients now participating in Neuralink trial',publisher:'University College London Hospitals NHS Foundation Trust',year:'2026',url:'https://www.uclh.nhs.uk/news/seven-gb-prime-patients-now-participating-neurolink-trial',kind:'공식 자료'}
    ]
  },
  {
    id:'hydrogen-explainer',
    industry:'energy',
    topic:'hydrogen',
    regions:['GLOBAL','KR','US','DE','FI','NO','DK','BR','CN','EUROPE','N_AMERICA','S_AMERICA','ASIA_PACIFIC'],
    type:'article',
    title:'청정수소 2030년 전망 49Mt→37Mt…발표는 많고 투자결정은 9%인 수소 경제 점검',
    dek:'IEA는 2025년 9월 처음으로 2030년 저배출 수소 생산 전망을 낮췄습니다. 유럽은 보조금 경매로, 미국은 세액공제 축소로, 한국은 청정수소발전 입찰 재설계로 각자 길을 바꾸고 있습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'저배출(청정) 수소',meaning:'재생에너지로 물을 전기분해하거나, 화석연료로 만들되 탄소를 포집하는 식으로 온실가스 배출을 크게 줄여 만든 수소입니다.'},
      {term:'최종투자결정(FID)',meaning:'기업이 사업 자금 집행을 공식 확정하는 단계입니다. 발표만 된 계획과 실제로 지어질 사업을 가르는 기준입니다.'},
      {term:'수전해(전기분해) 설비',meaning:'전기로 물을 수소와 산소로 나누는 장치로, 용량은 보통 MW·GW 단위로 표시합니다.'},
      {term:'고정 프리미엄 경매',meaning:'생산된 수소 1kg당 일정 보조금을 주되, 가장 적은 보조금을 써낸 사업부터 낙찰하는 방식입니다. 유럽수소은행이 이 방식을 씁니다.'},
      {term:'CHPS',meaning:'청정수소발전 의무화 제도. 수소·암모니아로 만든 전기를 경쟁입찰로 정해 일정 기간 구매하도록 한 한국 제도입니다.'}
    ],
    pages:[
      {
        heading:'전망의 첫 하향: IEA 글로벌 수소 리뷰 2025',
        easy:'국제에너지기구는 2030년까지 만들어질 청정수소 양을 1년 전보다 4분의 1가량 낮춰 잡았습니다. 계획은 많이 발표됐지만 실제로 돈을 대기로 확정한 사업은 아직 적기 때문입니다.',
        paragraphs:[
          'IEA는 2025년 9월 「글로벌 수소 리뷰 2025」에서 발표된 사업을 모두 합친 2030년 저배출 수소 생산 잠재량을 연 3,700만t으로 제시했다[1]. 2024년 리뷰의 4,900만t보다 줄어든 수치로, 2030년 전망이 낮아진 것은 이번이 처음이다[1][2]. 2024년 세계 수소 생산은 1억t에 가깝지만 저배출 기술로 만든 비중은 1%에 못 미쳤다[1].',
          '이미 가동 중이거나 건설 중, 또는 최종투자결정을 마친 사업은 2030년까지 연 400만t을 넘을 전망이다[1]. FID를 마친 사업은 1년 새 20% 늘었지만 여전히 2030년 사업 계획의 9%에 그친다[2]. IEA는 1,000만t은 2030년 가동 가능성이 높거나 거의 확실하지만, 1,900만t은 가능성이 낮거나 불확실하다고 분류했다[1].',
          '비용 격차는 여전하다. 2025년 9월 10일 플랫츠가 평가한 독일 재생에너지 기반 수소 가격은 kg당 10.04유로로, 탄소 포집 없는 천연가스 개질 수소(2.62유로)의 네 배 가까웠다[2]. 중국은 전 세계에 설치됐거나 FID를 마친 수전해 설비의 65%, 수전해 설비 제조 능력의 약 60%를 차지한다[2].'
        ]
      },
      {
        heading:'유럽은 경매, 미국은 기한, 브라질은 세액공제',
        easy:'유럽은 가장 적은 보조금으로 수소를 만들겠다는 사업에 돈을 주는 경매를 세 번 열었습니다. 미국은 수소 세액공제를 2027년 말까지 착공한 사업으로 제한했고, 브라질은 2028년부터 세액공제를 주는 법을 만들었습니다.',
        paragraphs:[
          'EU 집행위원회는 2026년 5월 유럽수소은행 3차 경매에서 9개 수소 생산 사업에 10억 유로 이상을 배정했다[3]. 13억 유로 예산에 11개국 58건이 응찰했고, 7개국 9개 사업이 1.1GW의 수전해 용량을 확보했다[4]. 낙찰가는 kg당 0.44유로(핀란드 클라우드베리)에서 3.49유로(노르웨이 로갈란H2)까지 벌어졌다[4].',
          '앞선 경매와 비교하면 1차는 약 7억 2,000만 유로로 7개 사업(kg당 0.37~0.48유로), 2차는 9억 9,200만 유로로 15개 사업(0.20~1.88유로)을 지원했다[4]. 3차 최대 낙찰 사업인 핀란드 클라우드베리(500MW)는 10년간 50만 8,000t 넘는 수소를 생산할 계획이다[4].',
          '미국은 2025년 7월 4일 서명된 감세법으로 청정수소 생산 세액공제(45V)를 2027년 12월 31일까지 착공한 설비로 제한했다[5]. 남미에서는 브라질이 2024년 9월 30일 공포한 법률 14.990호로 저탄소 수소 개발 프로그램을 만들고, 2028~2032년 모두 183억 헤알 한도의 세액공제를 경쟁 방식으로 배분하기로 했다[6]. 연도별 한도는 2028년 17억 헤알에서 2032년 50억 헤알로 늘어난다[6].'
        ]
      },
      {
        heading:'한국: 암모니아 혼소에서 수전해로 방향을 틀다',
        easy:'한국은 세계 최초로 청정수소로 만든 전기를 경쟁입찰로 사들이는 시장을 열었습니다. 하지만 석탄과 암모니아를 섞어 태우는 방식이 탈석탄 목표와 맞지 않는다는 비판에 따라 제도를 고치고 있습니다.',
        paragraphs:[
          '2024년 첫 청정수소발전 입찰에서는 한국남부발전의 삼척그린파워 1호기 암모니아 혼소 사업이 낙찰돼 2028~2042년 750GWh를 생산하기로 했다[7]. 그러나 한국전력거래소는 마감일인 2025년 10월 17일 2025년도 입찰을 취소했고, 기후에너지환경부가 이 제도와 2040년 탈석탄 국정과제가 맞지 않는다고 지적한 것이 이유로 설명됐다[7]. 거래소는 삼척그린파워와도 계약 기간을 줄이는 변경 협상을 하기로 했다[7].',
          '정부는 2026년 6월 8일 고시 개정안을 행정예고하며 올해 청정수소발전 500GWh, 일반수소발전 930GWh 물량으로 하반기에 입찰을 열겠다고 밝혔다[8]. 개정안은 석탄·암모니아 혼소를 청정수소발전 지원 대상에서 빼고, 수전해 기반 청정수소 생산을 늘리도록 평가 체계를 바꾸며, 수소 1kg당 배출량 4kgCO2e 이하 인증 연료만 참여하게 했다[8].',
          '국내 기업에는 기회와 위험이 함께 있다. 유럽수소은행 낙찰가가 kg당 0.44~3.49유로로 넓게 퍼진 것은[4] 수전해 설비와 재생에너지 조건에 따라 경제성이 크게 갈린다는 뜻이고, 중국이 수전해 설비 제조 능력의 약 60%를 쥐고 있다는 점은[2] 한국 설비 기업에 가격 압박이 된다. 정부가 혼소 대신 수전해를 우대하기로 한 만큼[8] 국내 수요가 실제 물량으로 이어지는지가 관건이다.'
        ]
      }
    ],
    deepDive:{
      heading:'“발표 용량”과 “낙찰가”를 어떻게 읽어야 하나',
      paragraphs:[
        'IEA의 3,700만t은 발표된 모든 사업을 더한 잠재량이지 예측치가 아닙니다[1]. 실제로 2030년에 가동될 가능성이 높은 물량은 FID·건설 중 사업 400만t과 가능성이 높은 사업을 합친 1,000만t 안팎이어서[1], 발표 숫자와 현실 사이의 간극을 함께 봐야 합니다.',
        '유럽수소은행 3차 경매의 최저 낙찰가는 보도마다 다릅니다. pv magazine은 0.44유로를 최저가로 보도했지만, 같은 기사에 인용된 집행위원회 자료는 0.57~3.49유로 범위를 제시했습니다[4]. 낙찰가는 보조금 액수이지 수소 생산 단가가 아니며, 이전 경매 낙찰 사업 중 일부가 계약을 포기할 수 있다는 점도 고려해야 합니다[3][4].',
        '한국 청정수소발전 입찰의 2026년 일정과 물량은 6월 행정예고 기준이며[8], 2026년 10월 현재 개정안 확정과 입찰 개설 여부는 이 글이 확인한 자료로는 알 수 없습니다. 미국 45V의 착공 기한도 재무부 세부 지침에 따라 해석이 달라질 수 있습니다[5].'
      ]
    },
    keyFacts:[
      {label:'2030년 저배출 수소 잠재량(IEA)',value:'연 3,700만t (전년 4,900만t)',source:1},
      {label:'FID 완료 비중',value:'2030년 사업 계획의 9%',source:2},
      {label:'유럽수소은행 3차 경매',value:'9개 사업·1.1GW·약 10.9억 유로',source:4},
      {label:'미국 45V 착공 기한',value:'2027년 12월 31일',source:5}
    ],
    questions:[
      'IEA가 2025년 리뷰에서 제시한 2030년 저배출 수소 잠재량은 얼마이며, 1년 전보다 얼마나 줄었나요?',
      '한국 정부가 2026년 6월 행정예고한 청정수소발전 입찰 개정안에서 지원 대상에서 빠진 방식은 무엇인가요?',
      '발표된 수소 사업 가운데 최종투자결정까지 가는 비율이 낮은 이유는 무엇일까요?',
      '유럽수소은행 경매에서 같은 해 낙찰가가 kg당 0.44유로에서 3.49유로까지 벌어지는 이유는 무엇일까요?',
      'EU(경매형 보조금), 미국(세액공제 기한 단축), 브라질(2028년부터 세액공제)의 정책 가운데 투자자에게 가장 예측 가능한 신호를 주는 것은 무엇일까요?',
      '내가 철강·화학·발전 등 수소를 쓸 수 있는 업종에서 일한다면, 수소 전환 계획을 세우기 전에 어떤 가격·인증 조건을 먼저 확인해야 할까요?'
    ],
    thoughts:[
      '석탄발전에 암모니아를 섞어 태우는 방식은 탈석탄으로 가는 현실적인 징검다리일까요, 아니면 석탄 설비의 수명을 늘리는 우회로일까요?',
      '청정수소가 회색수소보다 네 배 가까이 비싼 상황에서, 공공 보조금은 발전처럼 대안이 많은 분야보다 철강·비료처럼 대안이 적은 분야에 먼저 가야 할까요?',
      '중국이 수전해 설비 제조의 60%를 차지한 상황에서, 각국이 자국산 설비를 우대하는 정책은 수소 비용을 낮추는 데 도움이 될까요, 방해가 될까요?'
    ],
    sources:[
      {title:'Global Hydrogen Review 2025: Production highlights',publisher:'International Energy Agency',year:'2025',url:'https://www.iea.org/reports/global-hydrogen-review-2025/production-highlights-2',kind:'공식 자료'},
      {title:'Hydrogen project pipeline shrinks 25% but robust expansion expected: IEA',publisher:'S&P Global Commodity Insights',year:'2025',url:'https://www.spglobal.com/energy/en/news-research/latest-news/energy-transition/091225-hydrogen-project-pipeline-shrinks-25-but-robust-expansion-expected-iea',kind:'보도'},
      {title:'EU awards over €1 billion to European hydrogen projects to accelerate the clean transition',publisher:'European Commission',year:'2026',url:'https://ec.europa.eu/commission/presscorner/detail/en/ip_26_1004',kind:'공식 자료'},
      {title:'EU allocates 1.1 GW of electrolyzer capacity in third hydrogen auction, lowest bid comes in at €0.44/kg',publisher:'pv magazine',year:'2026',url:'https://www.pv-magazine.com/2026/05/07/eu-allocates-1-1-gw-of-electrolyzer-capacity-in-third-hydrogen-auction-lowest-bid-comes-in-at-e0-44-kg/',kind:'보도'},
      {title:'Congress Phases Out Energy Tax Credits',publisher:'Pierce Atwood',year:'2025',url:'https://www.pierceatwood.com/alerts/congress-phases-out-energy-tax-credits',kind:'보도'},
      {title:'New law establishes Low-Carbon Hydrogen Development Program in Brazil',publisher:'Mattos Filho',year:'2024',url:'https://www.mattosfilho.com.br/en/unico/law-hydrogen-development-program/',kind:'보도'},
      {title:'이재명 정부, 청정수소발전 입찰 전격 중단…지난해 물량도 기간 단축 검토',publisher:'뉴스타파',year:'2025',url:'https://newstapa.org/article/sZbYU',kind:'보도'},
      {title:'수소발전 입찰시장 물량 확정…청정수소 500GWh, 혼소발전 제외',publisher:'아시아경제',year:'2026',url:'https://view.asiae.co.kr/article/2026060819041231529',kind:'보도'}
    ]
  }
];
