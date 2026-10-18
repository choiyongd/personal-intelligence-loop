# Sprint 0–1 구현 범위

## PRD 접근 상태

원 대화 ID `6acebde8-70d4-83e8-9748-25bbbc95616e`의 사용자 요구사항은 확인했습니다. PRD와 직전 개발 답변의 실제 본문/첨부는 반환되지 않았으며 콘텐츠 참조 표시만 남아 있었습니다. 지정된 /mnt/data 경로도 존재하지 않았습니다. 아래는 현재 요청을 바탕으로 재구성한 개발 범위입니다. 원문 PRD v1.0을 확보한 후 용어·사용자 역할·정확한 Sprint 분할을 대조해야 합니다.

## Sprint 0

- Next.js/TypeScript 앱, 환경변수 예제, npm lockfile, Python 패키지와 버전 기록.
- Supabase 로컬 설정, migration/seed, 테넌트·멤버십·선호·라이선스·수집 데이터 모델.
- 검증된 사용자 조회, 이메일 인증 콜백, 소유자/멤버 권한, RLS/복합 FK, 신뢰된 worker 계정.
- 승인 근거·검토 만료·수집 방식·호스트/저장 허용 필드 레지스트리.
- 합성 RSS와 PostgreSQL RLS/파이프라인 테스트.

## Sprint 1

- 워크스페이스 생성/전환, 산업·키워드 저장, 승인 출처 구독·해제, 수집 요청.
- 독립 워커의 RSS/Atom 및 Federal Register API 어댑터.
- URL 정규화·SHA-256 dedup·출처별 observation upsert.
- 사건 후보 anchor 기반 군집화, 출처별 게시 시점 타임라인.
- 피드 20개 페이지, 현재 페이지 제목 검색, 개인 저장함 최근 100개.
- 작업 상태/시도 횟수/품질 집계/허용된 오류 코드 로그.
- 최근 20개 사건에서 관심 키워드로 선택한 발행 초안과 수동 검토 질문.
- durable retry·lease reclaim·stale writer fencing·원자적 완료/롤백.

## 수용 기준

| ID | 검증 시나리오 | 기대 결과 |
|---|---|---|
| AUTH-01 | 가입→같은 브라우저 이메일 확인→로그인 | Auth 서버 검증 후 본인 팀 접근 |
| TENANT-01 | 다른 팀 tenant/event ID로 접근 | 조회 0건 또는 권한 거절, 쓰기 차단 |
| ROLE-01 | member가 구독/키워드/queue 변경 | 실패; 본인 saved는 가능 |
| LICENSE-01 | pending/revoked/expired 출처 요청 | 구독 또는 enqueue 차단, worker 신규 저장 차단 |
| INGEST-01 | 원 합성 RSS 수집 | 기사 3·사건 후보 3·근거 3·제외 2 |
| INGEST-02 | 합성 mirror 추가 수집 | 기사 4·사건 후보 3·근거 5 |
| DEDUP-01 | 동일 RSS 재실행 | 자료 개수 변화 없음; 변경 없는 피드 순서 유지 |
| JOB-01 | 작업 중 워커 종료→기한 만료 | 새 토큰으로 재획득; 구 토큰 쓰기 실패 |
| JOB-02 | DB 트랜잭션 중 정책 오류 | article/event/observation/완료 로그 전부 롤백 |
| QUALITY-01 | bad date/private URL | 원문 payload 없이 제외 사유 집계 |
| UI-01 | 근거 상세/저장/발행 초안 | 원문 링크·출처·후보 표시가 유지됨 |

## 후속 개발

Sprint 2: 출처별 paging/cursor·ETag/Last-Modified·공유 캐시, 정식 출처 검토 UI, 다중 워커 경쟁 테스트, 일본어/한국어 토큰화, 사건 수동 합치기/분리·수정 이력, URL 변경 정책, DB 타입 자동 생성, 회원 초대/역할 변경 감사 기록.

Sprint 3: 근거를 참조하는 claim 추출과 수치 비교, 중요도/프로젝트 맥락 설명, 검토 가능한 Action Brief, 유저 승인 후 이메일 발송과 구독 동의·unsubscribe·중복 전송 방지.

Sprint 4: 팀의 과거 의사결정/후속 결과, 스몰 토크·강의·아이디어 개발 템플릿, 출력의 출처 보유율·사실성·효용 평가. LLM 제공자/키/비용/데이터 전송 범위는 이 단계에서 명시적으로 설정합니다. 현재 코드는 LLM 키를 요구하거나 호출하지 않습니다.
