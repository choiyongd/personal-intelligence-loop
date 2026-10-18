import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'labor-explainer',
    industry:'business',
    topic:'labor',
    regions:['GLOBAL','EUROPE','ES','KR'],
    type:'article',
    title:'2026년 12월 2일, 유럽 플랫폼 노동의 규칙이 바뀐다: ‘고용 추정’과 알고리즘 관리 규제',
    dek:'EU 플랫폼 노동 지침은 회원국이 2026년 12월 2일까지 국내법에 반영해야 하며, 플랫폼이 일을 통제하면 노동자를 피고용인으로 추정하도록 합니다. 스페인은 이미 2021년 ‘라이더법’으로 같은 길을 걸었고, 한국도 2026년 노동자 추정제를 두고 논쟁 중입니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'플랫폼 노동',meaning:'배달·운송·가사·전문 서비스 같은 일을 앱이나 웹 플랫폼이 중개·배정하는 노동 형태입니다.'},
      {term:'고용 추정(presumption of employment)',meaning:'일정한 사실이 확인되면 일단 고용관계로 보고, 아니라는 증명 책임을 사업주(플랫폼)에게 넘기는 법 기술입니다.'},
      {term:'오분류(misclassification)',meaning:'실질적으로는 피고용인처럼 일하는데 계약상 자영업자로 분류돼 최저임금·사회보험 등 보호에서 빠지는 상황입니다.'},
      {term:'알고리즘 관리',meaning:'업무 배정, 평가, 보수 산정, 계정 정지 같은 결정을 자동화 시스템이 내리거나 보조하는 방식입니다.'},
      {term:'국내법 전환(transposition)',meaning:'EU 지침은 그 자체로 바로 적용되지 않으므로, 회원국이 기한 안에 자국 법률로 옮겨 시행해야 합니다.'}
    ],
    pages:[
      {
        heading:'무엇이 정해졌나: EU 지침 2024/2831',
        easy:'유럽연합은 배달 앱이나 차량 호출 앱처럼 플랫폼을 통해 일하는 사람들의 권리를 지키는 법을 만들었습니다. 플랫폼이 일하는 방식을 사실상 지시하고 통제한다면, 그 사람을 직원으로 보는 것이 출발점이 됩니다. 각 나라는 2026년 12월 2일까지 이 내용을 자기 나라 법에 담아야 합니다.',
        paragraphs:[
          '「플랫폼 노동의 근로조건 개선에 관한 지침(EU) 2024/2831」은 2024년 10월 23일 채택됐고, 회원국은 이를 이행하는 법령을 2026년 12월 2일까지 시행해야 한다[1]. EU 이사회는 2023년 12월 13일 유럽의회와 잠정 합의를 이룬 뒤 2024년 10월 14일 지침을 최종 채택했다[2].',
          '규제의 배경에는 규모가 있다. EU 이사회 자료에 따르면 2022년 EU의 디지털 플랫폼 노동자는 2,830만 명으로 제조업 고용(2,900만 명)과 맞먹었고, 2025년에는 4,300만 명까지 늘어날 것으로 전망됐다[2]. 이 가운데 93%(2,630만 명)가 자영업자로 분류돼 있었는데, 약 500만 명은 잘못 분류된 것으로 추정됐다[2]. 또 플랫폼 노동자의 약 55%가 자국의 시간당 순최저임금보다 적게 벌고, 플랫폼 노동 시간의 약 41%는 일감 대기나 탐색처럼 보수가 없는 시간으로 집계됐다[2].',
          '지침의 핵심은 고용 추정이다. 통제와 지휘를 보여 주는 사실이 확인되면 플랫폼과 노동자의 관계는 법적으로 고용관계로 추정되고, 플랫폼은 고용관계가 아님을 스스로 증명해야만 이를 뒤집을 수 있다[1]. 회원국별로 이 추정을 언제, 어떤 절차로 적용할지는 국내법에서 구체화된다[1].',
          '두 번째 축은 알고리즘 관리다. 플랫폼은 자동화된 감시·의사결정 시스템을 쓴다는 사실을 노동자와 그 대표, 요청 시 관계 당국에 알려야 하고, 자동화된 결정이 근로조건과 평등 대우에 미치는 영향을 사람이 점검하도록 충분한 인력을 두어야 하며 그 담당자에게는 결정을 뒤집을 권한이 주어져야 한다[1]. 또한 감정·심리 상태, 사적 대화, 노조 활동 가능성 예측, 인종·이주 신분·정치 성향·건강 상태 추론 등에 쓰이는 개인정보 처리는 금지된다[1].'
        ]
      },
      {
        heading:'먼저 걸어간 나라: 스페인 라이더법과 글로보',
        easy:'스페인은 EU보다 먼저 2021년에 배달 라이더를 원칙적으로 직원으로 보는 법을 만들었습니다. 그 뒤 큰 배달 회사가 벌금과 거액의 사회보험료 청구를 받았고, 결국 라이더를 직접 고용하는 방식으로 바꿨습니다.',
        paragraphs:[
          '스페인의 「왕령법 9/2021」, 이른바 라이더법은 2021년 5월 11일 승인돼 5월 12일 관보에 실렸고, 공포 3개월 뒤 시행됐다[3]. 이 법은 디지털 플랫폼을 운영하는 회사가 알고리즘 관리를 통해 직간접적으로 업무를 지휘·통제하는 경우, 유상으로 상품을 배달하는 사람을 노동자법(Estatuto de los Trabajadores)의 적용 범위에 포함되는 것으로 추정하도록 했다[3].',
          '라이더법은 알고리즘 투명성 조항도 함께 담았다. 노동자법 제64.4조에 새 항목을 넣어, 근로조건·채용·고용 유지·프로파일링에 영향을 주는 알고리즘이나 인공지능 시스템의 기준과 지침을 사업장 노동자 대표(works council)에 알리도록 의무화했다[3]. EU 지침의 정보 제공 의무는 이 구조를 EU 전체로 넓힌 형태로 볼 수 있다[1][3].',
          '집행은 대형 배달 플랫폼 글로보(Glovo)에 집중됐다. EU 산하 연구기관 유로파운드(Eurofound)에 따르면 스페인 사회보장 당국은 2025년 7월 글로보에 미납 사회보험료와 벌금으로 4억 5,000만 유로를 청구했고, 노동감독관은 라이더법 시행 뒤 글로보가 바꾼 자영업 모델도 법을 충족하지 못한다고 판단했다[4]. 모회사 딜리버리히어로는 잠재적 부담을 5억 2,000만~8억 6,000만 유로로 추산했다[4].',
          '결국 글로보는 스페인에서 라이더를 직고용하는 모델로 전환한다고 발표했고, 딜리버리히어로는 이 전환이 2025년 이익에 약 1억 유로의 부담이 될 것으로 내다봤다[5]. 유로파운드 기록에 따르면 글로보는 2025년 6월까지 라이더 1만 4,000명을 급여 노동자로 채용했다[4].'
        ]
      },
      {
        heading:'한국은 어디쯤: 88만 명과 노동자 추정제 논쟁',
        easy:'한국에도 앱으로 일감을 받는 사람이 수십만 명 있습니다. 정부는 2026년 초, 일하는 사람을 일단 노동자로 보고 사업주가 아니라는 것을 증명하게 하는 제도를 추진한다고 밝혔지만, 노동계와 경영계 모두 불만을 내놓고 있습니다.',
        paragraphs:[
          '고용노동부와 한국고용정보원의 「2023년 플랫폼종사자 실태조사」에 따르면 한국의 플랫폼 종사자는 2023년 88만 3,000명으로 전년(79만 5,000명)보다 11.1% 늘었다[6]. 다만 IT 서비스(141.2%)와 전문 서비스(69.4%) 분야가 크게 늘어난 반면 배달·운전은 5.5% 줄었다[6].',
          '정부는 2026년 1월 20일 「일하는 사람의 권리에 관한 기본법」 제정과 노동자 추정제를 담은 입법 패키지를 발표했다[7]. 민사 분쟁에서 타인의 사업을 위해 노무를 제공한 사람은 노동자로 추정되고, 그렇지 않다는 증명 책임은 사업주가 지며, 보호 대상에서 빠진 사람은 최소 570만 명에서 최대 860만 명으로 추산됐다[7]. 노동계는 근로기준법상 노동자 정의 자체를 넓히지 않아 반쪽짜리라고 비판했다[7].',
          '2026년 6월 17일 국회노동포럼 토론회 자료에 따르면 국세청 기준 사업소득(3.3%) 원천징수 대상 비임금 노동자는 869만 명이지만 산재보험 가입률은 16.1%, 고용보험 가입률은 10.3%에 그쳤고, 이 시점까지 기본법과 노동자 추정제는 국회를 통과하지 못한 상태였다[8].',
          '유럽 시장에 진출하거나 유럽 플랫폼과 거래하는 한국 기업에도 이 흐름은 남의 일이 아니다. EU 지침은 자동화된 결정에 대한 사람의 검토와 개인정보 처리 제한을 요구하므로, 배정·평가 알고리즘을 설명하고 기록하는 체계를 미리 갖추는 것이 실무 과제가 된다[1].'
        ]
      }
    ],
    deepDive:{
      heading:'쟁점: 추정은 출발점일 뿐, 숫자와 기준은 나라마다 다릅니다',
      paragraphs:[
        'EU 이사회가 인용한 2,830만 명, 오분류 500만 명이라는 수치는 2022년 기준 추정치이며, 2025년 4,300만 명이라는 숫자도 전망치입니다[2]. 플랫폼 노동은 부업과 본업이 섞여 있고 여러 앱을 동시에 쓰는 경우가 많아 측정 방법에 따라 규모가 크게 달라질 수 있다는 점을 감안해야 합니다.',
        '한국 통계의 신뢰성도 쟁점입니다. 2023년 조사는 15~69세 5만 명 표본으로 진행됐고[6], 정부는 노동자 추정제의 보호 대상 규모를 570만~860만 명이라는 넓은 범위로 제시했습니다[7]. 국회 토론회에서 쓰인 869만 명은 국세청 원천징수 자료에 기반한 수치로, 프리랜서와 예술인까지 포함한 개념이어서 플랫폼 종사자 수와 직접 비교하기는 어렵습니다[8].',
        '스페인 사례는 법 조문만으로 시장이 바뀌지 않는다는 점도 보여 줍니다. 라이더법 시행 후에도 글로보가 자영업 모델을 유지하다가 대규모 사회보험료 청구를 받고서야 전환했다는 점에서[4][5], EU 지침의 실효성 역시 회원국이 2026년 12월 2일 이후 감독과 제재를 얼마나 실제로 집행하느냐에 달려 있습니다[1].'
      ]
    },
    keyFacts:[
      {label:'EU 지침 국내법 전환 기한',value:'2026년 12월 2일',source:1},
      {label:'EU 플랫폼 노동자(2022)',value:'2,830만 명, 오분류 약 500만 명',source:2},
      {label:'스페인 당국의 글로보 청구액',value:'4억 5,000만 유로(2025년 7월)',source:4},
      {label:'한국 플랫폼 종사자(2023)',value:'88만 3,000명(전년 대비 11.1% 증가)',source:6}
    ],
    questions:[
      '플랫폼이 고용관계가 아님을 증명하려면 어떤 사실을 보여 줘야 할까요? 근무 시간 선택권만으로 충분할까요?',
      '알고리즘의 결정을 사람이 검토하고 뒤집을 수 있게 하면, 플랫폼의 효율성과 노동자 보호는 어떻게 균형을 이룰까요?',
      '스페인처럼 직고용으로 전환하면 라이더가 일할 수 있는 시간이나 인원은 어떻게 달라질까요?',
      '한국의 노동자 추정제가 민사 분쟁에만 적용된다면, 실제 현장에서는 어떤 한계가 생길까요?'
    ],
    thoughts:[
      '고용 추정은 ‘누가 증명하느냐’를 바꾸는 장치입니다. 정보와 데이터가 플랫폼 쪽에 몰려 있다는 점을 생각하면, 증명 책임의 이동은 생각보다 큰 변화일 수 있습니다.',
      '규제가 강해질수록 플랫폼은 인력 수를 줄이거나 근무 시간을 묶는 방식으로 대응할 수 있습니다. 보호의 범위와 일자리의 유연성 사이 선택을 각 나라가 어떻게 하는지 지켜볼 만합니다.'
    ],
    sources:[
      {title:'Directive (EU) 2024/2831 on improving working conditions in platform work',publisher:'European Agency for Safety and Health at Work (EU-OSHA)',year:'2024',url:'https://osha.europa.eu/en/legislation/directive/directive-20242831eu-platform-work',kind:'공식 자료'},
      {title:'Digital platform workers in the EU',publisher:'Council of the European Union',year:'2025',url:'https://www.consilium.europa.eu/en/policies/digital-platform-workers-in-the-eu/',kind:'공식 자료'},
      {title:'Spain: The new ‘Rider Law’ presumes employment status and imposes information duties on algorithms',publisher:'Garrigues',year:'2021',url:'https://www.garrigues.com/en_GB/new/spain-new-rider-law-presumes-employment-status-and-imposes-information-duties-algorithms',kind:'보도'},
      {title:'Glovo faces €450m Spanish social security bill for misclassifying riders',publisher:'Eurofound Platform Economy Database',year:'2025',url:'https://apps.eurofound.europa.eu/platformeconomydb/glovo-faces-450m-spanish-social-security-bill-for-misclassifying-riders-110271',kind:'공식 자료'},
      {title:'Drivers for Spanish food delivery app Glovo will become full-time employees',publisher:'AP / ABC News',year:'2025',url:'https://abcnews.go.com/Business/wireStory/drivers-spanish-food-delivery-app-glovo-become-full-116377082',kind:'보도'},
      {title:'플랫폼종사자 11.1% 증가…배달·운전은 감소',publisher:'이투데이',year:'2024',url:'https://www.etoday.co.kr/news/view/2387442',kind:'보도'},
      {title:'Korea moves to extend labor protections to 8.6 mil. freelancers, platform workers',publisher:'The Korea Times',year:'2026',url:'https://www.koreatimes.co.kr/southkorea/society/20260120/korea-moves-to-extend-labor-protections-to-86-mil-freelancers-platform-workers',kind:'보도'},
      {title:'비임금노동자 16%만 사회보험…당연가입 규정 필요해',publisher:'뉴시스',year:'2026',url:'https://www.newsis.com/view/NISX20260617_0003672458',kind:'보도'}
    ]
  },
  {
    id:'architecture-explainer',
    industry:'design',
    topic:'architecture',
    regions:['GLOBAL','EUROPE'],
    type:'research',
    title:'건물이 세계 에너지의 32%를 쓴다: EU 건물에너지성능지침 개정과 2030년 ‘무배출 건물’',
    dek:'건물은 세계 에너지 소비의 32%, 이산화탄소 배출의 34%를 차지합니다. EU는 2030년부터 모든 신축 건물을 무배출 건물로 짓도록 했지만, 2026년 5월 국내법 전환 기한은 27개 회원국 모두가 지키지 못했습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'EPBD',meaning:'EU 건물에너지성능지침(Energy Performance of Buildings Directive). 2024년 개정판의 번호는 (EU) 2024/1275입니다.'},
      {term:'무배출 건물(ZEB)',meaning:'에너지 수요가 매우 낮고 현장에서 화석연료 배출이 없으며, 남은 수요를 재생에너지로 충당하는 건물을 EU가 부르는 이름입니다.'},
      {term:'최소 에너지성능 기준(MEPS)',meaning:'일정 수준에 못 미치는 건물을 정해진 기한까지 개보수하도록 강제하는 기준입니다.'},
      {term:'전 과정 지구온난화지수(GWP)',meaning:'자재 생산부터 시공·사용·철거까지 건물의 일생 동안 발생하는 온실가스를 합산한 지표입니다.'},
      {term:'뉴 유러피언 바우하우스(NEB)',meaning:'지속가능성·아름다움·포용성을 함께 추구하는 EU의 건축·도시 디자인 정책 프로그램입니다.'}
    ],
    pages:[
      {
        heading:'왜 건물인가: 에너지 32%, 이산화탄소 34%',
        easy:'우리가 사는 집과 일하는 사무실은 난방·냉방·조명에 많은 에너지를 씁니다. 전 세계 에너지의 약 3분의 1이 건물에서 쓰이고, 이산화탄소 배출도 비슷한 비중입니다. 그래서 기후 대응에서 건물을 빼놓을 수 없습니다.',
        paragraphs:[
          '유엔환경계획(UNEP)과 건물·건설 글로벌연합(GlobalABC)이 2025년 3월 17일 낸 「2024/2025 건물·건설 부문 글로벌 현황 보고서」에 따르면 건물 부문은 세계 에너지의 32%를 소비하고 이산화탄소 배출의 34%를 차지한다[4][5]. 보고서는 2024년 건물 부문 배출이 2020년 이후 처음으로 증가를 멈췄다고 밝혔다[5].',
          '같은 보고서에서 건물 부문의 에너지 집약도는 약 10% 낮아졌고 최종 에너지 수요 중 재생에너지 비중은 약 5% 높아졌지만, 신흥국과 개발도상국 신축 건물의 절반 이상은 강력한 에너지 기준 없이 지어지고 있다[5]. 보고서는 주요 배출국은 2028년까지, 나머지 국가는 2035년까지 탄소 제로 건물 에너지 기준을 도입하라고 권고했고, 건물 에너지 효율 투자를 2,700억 달러에서 2030년 5,220억 달러로 늘려야 한다고 봤다[5].',
          '유럽의 사정도 다르지 않다. 유럽연합 집행위원회에 따르면 EU에서 건물은 에너지 소비의 약 40%, 가스 소비의 약 50%를 차지하며, 가정 에너지의 약 80%가 난방·냉방·온수에 쓰인다[1]. EU 건물의 85%는 2000년 이전에 지어졌고 75%는 에너지 성능이 낮지만, 연간 에너지 개보수 비율은 1%에 그친다[1].'
        ]
      },
      {
        heading:'EPBD 개정의 핵심: 2028년, 2030년, 2040년',
        easy:'EU는 2024년에 건물 에너지 규칙을 크게 고쳤습니다. 새로 짓는 공공건물은 2028년부터, 모든 새 건물은 2030년부터 탄소를 내뿜지 않는 건물이어야 합니다. 에너지를 많이 쓰는 오래된 건물도 단계적으로 고쳐야 합니다.',
        paragraphs:[
          '개정 지침 (EU) 2024/1275는 2024년 4월 16일 이사회에서 채택돼 5월 8일 관보에 실렸고 5월 28일 발효됐으며, 회원국의 국내법 전환 기한은 2026년 5월 29일이었다[2]. 새 공공건물은 2028년부터, 그 밖의 모든 새 건물은 2030년부터 무배출 건물이어야 한다[2].',
          '기존 건물에 대해서는 단계별 목표가 붙었다. 주거용 건물은 회원국별로 평균 1차 에너지 사용량을 2030년까지 16%, 2035년까지 20~22% 줄이는 경로를 정해야 하며, 감축분의 최소 55%는 성능이 가장 나쁜 건물의 개보수에서 나와야 한다[1]. 비주거용 건물은 최소 에너지성능 기준을 통해 성능 최하위 16%를 2030년까지, 26%를 2033년까지 개보수하도록 했다[1].',
          '화석연료 보일러는 단계적으로 퇴출된다. 단독 화석연료 보일러에 대한 재정 지원은 2025년 1월 1일부터 금지됐고, 국가 건물 개보수 계획에는 2040년까지 화석연료 보일러를 퇴출하는 로드맵이 담겨야 한다[1][2]. 태양광 설치 준비 의무는 연면적 250㎡ 초과 신축 공공·비주거 건물에 2026년 12월 31일부터, 신축 주거 건물에 2029년 12월 31일부터 적용된다[2].',
          '건물의 일생 전체를 보는 지표도 도입된다. 연면적 1,000㎡ 초과 신축 건물은 2028년 1월부터, 모든 신축 건물은 2030년 1월부터 에너지성능인증서에 전 과정 지구온난화지수를 표시해야 한다[1]. 회원국은 2025년 12월 31일까지 국가 건물 개보수 계획 초안을, 2026년 12월 31일까지 최종안을 제출해야 한다[1].'
        ]
      },
      {
        heading:'디자인의 역할과 현실의 지연',
        easy:'규칙만으로 건물이 바뀌지는 않습니다. EU는 아름답고 친환경적이며 누구나 쓰기 좋은 건축을 지원하는 프로그램도 운영합니다. 하지만 2026년 5월까지 새 규칙을 자국 법에 완전히 반영한 회원국은 한 곳도 없었습니다.',
        paragraphs:[
          '유럽연합 집행위원회는 2026년 7월 15일, 개정 EPBD의 국내법 전환을 완전히 통보하지 않은 27개 회원국 모두에 이행 촉구 서한을 보냈다[3]. 회원국은 2개월 안에 답변하고 전환을 마쳐야 하며, 답변이 불충분하면 집행위원회는 이유를 붙인 의견(reasoned opinion)을 내는 다음 절차로 갈 수 있다[3].',
          '디자인 측면의 정책 도구는 뉴 유러피언 바우하우스다. 집행위원회는 2025년 3월 2025~2027년 ‘뉴 유러피언 바우하우스 퍼실리티’를 출범시켰고, 연구·혁신 부문은 호라이즌 유럽 안에서 연간 약 1억 2,000만 유로 규모로 운영된다[6]. 이 프로그램은 에너지 효율 건축, 친환경 이동, 순환경제, 시민 참여를 중심으로 동네 단위 전환을 지원하며 약 15개 시범 사업을 계획했다[6].',
          '한국도 비슷한 방향으로 움직이고 있다. 국토교통부는 2025년 1월 「제3차 녹색건축물 기본계획(2025~2029)」을 확정하면서 신축 공공건물의 제로에너지건축물 최소 등급을 5등급에서 4등급으로 높이고, 2025년 6월부터 30세대 이상 민간 공동주택과 연면적 1,000㎡ 이상 민간 건물에 5등급 이상 인증을 의무화했다[7]. 유럽에 건자재·설비를 수출하는 한국 기업이라면 EU 인증서에 전 과정 탄소 지표가 들어가는 2028년 이후를 대비해 제품 단위 탄소 데이터를 갖춰 둘 필요가 있다[1].'
        ]
      }
    ],
    deepDive:{
      heading:'방법과 한계: ‘무배출’의 정의와 비용 논쟁',
      paragraphs:[
        'UNEP 보고서의 32%와 34%는 건물 운영 에너지와 관련 배출을 중심으로 한 수치이며, 시멘트·철강 같은 건자재 생산 배출은 별도로 세계 배출의 18%를 차지한다고 보고됐습니다[5]. 따라서 운영 단계만 줄여서는 건물 부문 탈탄소가 완성되지 않으며, EU가 전 과정 지구온난화지수를 인증서에 넣기로 한 이유도 여기에 있습니다[1].',
        'EU 규칙의 실제 강도는 회원국이 정합니다. 무배출 건물 의무에서 회원국은 일부 건물 유형을 면제할 수 있고, 태양광 의무도 기술적·경제적·기능적으로 가능한 경우에만 적용됩니다[2]. 주거용 건물에는 개별 건물의 강제 개보수 대신 국가 평균 감축 경로가 적용되므로, 같은 지침 아래에서도 나라마다 체감 규제는 크게 다를 수 있습니다[1].',
        '이행 속도도 불확실합니다. 27개 회원국 모두가 2026년 5월 기한을 넘겼다는 사실은[3] 개보수 비용과 주거비 부담을 둘러싼 정치적 부담을 보여 주며, 연 1%에 머문 개보수 비율을 두 배로 높이겠다는 목표가 실현될지는 2026년 말 제출될 국가 개보수 계획을 봐야 판단할 수 있습니다[1].'
      ]
    },
    keyFacts:[
      {label:'건물의 세계 에너지 소비 비중',value:'32%(이산화탄소 배출 34%)',source:4},
      {label:'EU 모든 신축 건물 무배출 의무',value:'2030년부터(공공건물 2028년)',source:2},
      {label:'EU 비주거 건물 개보수 의무',value:'성능 최하위 16%(2030), 26%(2033)',source:1},
      {label:'EPBD 이행 촉구 서한',value:'2026년 7월 15일, 27개 회원국 전부',source:3}
    ],
    questions:[
      '오래된 건물을 고치는 것과 새로 짓는 것 중 탄소 측면에서 어느 쪽이 유리한지는 어떻게 판단할 수 있을까요?',
      '개보수 비용이 임대료 상승으로 이어진다면, 세입자를 보호하면서 개보수를 늘릴 방법은 무엇일까요?',
      '전 과정 탄소 지표가 의무화되면 건축가와 디자이너의 재료 선택은 어떻게 달라질까요?',
      '한국의 제로에너지건축물 인증은 EU의 무배출 건물 기준과 어떤 점에서 다를까요?'
    ],
    thoughts:[
      '건물은 수십 년을 쓰기 때문에 오늘의 설계가 2050년의 배출을 정합니다. 그래서 신축 기준은 미래 배출을 미리 잠그는 장치에 가깝습니다.',
      '27개국 모두가 기한을 놓친 것은 목표가 틀렸다기보다, 비용을 누가 부담할지에 대한 합의가 아직 없다는 신호로 읽을 수 있습니다.'
    ],
    sources:[
      {title:'Energy Performance of Buildings Directive',publisher:'European Commission, DG Energy',year:'2026',url:'https://energy.ec.europa.eu/topics/energy-efficiency/energy-performance-buildings/energy-performance-buildings-directive_en',kind:'공식 자료'},
      {title:'European mandating of building energy performance: EPBD recast adopted',publisher:'McCann FitzGerald',year:'2024',url:'https://www.mccannfitzgerald.com/knowledge/environmental-social-and-governance/legal-regulation-of-energy-performance-of-buildings',kind:'보도'},
      {title:'Commission urges EU countries to implement reinforced building energy rules',publisher:'European Commission, Transition Pathways',year:'2026',url:'https://transition-pathways.europa.eu/construction/news/commission-urges-eu-countries-implement-reinforced-building-energy-rules',kind:'공식 자료'},
      {title:'Here’s how buildings contribute to climate change and what can be done about it',publisher:'UN Environment Programme',year:'2025',url:'https://www.unep.org/news-and-stories/story/heres-how-buildings-contribute-climate-change-and-what-can-be-done-about-it',kind:'공식 자료'},
      {title:'Building sector emissions stall for first time since 2020 but progress remains slow',publisher:'Down To Earth',year:'2025',url:'https://www.downtoearth.org.in/amp/story/climate-change/building-sector-emissions-stall-for-first-time-since-2020-but-progress-remains-slow',kind:'보도'},
      {title:'EU Commission launches New European Bauhaus Facility 2025-2027',publisher:'BayFOR',year:'2025',url:'https://www.bayfor.org/en/news/latest-news/news-detail/5132-eu-commission-launches-new-european-bauhaus-facility-2025-2027-funding-for-sustainable-urban-development.html',kind:'보도'},
      {title:'ZEB 인증 80일→60일로 단축',publisher:'세계일보',year:'2025',url:'https://www.segye.com/newsView/20250101509120',kind:'보도'}
    ]
  },
  {
    id:'media-explainer',
    industry:'design',
    topic:'media',
    regions:['GLOBAL','N_AMERICA','CA','EUROPE','FR','KR'],
    type:'news',
    title:'넷플릭스는 자국 콘텐츠에 얼마를 내야 하나: 캐나다 5% 분담금 철회와 프랑스 투자 의무 강화',
    dek:'캐나다는 2024년 해외 스트리밍 기업에 캐나다 매출 5%를 내도록 했지만, 2026년 7월 정부가 이 분담금을 없애겠다고 법원에 밝혔습니다. 반대로 프랑스는 2026년부터 애니메이션·다큐멘터리 투자 의무를 더해, 넷플릭스 등이 최고행정법원에 소송을 냈습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'기본 분담금(base contributions)',meaning:'캐나다 방송통신위원회(CRTC)가 일정 매출 이상의 스트리밍 기업에 부과한, 매출 일정 비율을 콘텐츠 기금에 내는 의무입니다.'},
      {term:'AVMSD',meaning:'EU 시청각미디어서비스지침. 2018년 개정으로 VOD 서비스에도 유럽 작품 비중 규칙이 적용됩니다.'},
      {term:'유럽 작품 쿼터',meaning:'VOD 카탈로그의 최소 30%를 유럽 작품으로 채우고 눈에 잘 띄게 노출하도록 한 규칙입니다.'},
      {term:'SMAD 법령',meaning:'프랑스의 주문형 시청각 미디어 서비스(SMAD)에 투자 의무를 부과하는 2021년 6월 22일 법령입니다.'},
      {term:'홀드백(windowing)',meaning:'영화가 극장 개봉 뒤 스트리밍 등 다른 창구로 넘어가기까지 기다려야 하는 기간입니다.'}
    ],
    pages:[
      {
        heading:'캐나다: 5% 분담금에서 전면 재검토로',
        easy:'캐나다는 넷플릭스 같은 해외 스트리밍 회사도 캐나다 콘텐츠 제작을 돕도록 매출의 일부를 내게 하는 규칙을 만들었습니다. 그런데 회사들이 소송을 냈고, 2026년 들어 정부가 방향을 바꿔 이 부담금을 없애고 세금으로 지원하겠다고 밝혔습니다.',
        paragraphs:[
          '캐나다 「온라인 스트리밍법」은 2023년 4월 27일 왕실 재가를 받았고, 정부는 같은 해 11월 9일 방송통신위원회(CRTC)에 정책 지침을 내렸다[1]. CRTC는 2024년 6월 4일 규제정책 2024-121을 통해 연 2,500만 캐나다달러 이상 매출을 내며 캐나다 방송사와 계열 관계가 없는 스트리밍 서비스가 매출의 5%를 지정 기금에 내도록 했고, 최종 명령은 2024년 8월 29일 나왔다[1].',
          '아마존, 애플, 스포티파이, 미국영화협회(MPA) 캐나다 지부는 이 결정에 소송을 제기했고, 연방항소법원은 2025년 6월 심리를 열었다[1]. 분담금 납부는 2024년 12월부터 법원의 집행정지로 멈춰 있었다[2].',
          'CRTC는 2026년 5월 21일 연 매출 2,500만 캐나다달러 초과 사업자에 대해 캐나다 소유 방송 그룹은 25%, 비계열·해외 스트리밍 기업은 15%의 새 요건을 정했지만, MPA는 다음 날 이를 차별적이며 미국·멕시코·캐나다 협정(CUSMA) 위반이라고 반발했다[1]. 정부는 2026년 6월 3일 시청각·음악 부문에 연 6억 캐나다달러를 지원하고 CRTC에 규제 방식 재검토를 지시하겠다고 발표했다[1].',
          '이어 2026년 7월 17일 캐나다 법무부는 연방항소법원에 서한을 보내, 정부가 기본 분담금 요건을 없애고 대체 재원을 공공 재정으로 마련할 계획이라고 밝혔다[2]. 새 정책 지침은 관보 게재와 최소 30일의 의견 수렴을 거쳐야 하며, 이후 CRTC가 기존 결정을 되돌리고 새 절차를 시작해야 한다[2].'
        ]
      },
      {
        heading:'유럽: 30% 쿼터와 프랑스의 투자 의무',
        easy:'유럽연합은 스트리밍 서비스 목록의 30% 이상을 유럽 작품으로 채우도록 합니다. 프랑스는 여기서 더 나아가 프랑스에서 번 돈의 일부를 프랑스·유럽 작품 제작에 쓰도록 하고 있고, 2026년에는 그 규칙을 더 촘촘하게 만들었습니다.',
        paragraphs:[
          '2018년 개정된 EU 시청각미디어서비스지침(AVMSD)은 VOD 서비스가 카탈로그의 최소 30%를 유럽 작품으로 채우고 이를 눈에 띄게 노출하도록 했으며, 회원국은 2020년 9월까지 이를 국내법으로 옮겨야 했다[3]. 집행위원회는 2020년 7월 2일 30% 산정 방식과 소규모 사업자 면제 기준을 담은 지침을 발표했다[3].',
          '이행 점검 결과는 엇갈린다. 스페인 규제기관 CNMC의 2022~2023년 점검에서 RTVE Play 같은 국내 VOD는 30%를 넘겼고 일부는 유럽 작품 비중이 90%를 웃돌았지만, 넷플릭스·디즈니플러스·프라임비디오·HBO맥스 등 다국적 서비스는 부분 자료만 내며 형식적으로 쿼터를 충족하는 데 그쳤고 노출 노력은 제한적이었다[4].',
          '프랑스는 쿼터를 넘어 투자 의무를 부과한다. 2021년 6월 22일 SMAD 법령에 따라 해외 스트리밍 기업은 프랑스 매출의 20%를 프랑스·유럽 작품에 투자해야 하며, 당시 규제기관은 연간 투자 규모를 2억 5,000만~3억 유로로 추산했다[5][6]. 2026년 1월부터 적용된 개정 법령 제2025-1421호는 투자 의무의 최소 20%를 애니메이션·창작 다큐멘터리·공연 실황에 배정하도록 했고, 프랑스 연매출 5,000만 유로 초과 사업자는 그중 75%를 미공개 신작에 써야 한다[6].',
          '넷플릭스, 프라임비디오, 디즈니플러스는 2026년 7월 이 개정 법령의 취소를 요구하며 프랑스 최고행정법원(Conseil d’État)에 각각 소송을 냈다[7]. 넷플릭스는 프랑스 콘텐츠에 연 2억 5,000만 유로 이상을 투자하고 있다고 밝혔고, 새 규칙이 해당 장르 투자 의무를 두 배로 늘린다고 주장했다[7].'
        ]
      },
      {
        heading:'한국 콘텐츠에 주는 의미',
        easy:'각 나라가 자국 작품 비율과 투자를 요구하면, 글로벌 스트리밍 회사의 제작비가 어느 나라로 가는지가 달라질 수 있습니다. 한국은 의무 규정이 없는데도 넷플릭스가 큰돈을 투자해 온 나라입니다.',
        paragraphs:[
          '넷플릭스는 2023년 4월 윤석열 당시 대통령의 방미 일정에 맞춰 향후 4년간 한국 콘텐츠에 25억 달러를 투자하겠다고 발표했으며, 이는 연평균 약 6억 2,500만 달러 규모다[8]. 넷플릭스는 2015~2020년 한국 콘텐츠에 약 7억 달러를 썼고, 2021년에는 한국 오리지널에 5억 달러를 투입하겠다고 밝힌 바 있다[8].',
          '유럽의 30% 쿼터와 프랑스의 투자 의무는 글로벌 스트리밍 기업이 제작 예산을 지역별로 나눌 때 규제 대상 국가를 우선하도록 만드는 구조다[3][6]. 의무 규정 없이 시장성과 흥행 실적으로 투자를 끌어온 한국 콘텐츠 산업에는 같은 예산을 두고 규제 국가들과 경쟁하는 환경이 될 수 있다는 점을 염두에 둘 필요가 있다[6][8].',
          '반대로 캐나다 사례는 무역 갈등과 소비자 요금 부담이 이 같은 의무를 되돌릴 수 있음을 보여 준다. 캐나다 정부는 새 요건이 소비자에게 비용으로 전가될 위험을 언급하면서 구독료를 감당 가능한 수준으로 유지하겠다고 밝혔다[1].'
        ]
      }
    ],
    deepDive:{
      heading:'쟁점: 문화 정책인가, 무역 장벽인가',
      paragraphs:[
        '캐나다의 경우 MPA가 2026년 5월 결정을 CUSMA 위반이라고 주장했고, 정부는 CUSMA 의무를 지키겠다는 입장을 밝혔습니다[1]. 다만 7월 법원 서한에서 분담금 폐지 방침을 밝히게 된 직접적 배경이 무역 압박이었는지는 공개 자료로 확인되지 않습니다[2]. 새 체계가 완성되기까지는 관보 게재, 의견 수렴, CRTC의 새 절차가 남아 있어 수년이 걸릴 수 있다는 분석이 있습니다[2].',
        '프랑스 투자 의무 수치는 해석에 주의가 필요합니다. 2억 5,000만~3억 유로라는 추산은 2021년 규제기관의 전망치이며[5], 2026년 개정으로 실제 총액이 얼마나 늘어날지는 공식 집계가 아직 없습니다. 스트리밍 기업들은 이미 유럽에서 가장 무거운 의무라고 주장하고, 프랑스 제작 노조는 카탈로그 위주 투자를 막는 장치라며 지지하고 있습니다[7].',
        'EU 30% 쿼터 역시 숫자만으로 효과를 판단하기 어렵습니다. CNMC 점검처럼 다국적 서비스는 다른 회원국 관할에 속해 자료 제출이 부분적이고, 카탈로그 비중을 채워도 홈 화면 노출이 낮으면 시청으로 이어지지 않을 수 있습니다[4].'
      ]
    },
    keyFacts:[
      {label:'캐나다 기본 분담금(2024)',value:'캐나다 매출의 5%',source:1},
      {label:'캐나다 정부 지원 발표(2026.6.3)',value:'연 6억 캐나다달러',source:1},
      {label:'EU VOD 유럽 작품 최소 비중',value:'카탈로그의 30%',source:3},
      {label:'넷플릭스 한국 투자 약속(2023)',value:'4년간 25억 달러',source:8}
    ],
    questions:[
      '스트리밍 기업에 자국 콘텐츠 투자를 의무화하면, 시청자가 실제로 보는 작품도 달라질까요?',
      '캐나다처럼 기업 분담금을 세금 지원으로 바꾸면, 비용 부담은 누구에게 옮겨 갈까요?',
      '카탈로그 30% 쿼터와 매출 기준 투자 의무 가운데 어느 쪽이 지역 제작 산업에 더 효과적일까요?',
      '한국도 글로벌 스트리밍 기업에 투자 의무를 부과해야 할까요, 아니면 지금처럼 시장에 맡기는 편이 나을까요?'
    ],
    thoughts:[
      '같은 넷플릭스라도 나라마다 내야 하는 몫이 다릅니다. 콘텐츠 규제는 결국 글로벌 제작비를 어느 나라로 끌어올지에 대한 경쟁이기도 합니다.',
      '캐나다가 2년 만에 방향을 바꾼 것은, 문화 정책이 무역 협상과 구독료 문제에서 자유롭지 않다는 점을 보여 줍니다.'
    ],
    sources:[
      {title:'Question Period Note: Implementing the Online Streaming Act (PCH-2026-QP-00001)',publisher:'Canadian Heritage, Government of Canada',year:'2026',url:'https://search.open.canada.ca/qpnotes/record/pch%2CPCH-2026-QP-00001',kind:'공식 자료'},
      {title:'Starting Over: Court Filing Confirms the CRTC’s Streamer Contribution Decisions Are Dead',publisher:'Michael Geist',year:'2026',url:'https://www.michaelgeist.ca/2026/07/starting-over-court-filing-confirms-the-crtcs-streamer-contribution-decisions-are-dead-with-a-full-online-streaming-act-reset-to-come/',kind:'보도'},
      {title:'Commission releases Guidelines on Video sharing platforms and Guidelines on European Works',publisher:'European Commission',year:'2020',url:'https://digital-strategy.ec.europa.eu/en/library/commission-releases-guidelines-video-sharing-platforms-and-guidelines-european-works',kind:'공식 자료'},
      {title:'Spain: CNMC monitoring report on European works quotas and prominence (IRIS 2025-6)',publisher:'European Audiovisual Observatory',year:'2025',url:'https://merlin.obs.coe.int/article/10332',kind:'공식 자료'},
      {title:'Streaming Giants Will Spend Up To $330M Annually On French Content',publisher:'Cartoon Brew',year:'2021',url:'https://www.cartoonbrew.com/law/streaming-giants-will-spend-up-to-330m-annually-on-french-content-but-dont-expect-much-animation-211835.html',kind:'보도'},
      {title:'France tightens on-demand audiovisual media services investment obligations',publisher:'Osborne Clarke',year:'2026',url:'https://www.osborneclarke.com/insights/france-tightens-demand-audiovisual-media-services-investment-obligations',kind:'보도'},
      {title:'France: streamers appeal the new content quota rule',publisher:'Señal News',year:'2026',url:'https://senalnews.com/en/digital/france-streamers-appeal-the-new-content-quota-rule',kind:'보도'},
      {title:'Netflix earmarks $2.5B for original content in South Korea',publisher:'TechCrunch',year:'2023',url:'https://techcrunch.com/2023/04/25/netflix-earmarks-2-5b-for-original-content-in-south-korea',kind:'보도'}
    ]
  },
  {
    id:'edtech-explainer',
    industry:'education',
    topic:'edtech',
    regions:['GLOBAL','EUROPE','EE','KR'],
    type:'article',
    title:'AI가 교실에 들어오는 두 갈래 길: 에스토니아 ‘AI 립’과 한국 AI 교과서의 ‘교육자료’ 전환',
    dek:'에스토니아는 2025년 9월 고교생 2만 명에게 AI 학습 도구를 주며 국가 프로그램을 시작했습니다. 같은 해 한국은 AI 디지털교과서를 한 학기 만에 ‘교육자료’로 바꿨고, 2026년 9월 발표된 PISA 2025는 처음으로 디지털 환경에서의 학습 능력을 측정했습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'생성형 AI',meaning:'질문에 맞춰 글·그림·코드 등을 새로 만들어 내는 인공지능으로, 챗GPT 같은 대화형 서비스가 대표적입니다.'},
      {term:'AI 립(TI-Hüpe)',meaning:'에스토니아가 2025년 시작한 국가 교육 프로그램으로, 학생과 교사에게 AI 학습 도구와 교육을 제공합니다.'},
      {term:'AI 디지털교과서(AIDT)',meaning:'학생별 학습 데이터를 분석해 맞춤형 문제와 설명을 제공하도록 설계된 한국의 디지털 교과서입니다.'},
      {term:'PISA',meaning:'OECD가 만 15세 학생의 읽기·수학·과학 역량을 비교하는 국제 학업성취도 평가입니다.'},
      {term:'디지털 세계에서의 학습',meaning:'PISA 2025에 새로 들어간 혁신 영역으로, 디지털 도구로 정보를 찾고 평가하며 스스로 학습하는 능력을 측정합니다.'}
    ],
    pages:[
      {
        heading:'국제 기준: 유네스코의 경고와 PISA의 새 영역',
        easy:'유네스코는 2023년 학교에서 생성형 AI를 쓰기 전에 정부가 먼저 규칙을 만들어야 한다고 권고했습니다. 그리고 2026년 9월 나온 국제 학력평가 PISA는 처음으로 디지털 환경에서 공부하는 능력을 따로 측정했습니다.',
        paragraphs:[
          '유네스코는 2023년 9월 7일 48쪽 분량의 「교육·연구 분야 생성형 AI 지침」을 발표하고, 각국 정부가 데이터 보호 규정을 마련하고 13세 미만 이용에 제한을 두며 교사 연수를 제공하라고 권고했다[1]. 유네스코가 450여 개 학교와 대학을 조사한 결과, 생성형 AI에 대한 기관 차원의 정책이나 공식 지침을 갖춘 곳은 10%에 못 미쳤다[1].',
          'OECD는 2026년 9월 8일 「PISA 2025 결과」 1권을 공개했으며, 91개국·지역의 15세 학생 76만 명 이상이 참여했다[4]. 이번 평가는 과학·읽기·수학 외에 학생들의 인공지능 활용 등 태도와 행동도 다뤘다[4].',
          '새로 도입된 「디지털 세계에서의 학습」 영역은 기술이 풍부한 환경에서 디지털 도구로 정보를 찾고 평가하며, 문제를 풀고 피드백을 통해 학습을 개선하는 능력을 측정한다[5]. 이 영역의 OECD 평균은 500점이었다[5].'
        ]
      },
      {
        heading:'에스토니아: 대통령이 주도한 ‘AI 립’',
        easy:'에스토니아는 약 30년 전 모든 학교에 컴퓨터와 인터넷을 깐 ‘타이거 립’ 사업으로 유명합니다. 이번에는 고등학생과 교사에게 AI 학습 도구를 주고, 교사 연수부터 시작했습니다.',
        paragraphs:[
          '에스토니아 교육연구부는 2025년 2월 25일 알라르 카리스 대통령의 제안으로 시작된 「AI 립 2025(TI-Hüpe)」를 발표했으며, 2025년 9월 1일 10~11학년 고교생 2만 명과 교사 3,000명을 대상으로 1단계를 시작하고, 2026년 9월에는 직업학교 등을 포함해 학생 3만 8,000명과 교사 2,000명을 추가할 계획을 밝혔다[2]. 정부는 오픈AI·앤트로픽 등 AI 개발사와 협의 중이라고 했고, 이 사업을 약 30년 전 학교에 컴퓨터와 인터넷을 보급한 ‘타이거 립’의 후속으로 규정했다[2].',
          '사업 책임자 이보 비사크는 2026년 6월 10일 인터뷰에서 첫 시범 연도를 마쳤다고 밝히며, 자체 학습 앱 ITI의 누적 학생 이용자가 1만 2,000명이고 매주 약 4,000명이 쓴다고 설명했다[3]. ITI는 답을 바로 주기보다 먼저 질문을 던지도록 설계됐고, 학생 반응은 ‘가능성은 크지만 정말 짜증 난다’로 요약됐다[3].',
          '재원은 정부와 민간이 절반씩 부담하는 구조이며, 타르투대 연구진이 ITI의 효과와 교사·학생의 AI 리터러시를 연구해 2026년 말까지 최종 분석을 낼 예정이다[3]. 향후 6만 명이 넘는 기초학교 교사와 직업학교로 지원을 넓히는 방안도 추진되고 있다[3].'
        ]
      },
      {
        heading:'한국: 한 학기 만에 ‘교과서’에서 ‘교육자료’로',
        easy:'한국은 2025년 3월부터 일부 학년에서 AI 디지털교과서를 쓰기 시작했습니다. 하지만 학부모와 교사의 반대가 이어지자 국회가 법을 바꿔 AI 교과서를 정식 교과서가 아닌 학교가 고를 수 있는 교육자료로 낮췄습니다.',
        paragraphs:[
          'AI 디지털교과서는 2025년 1학기 초등 3·4학년, 중1, 고1의 영어·수학·정보 과목에 도입될 예정이었으나, 학부모와 교사의 반대로 학교가 자율적으로 선택하는 방식으로 바뀌었고 전국 채택률은 약 34%였다[7]. 국회는 2025년 8월 4일 본회의에서 AI 디지털교과서를 교과서가 아닌 ‘교육자료’로 규정하는 초·중등교육법 개정안을 통과시켰다[7].',
          '교육자료로 바뀌면서 무상 보급의 법적 근거가 사라졌고, 2026년 도입 예정이던 초5·6, 중2 수학·영어 AI 교과서 심사도 중단됐다[7]. 천재교육과 YBM은 교육부의 ‘선택적 사용’ 결정 취소 소송을 냈지만, 서울행정법원은 2026년 7월 23일 교육부 안내가 행정처분이 아니라며 각하했다[8]. 업계는 개발에 최소 수백억 원을 투자했다며 손실을 주장하고 있다[8].',
          '한국 학생의 디지털 학습 역량은 국제적으로 높은 편이다. PISA 2025에서 한국은 「디지털 세계에서의 학습」 영역 538점으로 OECD 38개국 중 2~5위였지만, 읽기는 515점에서 501점으로 14점 떨어져 세 과목 중 유일하게 통계적으로 유의한 하락을 보였다[6]. 교육부는 읽기 하락의 배경으로 스마트폰과 소셜미디어 이용 확대를 꼽았다[6].'
        ]
      }
    ],
    deepDive:{
      heading:'쟁점: 무엇을 측정하고, 누가 결정하는가',
      paragraphs:[
        '두 나라의 차이는 기술보다 절차에 있습니다. 에스토니아는 교사 연수를 먼저 하고 고교 일부 학년에서 시작해 단계적으로 넓히며, 대학 연구진의 효과 분석을 병행합니다[2][3]. 한국은 여러 학년·과목에 동시 도입을 추진하다 반발에 부딪혀 자율 선택으로 바꿨고, 결국 법적 지위 자체가 바뀌었습니다[7].',
        '효과를 판단할 근거는 아직 부족합니다. 에스토니아의 이용자 수는 누적 고유 이용자 기준이며, 학습 효과에 대한 최종 분석은 2026년 말에야 나옵니다[3]. 한국의 채택률 34%도 학교가 최소 한 종을 채택했는지를 보는 수치여서, 실제 수업 활용 정도를 보여 주지는 않습니다[7][8].',
        'PISA 결과의 해석에도 주의가 필요합니다. 순위는 표본 오차 때문에 범위로 제시되며, 교육부가 언급한 스마트폰·소셜미디어와 읽기 하락의 관계는 인과를 측정한 결과가 아니라 해석입니다[6]. 또한 OECD 평균 읽기 점수도 476점에서 461점으로 떨어져, 읽기 하락은 한국만의 현상이 아닙니다[6].'
      ]
    },
    keyFacts:[
      {label:'유네스코 조사 중 AI 지침 보유 기관',value:'10% 미만(450여 곳 조사)',source:1},
      {label:'에스토니아 AI 립 1단계(2025.9)',value:'고교생 2만 명, 교사 3,000명',source:2},
      {label:'한국 AI 교과서 교육자료 전환',value:'2025년 8월 4일 국회 통과',source:7},
      {label:'한국 PISA 2025 디지털 학습 영역',value:'538점(OECD 2~5위)',source:6}
    ],
    questions:[
      '학교에서 AI를 쓸 때 답을 바로 알려 주는 도구와 질문을 되묻는 도구 중 어느 쪽이 학습에 더 도움이 될까요?',
      '새 교육 기술을 도입할 때 전국 동시 도입과 단계적 시범 운영은 각각 어떤 장단점이 있을까요?',
      'AI 교과서가 교육자료로 바뀐 뒤, 학교 간 디지털 학습 격차는 커질까요, 줄어들까요?',
      '디지털 학습 점수는 높은데 읽기 점수가 떨어진 결과를 어떻게 해석해야 할까요?'
    ],
    thoughts:[
      'AI 교육의 성패는 기기나 앱보다 교사 연수와 도입 순서에서 갈리는 경우가 많습니다. 에스토니아와 한국의 사례는 같은 기술이 절차에 따라 전혀 다른 결과를 낳을 수 있음을 보여 줍니다.',
      '디지털 도구를 잘 다루는 것과 긴 글을 깊이 읽는 것은 다른 능력입니다. AI 시대 교육은 두 능력을 함께 키우는 방법을 찾아야 합니다.'
    ],
    sources:[
      {title:'UNESCO urges governments to regulate generative AI in schools',publisher:'StateScoop',year:'2023',url:'https://statescoop.com/unesco-urges-governments-regulate-generative-ai-schools/',kind:'보도'},
      {title:'Estonia Announces A Groundbreaking National Initiative: AI Leap Programme to Bring AI Tools to All Schools',publisher:'Estonian Ministry of Education and Research',year:'2025',url:'https://hm.ee/en/news/estonia-announces-groundbreaking-national-initiative-ai-leap-programme-bring-ai-tools-all',kind:'공식 자료'},
      {title:'AI Leap project lead: Students say our model is annoying but full of potential',publisher:'ERR News',year:'2026',url:'https://news.err.ee/1610051425/ai-leap-project-lead-students-say-our-model-is-annoying-but-full-of-potential',kind:'보도'},
      {title:'PISA 2025 Results (Volume I): Future-Ready Students',publisher:'OECD',year:'2026',url:'https://www.oecd.org/en/publications/2026/09/pisa-2025-results-volume-i_5265bfb1.html',kind:'공식 자료'},
      {title:'PISA 2025: Australian students perform above OECD average in all domains',publisher:'Teacher (ACER)',year:'2026',url:'https://teachermagazine.com/au_en/articles/pisa-2025-results',kind:'보도'},
      {title:'스마트폰·SNS 달고 살더니…한국 학생들, 읽기 성적 14점 뚝',publisher:'머니투데이',year:'2026',url:'https://www.mt.co.kr/policy/2026/09/08/2026090810544016796',kind:'보도'},
      {title:'AI교과서 한 학기 만에 교육자료로…후폭풍 불가피',publisher:'더팩트',year:'2025',url:'https://news.tf.co.kr/read/life/2230700.htm',kind:'보도'},
      {title:'AI교과서 학교별 선택 취소해야 발행사 소송…1심서 각하',publisher:'뉴시스',year:'2026',url:'https://www.newsis.com/view/NISX20260723_0003721107',kind:'보도'}
    ]
  }
];
