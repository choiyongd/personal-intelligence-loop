import type {Article} from './types';

export const articles:Article[]=[
  {
    id:'sports-business-explainer',
    industry:'sports',
    topic:'sports-business',
    regions:['GLOBAL','EUROPE','N_AMERICA','MIDEAST_AFRICA','ASIA_PACIFIC','ES','GB','US','SA','KR'],
    type:'article',
    title:'상위 20개 축구 클럽 매출 124억 유로, NBA 중계권 760억 달러…스포츠에 돈이 몰리는 구조와 사우디의 후퇴',
    dek:'2024/25 시즌 유럽 상위 20개 축구 클럽의 매출이 처음으로 120억 유로를 넘었고, 미국 NBA는 11년 760억 달러 규모의 중계권 시대에 들어섰습니다. 반면 사우디 국부펀드는 2026년 4월 LIV 골프 지원 중단을 발표하며 “스포츠 투자의 수익성”이라는 질문을 던졌습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'중계권(미디어 권리)',meaning:'경기를 TV·스트리밍으로 내보낼 수 있는 권리로, 리그와 구단 매출의 가장 큰 축 가운데 하나입니다.'},
      {term:'풋볼 머니 리그',meaning:'딜로이트가 매년 발표하는 축구 클럽 매출 순위 보고서로, 경기일·중계·상업 매출을 합산해 비교합니다.'},
      {term:'상업 매출',meaning:'스폰서십, 머천다이즈, 프리시즌 투어 등 경기 입장료와 중계권을 제외한 수입입니다.'},
      {term:'PIF(사우디 공공투자기금)',meaning:'사우디아라비아의 국부펀드로, 뉴캐슬 유나이티드와 LIV 골프 등 해외 스포츠 자산에 투자해 왔습니다.'},
      {term:'경기일 매출',meaning:'입장권, 좌석 패키지, 경기장 내 식음료 등 경기가 열리는 날 경기장에서 발생하는 수입입니다.'}
    ],
    pages:[
      {
        heading:'축구와 농구: 기록을 다시 쓰는 매출과 중계권',
        easy:'유럽 최상위 축구 클럽들이 벌어들이는 돈이 해마다 최고 기록을 경신하고 있습니다. 미국 프로농구도 방송사와 역대 최대 규모의 계약을 맺었습니다. 스포츠는 이제 거대한 미디어 산업이기도 합니다.',
        paragraphs:[
          '딜로이트가 2026년 1월 22일 발표한 제29회 풋볼 머니 리그에 따르면 2024/25 시즌 매출 상위 20개 클럽의 합계 매출은 124억 유로로 전 시즌보다 11% 늘었고, 처음으로 120억 유로를 넘었다[1]. 1위 레알 마드리드의 매출은 약 12억 유로였고, 바르셀로나(9억 7,500만 유로), 바이에른 뮌헨(8억 6,100만 유로), 파리 생제르맹(8억 3,700만 유로), 리버풀(8억 3,600만 유로)이 뒤를 이었다[1].',
          '매출 구성을 보면 상업 매출이 53억 유로로 전체의 43%를 차지해 3년 연속 최대 수입원이 됐고, 경기일 매출은 24억 유로로 16% 늘어 전체의 19%를 차지했다[1]. 중계 매출은 10% 증가해 전체의 38%였으며, 확대 개편된 FIFA 클럽 월드컵에 참가한 10개 클럽은 중계 매출이 17% 늘었다[1].',
          '중계권 가격은 리그 단위에서도 오르고 있다. 잉글랜드 프리미어리그는 2023년 12월 5일 스카이스포츠·TNT스포츠와 2025/26~2028/29 시즌 4년간 67억 파운드, 연평균 16억 7,500만 파운드 규모의 영국 내 중계 계약을 맺었다[2]. 스카이는 시즌당 215경기, TNT는 52경기를 생중계한다[2].',
          '미국에서는 NBA가 2024년 7월 24일 디즈니(ABC·ESPN), NBC유니버설, 아마존 프라임비디오와 2025/26 시즌부터 2035/36 시즌까지 11년간 총 760억 달러로 보도된 중계 계약을 발표했다[3]. 기존 중계사였던 워너브러더스디스커버리는 아마존 제안에 맞췄는데도 탈락했다며 이의를 제기했고, 같은 시기 WNBA의 새 계약은 시즌당 약 2억 달러, 총 22억 달러 규모로 보도됐다[3].'
        ]
      },
      {
        heading:'여성 스포츠의 성장과 사우디 투자의 방향 전환',
        easy:'여성 스포츠는 매출이 빠르게 늘며 투자 대상으로 떠올랐습니다. 반대로 스포츠에 막대한 돈을 쏟아붓던 사우디아라비아는 수익을 따지는 쪽으로 방향을 틀고 있습니다.',
        paragraphs:[
          '딜로이트는 2025년 3월 보고서에서 세계 여성 엘리트 스포츠 매출이 2025년 23억 달러를 넘을 것으로 전망했고, 2024년 상업 매출이 처음으로 10억 달러를 넘었다고 밝혔다[4]. 종목별로는 농구가 10억 3,000만 달러(44%)로 축구(8억 2,000만 달러, 35%)를 제치고 최대 종목이 될 것으로 예상됐다[4].',
          '여성 스포츠 매출의 54%(12억 6,000만 달러)는 스폰서십 등 상업 매출이고, 중계는 25%(5억 9,000만 달러), 경기일 매출은 21%(5억 달러)로 추정됐다[4]. 딜로이트는 단기 투자수익률보다 벤처캐피털식 장기 관점의 투자가 필요하다고 권고했다[4].',
          '사우디아라비아의 공공투자기금(PIF)은 뉴캐슬 유나이티드를 4억 900만 달러에 인수하고 애스턴마틴 F1 팀 지분 16.7%를 보유하는 등 스포츠 자산을 공격적으로 사들였다[7]. 2023년에는 스포츠 투자 자회사 서지(Surj)를 세웠고, 2030년까지 스포츠가 국내총생산의 3%를 차지하도록 한다는 목표를 내걸었다[6].',
          '그러나 PIF는 2026년 4월 30일 LIV 골프를 “2026 시즌 잔여 기간까지만” 지원하겠다고 발표했고, 그 배경으로 투자 우선순위와 “현재의 거시 환경”을 들었다[5]. AFP는 PIF가 LIV에 이미 50억 달러 이상을 썼다고 전했고, 일부 추정치는 지난 5년간 지출을 최대 60억 달러로 본다[5][6]. 2026~2030년 PIF 전략은 자산 매입보다 수익 창출과 수익이 나지 않는 자산의 정리를 우선한다[6].'
        ]
      },
      {
        heading:'한국 독자에게 의미하는 것: 관중은 늘지만 돈의 규모는 다르다',
        easy:'한국 프로야구는 2년 연속 관중 기록을 세웠습니다. 하지만 세계 스포츠 시장의 돈은 중계권과 글로벌 스폰서십에서 나오기 때문에, 관중 수만으로는 격차를 좁히기 어렵습니다.',
        paragraphs:[
          'KBO리그는 2025년 1,231만 2,519명의 관중으로 국내 프로스포츠 첫 1,200만 관중 시대를 열었고, 2026년에는 10월 5일 기준 699경기 만에 약 1,236만 명을 기록해 단일 시즌 최다 관중 기록을 다시 썼다[8]. 2026 시즌 경기당 평균 관중은 1만 7,685명으로 전년 같은 경기 수 대비 약 4% 많았다[8].',
          '다만 세계 최상위 구단의 매출 구조에서 경기일 매출 비중은 19%에 그치고, 상업·중계 매출이 80% 이상을 차지한다[1]. 관중 흥행이 중계권 가치와 글로벌 스폰서십으로 이어지지 않으면 매출 규모의 격차는 쉽게 좁혀지지 않는다는 뜻이다.',
          '국가 자본이 스포츠 시장을 떠받치던 구도도 흔들리고 있다. 사우디는 2024년 12월 2034년 FIFA 월드컵 개최권을 확보한 뒤 재정 압박 속에 스포츠 지출을 눈에 띄게 줄였다[6]. 한국 기업이 해외 리그 스폰서십이나 중계권 시장에 참여할 때, 상대방 자본의 지속성까지 따져 봐야 하는 이유다.'
        ]
      }
    ],
    deepDive:{
      heading:'“역대 최대”라는 숫자를 읽을 때 주의할 점',
      paragraphs:[
        '풋볼 머니 리그는 구단 영업 매출을 합산한 순위이며, 선수 이적료 수입은 포함하지 않습니다. 따라서 매출 1위가 곧 이익 1위를 뜻하지는 않습니다. 2024/25 시즌 수치에는 확대 개편된 클럽 월드컵이라는 일회성 요인이 일부 섞여 있어[1], 다음 시즌의 증가율을 그대로 예측하는 근거로 쓰기는 어렵습니다.',
        'NBA의 760억 달러는 리그가 공식 확인한 액수가 아니라 보도된 추정치입니다[3]. 장기 중계권 계약은 스트리밍 가입자 증가와 광고 시장을 전제로 하므로, 계약 후반부에 중계사의 수익성이 맞지 않으면 재협상이나 분쟁 가능성이 생깁니다.',
        '사우디의 LIV 지원 중단은 국부펀드 투자가 정치·외교적 목표와 재무적 수익 사이에서 언제든 재조정될 수 있음을 보여 줍니다[5][6]. 여성 스포츠 성장 전망 역시 딜로이트의 추정치여서[4], 실제 집계가 나오면 수치가 달라질 수 있습니다.'
      ]
    },
    keyFacts:[
      {label:'상위 20개 축구 클럽 매출(2024/25)',value:'124억 유로(+11%)',source:1},
      {label:'NBA 중계권(2025/26~2035/36)',value:'총 760억 달러(보도)',source:3},
      {label:'여성 엘리트 스포츠 매출 전망(2025)',value:'23억 달러 이상',source:4},
      {label:'PIF의 LIV 골프 지출',value:'50억 달러 이상',source:5}
    ],
    questions:[
      '2024/25 시즌 상위 20개 축구 클럽 매출에서 상업·경기일·중계 매출은 각각 몇 퍼센트였나요?',
      'PIF가 LIV 골프 지원 중단 이유로 든 두 가지는 무엇이었나요?',
      '확대된 FIFA 클럽 월드컵이 참가 클럽의 중계 매출을 끌어올린 이유는 무엇이라고 볼 수 있나요?',
      '여성 스포츠에서 농구가 축구를 제치고 최대 매출 종목이 될 것으로 전망된 배경은 무엇일까요?',
      '프리미어리그·NBA의 중계권 모델과 KBO리그의 수익 구조를 비교하면 가장 큰 차이는 어디에 있나요?',
      '여러분의 회사나 브랜드가 스포츠 스폰서십을 검토한다면, 남자 리그와 여자 리그 중 어디에 어떤 기준으로 투자하겠습니까?'
    ],
    thoughts:[
      '국부펀드가 스포츠 구단과 리그를 소유하는 것은 시장의 성장 동력일까요, 아니면 경쟁의 공정성을 해치는 위험 요인일까요?',
      '중계권이 TV에서 아마존 같은 스트리밍 플랫폼으로 옮겨 갈수록, 무료로 스포츠를 볼 권리는 어떻게 지켜져야 할까요?',
      'KBO리그가 관중 1,200만 명의 인기를 글로벌 매출로 바꾸려면 중계권 해외 판매와 구단 브랜드 중 무엇부터 손봐야 할까요?'
    ],
    sources:[
      {title:'Real Madrid tops Deloitte Football Money League',publisher:'Deloitte',year:'2026',url:'https://www.deloitte.com/fi/fi/about/press-room/real-madrid-tops-deloitte-football-money-league.html',kind:'원문'},
      {title:'Premier League agrees record £6.7bn UK broadcast deals with Sky, TNT and BBC',publisher:'Inside World Football',year:'2023',url:'https://www.insideworldfootball.com/2023/12/05/premier-league-agrees-record-6-7bn-uk-broadcast-deals-sky-tnt-bbc/',kind:'보도'},
      {title:'NBA announces 11-year rights deal with Disney, NBCUniversal, Amazon',publisher:'NewscastStudio',year:'2024',url:'https://www.newscaststudio.com/2024/07/24/nba-announces-11-year-rights-deal-with-disney-nbcuniversal-amazon/',kind:'보도'},
      {title:'Women\'s elite sports exceed expectations as revenues projected to surpass US$2.3 billion in 2025',publisher:'Deloitte',year:'2025',url:'https://www.deloitte.com/global/en/about/press-room/womens-elite-sports-exceed-expectations-as-revenues-projected-to-surpass-in-2025.html',kind:'원문'},
      {title:'Saudi wealth fund to cut LIV Golf funding after 2026 season',publisher:'Al-Monitor (AFP)',year:'2026',url:'https://www.al-monitor.com/index%2ephp/originals/2026/04/saudi-wealth-fund-cut-liv-golf-funding-after-2026-season',kind:'보도'},
      {title:'Inside Saudi Arabia\'s costly LIV Golf gamble',publisher:'AGBI',year:'2026',url:'https://www.agbi.com/opinion/business-of-sport/2026/05/inside-saudi-arabias-costly-liv-golf-gamble/',kind:'보도'},
      {title:'Saudi Arabia reportedly launching multibillion-dollar sports investment entity',publisher:'Front Office Sports',year:'2023',url:'https://frontofficesports.com/article/saudi-arabia-reportedly-launching-multibillion-dollar-sports-investment-entity/',kind:'보도'},
      {title:'“KT 우승 확정·김도영 대폭발” KBO리그 1236만 관중 돌파…역대 단일시즌 최다 기록 경신',publisher:'일간스포츠',year:'2026',url:'https://isplus.com/article/view/isp202610050137',kind:'보도'}
    ]
  },
  {
    id:'mega-events-explainer',
    industry:'sports',
    topic:'mega-events',
    regions:['GLOBAL','N_AMERICA','EUROPE','US','CA','MX','IT','ES','AR','NO','KR'],
    type:'news',
    title:'48개국·104경기·681만 관중…2026 북중미 월드컵과 밀라노·코르티나 동계올림픽이 남긴 숫자',
    dek:'2026년 7월 19일 스페인이 아르헨티나를 1-0으로 꺾고 우승하며 사상 첫 48개국 월드컵이 막을 내렸습니다. 관중 기록은 크게 경신됐지만 경제 효과를 둘러싼 논쟁은 남았고, 한국은 월드컵 조별리그 탈락과 동계올림픽 종합 13위라는 성적표를 받았습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'메가 이벤트',meaning:'올림픽·월드컵처럼 전 세계 관심과 대규모 투자가 몰리는 초대형 국제 행사를 말합니다.'},
      {term:'48개국 체제',meaning:'2026년 월드컵부터 본선 참가국을 32개에서 48개로 늘린 방식으로, 경기 수도 64경기에서 104경기로 늘었습니다.'},
      {term:'성적 3위 팀 와일드카드',meaning:'12개 조의 3위 팀 가운데 성적이 좋은 8개 팀이 32강에 합류하는 규칙입니다.'},
      {term:'대체 효과',meaning:'행사로 생긴 소비가 원래 있던 다른 소비를 밀어낸 것에 불과해 경제 전체의 순증가는 작아지는 현상입니다.'},
      {term:'분산 개최',meaning:'한 도시가 아니라 여러 도시·지역의 기존 시설을 나눠 쓰는 대회 운영 방식입니다.'}
    ],
    pages:[
      {
        heading:'사상 첫 48개국 월드컵: 관중 기록과 결과',
        easy:'2026년 월드컵은 미국·캐나다·멕시코 세 나라가 함께 열었고, 참가국이 48개로 늘었습니다. 경기장을 찾은 관중은 역대 최다였고, 우승은 스페인이 차지했습니다.',
        paragraphs:[
          '2026 FIFA 월드컵은 미국·캐나다·멕시코 공동 개최로 열렸고, 사상 처음으로 48개국이 참가해 104경기를 치렀다[2]. 결승전은 2026년 7월 19일 뉴욕·뉴저지 스타디움에서 열렸고, 스페인이 연장 끝에 아르헨티나를 1-0으로 꺾고 우승했다[2][5]. 4강에는 FIFA 랭킹 상위 4개국인 아르헨티나, 스페인, 프랑스, 잉글랜드가 올랐다[5].',
          'FIFA가 결승 직후 발표한 누적 관중은 681만 966명으로, 같은 미국에서 열린 1994년 대회의 약 359만 명 기록을 크게 넘어섰다[2]. FIFA는 결승 직전인 7월 18일 기준으로 경기당 평균 관중 6만 5,351명, 좌석 점유율 99.7%를 기록했다고 밝혔다[1]. 이 시점의 누적 관중은 2018년과 2022년 대회를 합친 643만 6,020명보다도 많았다[1].',
          '확대된 대회는 새로운 이야기도 낳았다. 노르웨이는 처음으로 8강에 올랐고, 캐나다는 16강에 진출했다[5]. 반면 멕시코에서는 40년 만의 녹아웃 스테이지 승리 뒤 군중 압사 사고로 4명이 숨졌다[5].'
        ]
      },
      {
        heading:'경제 효과: 공식 전망과 회의론',
        easy:'FIFA는 월드컵이 미국 경제에 큰 도움이 된다고 전망했습니다. 하지만 많은 경제학자는 실제 효과가 그보다 훨씬 작다고 봅니다.',
        paragraphs:[
          'FIFA와 세계무역기구(WTO)가 2025년 4월 공개한 연구는 2026 월드컵이 미국에서 305억 달러의 총산출과 172억 달러의 GDP, 18만 5,000개의 상근 환산 일자리를 만들 것으로 추정했다[3]. 세계 전체로는 최대 409억 달러의 GDP 기여와 약 82만 4,000개의 일자리를 전망했으며, 분석은 독립 기관 오픈이코노믹스가 맡았다[3].',
          '그러나 골드만삭스는 2026년 6월 3일 보고서에서 1982년 이후 모든 월드컵의 GDP 자료를 분석한 결과, 개최가 실질 산출에 미치는 효과는 “소폭 플러스지만 통계적으로 유의하지 않다”고 결론냈다[4]. 172억 달러라는 공식 추정치도 미국 GDP의 약 0.05%에 불과하다[4].',
          '대회 직전에는 수요 둔화 신호도 나왔다. 미국호텔숙박협회 조사에서 응답 호텔의 80%가 예약이 기존 예상보다 저조하다고 답했다[4]. 회의론자들은 해외 시청자의 소비는 개최국 GDP에 잡히지 않고, 국내 소비는 다른 지출에서 옮겨 온 것일 수 있으며, 스폰서십·라이선스 수익은 다국적 기업으로 빠져나간다고 지적했다[4].'
        ]
      },
      {
        heading:'한국의 성적표와 밀라노·코르티나 동계올림픽',
        easy:'한국 축구는 이번 월드컵에서 조별리그를 통과하지 못했고, 감독이 사퇴했습니다. 2월 동계올림픽에서는 금메달 3개로 목표를 채웠습니다.',
        paragraphs:[
          '한국은 멕시코, 남아프리카공화국, 체코와 함께 A조에 속해 첫 경기에서 체코를 이겼지만 멕시코와 남아공에 잇따라 졌다[6]. 1승 2패로 조 3위가 된 한국은 성적 상위 3위 팀 8곳에 들지 못해 32강 진출에 실패했고, 홍명보 감독은 멕시코 베이스캠프를 떠나기 전 사퇴를 발표했다[6]. 이재명 대통령은 이번 탈락을 제도적 실패로 규정하고 전면 조사를 지시했다[6].',
          '2026년 2월 6~22일 열린 밀라노·코르티나담페초 동계올림픽은 밀라노와 이탈리아 알프스 여러 지역에 경기장을 나눠 쓰는 분산 개최로 치러졌고, 폐회식은 2월 22일 베로나 아레나에서 열렸다[7]. 노르웨이는 금 18개로 단일 동계올림픽 최다 금메달 기록을 세웠고, 미국은 금 12개·총 33개로 자국 동계올림픽 최고 성적을 냈다[7]. 개최국 이탈리아는 금 10개를 포함해 30개의 메달을 땄다[7].',
          '한국은 6개 종목 71명의 선수가 출전해 금 3, 은 4, 동 3개로 종합 13위를 기록하며 금메달 3개 목표를 달성했다[8]. 쇼트트랙의 김길리가 여자 1500m와 3000m 계주에서 2관왕에 올랐고, 최가온은 스노보드 여자 하프파이프에서 금메달을 땄다[8]. 문화체육관광부 차관은 국내 시설 부족으로 해외에서 훈련하는 스노보드 선수들에게 사과하고 개선을 약속했다[8].'
        ]
      }
    ],
    deepDive:{
      heading:'메가 이벤트의 “경제 효과”는 왜 늘 논쟁이 될까',
      paragraphs:[
        'FIFA·WTO 연구는 직접·간접·유발 효과와 무형의 사회적 편익까지 합산하는 영향 분석과 사회적 투자수익률(SROI) 방법을 썼습니다[3]. 이런 사전 추정은 관광객이 원래 했을 다른 소비나, 혼잡과 높은 가격 때문에 오지 않은 일반 방문객을 충분히 빼지 못한다는 비판을 받습니다[4].',
        '관중 수치도 기준을 확인해야 합니다. FIFA는 7월 18일에는 666만 5,825명을, 결승 이후에는 681만 966명을 발표했습니다[1][2]. 참가국과 경기 수가 늘어난 만큼 총관중의 기록 경신은 어느 정도 예정된 결과였으며, 경기당 평균과 좌석 점유율을 함께 봐야 흥행을 공정하게 비교할 수 있습니다[1].',
        '세 나라 공동 개최는 경제 효과를 더 희석합니다. 골드만삭스는 세 개최국이 세계 GDP의 약 30%를 차지해 대회 효과가 비율상 더 작아질 수밖에 없다고 지적했습니다[4]. 반면 분산 개최로 신규 건설을 줄인 밀라노·코르티나 방식은 비용 측면의 대안으로 거론되지만, 장기 평가는 아직 이릅니다[7].'
      ]
    },
    keyFacts:[
      {label:'2026 월드컵 누적 관중',value:'681만 966명',source:2},
      {label:'경기당 평균 관중(7월 18일 기준)',value:'6만 5,351명',source:1},
      {label:'FIFA·WTO 추정 미국 GDP 기여',value:'172억 달러',source:3},
      {label:'한국 동계올림픽 성적',value:'금3·은4·동3, 종합 13위',source:8}
    ],
    questions:[
      '2026 월드컵의 결승 대진과 결과, 그리고 누적 관중은 얼마였나요?',
      '한국이 1승 2패로 조 3위를 하고도 32강에 오르지 못한 규칙상 이유는 무엇인가요?',
      '골드만삭스가 월드컵 개최의 GDP 효과를 “통계적으로 유의하지 않다”고 본 근거는 무엇인가요?',
      '참가국을 48개로 늘린 결정이 관중 기록과 경기 수준에 각각 어떤 영향을 미쳤을까요?',
      '2002 한일 월드컵·2018 평창 올림픽을 치른 한국의 경험과 2026년 두 대회의 운영 방식을 비교해 보세요.',
      '여러분이 일하는 업계에서 메가 이벤트 특수를 노린 마케팅을 기획한다면, 대체 효과를 고려해 어떤 지표로 성과를 측정하겠습니까?'
    ],
    thoughts:[
      '메가 이벤트 유치를 위해 공공 재정을 쓰는 것이 정당하려면 경제 효과 외에 어떤 편익이 입증돼야 할까요?',
      '월드컵 본선을 48개국으로 늘린 것은 축구의 세계화일까요, 아니면 중계권 수익을 늘리기 위한 경기 수의 인플레이션일까요?',
      '동계 종목 선수들이 해외에서 훈련해야 하는 현실을 바꾸려면, 메달 포상과 시설 투자 중 어디에 예산을 더 써야 할까요?'
    ],
    sources:[
      {title:'White House reception: Infantino and President Trump celebrate records',publisher:'FIFA',year:'2026',url:'https://vod.fifa.com/organisation/president/news/white-house-reception-infantino-president-trump-records',kind:'공식 자료'},
      {title:'2026 World Cup sets all-time attendance record with more than 6.8 million spectators',publisher:'The Brussels Times (Belga)',year:'2026',url:'https://www.brusselstimes.com/2238194/2026-world-cup-sets-all-time-attendance-record-with-more-than-6-8-million-spectators',kind:'보도'},
      {title:'FIFA-WTO study estimates USD 47 billion economic output from FIFA Club World Cup and FIFA World Cup in the US',publisher:'FIFA',year:'2025',url:'https://inside.fifa.com/en/news/fifa-wto-study-estimates-usd-47-billion-economic-output-from-fifa-club-world',kind:'공식 자료'},
      {title:'World Cup 2026: big event, small economic impact',publisher:'SGI Europe',year:'2026',url:'https://www.sgieurope.com/sporting-events/world-cup-2026-big-event-small-economic-impact/121493.article',kind:'보도'},
      {title:'More teams, bigger format, same result: 10 takeaways from the 2026 FIFA World Cup',publisher:'South China Morning Post (Reuters)',year:'2026',url:'https://www.scmp.com/sport/football/article/3361246/more-teams-bigger-format-same-result-10-takeaways-2026-fifa-world-cup',kind:'보도'},
      {title:'Korea Republic coach resigns after World Cup failure',publisher:'beIN SPORTS',year:'2026',url:'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/korea-republic-coach-resigns-after-world-cup-failure-2026-06-28',kind:'보도'},
      {title:'Winter Olympics 2026 Milano Cortina final medal tally',publisher:'Outlook India',year:'2026',url:'https://www.outlookindia.com/amp/story/sports/others/winter-olympics-2026-milano-cortina-final-medal-tally-check-full-standings',kind:'보도'},
      {title:'[동계올림픽] 금3·은4·동3 세계 13위…17일간 열전 마친 선수단(종합)',publisher:'더팩트',year:'2026',url:'https://news.tf.co.kr/read/ogmeta/2294843.htm',kind:'보도'}
    ]
  },
  {
    id:'travel-explainer',
    industry:'lifestyle',
    topic:'travel',
    regions:['GLOBAL','EUROPE','ASIA_PACIFIC','N_AMERICA','S_AMERICA','MIDEAST_AFRICA','IT','ES','JP','KR','BR'],
    type:'research',
    title:'2025년 해외여행객 15억 2,000만 명, 2026년 상반기엔 0.4% 증가에 그쳐…베네치아·바르셀로나·일본의 ‘관광세’ 실험',
    dek:'세계 국제관광객은 2025년 15억 2,000만 명으로 늘었지만, 2026년 상반기에는 중동 분쟁과 비용 상승으로 성장이 거의 멈췄습니다. 그 사이 인기 여행지들은 입장료와 관광세를 올리며 과잉관광 대응에 나섰고, 한국은 방한객 1,894만 명으로 코로나 이전 수준을 넘어섰습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'국제관광객 도착',meaning:'외국에서 온 방문객이 최소 1박 이상 머문 경우를 집계한 UN 관광기구의 대표 지표입니다.'},
      {term:'과잉관광(오버투어리즘)',meaning:'관광객이 지역의 수용 능력을 넘어서 주민 생활과 환경, 관광 경험이 함께 나빠지는 현상입니다.'},
      {term:'방문 입장료(Access Fee)',meaning:'베네치아가 당일 방문객에게 특정 날짜에 부과하는 입장료로, 숙박객은 면제됩니다.'},
      {term:'출국세',meaning:'일본이 국적과 관계없이 출국자에게 항공권 등에 붙여 걷는 세금입니다.'},
      {term:'회복률',meaning:'특정 연도의 관광객 수를 코로나19 이전인 2019년 수치와 비교한 비율입니다.'}
    ],
    pages:[
      {
        heading:'세계 관광: 2025년의 회복, 2026년의 정체',
        easy:'2025년 세계 해외여행객 수는 코로나 이전 수준을 넘어 계속 늘었습니다. 그런데 2026년 들어 중동 분쟁과 비싼 항공료 때문에 증가세가 거의 멈췄습니다.',
        paragraphs:[
          'UN 관광기구(UN Tourism)가 2026년 1월 20일 발표한 자료에 따르면 2025년 국제관광객은 약 15억 2,000만 명으로 전년보다 4%, 약 6,000만 명 늘었다[1]. 같은 해 국제관광 수입은 약 1조 9,000억 달러로 5% 증가했다[1].',
          '지역별로는 유럽이 7억 9,300만 명으로 2019년보다 6% 많았고, 아시아·태평양은 3억 3,100만 명으로 6% 늘었지만 여전히 2019년보다 9% 적었다[1]. 아메리카는 2억 1,800만 명으로 1% 증가에 그쳤는데, 3·4분기에는 미국 영향으로 소폭 감소했다[1]. 아프리카는 8% 늘어난 8,100만 명이었고, 국가별로는 브라질이 37% 급증했다[1].',
          '2026년에는 흐름이 꺾였다. UN 관광기구가 2026년 9월 17일 발표한 바에 따르면 2026년 상반기 국제관광객은 약 6억 9,000만 명으로 전년 동기보다 0.4% 늘었고, 2분기에는 1% 감소했다[2]. 2026년 3월 초 시작된 중동 분쟁으로 중동 지역 방문객은 22% 줄었고, 유가와 항공 요금 상승이 다른 지역의 수요에도 부담을 줬다[2].',
          '이에 따라 UN 관광기구는 2026년 국제관광객 증가율 전망을 1월의 3~4%에서 1~2%로 낮췄다[2]. 지역별 상반기 증가율은 아프리카 4%, 유럽 3%, 아메리카 2%, 아시아·태평양 1%였다[2].'
        ]
      },
      {
        heading:'과잉관광 대응: 입장료와 관광세의 확산',
        easy:'관광객이 너무 몰리는 도시들은 방문객에게 돈을 더 받는 방식으로 대응하고 있습니다. 베네치아는 당일치기 입장료를, 바르셀로나와 일본은 숙박세와 출국세를 올렸습니다.',
        paragraphs:[
          '베네치아는 2024년 29일 동안 당일 방문 입장료를 시범 운영해 약 48만 5,000명에게서 약 240만 유로를 걷었고, 2025년에는 54일 동안 약 72만 명, 약 540만 유로로 규모를 키웠다[3]. 2026년에는 4월 3일부터 7월 26일까지 60일로 부과일을 늘렸고, 4일 전까지 예약하면 5유로, 그 이후에는 10유로를 받는다[4]. 부과 시간은 오전 8시 30분부터 오후 4시까지이며 숙박객과 14세 미만은 면제된다[4].',
          '바르셀로나는 2026년 4월 1일부터 관광세를 두 배로 올렸다[5]. 5성급 호텔의 1박 세금은 3.5유로에서 7유로로, 시 추가 부과금은 4유로에서 5유로로 올라 도심 숙박객은 1인 1박 약 12유로를 내게 됐다[5]. 크루즈 승객은 12시간 넘게 머물면 9유로, 12시간 미만이면 11유로를 낸다[5]. 시는 2028년까지 단기 임대 숙소를 완전히 없애겠다는 계획이며, 2025년 방문객은 약 1,600만 명이었다[5].',
          '일본은 2025년 외국인 방문객이 약 4,270만 명으로 처음 4,000만 명을 넘었고, 외국인 관광 소비도 약 9조 5,000억 엔으로 사상 최대를 기록했다[7]. 일본 정부는 관광지 혼잡과 민폐 행위 대책 재원을 마련하기 위해 2026년 7월부터 출국세를 1인당 1,000엔에서 3,000엔으로 올렸다[6]. 출국세 수입은 2024 회계연도 약 525억 엔에서 2026 회계연도 약 1,300억 엔으로 늘어날 것으로 예상된다[6].'
        ]
      },
      {
        heading:'한국의 관광 수지와 한국 여행자에게 미치는 영향',
        easy:'2025년 한국을 찾은 외국인 관광객은 코로나 이전보다 많아졌습니다. 하지만 해외로 나간 한국인이 훨씬 더 많아, 일본 같은 인기 여행지의 세금 인상은 한국인의 여행 비용에도 직접 영향을 줍니다.',
        paragraphs:[
          '한국관광공사 집계에 따르면 2025년 방한 외래관광객은 1,894만 명으로 전년보다 15.7% 늘었고, 2019년 대비 회복률은 108.2%였다[8]. 국가별로는 중국 548만 명, 일본 365만 명, 대만 189만 명, 미국 148만 명 순이었다[8].',
          '같은 해 해외로 나간 한국인은 2,955만 명으로 3% 늘었고, 가장 많이 찾은 나라는 일본, 그다음은 베트남이었다[8]. 방한객보다 출국자가 1,000만 명 넘게 많아 관광 분야의 인적 교류는 여전히 출국 우위 구조다[8].',
          '일본의 출국세 인상은 일본을 떠나는 모든 출국자에게 적용되므로 일본을 찾는 한국인 여행객의 비용도 올라간다[6]. 베네치아·바르셀로나처럼 유럽 인기 도시들의 부담금도 커지고 있어[4][5], 여행 상품을 기획하는 국내 여행사와 항공사는 세금과 부과금을 포함한 총비용을 미리 안내할 필요가 커졌다.'
        ]
      }
    ],
    deepDive:{
      heading:'관광세는 과잉관광을 줄이는가',
      paragraphs:[
        '베네치아의 입장료 수입과 납부자 수는 늘었지만[3], 이는 부과일이 29일에서 54일로 늘어난 효과가 섞여 있어 실제로 방문객 수를 줄였는지는 이 수치만으로 판단하기 어렵습니다. 5~10유로라는 금액이 당일 여행 수요를 억제할 만큼 큰지도 논쟁거리입니다[4].',
        '바르셀로나 호텔업계는 시가 단계적 인상 요구를 무시했다며 “황금알을 낳는 거위를 죽일 것”이라고 반발했습니다[5]. 반면 시는 세수의 약 25%를 주거 지원에 쓰겠다고 밝혀, 관광세를 주민의 주거비 부담에 대한 보상 수단으로 설명하고 있습니다[5].',
        'UN 관광기구의 도착 통계는 각국이 보고한 자료를 모은 추정치로, 연말 발표 수치는 이후 수정될 수 있습니다[1]. 2026년 전망 역시 분쟁 지속 기간과 유가·물가에 따라 달라질 수 있다는 단서가 붙어 있습니다[2].'
      ]
    },
    keyFacts:[
      {label:'2025년 세계 국제관광객',value:'약 15억 2,000만 명(+4%)',source:1},
      {label:'2026년 상반기 증가율',value:'0.4%',source:2},
      {label:'베네치아 입장료 2025년 수입',value:'약 540만 유로',source:3},
      {label:'2025년 방한 외래관광객',value:'1,894만 명(2019년 대비 108.2%)',source:8}
    ],
    questions:[
      '2025년 지역별 국제관광객 수에서 2019년 수준을 아직 회복하지 못한 지역은 어디인가요?',
      '베네치아의 2026년 입장료는 언제, 얼마를, 누구에게 부과하나요?',
      'UN 관광기구가 2026년 성장률 전망을 3~4%에서 1~2%로 낮춘 이유는 무엇인가요?',
      '관광객이 사상 최대인데도 일본·바르셀로나가 세금을 올리는 이유는 무엇이며, 그 돈은 어디에 쓰이나요?',
      '베네치아의 입장료, 바르셀로나의 숙박세, 일본의 출국세 가운데 과잉관광 억제 효과가 가장 클 것으로 보이는 방식은 무엇이고, 왜 그런가요?',
      '서울·부산·제주에서 과잉관광 문제가 생긴다면, 여러분의 업무나 지역에서는 어떤 대응책이 현실적일까요?'
    ],
    thoughts:[
      '관광세가 부유한 여행자만 유명 도시를 즐기게 만드는 “관광의 계층화”로 이어진다면, 이를 정당화할 수 있을까요?',
      '한국의 출국자가 방한객보다 1,000만 명 넘게 많은 구조는 해결해야 할 적자일까요, 아니면 소득 증가의 자연스러운 결과일까요?',
      '분쟁과 유가에 따라 해외여행 수요가 크게 출렁이는 시대에, 지역 관광 산업은 해외 의존도를 얼마나 낮춰야 할까요?'
    ],
    sources:[
      {title:'International tourist arrivals up 4% in 2025 reflecting strong travel demand around the world',publisher:'UN Tourism',year:'2026',url:'https://www.untourism.int/news/international-tourist-arrivals-up-4-in-2025-reflecting-strong-travel-demand-around-the-world',kind:'통계'},
      {title:'International tourism holds steady with 0.4% growth in first half of 2026 as Middle East conflict and rising costs weigh on momentum',publisher:'UN Tourism',year:'2026',url:'https://www.untourism.int/news/international-tourism-holds-steady-with-04-growth-in-first-half-of-2026-as-middle-east-conflict-and-rising-costs-weigh-on-momentum',kind:'통계'},
      {title:'So many tourists paid for a day ticket in Venice this year',publisher:'Vol.at',year:'2025',url:'https://www.vol.at/so-many-tourists-paid-for-a-day-ticket-in-venice-this-year/9577019',kind:'보도'},
      {title:'Venice doubles its paid entry days in 2026, and the price jumps if you wait',publisher:'FTN News',year:'2026',url:'https://ftnnews.com/travel-news/tours/venice-doubles-its-paid-entry-days-in-2026-and-the-price-jumps-if-you-wait/',kind:'보도'},
      {title:'Barcelona\'s new tourist tax takes effect: what travelers need to know',publisher:'TravelPulse',year:'2026',url:'https://www.travelpulse.com/news/destinations/barcelona-s-new-tourist-tax-takes-effect-what-travelers-need-to-know',kind:'보도'},
      {title:'Japan departure tax to rise to 3,000 yen on Wed.',publisher:'Jiji Press (Adnkronos)',year:'2026',url:'https://english.adnkronos.com/2026/06/29/japan-departure-tax-to-rise-to-3000-yen-on-wed/',kind:'보도'},
      {title:'Foreign visitors to Japan top 40 million for 1st time in 2025',publisher:'Nippon.com (Jiji Press)',year:'2026',url:'https://www.nippon.com/en/news/yjj2026012000347',kind:'보도'},
      {title:'6년만에 코로나 탈출, 작년 외래객 1894만명, 회복률 108%',publisher:'헤럴드경제',year:'2026',url:'https://www.heraldk.com/article/2026012918155213361',kind:'보도'}
    ]
  },
  {
    id:'wellness-explainer',
    industry:'lifestyle',
    topic:'wellness',
    regions:['GLOBAL','N_AMERICA','EUROPE','ASIA_PACIFIC','US','GB','FI','KR'],
    type:'article',
    title:'6.8조 달러 웰니스 경제와 ‘잠’의 산업화…수면장애 환자 131만 명 시대, 스마트워치는 답이 될까',
    dek:'세계 웰니스 경제는 2024년 6조 8,000억 달러로 사상 최대를 기록했고, 수면은 스마트링·스마트워치 기업의 핵심 시장이 됐습니다. 연구는 수면 시간만큼 “규칙성”이 중요하다는 근거를 쌓고 있고, 한국의 수면장애 진료 환자는 2024년 130만 명을 넘었습니다.',
    asOf:'2026-10-18',
    glossary:[
      {term:'웰니스 경제',meaning:'몸과 마음의 건강을 위한 소비·서비스 전반으로, 미용·건강식·운동·웰니스 관광·정신 건강 등 11개 부문으로 집계됩니다.'},
      {term:'수면 규칙성 지수(SRI)',meaning:'하루하루 같은 시각에 자고 깨는지를 0~100으로 나타낸 지표로, 높을수록 수면 패턴이 일정합니다.'},
      {term:'폐쇄성 수면무호흡증',meaning:'자는 동안 기도가 반복해서 막혀 호흡이 멈추거나 약해지는 질환으로, 심혈관 질환 위험과 관련이 있습니다.'},
      {term:'드 노보(De Novo) 허가',meaning:'비교할 기존 기기가 없는 새로운 저·중위험 의료기기를 미국 FDA가 허가하는 경로입니다.'},
      {term:'가속도계',meaning:'움직임을 감지하는 센서로, 웨어러블 기기가 수면과 활동을 추정하는 데 쓰입니다.'}
    ],
    pages:[
      {
        heading:'커지는 웰니스 시장, 그 안의 수면',
        easy:'건강하게 살기 위해 사람들이 쓰는 돈이 전 세계적으로 계속 늘고 있습니다. 특히 잠을 측정하고 개선해 주는 반지·시계 같은 기기가 빠르게 팔리고 있습니다.',
        paragraphs:[
          '글로벌웰니스연구소(GWI)의 2025 글로벌 웰니스 경제 모니터에 따르면 세계 웰니스 경제 규모는 2024년 약 6조 8,000억 달러로 사상 최대였고, 전년보다 7.9% 성장했다[1]. 2013~2024년 연평균 성장률은 6.5%로 같은 기간 세계 GDP 성장률(3.2%)의 두 배를 넘었으며, 2029년에는 약 9조 8,000억 달러에 이를 것으로 전망됐다[1].',
          '부문별로는 웰니스 부동산이 2019~2024년 연평균 19.5%, 정신 웰니스가 12.4% 성장해 가장 빠르게 커졌고, 지역별로는 북미·중동·북아프리카·유럽의 성장세가 두드러졌다[1].',
          '수면을 측정하는 웨어러블 시장도 커지고 있다. 핀란드에서 2013년 설립된 스마트링 기업 오우라는 2025년 10월 9억 달러 규모의 투자를 유치하며 110억 달러의 기업가치를 인정받았고, 2025년 매출 10억 달러 달성이 예상됐다[6]. 오우라는 2015년 이후 약 550만 개의 반지를 팔았는데 이 가운데 약 300만 개가 2025년 한 해에 팔렸고, 2026년 5월 21일 미국 증권거래위원회에 비공개로 상장 신청서를 냈다고 밝혔다[6].'
        ]
      },
      {
        heading:'근거가 말하는 것: 시간과 규칙성',
        easy:'어른은 하루 7시간 이상 자는 것이 권장되지만, 많은 사람이 이보다 덜 잡니다. 최근 연구는 얼마나 오래 자는지뿐 아니라 매일 비슷한 시간에 자고 일어나는지도 건강에 중요하다고 말합니다.',
        paragraphs:[
          '미국 질병통제예방센터(CDC)는 성인에게 하루 7시간 이상의 수면을 권장하며, 7시간 미만을 수면 부족으로 본다[2]. 2022년 미국 성인 가운데 수면이 부족한 비율은 주별로 버몬트 30%에서 하와이 46%까지 차이가 났고, 2013~2022년 전국 추세는 거의 변하지 않았다[2]. 집단별로는 45~64세의 39%, 남성의 37%가 수면 부족이었다[2].',
          '영국 바이오뱅크 참가자 6만 977명의 가속도계 자료 1,000만 시간 이상을 분석한 2023년 연구는 수면 규칙성이 가장 낮은 집단에 비해 나머지 집단의 전체 사망 위험이 20~48% 낮았다고 보고했다[3]. 같은 연구에서 암 사망 위험은 16~39%, 심혈관·대사 질환 사망 위험은 22~57% 낮았으며, 수면 규칙성은 수면 시간보다 더 강한 사망 위험 예측 인자였다[3].',
          '웨어러블 기기는 수면 질환의 선별 도구로도 쓰이기 시작했다. 미국 식품의약국(FDA)은 2024년 9월 16일 애플워치 시리즈 9·10과 울트라 2의 수면무호흡 알림 기능을 승인했는데, 이 기능은 30일 중 10일 밤의 데이터로 위험을 판단하며 진단 도구는 아니다[4]. 그보다 앞서 삼성전자는 2024년 2월 갤럭시워치의 수면무호흡 기능이 FDA 드 노보 허가를 받았다고 발표했고, 국내에서는 2023년 10월 식품의약품안전처 허가를 받았다[5].'
        ]
      },
      {
        heading:'한국의 수면 문제와 산업의 기회',
        easy:'한국에서도 잠 문제로 병원을 찾는 사람이 빠르게 늘고 있습니다. 국내 기업이 만든 웨어러블 기기가 수면 건강 시장에서 기회를 찾고 있지만, 치료제 접근성 문제도 함께 커지고 있습니다.',
        paragraphs:[
          '국내 수면장애 진료 환자는 2020년 103만 7,396명에서 2024년 130만 8,383명으로 약 26% 늘었다[7]. 건강보험심사평가원 자료에 따르면 이 가운데 불면증 환자는 같은 기간 65만 8,675명에서 76만 8,814명으로 16.7% 증가했다[8].',
          '치료 접근성은 과제로 남아 있다. 기면증 치료제 와킥스는 2020년 12월 건강보험이 적용됐지만, 프랑스 제조사가 국내 약가를 받아들이지 않아 2024년 9월 16일 공급이 중단됐다[8]. 대한수면연구학회는 낮은 약가 때문에 글로벌 제약사들이 한국을 건너뛰는 “코리아 패싱”이 일어나고 있다고 지적했다[8].',
          '반면 기기 분야에서는 한국 기업이 앞서 있다. 삼성전자는 갤럭시워치의 수면무호흡 기능이 미국 FDA 드 노보 허가를 받은 첫 사례라고 밝혔으며, 22세 이상 미진단 사용자가 10일 안에 4시간 넘는 수면을 두 번 측정하면 중등도 이상 위험 신호를 알려 준다[5]. 측정 기기의 보급이 실제 진단과 치료로 이어지려면 의료 체계와의 연결이 함께 갖춰져야 한다.'
        ]
      }
    ],
    deepDive:{
      heading:'웰니스 숫자와 수면 연구를 읽는 법',
      paragraphs:[
        'GWI의 6조 8,000억 달러는 미용, 건강식, 운동, 웰니스 관광 등 11개 부문을 넓게 합산한 수치입니다[1]. 일반 소비재 상당 부분이 “웰니스”로 분류되는 만큼, 수면처럼 특정 분야의 시장 규모로 바로 쪼개 쓰기는 어렵습니다.',
        '영국 바이오뱅크 연구는 평균 나이 62.8세의 참가자를 평균 약 6.3년 추적한 관찰 연구로, 연령·성별·생활습관·건강 요인을 보정했지만 인과관계를 증명하지는 않습니다[3]. 참가자가 비교적 건강한 영국 중장년층이라는 점에서 한국 등 다른 집단에 그대로 적용하는 데도 한계가 있습니다.',
        '스마트워치의 수면무호흡 알림은 FDA가 허가한 위험 평가 기능이지 진단이 아니며[4][5], 알림이 없다고 질환이 없다는 뜻도 아닙니다. 한국의 환자 증가 역시 실제 유병률 증가뿐 아니라 진료 접근성과 인식 개선의 영향을 함께 받는다는 점을 감안해야 합니다[7].'
      ]
    },
    keyFacts:[
      {label:'세계 웰니스 경제(2024)',value:'약 6조 8,000억 달러(+7.9%)',source:1},
      {label:'수면 규칙적 집단의 전체 사망 위험',value:'20~48% 낮음',source:3},
      {label:'오우라 기업가치(2025년 10월)',value:'110억 달러',source:6},
      {label:'국내 수면장애 진료 환자(2024)',value:'130만 8,383명',source:7}
    ],
    questions:[
      'CDC가 정한 성인의 권장 수면 시간은 몇 시간이며, 2022년 미국에서 수면 부족 비율이 가장 높았던 주와 낮았던 주는 어디인가요?',
      '애플워치와 갤럭시워치의 수면무호흡 기능은 각각 언제 FDA 승인을 받았고, 어떤 방식으로 위험을 판단하나요?',
      '수면 규칙성이 수면 시간보다 사망 위험을 더 잘 예측한 이유는 무엇일 수 있을까요?',
      '국내 수면장애 진료 환자가 4년 만에 약 26% 늘어난 데에는 어떤 요인이 작용했을까요?',
      '미국·영국의 수면 연구 결과를 장시간 근로와 교대 근무가 많은 한국 직장인에게 적용할 때 주의할 점은 무엇인가요?',
      '여러분의 조직에서 직원 웰니스 프로그램을 설계한다면, 수면 시간과 수면 규칙성 중 무엇을 목표 지표로 삼겠습니까?'
    ],
    thoughts:[
      '스마트링과 스마트워치가 수면을 수치로 보여 줄수록, 사람들은 더 잘 자게 될까요 아니면 점수에 대한 불안으로 오히려 덜 쉬게 될까요?',
      '수면 데이터를 보험사나 회사가 활용할 수 있게 된다면 어디까지 허용해야 할까요?',
      '수면 건강을 개인의 자기관리 소비에 맡길지, 근로시간·등교 시간 같은 사회 제도로 다뤄야 할지 어떻게 판단해야 할까요?'
    ],
    sources:[
      {title:'2025 Global Wellness Economy Monitor',publisher:'Global Wellness Institute',year:'2025',url:'https://globalwellnessinstitute.org/industry-research/2025-global-wellness-economy-monitor/',kind:'통계'},
      {title:'FastStats: Sleep in Adults',publisher:'U.S. Centers for Disease Control and Prevention',year:'2024',url:'https://www.cdc.gov/sleep/data-research/facts-stats/adults-sleep-facts-and-stats.html',kind:'통계'},
      {title:'Sleep regularity is a stronger predictor of mortality risk than sleep duration: a prospective cohort study',publisher:'Sleep (Windred et al.), UK Biobank',year:'2023',url:'https://www.ukbiobank.ac.uk/publications/sleep-regularity-is-a-stronger-predictor-of-mortality-risk-than-sleep-duration-a-prospective-cohort-study/',kind:'학술 자료'},
      {title:'Apple Watch sleep apnea detection gets FDA approval',publisher:'TechCrunch',year:'2024',url:'https://techcrunch.com/2024/09/16/apple-watch-sleep-apnea-detection-gets-fda-approval',kind:'보도'},
      {title:'Samsung\'s Sleep Apnea Feature on Galaxy Watch First of Its Kind Authorized by US FDA',publisher:'Samsung Newsroom',year:'2024',url:'https://news.samsung.com/global/samsungs-sleep-apnea-feature-on-galaxy-watch-first-of-its-kind-cleared-by-us-fda',kind:'원문'},
      {title:'Smart ring maker Oura files confidentially for IPO as consumer demand propels revenue growth',publisher:'Fierce Healthcare',year:'2026',url:'https://www.fiercehealthcare.com/health-tech/oura-smart-ring-maker-files-confidentially-ipo-consumer-demand-propels-revenue-growth',kind:'보도'},
      {title:'에이슬립, 한독과 수면리듬 기록 디지털의료기기 유통·판매 계약',publisher:'머니투데이방송(MTN)',year:'2026',url:'https://news.mtn.co.kr/news-detail/2026082016070796316',kind:'보도'},
      {title:'잠 못 드는 한국인↑…“수면장애 약, 없어서 못 쓰고 있어도 못 써” 왜',publisher:'머니투데이',year:'2026',url:'https://www.mt.co.kr/thebio/2026/03/09/2026030911423521333',kind:'보도'}
    ]
  }
];
