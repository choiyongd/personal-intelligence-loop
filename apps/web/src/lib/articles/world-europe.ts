import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'cybersecurity-explainer',
    industry:'technology',
    topic:'cybersecurity',
    regions:['GLOBAL','EUROPE','IE','ES','FR','NL','GB','DE','BE'],
    type:'news',
    title:'2026년 9월 11일부터 ‘24시간 신고’…EU 사이버복원력법(CRA) 신고 의무 시작과 NIS2 지각생 4개국 제소',
    dek:'EU 시장에 연결 기기와 소프트웨어를 파는 제조사는 2026년 9월 11일부터 실제 악용된 취약점을 24시간 안에 알려야 합니다. 같은 해 7월 집행위원회는 NIS2 지침을 제때 옮기지 않은 4개 회원국을 EU 사법재판소에 넘겼습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'NIS2 지침',meaning:'EU가 에너지·교통·보건 등 핵심 분야 기관에 보안 관리와 사고 보고 의무를 지우는 지침(Directive (EU) 2022/2555)입니다. 지침이라서 각 회원국이 자국법으로 옮겨야 효력이 생깁니다.'},
      {term:'사이버복원력법(CRA)',meaning:'디지털 요소가 들어간 제품, 즉 연결 기기와 소프트웨어에 보안 요건을 부과하는 EU 규정(Regulation (EU) 2024/2847)입니다. 규정이라 회원국 입법 없이 바로 적용됩니다.'},
      {term:'국내법 전환(transposition)',meaning:'EU 지침의 내용을 회원국이 자국 법률로 옮기는 절차입니다. 기한을 넘기면 집행위원회가 위반 절차를 밟을 수 있습니다.'},
      {term:'CSIRT',meaning:'컴퓨터 보안 사고 대응팀입니다. 각 회원국이 지정하며, CRA 신고는 제조사 주 사업장이 있는 나라의 CSIRT로 먼저 들어갑니다.'},
      {term:'단일신고플랫폼(SRP)',meaning:'EU 사이버보안청(ENISA)이 만든 CRA 신고 창구입니다. 한 번 제출하면 관련 기관에 함께 전달됩니다.'}
    ],
    pages:[
      {
        heading:'무엇이 바뀌었나: 제조사의 24시간·72시간 신고',
        easy:'유럽에서 스마트 기기나 소프트웨어를 파는 회사는 이제 해커가 실제로 쓰고 있는 보안 구멍을 발견하면 하루 안에 당국에 알려야 합니다. 신고는 EU가 만든 온라인 창구 한 곳으로 하면 됩니다.',
        paragraphs:[
          'EU 사이버복원력법(CRA)의 신고 의무는 2026년 9월 11일부터 적용됐고, 같은 날 단일신고플랫폼(SRP)이 가동됐다[1]. 신고 대상은 디지털 요소가 들어간 제품에서 실제로 악용되고 있는 취약점과, 제품 보안에 영향을 주는 중대한 사고 두 가지다[1]. 하드웨어와 소프트웨어를 가리지 않고 연결 제품 제조사가 적용 대상이다[2].',
          '제조사는 사실을 인지한 뒤 24시간 안에 조기 경보를, 72시간 안에 상세 신고를 내야 한다[1]. 악용 취약점은 수정·완화 조치가 나온 뒤 14일 안에, 중대 사고는 72시간 신고 뒤 한 달 안에 최종 보고서를 제출해야 한다[1]. 오픈소스 소프트웨어 관리 주체(steward)의 신고 의무는 2027년 12월 11일부터 적용된다[1].',
          '신고는 SRP를 통해 한 번만 하면 되고, 제조사 주 사업장이 있는 회원국의 CSIRT로 전달되면서 특별한 사정이 없으면 ENISA도 동시에 받는다[1]. 해당 CSIRT는 제품이 유통된 다른 회원국 CSIRT와 지체 없이 정보를 공유해야 하며, 정당한 보안상 이유가 있을 때만 공유를 늦출 수 있다[1]. 접속은 다중 인증이 걸린 개인 EU Login 계정으로 하며, 기업당 주 대리인 1명과 부 대리인 최대 20명을 등록할 수 있다[2].',
          'CRA의 나머지 조항, 즉 제품 보안 요건 전반은 2027년 12월 11일부터 적용된다[2]. 필수 보안 요건과 제조사 의무(신고 의무 포함)를 어기면 1,500만 유로 또는 직전 회계연도 전 세계 매출의 2.5% 가운데 큰 금액까지 과징금이 부과될 수 있다[3]. 다만 소기업과 영세기업은 24시간 조기 경보 기한을 놓친 데 대해서는 과징금을 면제받는다[3].'
        ]
      },
      {
        heading:'NIS2: 기한 2년 지나도 끝나지 않은 국내법 전환',
        easy:'NIS2는 발전소, 병원, 교통 같은 중요한 기관이 해킹에 대비하도록 만든 EU 규칙입니다. 그런데 몇몇 나라가 이 규칙을 자기 나라 법으로 옮기지 않아 EU 집행위원회가 법원에 소송을 냈습니다.',
        paragraphs:[
          'NIS2 지침의 국내법 전환 기한은 2024년 10월 17일이었다[4]. 집행위원회는 2024년 11월 28일 미이행 회원국에 공식 통지서를, 2025년 5월 7일 이유부 의견서를 보냈다[4]. 지침은 보건·에너지·교통·공공 부문 등 18개 핵심 분야 기관에 높은 보안 기준을 요구한다[4].',
          '2026년 7월 8일 집행위원회는 아일랜드·스페인·프랑스·네덜란드를 NIS2 전환 미완료로 EU 사법재판소에 제소하고, 일시금과 함께 전환을 마칠 때까지 매일 붙는 이행강제금을 청구했다[4]. 컨설팅사 웨이브스톤 집계로는 2026년 1월 1일 기준 27개 회원국 중 20개국이 전환을 마쳤고, 불가리아·프랑스·아일랜드·룩셈부르크·네덜란드·폴란드·스페인 7개국이 남아 있었다[5].',
          '독일은 2025년 11월 13일 연방하원, 11월 21일 연방참사원을 거쳐 12월 초 NIS2 이행법을 공포·시행했다[5]. 벨기에(2024년 10월 18일)와 이탈리아(2024년 10월 16일)는 기한 무렵에 이미 시행에 들어간 나라로 분류된다[5]. EU 회원국이 아닌 영국과 노르웨이는 각자 별도 입법을 추진하고 있다[5].'
        ]
      },
      {
        heading:'왜 지금인가: 공항과 자동차 공장을 멈춘 공격들',
        easy:'지난해 유럽에서는 공항 체크인 시스템과 대형 자동차 공장이 해킹으로 멈춰 큰 혼란이 있었습니다. 한 회사가 뚫리면 많은 고객사와 협력사가 함께 피해를 본다는 점이 드러났습니다.',
        paragraphs:[
          '2025년 9월 셋째 주 주말, 콜린스 에어로스페이스의 체크인·수하물 위탁 소프트웨어 MUSE가 공격을 받아 런던 히드로, 브뤼셀, 베를린 등 유럽 여러 공항에서 지연과 결항이 이어졌다[6]. ENISA는 제3자 서비스 공급업체가 랜섬웨어 사고를 겪었으며 랜섬웨어 종류가 확인돼 수사기관이 조사 중이라고 밝혔다[6]. 모회사 RTX는 피해가 전자 체크인과 수하물 위탁에 한정되며 수동 체크인으로 대응할 수 있다고 설명했다[6].',
          '2025년 8월 말 재규어 랜드로버(JLR)는 사이버 공격으로 솔리헐·헤일우드·울버햄튼 공장 생산을 몇 주간 멈췄다[7]. 영국 사이버모니터링센터(CMC)는 이 사건의 영국 경제 피해를 19억 파운드로 추산하며, 영국에서 기록된 사이버 사건 가운데 경제적 피해가 가장 큰 사례라고 평가했다[7]. 공급망을 통해 영향을 받은 영국 기관은 5,000곳이 넘는 것으로 집계됐다[7].',
          '두 사건 모두 공급업체 한 곳의 침해가 여러 고객사와 협력사로 번지는 구조를 보여 줬다[6][7]. EU는 CRA로 제품 단위의 보안 의무를, NIS2로 핵심 분야 기관 단위의 보안 의무를 각각 지우고 있다[1][4]. 한국 기업에도 남의 일이 아니다. CRA 신고 의무는 EU 시장에 연결 제품을 내놓는 제조사에 적용되므로[2], 유럽에 가전·IoT·산업용 소프트웨어를 수출하는 한국 제조사는 24시간 신고 체계와 EU Login 기반 대리인 지정을 이미 갖춰야 하는 상황이다[1][2].'
        ]
      }
    ],
    deepDive:{
      heading:'규칙은 생겼지만 집행은 이제 시작입니다',
      paragraphs:[
        'CRA 신고 의무는 회원국 입법 없이 바로 적용되지만, 실제 단속은 회원국 시장감시당국이 맡고 집행 강도도 나라마다 다르게 쌓여 갈 것이라는 분석이 나옵니다[2]. 특히 “실제로 악용되는 취약점”의 판단 기준과 “중대한 사고”의 문턱을 기업이 어떻게 해석하느냐에 따라 신고 건수가 크게 달라질 수 있습니다[1][2]. CSIRT가 보안상 이유로 정보 공유를 늦출 수 있도록 한 예외 조항이 투명성과 충돌할 수 있다는 점도 지켜볼 대목입니다[1].',
        'NIS2 쪽은 전환율 수치를 읽을 때 주의가 필요합니다. 웨이브스톤은 법률 통과 여부와 세부 체계 완비 여부를 나눠 단계로 분류하고 있어[5], “전환 완료”라는 표현이 곧 현장 감독이 작동한다는 뜻은 아닙니다. 사법재판소 제소는 이미 이유부 의견서 단계를 거친 뒤의 마지막 수단이며, 실제 이행강제금 액수는 판결에서 정해집니다[4].',
        '피해 규모 추정에도 한계가 있습니다. JLR 사건의 19억 파운드는 CMC가 공급망 파급까지 포함해 산정한 추정치이며 확정된 손실액이 아닙니다[7]. 공항 사건 역시 결항 건수 같은 구체적 피해 통계는 당시 보도에서 확인되지 않았습니다[6].'
      ]
    },
    keyFacts:[
      {label:'CRA 신고 의무 시작',value:'2026년 9월 11일',source:1},
      {label:'조기 경보 / 상세 신고',value:'24시간 / 72시간',source:1},
      {label:'최대 과징금',value:'1,500만 유로 또는 매출 2.5%',source:3},
      {label:'NIS2 미전환 제소',value:'2026년 7월 8일, 4개국',source:4}
    ],
    questions:[
      'CRA와 NIS2는 규제 대상이 어떻게 다른가요?',
      '악용 취약점을 신고할 때 24시간, 72시간, 14일 기한은 각각 무엇을 요구하나요?',
      '집행위원회가 4개 회원국을 사법재판소에 제소하기까지 어떤 단계를 거쳤나요?',
      '내가 유럽에 IoT 기기를 수출하는 회사의 보안 담당자라면 지금 무엇부터 점검해야 할까요?'
    ],
    thoughts:[
      '24시간 신고 의무가 기업의 취약점 공개를 앞당길까요, 아니면 신고 부담 때문에 내부 은폐를 부추길까요?',
      '공급업체 한 곳의 침해가 수많은 고객사로 번지는 시대에, 보안 책임은 제품 제조사와 사용 기관 사이에서 어떻게 나뉘어야 할까요?'
    ],
    sources:[
      {title:'CRA Reporting',publisher:'European Commission (Shaping Europe’s digital future)',year:'2026',url:'https://digital-strategy.ec.europa.eu/en/policies/cra-reporting',kind:'공식 자료'},
      {title:'It’s Live: The Cyber Resilience Act Reporting Is Mandatory As Of Today, 11 September 2026',publisher:'Mondaq (Crowell & Moring)',year:'2026',url:'https://www.mondaq.com/compliance/1843102/its-live-the-cyber-resilience-act-reporting-is-mandatory-as-of-today-11-september-2026',kind:'보도'},
      {title:'Cyber Resilience Act, Article 64: Penalties (OJ L 2024/2847)',publisher:'SpringLex',year:'2024',url:'https://www.springlex.eu/en/packages/cra/cra-regulation/article-64/',kind:'원문'},
      {title:'Commission refers Ireland, Spain, France and the Netherlands to the Court of Justice for failing to transpose rules (NIS2)',publisher:'European Commission',year:'2026',url:'https://digital-strategy.ec.europa.eu/de/news/commission-refers-ireland-spain-france-and-netherlands-court-justice-failing-transpose-rules',kind:'공식 자료'},
      {title:'NIS 2: Where are European countries in transposing the directive? [updated January 2026]',publisher:'Wavestone',year:'2026',url:'https://www.wavestone.com/en/insight/nis-2-european-countries-transposing-directive/',kind:'보도'},
      {title:'EU agency ENISA says ransomware attack behind airport disruptions',publisher:'Security Affairs',year:'2025',url:'https://securityaffairs.com/182440/security/eu-agency-enisa-says-ransomware-attack-behind-airport-disruptions.html',kind:'보도'},
      {title:'JLR cyber attack may cost UK economy £1.9bn',publisher:'Continuity Insurance & Risk (CIR) Magazine',year:'2025',url:'https://cirmagazine.com/cir/c2025102201.php',kind:'보도'}
    ]
  },
  {
    id:'physics-explainer',
    industry:'science',
    topic:'physics',
    regions:['GLOBAL','EUROPE','CH','FR','DE'],
    type:'research',
    title:'둘레 90.7km, 1단계 153억 스위스프랑: CERN이 LHC 후계로 FCC-ee를 고른 과정과 2028년 결정까지 남은 숙제',
    dek:'CERN 이사회는 2026년 5월 22일 유럽 입자물리 전략을 갱신하며 전자·양전자 미래원형충돌기(FCC-ee)를 차기 주력 사업으로 권고했습니다. LHC는 7월 고광도 업그레이드를 위한 장기 정지에 들어갔고, 건설 여부는 2028년 무렵 결정됩니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'FCC-ee',meaning:'제네바 일대 지하에 둘레 약 91km 터널을 뚫어 전자와 양전자를 충돌시키는 원형 가속기 계획입니다. 힉스 입자를 대량으로 만들어 정밀 측정하는 것이 목표입니다.'},
      {term:'FCC-hh',meaning:'FCC-ee 이후 같은 터널을 재사용해 양성자를 최대 100TeV로 충돌시키는 2단계 계획입니다.'},
      {term:'고광도 LHC(HL-LHC)',meaning:'현재 LHC의 충돌 빈도(광도)를 최대 10배까지 높이는 업그레이드입니다.'},
      {term:'유럽 입자물리 전략',meaning:'CERN 이사회가 수년마다 갱신하는 유럽 입자물리 분야의 장기 우선순위 문서입니다.'},
      {term:'광도(luminosity)',meaning:'가속기에서 일정 시간 동안 일어나는 충돌의 빈도를 나타내는 지표로, 높을수록 드문 현상을 더 많이 관측할 수 있습니다.'}
    ],
    pages:[
      {
        heading:'무엇이 결정됐나: “다음 주력은 FCC-ee”',
        easy:'유럽 입자물리 연구소 CERN이 지금의 거대 가속기 LHC 다음으로 지을 기계로 둘레 약 91km짜리 새 가속기를 공식 추천했습니다. 다만 실제로 지을지는 2028년쯤 다시 결정합니다.',
        paragraphs:[
          'CERN 이사회는 2026년 5월 22일 유럽 입자물리 전략을 갱신하고, 전자·양전자 미래원형충돌기(FCC-ee)를 CERN의 차기 주력 사업으로 권고했다[1]. 이번 갱신 절차는 2024년 3월 시작돼 263건의 의견서를 검토했다[3]. 유럽전략그룹(ESG)은 2025년 12월 1~5일 스위스 아스코나 회의에서 권고안을 마련했고, 이를 12월 12일 제225차 이사회에 제출했다[2].',
          'ESG는 FCC-ee가 실현 불가능하거나 경쟁력이 없을 경우의 대안으로 규모를 줄인(descoped) FCC-ee를 제시했다[2]. 이사회는 2028년까지 FCC-ee 건설 여부를 결정할 계획이며, 과학적·기술적·재정적 타당성과 함께 터널이 지나는 프랑스·스위스의 공공 협의 결과를 고려한다[1]. 그 사이 CERN 집행부는 2년 동안 매년 전략 이행 보고서를 낸다[1].',
          '마크 톰슨 CERN 사무총장은 “이 전례 없는 사업을 이사회 결정까지 이끄는 것이 CERN의 과제”라고 말했다[1]. 전략사무국 의장 카를 야콥스는 FCC-ee의 범위와 비용이 잘 정의돼 있다고 밝혔다[1].'
        ]
      },
      {
        heading:'어떤 기계인가: 숫자로 본 FCC',
        easy:'새 가속기는 지금의 LHC보다 세 배 이상 크고, 땅속 200~400m에 묻힙니다. 15년 동안 힉스 입자 약 300만 개를 만들어 아주 정밀하게 재는 것이 목표입니다.',
        paragraphs:[
          'CERN은 2025년 3월 31일 FCC 타당성 조사 최종 보고서를 공개했다[4]. 보고서에 따르면 링 둘레는 90.7km, 수직갱 깊이는 200~400m이며, 지상 거점 8곳과 실험 4개로 구성된다[4]. 현재 LHC의 둘레는 27km다[3].',
          'FCC-ee는 충돌점 4개를 가진 이중 링으로 최대 365GeV의 질량중심 에너지를 목표로 하며, 이는 선대 가속기 LEP의 209GeV를 넘는다[3]. 15년 운전 동안 Z 보손 약 6×10¹²개, 힉스 보손 약 300만 개, 톱 쿼크 쌍 약 200만 개를 만들어 낼 것으로 예상된다[3].',
          '비용은 토목·기반시설·가속기·검출기 4기를 합쳐 153억 스위스프랑으로 추산되며, 투자는 2030년대 초부터 약 15년에 걸쳐 나뉜다[4]. 독일 언론 하이제는 1단계 비용을 160억 유로로 보도했고, 2025년 12월 억만장자와 재단들이 모두 8억 6,000만 유로를 기부하기로 약정했다고 전했다[3]. 전력 소비는 운전 방식에 따라 연 1.1~1.8TWh로, CERN의 현재 소비량(연 약 1.3TWh)과 비슷한 수준이다[4].',
          '후속 단계인 FCC-hh는 같은 터널에서 양성자를 최대 100TeV로 충돌시키는 계획으로[3], 2070년대 초 가동이 거론된다[4]. FCC-ee 자체의 가동 목표는 2040년대 중후반이다[3].'
        ]
      },
      {
        heading:'그 사이 LHC는: 장기 정지와 고광도 업그레이드',
        easy:'지금의 LHC는 2026년 여름 약 4년간의 대규모 공사에 들어갔습니다. 2030년에 충돌 횟수를 크게 늘린 모습으로 돌아올 예정이며, 이 업그레이드가 당장의 최우선 과제입니다.',
        paragraphs:[
          'LHC는 2026년 6월 말 마지막 물리 빔을 내보낸 뒤 7월 초 3차 장기 정지(LS3)에 공식 돌입했다[6]. CERN은 2024년 10월 일정 조정에서 LHC의 LS3 시작을 2026년 7월 초로, 주입 가속기 복합체의 대규모 작업 시작을 2026년 9월로 잡았다[5]. LS3는 약 4년간 이어지며 가속기는 2028년 중반부터 단계적으로 재가동된다[6].',
          '고광도 LHC(HL-LHC)의 첫 운전(Run 4)은 2030년 6월이 목표이고, 광도를 최대 10배까지 높이는 것이 업그레이드의 목적이다[5][6]. CERN 이사회는 이번 전략 갱신에서도 HL-LHC 완공을 중기 최우선 과제로 재확인했으며, LHC는 2041년 운전 수명을 마칠 예정이다[1].',
          '아시아 쪽 경쟁 구도도 바뀌었다. 중국과학원 고에너지물리연구소(IHEP)가 추진한 원형전자양전자충돌기(CEPC)는 2025년 10월 기술설계보고서를 모두 마쳤지만 중국 제15차 5개년 계획(2026~2030년)에는 포함되지 못했다[8]. 연구 책임자 왕이팡은 2030년 재신청을 계획하되, 그 전에 FCC가 공식 승인되면 CEPC를 접고 FCC 참여를 추진하겠다고 밝혔다[8].'
        ]
      }
    ],
    deepDive:{
      heading:'“잘 정의된 비용”과 “감당할 수 없는 비용” 사이',
      paragraphs:[
        '가장 큰 쟁점은 돈입니다. CERN 예산의 21%를 내는 최대 분담국 독일의 연방교육연구부는 독일 입자물리학자 회의에서 FCC가 “감당할 수 없는 것으로 봐야 한다”며 계획된 재원을 낼 처지가 아니라고 밝힌 바 있습니다[7]. 이 발언은 2024년에 보도된 것이어서 2026년 전략 갱신 이후 독일 정부의 입장이 어떻게 바뀌었는지는 이번에 확인한 자료로는 알 수 없습니다[7]. CERN 집행부는 회원국, EU, 기타 기관과 함께 재정적으로 실행 가능한 재원 계획을 만들어야 하는 과제를 안고 있습니다[3].',
        '비용 수치 자체도 출처마다 다릅니다. 타당성 보고서는 153억 스위스프랑[4], 하이제 보도는 1단계 160억 유로[3]를 제시하는데, 포함 범위와 통화·기준 연도가 달라 단순 비교하기 어렵습니다. 15년 이상의 건설 기간 동안 물가와 환율이 변하면 실제 비용은 또 달라질 수 있습니다[4].',
        '과학적 기대에도 불확실성이 있습니다. FCC-ee의 핵심 성과로 제시되는 힉스·Z·톱 쿼크 생산량은 계획대로 15년을 운전한다는 가정에서 나온 예측입니다[3]. 새로운 입자의 직접 발견이 보장되지 않는 정밀 측정 기계에 이 정도 비용을 쓸 가치가 있는지에 대한 최종 판단은 과학적·기술적·재정적 타당성 검토와 함께 2028년 이사회 결정으로 넘어갔습니다[1].'
      ]
    },
    keyFacts:[
      {label:'전략 갱신 결정',value:'2026년 5월 22일',source:1},
      {label:'FCC 링 둘레',value:'90.7km',source:4},
      {label:'FCC-ee 비용 추산',value:'153억 스위스프랑',source:4},
      {label:'HL-LHC 첫 운전 목표',value:'2030년 6월',source:5}
    ],
    questions:[
      'FCC-ee와 FCC-hh는 각각 무엇을 충돌시키고, 왜 단계를 나눴나요?',
      'CERN이 FCC-ee를 권고하면서 제시한 대안은 무엇인가요?',
      'LHC의 3차 장기 정지 기간에는 어떤 일이 일어나나요?',
      '중국 CEPC가 5개년 계획에서 빠진 것이 FCC 추진에 어떤 영향을 줄 수 있을까요?'
    ],
    thoughts:[
      '새 입자 발견이 보장되지 않는 정밀 측정 장비에 대규모 공공 재정을 투입하는 것을 어떻게 정당화할 수 있을까요?',
      '거대 과학 시설을 한 지역에 집중해 짓는 방식과 여러 나라가 분산 투자하는 방식 중 어느 쪽이 더 지속 가능할까요?'
    ],
    sources:[
      {title:'The CERN Council decided to update the European Strategy for Particle Physics',publisher:'CERN',year:'2026',url:'https://home.cern/the-cern-council-decided-to-update-the-european-strategy-for-particle-physics/',kind:'공식 자료'},
      {title:'European Strategy for Particle Physics reaches important milestone',publisher:'CERN',year:'2025',url:'https://home.cern/european-strategy-particle-physics-reaches-important-milestone/',kind:'공식 자료'},
      {title:'CERN Council Decides on Strategy Update: FCC-ee to Become LHC Successor',publisher:'heise online',year:'2026',url:'https://heise.de/-11305189',kind:'보도'},
      {title:'FCC feasibility study complete',publisher:'CERN Courier',year:'2025',url:'https://cerncourier.com/a/fcc-feasibility-study-complete/',kind:'보도'},
      {title:'Updated schedule for CERN’s accelerators',publisher:'CERN',year:'2024',url:'https://home.cern/updated-schedule-cerns-accelerators',kind:'공식 자료'},
      {title:'Large Hadron Collider waves goodbye as it enters Long Shutdown 3 after nearly 20 years of service',publisher:'Science Times',year:'2026',url:'https://www.sciencetimes.com/articles/62039/20260706/large-hadron-collider-waves-goodbye-it-enters-long-shutdown-3-after-nearly-20-years-service.htm',kind:'보도'},
      {title:'CERN can’t brush off German objections to flagship project',publisher:'Research Professional News',year:'2024',url:'https://www.researchprofessionalnews.com/rr-news-europe-views-of-europe-2024-6-cern-can-t-brush-off-german-objections-to-flagship-project/',kind:'보도'},
      {title:'CEPC matures but approval is on hold',publisher:'CERN Courier',year:'2025',url:'https://cerncourier.com/a/cepc-matures-but-approval-is-on-hold/',kind:'보도'}
    ]
  },
  {
    id:'aging-explainer',
    industry:'health',
    topic:'aging',
    regions:['GLOBAL','EUROPE','DE','IT','KR','ASIA_PACIFIC'],
    type:'article',
    title:'EU 인구 22%가 65세 이상, 한국은 21.6%: 유럽의 장기요양 실험이 초고령 한국에 주는 숫자들',
    dek:'2025년 1월 기준 EU 인구의 22.0%가 65세 이상이고, 이탈리아는 24.7%로 가장 높습니다. 독일 장기요양보험 수급자는 600만 명을 넘었고, 2024년 말 초고령사회에 들어선 한국은 2026년 고령 인구 비중이 21.6%에 이르렀습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'노년부양비',meaning:'생산연령인구(15~64세) 100명이 부양하는 65세 이상 인구의 수입니다.'},
      {term:'초고령사회',meaning:'65세 이상 인구가 전체의 20% 이상인 사회를 말합니다. 7% 이상은 고령화사회, 14% 이상은 고령사회로 부릅니다.'},
      {term:'장기요양(LTC)',meaning:'노화나 질병으로 일상생활을 스스로 하기 어려운 사람에게 오랜 기간 제공하는 돌봄 서비스입니다.'},
      {term:'장기요양보험(Pflegeversicherung)',meaning:'독일이 1990년대에 도입한 사회보험으로, 임금에서 보험료를 걷어 돌봄 비용을 지원합니다. 한국도 2008년 같은 방식의 제도를 도입했습니다.'},
      {term:'바단테(badante)',meaning:'이탈리아에서 노인 가정에 머물며 돌봄을 맡는 가사·돌봄 노동자를 부르는 말입니다.'}
    ],
    pages:[
      {
        heading:'유럽은 얼마나 늙었나: 중위연령 44.9세',
        easy:'유럽연합 인구 다섯 명 중 한 명 이상이 65세 이상입니다. 일하는 나이의 사람 약 세 명이 노인 한 명을 부양하는 구조이고, 이 부담은 앞으로 더 커질 전망입니다.',
        paragraphs:[
          '유럽연합 통계청(Eurostat)에 따르면 2025년 1월 1일 기준 EU 인구에서 65세 이상이 차지하는 비중은 22.0%로, 10년 전보다 2.9%포인트 높아졌다[1]. EU 중위연령은 44.9세로 2015년 42.8세에서 올랐고, 노년부양비는 34.5%로 생산연령인구 3명 남짓이 노인 1명을 부양하는 구조다[1].',
          '회원국 가운데 65세 이상 비중은 이탈리아(24.7%), 포르투갈(24.3%), 불가리아(24.0%) 순으로 높다[1]. 이탈리아는 중위연령(49.1세)과 노년부양비(39.0%)에서도 EU 최고이며, 중위연령이 가장 낮은 나라는 아일랜드(39.6세)다[1].',
          'Eurostat 장래인구추계(EUROPOP2023)는 EU 인구가 2026년 무렵 약 4억 5,330만 명으로 정점을 찍은 뒤 2100년 약 4억 1,950만 명으로 줄 것으로 본다[1]. 같은 추계에서 65세 이상 비중은 2100년 32.5%, 80세 이상 비중은 2025년 6.2%에서 15.3%로 오르고, 노년부양비는 59.7%로 지금의 두 배 가까이 된다[1].'
        ]
      },
      {
        heading:'독일과 이탈리아: 보험으로 돌보는 나라, 가정이 돌보는 나라',
        easy:'독일은 월급에서 보험료를 떼어 돌봄 비용을 대는데, 돌봄이 필요한 사람이 빠르게 늘어 재정이 빠듯해졌습니다. 이탈리아는 가족과, 주로 이민자인 가정 돌봄 노동자에 크게 기대고 있습니다.',
        paragraphs:[
          '독일 연방통계청(Destatis)에 따르면 2023년 12월 장기요양보험법(SGB XI)상 돌봄이 필요한 사람은 약 570만 명으로, 2021년 12월보다 15%(약 73만 명) 늘었다[2]. 이 가운데 86%(약 490만 명)는 집에서 돌봄을 받았고 요양원 거주자는 약 14%(80만 명)였다[2]. Destatis는 증가분 대부분이 2017년 도입된 넓은 돌봄 필요 기준 때문이며, 인구 고령화로 설명되는 몫은 약 10만 명에 불과하다고 분석했다[2].',
          '2025년 독일 사회적 장기요양보험 급여 수급자는 601만 명으로 처음 600만 명을 넘었고, 2015년(267만 명)의 두 배를 웃돌았다[3]. 공적 의료보험 연합회(GKV-Spitzenverband)의 올리버 블라트 위원장은 장기요양보험이 이듬해 최소 70억 유로의 적자를 낼 것으로 전망했다[3]. 니나 바르켄 보건장관은 2026년 5월 개혁안 발표를 예고했으며, 요양원 입소자의 본인부담을 늘리는 방안이 보도되기도 했다[3].',
          '이탈리아는 공적 서비스가 제한적이고 가족 돌봄 비중이 큰 체계로, 가정 돌봄 노동자인 바단테가 사실상 돌봄의 기둥 역할을 한다[6]. 2022년 바단테는 약 107만 명으로 대부분 여성이며, 약 70%가 동유럽·중남미·필리핀 출신 이민자다[6]. 2021년 가사노동 시장의 약 53.5%가 미신고 또는 부분 신고 상태로 추정되며, 정부는 2023년 법령으로 해외 가사노동자 채용 한도를 연 9,500명으로 정했다[6].'
        ]
      },
      {
        heading:'한국과 비교하면: 더 빠른 고령화, 더 낮은 지출',
        easy:'한국은 2024년 말 노인 인구가 20%를 넘어 초고령사회가 됐고, 늙어가는 속도는 유럽보다 훨씬 빠릅니다. 반면 돌봄에 쓰는 나랏돈은 아직 유럽 주요국보다 적습니다.',
        paragraphs:[
          '한국은 2024년 12월 23일 65세 이상 인구가 1,024만 명으로 전체(5,122만 명)의 20%에 이르러 초고령사회에 진입했다[7]. 고령화사회(7%) 진입이 2000년, 고령사회(14%) 진입이 2017년이었으니 고령사회에서 초고령사회까지 7년 남짓 걸린 셈이다[7]. 2026년 65세 이상 인구는 1,112만 명으로 전체의 21.6%이며, 정부는 이 비중이 2036년 약 30%, 2050년 40%를 넘을 것으로 내다본다[8].',
          '지출 규모는 다르다. OECD 「한눈에 보는 보건 2023」 수치를 인용한 정리에 따르면 2021년 GDP 대비 장기요양 지출은 OECD 평균 1.8%, 네덜란드 4.4%, 독일 2.5%, 한국 1.1%였다[5]. 한국 장기요양보험은 독일처럼 사회보험 방식이며 2018년 이후 적자를 내 왔고, 다른 장기요양보험 국가보다 낮은 보험료율이 그 요인 중 하나로 지적됐다[5].',
          'OECD가 2026년 4월 낸 보건 워킹페이퍼는 OECD 국가의 공적 장기요양 지출이 2050년까지 대략 두 배로 늘어 GDP의 2.8%에 이를 것으로 전망했다[4]. 같은 기간 공적 연금 지출은 GDP의 8.8%에서 10%로, 공적 보건 지출은 5.5%에서 8.8%로 늘 것으로 봤다[4]. 한국 독자에게 이는 고령 인구 비중이 EU 평균에 이미 근접한 상황에서 돌봄 지출은 OECD 평균에도 못 미친다는 격차가 앞으로 재정 압박으로 돌아올 수 있다는 뜻이다[1][5][8].'
        ]
      }
    ],
    deepDive:{
      heading:'국가 간 돌봄 지출 비교가 어려운 이유',
      paragraphs:[
        '장기요양 지출 통계는 나라마다 무엇을 장기요양으로 분류하는지가 달라 직접 비교에 한계가 있습니다. 예를 들어 이탈리아는 일부 개인 돌봄·지원 서비스를 장기요양 지출로 보고하지 않아 수치를 그대로 비교하기 어렵다는 지적이 있습니다[5]. 이탈리아처럼 가정 돌봄 노동의 절반 이상이 비공식 영역에 있는 경우 실제 돌봄 부담은 통계보다 훨씬 클 수 있습니다[6].',
        '수급자 수 증가도 해석에 주의가 필요합니다. 독일의 돌봄 필요 인구 증가는 대부분 2017년 기준 확대 때문이며 순수한 고령화 효과는 작다는 것이 Destatis의 분석입니다[2]. 한국 역시 등급 기준이나 서비스 범위를 바꾸면 수급자 수가 크게 달라질 수 있어, 수치 변화를 곧바로 고령화 속도로 읽어서는 안 됩니다.',
        '장기 전망은 가정에 크게 좌우됩니다. OECD 워킹페이퍼는 비용 압력, 건강한 고령화, 생산성 향상 등 시나리오에 따라 지출 경로가 달라질 수 있다고 밝혔고[4], Eurostat 추계 역시 출산율과 이민 가정에 따라 달라지는 추정치입니다[1]. 이 기사의 OECD 국가별 지출 수치는 OECD 원문이 아닌 2023년판 보고서 인용 자료를 통해 확인한 것으로, 2025년판 최신 수치와는 다를 수 있습니다[5].'
      ]
    },
    keyFacts:[
      {label:'EU 65세 이상 비중(2025.1.1)',value:'22.0%',source:1},
      {label:'독일 장기요양 수급자(2025)',value:'601만 명',source:3},
      {label:'한국 65세 이상 비중(2026)',value:'21.6%',source:8},
      {label:'OECD 공적 장기요양 지출 전망(2050)',value:'GDP의 2.8%',source:4}
    ],
    questions:[
      'EU에서 65세 이상 비중과 노년부양비가 가장 높은 나라는 어디인가요?',
      '독일의 돌봄 필요 인구가 크게 늘어난 주된 이유는 무엇인가요?',
      '이탈리아의 돌봄 체계는 독일과 어떤 점에서 다른가요?',
      '내가 한국의 지방자치단체 복지 담당자라면 유럽 사례에서 어떤 교훈을 먼저 가져오겠나요?'
    ],
    thoughts:[
      '돌봄 노동을 이민자에게 크게 의존하는 이탈리아 방식은 한국에서도 대안이 될 수 있을까요, 아니면 어떤 위험이 있을까요?',
      '장기요양보험료를 올리는 것과 본인부담을 늘리는 것 중 세대 간 형평에 더 맞는 방식은 무엇일까요?'
    ],
    sources:[
      {title:'Population structure and ageing (Statistics Explained, data extracted 2 February 2026)',publisher:'Eurostat',year:'2026',url:'https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/1271.pdf',kind:'통계'},
      {title:'Pflegebedürftige in Deutschland, Dezember 2023 (Pressemitteilung)',publisher:'Statistisches Bundesamt (Destatis) via presseportal',year:'2024',url:'https://www.presseportal.de/pm/32102/5933248',kind:'통계'},
      {title:'Gut sechs Millionen Pflegebedürftige – Hohe Erwartungen an Reform',publisher:'evangelisch.de (epd)',year:'2026',url:'https://www.evangelisch.de/inhalte/255615/19-05-2026/gut-sechs-millionen-pflegebeduerftige-hohe-erwartungen-reform',kind:'보도'},
      {title:'Future long-term care expenditure trajectories across OECD countries',publisher:'OECD Health Working Papers',year:'2026',url:'https://www.oecd.org/en/publications/future-long-term-care-expenditure-trajectories-across-oecd-countries_800aba3e-en.html',kind:'학술 자료'},
      {title:'How Is Long-Term Care Handled by OECD Countries?',publisher:'A. Mark Foundation',year:'2024',url:'https://amarkfoundation.org/reports/how-is-long-term-care-handled-by-oecd-countries/',kind:'보도'},
      {title:'En Italie, les « badanti », pilier fondamental du système de soins',publisher:'Le Monde (Assindatcolf 게재본)',year:'2024',url:'https://assindatcolf.it/wp-content/uploads/2024/09/Le-monde-12.9.2024.pdf',kind:'보도'},
      {title:'Korea becomes super-aged society with 20% of population aged 65 or older',publisher:'KED Global',year:'2024',url:'https://www.kedglobal.com/newsView/ked202412240006',kind:'보도'},
      {title:'Over 20% of population over 65 years old this year',publisher:'Korea JoongAng Daily',year:'2026',url:'https://www.koreajoongangdaily.com/korea/over-20-of-population-over-65-years-old-this-year/12900392',kind:'보도'}
    ]
  },
  {
    id:'crypto-explainer',
    industry:'finance',
    topic:'crypto',
    regions:['GLOBAL','EUROPE','US','KR','N_AMERICA','ASIA_PACIFIC'],
    type:'news',
    title:'MiCA 유예 종료(2026년 7월 1일), 지니어스법 시행 임박…원화 스테이블코인법은 15개월째 국회에',
    dek:'EU는 2026년 7월 1일 암호자산 사업자 경과 기간을 끝내고 무인가 업체에 철수를 요구했습니다. 미국 스테이블코인법은 2027년 1월 전후 시행을 앞두고 있지만, 한국 디지털자산기본법은 2026년 10월 현재 국회를 통과하지 못했습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'MiCA',meaning:'EU의 암호자산시장 규정(Markets in Crypto-Assets)입니다. 스테이블코인 발행인과 거래소·수탁업체 같은 암호자산 서비스 제공자를 EU 전역에서 하나의 인가 체계로 규율합니다.'},
      {term:'CASP',meaning:'암호자산 서비스 제공자(Crypto-Asset Service Provider)로, 거래소·수탁·중개 등을 하는 사업자를 말합니다. MiCA 인가를 받으면 EU 전역에서 영업할 수 있습니다.'},
      {term:'지니어스법(GENIUS Act)',meaning:'미국의 결제용 스테이블코인 연방 규제법입니다. 허가받은 발행인만 스테이블코인을 발행할 수 있게 하고 1:1 준비자산을 의무화합니다.'},
      {term:'스테이블코인',meaning:'달러나 원화 같은 법정화폐에 가치를 고정하도록 설계한 암호자산입니다.'},
      {term:'디지털자산기본법',meaning:'한국에서 추진 중인 가상자산 2단계 입법으로, 원화 스테이블코인 발행과 거래소 인가제 등을 담고 있습니다.'}
    ],
    pages:[
      {
        heading:'EU: 유예는 끝났다, 인가 없으면 철수',
        easy:'유럽에서는 2026년 7월부터 정식 인가를 받은 코인 업체만 영업할 수 있습니다. 인가를 못 받은 업체는 새 고객을 받지 말고 질서 있게 문을 닫아야 합니다.',
        paragraphs:[
          'MiCA의 스테이블코인 규정은 2024년 6월 30일, 거래소·지갑 등 사업자 전반에 대한 규정은 2024년 12월 30일부터 적용됐다[3]. 기존 국내법으로 영업하던 업체에 허용된 경과 기간은 최장 2026년 7월 1일에 끝났다[1]. 유럽증권시장청(ESMA)은 그 직전인 2026년 6월 23일 공개 성명을 내고 인가를 받지 못한 CASP에 EU 내 영업을 즉시 질서 있게 정리하라고 요구했다[1].',
          'ESMA 성명에 따르면 무인가 CASP는 EU 신규 고객 유치·계좌 개설·마케팅을 멈추고, 자산 매각·이전이나 포지션 청산에 필요한 서비스만 제공할 수 있다[1]. 고객 자산 보관은 질서 있는 철수에 꼭 필요한 기간에만 허용되며, 잔여 포지션을 자동 청산하는 기한을 고객에게 분명히 알려야 한다[1]. EU 밖 업체는 EU 고객에게 서비스나 권유를 할 수 없고, 고객의 자발적 요청(역권유)은 좁은 예외로만 인정된다[1].',
          '회계·자문법인 에코비스 집계로는 2026년 7월 1일까지 EEA 전역에서 244건의 CASP 인가가 나왔고, 독일·네덜란드·프랑스가 ESMA 등록부에서 앞서 있다[2]. 같은 집계에서 그리스·헝가리·폴란드·루마니아는 기한까지 MiCA 인가를 한 건도 내주지 않았으며, MiCA 이전 플랫폼의 75~80%가 유럽 시장에서 철수했거나 철수 중인 것으로 추정됐다[2].'
        ]
      },
      {
        heading:'미국: 지니어스법, 법은 만들었지만 세부 규칙은 아직',
        easy:'미국은 2025년 여름 스테이블코인을 규제하는 법을 만들었습니다. 다만 실제로 적용하려면 감독 당국이 세부 규칙을 확정해야 하는데, 그 작업이 2026년까지 이어지고 있습니다.',
        paragraphs:[
          '지니어스법은 2025년 6월 17일 상원(68대 30), 7월 17일 하원을 통과했고 7월 18일 대통령 서명으로 법률이 됐다[5]. 법은 허가받은 결제용 스테이블코인 발행인만 발행을 할 수 있게 하고, 달러나 저위험 자산으로 1:1 준비자산을 갖추도록 했다[5]. 발행인은 상환 정책을 공개하고 준비자산 구성을 매월 보고해야 하며, 보유자에게 이자나 수익을 지급할 수 없다[4].',
          '유통 잔액이 100억 달러 미만인 비은행 발행인은 연방 대신 주 규제 체계를 선택할 수 있다[4]. 해외 발행인은 재무장관이 자국 규제를 동등하다고 인정하면 미국 내 허가 발행인이 되지 않고도 영업할 수 있지만, 통화감독청(OCC)에 등록하고 미국 내에 충분한 준비자산을 둬야 한다[4].',
          '법 시행일은 제정 후 18개월이 되는 날과 주요 연방 규제기관의 최종 규칙 발표 후 120일이 되는 날 가운데 이른 날이다[4]. 재무부는 2025년 9월 19일 사전 의견 수렴(ANPRM)을 했고, OCC는 2026년 4월 10일 규칙안을 냈으며, 2026년 6월 기준 연준·OCC 등의 최종 규칙과 주 규제 체계 인증 틀은 아직 확정되지 않았다[5].'
        ]
      },
      {
        heading:'한국: 1단계는 시행, 2단계는 표류',
        easy:'한국은 2024년 여름부터 코인 투자자의 돈을 보호하는 법을 시행하고 있습니다. 하지만 원화 스테이블코인을 누가 발행할지 등을 정하는 다음 법은 아직 국회에서 결론이 나지 않았습니다.',
        paragraphs:[
          '한국의 1단계 입법인 가상자산이용자보호법은 2023년 7월 18일 제정돼 2024년 7월 19일 시행됐다[6]. 이 법은 이용자 예치금을 은행이 보관하게 하고, 사업자에게 이용자 자산과 같은 종류·수량의 가상자산 실보유와 해킹 대비 보험·준비금 적립을 의무화했다[6]. 시세조종 등 불공정거래에는 형사처벌과 부당이득의 2배 상당 과징금을 매길 수 있게 했다[6].',
          '원화 스테이블코인과 거래소 인가제 등을 담은 2단계 디지털자산기본법은 2026년 7월 기준 1년 넘게 국회에 계류돼 있었다[7]. 핵심 쟁점은 금융당국과 한국은행이 요구하는 은행 과반 지분 발행 구조 대 비은행 사업자 진입 확대, 5억~250억 원 사이에서 맞서는 발행인 최소 자기자본, 약 20% 상한과 3년 유예가 거론되는 거래소 대주주 지분 제한이다[7]. 2026년 10월 중순 보도에 따르면 국회 안팎에서 11월 통과 기대가 나오지만 구체적 처리 일정은 확정되지 않았다[8].',
          '한국 기업에 MiCA는 이미 현실적 제약이다. EU 밖 CASP는 EU 고객에게 서비스나 권유를 할 수 없으므로[1], 유럽 이용자를 겨냥하는 국내 거래소·지갑 사업자는 EU 회원국 한 곳에서 인가를 받지 않으면 시장에 들어갈 수 없다[1][2]. 국내 입법이 늦어질수록 법 통과 뒤 준비자산 관리·공시·인가 심사 기준 같은 후속 제도 정비 부담도 커진다는 지적이 나온다[8].'
        ]
      }
    ],
    deepDive:{
      heading:'세 가지 규제 모델을 비교할 때 조심할 점',
      paragraphs:[
        'CASP 인가 건수는 출처와 시점에 따라 다릅니다. 에코비스는 2026년 7월 1일 기준 244건으로 집계했지만[2], ESMA 등록부는 매주 갱신되는 임시 등록부여서 같은 날짜라도 집계 방식에 따라 숫자가 달라질 수 있습니다[1]. “플랫폼 75~80% 철수”도 에코비스의 추정치이며 공식 통계는 아닙니다[2].',
        '미국의 시행 시점은 여전히 유동적입니다. 법 조문상 시행일은 제정 18개월 뒤와 최종 규칙 120일 뒤 가운데 이른 날이고[4], 2026년 6월 기준 주요 최종 규칙이 나오지 않았기 때문에[5] 사실상 2027년 1월 전후가 될 가능성이 큽니다. 다만 그 사이 최종 규칙이 발표되면 일정이 달라질 수 있습니다[4].',
        '한국의 쟁점은 단순한 속도 문제가 아닙니다. 은행 중심 발행은 통화·금융 안정성을, 비은행 진입 확대는 혁신과 경쟁을 앞세우는 선택이어서[7], 어느 쪽으로 결론이 나느냐에 따라 시장 구조가 크게 달라집니다. 이 기사는 2026년 10월 중순까지의 보도에 근거하며, 이후 국회 처리 결과는 반영하지 못했습니다[8].'
      ]
    },
    keyFacts:[
      {label:'MiCA 경과 기간 종료',value:'2026년 7월 1일',source:1},
      {label:'EEA CASP 인가(7월 1일 기준)',value:'244건',source:2},
      {label:'지니어스법 서명',value:'2025년 7월 18일',source:5},
      {label:'가상자산이용자보호법 시행',value:'2024년 7월 19일',source:6}
    ],
    questions:[
      'MiCA 경과 기간이 끝난 뒤 무인가 사업자는 무엇을 할 수 있고 무엇을 할 수 없나요?',
      '지니어스법의 시행일은 어떻게 정해지나요?',
      '한국 디지털자산기본법의 3대 쟁점은 무엇인가요?',
      '내가 EU 이용자를 받고 싶은 국내 거래소의 경영진이라면 어떤 선택지를 검토해야 할까요?'
    ],
    thoughts:[
      '원화 스테이블코인 발행을 은행 중심으로 묶는 것과 기술 기업에 문을 여는 것 중 어느 쪽이 이용자에게 더 이로울까요?',
      'EU·미국·한국의 규제가 서로 다를 때, 국경을 넘는 스테이블코인 결제는 어떤 방식으로 정리돼야 할까요?'
    ],
    sources:[
      {title:'Public Statement: MiCA transitional period ends (ESMA75-113276571-1710)',publisher:'European Securities and Markets Authority (ESMA)',year:'2026',url:'https://www.esma.europa.eu/sites/default/files/2026-06/ESMA75-113276571-1710_Public_Statement_MiCA_transitional_period_ends.pdf',kind:'공식 자료'},
      {title:'MiCA Transitional Period Has Ended: The European Crypto Market After the Deadline',publisher:'ECOVIS',year:'2026',url:'https://ecovis.lt/?p=9652',kind:'보도'},
      {title:'MiCA’s Looming Deadline: Crypto Exchanges Shake-Up Stablecoins',publisher:'Finance Magnates',year:'2024',url:'https://www.financemagnates.com/cryptocurrency/micas-looming-deadline-crypto-exchanges-shake-up-stablecoins/',kind:'보도'},
      {title:'GENIUS Act Passes in US Congress: A Breakdown of the Landmark Stablecoin Law',publisher:'Morgan Lewis',year:'2025',url:'https://www.morganlewis.com/pubs/2025/07/genius-act-passes-in-us-congress-a-breakdown-of-the-landmark-stablecoin-law',kind:'보도'},
      {title:'GENIUS Act 1-Year Implementation Tracker: Where Things Actually Stand',publisher:'Eco',year:'2026',url:'https://eco.com/support/en/articles/15606775-genius-act-1-year-implementation-tracker-where-things-actually-stand',kind:'보도'},
      {title:'[보도자료] 내일(7.19일)부터 ｢가상자산이용자보호법｣이 시행됩니다',publisher:'금융위원회',year:'2024',url:'https://fsc.go.kr/no010101/82682?curPage=96',kind:'공식 자료'},
      {title:'디지털자산기본법, 1년째 국회 표류…스테이블코인·거래소 지분 제한에 발목',publisher:'시사저널',year:'2026',url:'https://www.sisajournal.com/news/articleView.html?idxno=380303',kind:'보도'},
      {title:'디지털자산기본법 11월 통과?…해외는 판 다 깔았다',publisher:'데일리안',year:'2026',url:'https://www.dailian.co.kr/news/view/1701457/%EB%94%94%EC%A7%80%ED%84%B8%EC%9E%90%EC%82%B0%EA%B8%B0%EB%B3%B8%EB%B2%95-11%EC%9B%94-%ED%86%B5%EA%B3%BC%ED%95%B4%EC%99%B8-%ED%8C%90-2026',kind:'보도'}
    ]
  }
];
