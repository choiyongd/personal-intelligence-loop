# Personal Intelligence Loop · Sprint 0–1

허용된 RSS/API의 메타데이터를 수집하고, 중복 URL을 합치고, 제목이 유사한 문서를 사건 후보로 연결하는 실행 가능한 개발 프로젝트입니다.

**2026-10-17 디자인 업데이트:** 사용자 지정 Matter/Bloomberg 레퍼런스를 반영한 검은 제품 UI와 흰 뉴스레터 지면, 분야·세부 주제·지역 선택 흐름을 추가했습니다. [변경 내용·실행 방법](docs/REDESIGN.md), [디자인 기준](docs/REDESIGN_REFERENCE_LOCK.md)을 확인하세요. 추가 migration은 `202610170001_newsletter_profiles.sql`입니다. 기본 진입은 소개 화면 `/`, 선택은 `/customize`, 합성 뉴스레터 미리보기는 `/demo`입니다. `npm run preview`는 3100번 포트에서 실행합니다.

**2026-10-17 인계 후 수정 (Claude):**
- **디자인이 하나도 안 보이던 원인:** `npm run preview`(또는 `start`) 서버를 켜 둔 채 `npm run build`를 다시 하면, 기존 서버는 예전 HTML을 계속 보내면서 그 HTML이 가리키는 CSS 파일은 새 빌드로 지워집니다. 그 결과 글자만 있는 흰 화면이 됩니다. 이제 `npm run build` 전에 이 프로젝트 서버가 3100/3000/3001에서 실행 중이면 빌드를 멈추고 안내합니다(`scripts/guard-running-preview.mjs`).
- **PC에서 실행본 확인·재시작:** `powershell -ExecutionPolicy Bypass -File scripts\restart-preview.ps1` 은 포트 소유 프로세스·시작 시각·현재 빌드 시각·CSS 응답을 보여 줍니다. `-Restart`를 붙이면 이 프로젝트 경로의 서버만 종료하고 빌드 후 3100을 다시 띄웁니다.
- 뉴스레터 지면을 검정 masthead·굵은 헤드라인·얇은 구분선·다단 편집으로 재구성했고, 같은 합성 기사가 반복되지 않게 했습니다.
- `APP_ORIGIN` 기본값과 Supabase Auth `site_url`/redirect 목록을 preview 주소 `http://127.0.0.1:3100` 기준으로 맞췄습니다. 브라우저 주소와 호스트가 달라지면(localhost ↔ 127.0.0.1) 로그인 쿠키가 유지되지 않습니다.
- 로그인 전 `/customize`에서 고른 선택은 쿠키(`pil_draft_selection`)에 남아, 가입 후 첫 개인 설정의 시작값이 됩니다. 저장하면 DB 프로필이 우선합니다.
- 실제 수집 지면(`/publish`)은 사건 하나당 기사 하나만 싣고, 같은 사건의 모든 출처를 근거로 묶습니다.

**로컬 Supabase 전체 흐름 (2026-10-17 검증한 순서, 기존 DB는 reset하지 않음):**
1. Docker Desktop 실행 → `npx supabase start` (이미 실행 중이었다면 config 변경 반영을 위해 `npx supabase stop` 후 `npx supabase start`; `stop`은 데이터를 지우지 않습니다)
2. 기존 DB에 새 migration만 적용: `npx supabase migration up`
3. `npx supabase status`의 API URL과 Publishable key를 `apps/web/.env.local`에 넣고 `APP_ORIGIN=http://127.0.0.1:3100`
4. 워커 로그인 준비(로컬 전용): `docker exec -i supabase_db_personal-intelligence-loop psql -U postgres -d postgres < scripts/provision-local-worker.sql`, `worker/.env.example` → `worker/.env`
5. `scripts\restart-preview.ps1 -Restart` → `http://127.0.0.1:3100/login`에서 가입 → 메일함 `http://127.0.0.1:54324`의 인증 링크 → `/feed`
6. `/settings`에서 워크스페이스 만들기 → 나만의 뉴스레터 설정 저장 → 합성 RSS 두 개 구독·수집 요청 → `worker`에서 `..\.venv\Scripts\python.exe -m pil_worker.cli drain` → `/publish`

**구현:** Next.js/TypeScript, Supabase Auth/Postgres/RLS, 독립 Python worker, 라이선스 레지스트리, 구독·작업 큐·재시도·근거 타임라인·운영 로그·개인 저장함.

**범위 근거:** 참조 대화를 읽었으나 PRD 응답은 콘텐츠 참조 표시로만 제공되었습니다. `/mnt/data/PRD_Personal_Intelligence_Loop_v1.0.md`도 현재 환경에 없었습니다. 이 구현은 사용자 메시지의 명시적 요구사항을 기준으로 작성했으며 PRD 원문과의 일치 검증을 주장하지 않습니다. [범위·수용 기준](docs/SPRINT_SCOPE.md)을 확인하세요.

## 0. 2026-10-18 베타 변경

- **가입 없이 베타 입장**: `/login`의 "베타로 바로 시작"은 부를 이름만 받아 `pil_beta` 쿠키(httpOnly, 90일)를 남깁니다. 이 쿠키는 표시용이며 Supabase 데이터 접근 권한을 주지 않습니다. 관심사는 `pil_draft_selection` 쿠키에 저장되고 `/my`에서 나의 뉴스레터로 보입니다. 이메일 계정 로그인은 같은 화면의 접힌 영역에 그대로 있습니다.
- **복수 선택**: 분야(1~8), 세부 주제(최대 16, 선택한 분야의 것만), 국가(최대 5), 읽는 수준(입문·실무·심화). DB는 `202610180001_multi_select_profiles.sql`이 `industries`, `countries`, `level` 열을 추가하고 기존 `industry`/`country`를 트리거로 맞춥니다. 기존 행과 예전 링크(`?industry=&country=`)도 그대로 열립니다.
- **해설 기사**: `apps/web/src/lib/articles/`에 25개 세부 주제별 해설이 있습니다. 각 기사는 3장 이상 본문, 심화 수준에서 한 장 더, 마지막 장의 질문과 생각거리, 번호가 붙은 출처 목록(원문·공식 자료·학술 자료·통계)으로 구성되며 `/article/<id>?level=`에서 읽습니다. `tests/articles.test.mjs`가 장 수, 질문 수, 모든 [n] 인용이 실제 출처를 가리키는지 확인합니다.
- 합성 예시 기사(`demo-stories.ts`)는 지웠습니다. 공개 지면은 모두 출처가 있는 해설 기사로 채웁니다. 사실은 2026-10-18 기준이며 실시간 뉴스가 아닙니다.

## 0-1. 2026-10-18 메일 발송 · 보관함 · 디자인 개편

- **디자인**: 뉴스레터 지면과 해설 기사 화면을 남색→파랑 그라데이션 머리, 세리프 제목, 흰 읽기 면, 남색 카드로 바꿨습니다(사진·문구는 레퍼런스에서 가져오지 않음).
- **받는 때**: 관심사 설정 마지막 단계에서 매일/매주, 요일, 시간(한국 시간)을 고릅니다.
- **메일**: `/my`에서 메일 주소를 넣으면 확인 메일이 가고, 버튼을 눌러야 발송이 켜집니다. 모든 메일에 수신 거부 링크와 `List-Unsubscribe` 헤더가 있습니다.
- **보관함**: 정해진 시간의 정기 호와 "오늘 호 보관하기"로 저장한 호가 `/my/archive`에 쌓입니다. 호마다 그때의 관심사와 기사 목록을 저장해 나중에도 같은 지면으로 보입니다. 기사는 보낸 적 없는 것부터 돌려 가며 고릅니다.
- **발송 구조**: `.github/workflows/dispatch.yml`이 매시 2분에 `/api/dispatch`를 `CRON_SECRET`으로 호출합니다. 앱은 한국 시간으로 발송 시각이 지난 독자 중 오늘 정기 호가 없는 사람에게만 보냅니다(늦은 호출도 같은 날 안에 따라잡음). `(독자, 종류, 날짜)` 유일 키와 attempts 비교로 중복 발송을 막고, 실패하면 같은 날 최대 3번 다시 시도합니다.
- **필요한 설정**(Vercel 환경 변수): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`(또는 `SUPABASE_SERVICE_ROLE_KEY`), `APP_ORIGIN`(배포 주소), `RESEND_API_KEY`, `MAIL_FROM`, `CRON_SECRET`. GitHub 저장소 비밀값: `DISPATCH_URL`(`<배포 주소>/api/dispatch`), `CRON_SECRET`. Supabase 프로젝트에 `supabase/migrations`를 적용해야 합니다. 설정 전에는 화면에 "설정이 끝나면 열립니다"로 표시되고 나머지 기능은 그대로 동작합니다.
- 로컬에서는 `MAILPIT_URL`을 넣으면 메일이 Supabase 로컬 받은편지함(Mailpit)에 쌓여 그대로 확인할 수 있습니다.

## 1. 파일 구조

```text
personal-intelligence-loop/
├── apps/web/                    Next.js App Router · 서버 렌더링
│   ├── .env.example
│   └── src/
│       ├── app/                 login, feed, settings, events/[id], saved,
│       │                        publish, operations, auth/callback, demo
│       ├── components/          Shell, EventCard, Notice
│       ├── lib/                 인증 컨텍스트·Supabase 서버 클라이언트·검증
│       └── proxy.ts             세션 쿠키 갱신
├── worker/
│   ├── .env.example
│   ├── pyproject.toml
│   ├── requirements-lock.txt
│   ├── src/pil_worker/          fetch → normalize → cluster → store
│   │   └── fixtures/           프로젝트가 작성한 합성 RSS 두 개
│   └── tests/                  단위·워커 DB 통합 테스트
├── supabase/
│   ├── config.toml
│   ├── migrations/202610150001_core.sql
│   └── seed.sql                출처·라이선스만 생성; 사용자/비밀번호 없음
├── scripts/                    로컬 전용 worker 계정 설정
├── tests/                      PostgreSQL RLS·HTTP·통합 실행기
├── docs/                       구조·스키마·정책·운영·검증 기록
├── package.json
└── package-lock.json
```

## 2. 빠른 화면 미리보기 · DB 없이 실행

Node.js 22 이상, npm이 필요합니다. 프로젝트 루트에서:

```powershell
npm ci
npm run dev
```

[합성 브리핑 미리보기](http://localhost:3000/demo)를 엽니다. 합성 자료임을 화면에 명시합니다. `/demo`는 공개된 정적 예제이며 실제 사용자 데이터나 설정·저장 기능을 사용하지 않습니다. 비공개 페이지는 환경 설정과 로그인을 요구합니다. `ENABLE_DEMO=false`는 빌드 시 설정하면 미리보기를 비활성화합니다.

## 3. 전체 로컬 환경

필요 도구: Docker Desktop 실행 상태, Supabase CLI(`npx supabase` 사용 가능), Node.js 22 이상, Python 3.11 이상(검증 버전 3.12), 선택적으로 `psql`.

### 3-1. Supabase 시작·스키마 적용

루트에서 실행합니다. `db reset`은 **이 프로젝트의 로컬 개발 DB 데이터를 지웁니다**. 기존 개발 데이터가 있으면 먼저 백업하세요.

```powershell
npx supabase start
npx supabase db reset
npx supabase status
```

두 migration이 13개 애플리케이션 테이블과 RLS, 제약조건, 함수, `pil_worker` NOLOGIN 역할을 생성합니다. Seed는 두 합성 RSS, Federal Register API, 검토 대기 RSS와 라이선스만 등록합니다.

### 3-2. 웹 환경변수

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
```

`supabase status`의 로컬 API URL과 anon/publishable key를 `.env.local`에 입력합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<로컬 anon 또는 publishable key>
APP_ORIGIN=http://localhost:3000
ENABLE_DEMO=true
```

브라우저용 키는 공개용입니다. 데이터 접근은 사용자 JWT와 RLS로 제한합니다. **service_role/secret 키와 DB URL은 웹에 넣지 않습니다.** `APP_ORIGIN`은 서버 전용의 신뢰할 수 있는 고정 origin이며 인증 콜백의 임의 외부 이동을 허용하지 않습니다.

### 3-3. 전용 워커 계정

로컬 전용 로그인 설정:

```powershell
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f scripts/provision-local-worker.sql
```

`psql`이 없으면 [로컬 Studio](http://localhost:54323)의 SQL 편집기에 `scripts/provision-local-worker.sql`을 실행합니다. 알려진 로컬 비밀번호를 사용하는 파일이므로 호스팅 DB에 적용하지 마세요. 운영 계정은 관리자가 별도 강한 비밀번호·TLS로 구성합니다. Migration 자체는 로그인/비밀번호를 생성하지 않습니다.

### 3-4. Python 워커 설치

루트에서:

```powershell
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r worker/requirements-lock.txt
./.venv/Scripts/python.exe -m pip install -e ./worker --no-deps
Copy-Item worker/.env.example worker/.env
```

macOS/Linux는 `.venv/Scripts/python.exe`를 `.venv/bin/python`으로 바꾸세요. 패키지 엔트리포인트 `pil-worker`도 제공합니다. 번들 Python에 `ensurepip`이 없는 환경은 표준 Python을 사용하거나 pip가 있는 Python에서 `python -m pip --python .venv install ...`을 사용합니다.

터미널 A:

```powershell
npm run dev
```

터미널 B · `worker/`에서 실행해 `.env`를 읽습니다:

```powershell
Set-Location worker
../.venv/Scripts/python.exe -m pil_worker.cli check
../.venv/Scripts/python.exe -m pil_worker.cli run --schedule
```

`check`는 연결 역할이 `pil_worker`인지 확인합니다. 관리자 DB 계정이면 실행을 거부합니다. 기본 `ALLOW_LIVE_FETCH=false`로 외부 네트워크 수집은 차단합니다. 합성 RSS는 파일에서 처리합니다.

### 3-5. 사용자 흐름

1. [로그인 화면](http://localhost:3000/login)에서 이메일과 10자 이상 비밀번호로 가입합니다.
2. [로컬 메일함](http://localhost:54324)의 인증 링크를 같은 브라우저에서 열고 로그인합니다. 발신자 주소는 실제 외부 주소일 필요가 없는 로컬 메일 캡처 환경입니다.
3. 관심 분야·출처에서 워크스페이스를 만듭니다. 이름은 1~80자이고 계정당 최대 5개입니다.
4. 두 **합성 RSS**를 구독하고 각 `수집 요청`을 누릅니다. 브리핑 화면에 기사 4개·근거 5개·사건 후보 3개가 나타나야 합니다. 원 출처만 구독하면 3개·3개·3개입니다.
5. 사건 상세에서 출처별 타임라인을 보고 저장한 뒤 저장함을 확인합니다. 합성 URL은 `example.com` 예약 도메인을 사용하므로 실제 기사 페이지가 아닙니다.
6. 수집 현황에서 `succeeded`, 원 출처의 통과 3개·제외 2개를 확인합니다. 같은 RSS를 다시 수집해도 기존 기사/근거 수가 증가하지 않습니다. 수동 재요청에는 최소 60초 대기 시간이 있습니다.
7. 발행 초안은 최근 사건 20개에서 관심 키워드로 제목을 필터링합니다. 산업은 브리핑 주제 라벨로 표시됩니다. 자동 중요도/산업 분류를 수행하지 않습니다.

두 번째 계정의 워크스페이스에서 첫 번째의 tenant/event ID를 URL이나 요청에 넣어도 데이터를 읽거나 수정할 수 없어야 합니다. 역할 변경·초대 UI는 다음 Sprint 범위이며 멤버십 직접 쓰기 권한이 없습니다.

## 4. 허용된 실제 API 수집

Federal Register는 [공개 API](https://www.federalregister.gov/developers/documentation/api/v1)와 [재사용 정책](https://www.federalregister.gov/reader-aids/government-policy-and-ofr-procedures/about-this-site)을 근거로 **제목·게시일·문서번호·원문 링크만** 허용한 초기 출처입니다. 초기 검토일 2026-10-15, 재검토 기한 2027-01-15 이후에는 자동 차단합니다. XML/HTML 표시는 공식 법령 판본이 아니므로 법적 판단은 공식 판본을 확인해야 합니다.

1. `worker/.env`의 `USER_AGENT`를 운영 주체와 연락처를 포함하도록 바꿉니다.
2. `ALLOW_LIVE_FETCH=true`로 바꾸고 워커를 다시 시작합니다.
3. Federal Register를 구독하고 수집 요청을 누릅니다.

페이지 크기는 20이고 다음 페이지는 따라가지 않습니다. 이는 완전한 산업 커버리지가 아닌 Sprint 1의 제한된 최근 문서 수집입니다. 출처별 전역 요청 간격 1시간을 DB 큐에서 적용하므로 다른 테넌트 작업이 대기할 수 있습니다. 이중화/대규모 서비스에는 출처별 공유 메타데이터 캐시와 배포 간 전역 속도 제한이 필요합니다. 임의 RSS URL 입력은 제공하지 않습니다. 다른 RSS/API는 관리자가 이용 근거·호스트·검토 기한을 등록하고 승인한 뒤에만 사용할 수 있습니다.

기사 전문·이미지·description·body는 저장하지 않습니다. 외부 API/RSS 응답은 제한된 크기로 메모리에서만 처리합니다. 크롤링·페이월 우회·HTML 전문 다운로드는 구현하지 않습니다. [출처 이용 정책](docs/SOURCE_POLICY.md)을 참고하세요.

## 5. 테스트와 빌드

루트에서:

```powershell
npm run typecheck
npm run build
./.venv/Scripts/python.exe -m pytest worker/tests -q
npm run test:db
npm run test:worker-integration
npm run test:newsletter
```

`test:db`는 PGlite PostgreSQL 엔진에서 실제 migration을 실행하고 역할·RLS·외래키·정책을 검사합니다. `test:worker-integration`은 임시 DB를 127.0.0.1:55433에 열어 실제 psycopg/Store SQL을 실행합니다. 테스트 소켓은 **격리된 단일 테스트 프로세스용**이고 Auth/로그인/동시 트랜잭션 격리를 모사하지 않습니다. 운영 DB나 서버로 사용하지 마세요.

웹 서버가 실행 중일 때:

```powershell
npm run test:web
```

웹 테스트는 환경변수가 없는 기본 환경을 대상으로 공개 미리보기·로그인 화면과 비인증 보호 경로를 검사합니다. 별도 주소는 `PIL_WEB_ORIGIN`으로 지정합니다. 서버가 이미 실제 인증 설정을 사용 중이면 확인한 계정으로 수동 수용 테스트를 추가하세요.

명령별 검증 결과와 남은 제약은 [검증 기록](docs/VERIFICATION.md)에 기록합니다. Supabase Auth 메일·세션 갱신·PostgREST 중첩 조회를 포함한 전체 브라우저 흐름은 Docker/Supabase 환경에서 위 수동 수용 절차로 확인해야 합니다.

## 6. 문서

- [상세 아키텍처·스키마·권한 행렬](docs/ARCHITECTURE.md)
- [Sprint 범위·수용 기준·다음 단계](docs/SPRINT_SCOPE.md)
- [출처 이용 정책·리뷰 절차](docs/SOURCE_POLICY.md)
- [운영·재시도·장애 대응](docs/OPERATIONS.md)
- [화면 설계 근거](docs/DESIGN.md)
- [검증 결과](docs/VERIFICATION.md)
- [개인 뉴스레터 리디자인·선택 흐름](docs/REDESIGN.md)

## 7. 이번 버전의 한계

Event Graph Lite는 제목 토큰 기반의 사건 후보 묶음입니다. 모순 검출, 사실 검증, 인과 관계, LLM 요약, Why It Matters, Action Brief, 의사결정 메모리, 강의·스몰 토크 생성, 이메일 발송은 구현 완료로 표시하지 않습니다. 발행 화면은 근거 링크와 검토 질문을 보여주는 초안입니다. 새 기사에 대한 논리적 영향과 행동을 자동 단정하지 않습니다.

운영 배포 전에는 Auth 전체 흐름, 실제 Postgres 다중 워커 경쟁, 공급자 API 가용성, 재검토 만료·삭제 절차, 메일 수신 동의와 발신 설정을 추가 검증하세요. 현재 산출물은 Sprint 0–1 개발 기반입니다.
