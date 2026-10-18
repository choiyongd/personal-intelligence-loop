# 상세 구조와 Supabase 스키마

2026-10-17 추가: 개인 뉴스레터는 `newsletter_profiles`(tenant_id,user_id 복합 PK/FK)로 별도 저장합니다. industry/subtopics/scope/country/content_types/name/cadence를 본인만 CRUD하며 같은 팀의 owner에게도 타인의 프로필 접근을 허용하지 않습니다. worker에는 이 테이블 권한이 없습니다. articles에는 명시적 country_codes와 content_type을 추가했고, 특정 국가 선택 시 국가 미확인 자료를 제외합니다. 상세 변경은 [REDESIGN.md](REDESIGN.md)를 확인하세요. 아래 기본 테이블 12개에 이 프로필 테이블이 추가되어 현재는 13개입니다.

## 실행 경계

브라우저 → Next.js 서버 컴포넌트/Server Action → 사용자 세션이 포함된 Supabase client → PostgREST → RLS로 접근합니다. 별도 FastAPI는 추가하지 않았습니다. 데이터 수집은 긴 네트워크 대기를 웹 요청과 분리하는 독립 Python 프로세스를 사용합니다.

소유자가 구독/수집 요청 → DB 큐 → 워커 claim → 허용 정책 확인 → RSS/API 메모리 처리 → 정규화/품질검사 → 단일 DB 트랜잭션으로 article/event/observation/작업 완료/운영 로그를 기록합니다. 외부 네트워크 호출 중에는 DB 트랜잭션을 유지하지 않습니다.

## 테이블 사전

| 테이블 | 주요 필드 | 키·제약 | 쓰기 주체 |
|---|---|---|---|
| tenants | id, name, created_at | UUID PK, 이름 1~80자 | create_workspace RPC |
| memberships | tenant_id, user_id, role | 복합 PK, Auth users FK, owner/member | 가입 RPC/신뢰된 관리자 |
| preferences | tenant_id, industry, keywords | tenant PK, 산업 enum 유사 CHECK, 키워드 20개 이하 | 소유자 |
| license_registry | id, status, evidence_url, reviewed_at, review_due_at, attribution, allow_metadata, max_excerpt_chars | 텍스트 PK, 기한 유효성, allow_full_text=false CHECK | migration/신뢰된 관리자 |
| sources | id, kind, endpoint, allowed_hosts, license_id, enabled, min_interval_seconds | 레지스트리 FK, 고정 어댑터 종류 | migration/신뢰된 관리자 |
| subscriptions | tenant_id, source_id, enabled | 복합 PK·FK | 소유자 |
| events | id, tenant_id, title, anchor_tokens, anchor_numbers, anchor_published_at, first_seen_at, last_seen_at, algorithm | UUID PK, UNIQUE(tenant_id,id) | 워커 |
| articles | id, tenant_id, canonical_url, url_hash, title, published_at, title_tokens, event_id | UNIQUE(tenant_id,url_hash), 복합 event FK | 워커 |
| observations | id, tenant_id, article_id, source_id, external_id, original_url, title, published_at, content_hash, license_id, fetched_at, excerpt | UNIQUE(tenant_id,source_id,external_id), 복합 article FK, 라이선스 트리거 | 워커 |
| saved_events | tenant_id, user_id, event_id, created_at | 3열 PK, 복합 event FK·membership FK | 해당 사용자 |
| ingestion_jobs | id, tenant_id, source_id, state, attempt, lease_token, leased_until, available_at, accepted, rejected, error_code | 구독 복합 FK, tenant/id UNIQUE, 활성 작업 부분 UNIQUE | enqueue RPC/워커 |
| ingestion_logs | id, tenant_id, job_id, level, code, details, created_at | identity PK, 복합 job FK | 워커 |

모든 시각은 timestamptz/UTC로 저장하고 UI는 Asia/Seoul로 표시합니다. ID는 uuid이며 URL hash/content hash는 SHA-256 64자입니다. 로그 JSON에는 집계값/제외 사유만 넣습니다.

### 관계

Tenant 1:N Membership/Subscription/Event/Job. Event 1:N Article. Article 1:N Observation. Source 1:N Observation/Subscription. License 1:N Source/Observation. 개인 저장은 Tenant+User+Event로 식별됩니다. Event Graph Lite의 시간 연결은 event의 고정 anchor와 observation의 게시 시각을 사용합니다. 의미 관계를 가진 그래프 edge 테이블은 다음 단계입니다.

### 인덱스

- memberships(user_id,tenant_id): 로그인 후 접근 가능한 팀 조회.
- events(tenant_id,last_seen_at DESC,id): 피드 정렬.
- articles(tenant_id,event_id), observations(tenant_id,article_id): 근거 상세 조회.
- articles UNIQUE(tenant_id,url_hash): URL 기반 중복 차단.
- observations UNIQUE(tenant_id,source_id,external_id): 공급자 항목 재수집 멱등성.
- jobs UNIQUE(tenant_id,source_id) WHERE state IN queued/running/retry: 활성 요청 중복 차단.
- jobs(available_at) 부분 인덱스: due 작업 찾기.
- ingestion_logs(tenant_id,created_at DESC): 운영 화면.

## 접근 권한 행렬

| 리소스 | anon | member | owner | pil_worker |
|---|---|---|---|---|
| tenant/membership | 없음 | 소속 팀 읽기 | 소속 팀 읽기 | 없음 |
| preference | 없음 | 팀 읽기 | 지정 열 수정 | 읽기 |
| license/source | 없음 | 읽기 | 읽기 | 읽기 |
| subscription | 없음 | 팀 읽기 | 승인 출처 구독·활성 토글 | 읽기 |
| event/article/observation | 없음 | 팀 읽기 | 팀 읽기 | 수집 쓰기 |
| personal saved event | 없음 | 본인만 CRUD 일부 | 본인만 CRUD 일부 | 없음 |
| job/log | 없음 | 팀 읽기 | 팀 읽기·제한된 enqueue | 생성/조회/갱신 |
| auth.users | 없음 | Auth 서비스 경유 | Auth 서비스 경유 | 없음 |

worker는 신뢰된 시스템 프로세스로 수집 데이터에 대해 테넌트 전체를 처리할 권한이 있습니다. RLS를 우회하는 `BYPASSRLS` 역할이 아니며 명시적 worker 정책과 SQL grants를 사용합니다. 따라서 워커 자격증명 유출은 여러 테넌트 수집 데이터에 영향을 미칠 수 있습니다. 웹 요청이나 브라우저에 이 계정을 전달하지 않습니다.

RLS는 테이블 소유자/DB 관리자에게 적용되는 보안 경계가 아닙니다. migration 소유자는 신뢰합니다. `private.is_member`는 고정 search_path와 완전한 테이블 경로를 쓰는 definer 함수이며 회원 정책의 재귀 조회를 피합니다. `auth.uid()`는 검증된 Supabase JWT의 사용자 ID입니다. 사용자 입력 tenant_id는 반드시 실제 멤버십과 비교합니다. 브라우저의 tenant_id나 cookie session 데이터만으로 권한을 인정하지 않습니다.

공개 RPC 두 개만 authenticated에 execute를 줍니다. `create_workspace`는 로그인 사용자를 owner로 원자적으로 등록하고 계정별 최대 5개를 검사합니다. `enqueue_ingestion`은 소유자·활성 구독·승인 정책·검토 기한·기존 작업·대기 시간을 검사합니다. 기본 PUBLIC execute 권한은 제거합니다. `private.lock_source_policy`는 워커만 실행할 수 있으며 license/source/subscription을 잠금과 함께 재검증합니다. 워커에 레지스트리 UPDATE 권한을 주지 않습니다. `private`는 Data API에 노출하지 않습니다.

복합 외래키는 같은 테넌트 안의 event/article/job/membership만 참조하도록 강제합니다. 앱의 필터를 제거해도 RLS와 FK가 경계를 유지합니다. 사용자에게 ingestion 자료 직접 쓰기 권한은 없습니다.

## 인증 처리

이메일/비밀번호 가입 → 이메일 확인 → 비밀번호 로그인 → 서버 쿠키 세션입니다. 서버의 각 보호된 페이지·action은 `auth.getUser()`로 인증 서버의 사용자를 확인하고 멤버십을 조회합니다. Proxy는 만료 토큰을 갱신하며 권한 결정의 유일한 위치가 아닙니다. 쿠키는 서버에서 사용하므로 HttpOnly/Lax, 운영에서는 Secure를 적용합니다. 인증 데이터와 비공개 HTML은 공유 캐시에 저장하지 않습니다. Server Action은 POST와 Next.js origin 검증을 사용합니다. origin 허용 목록을 와일드카드로 확장하지 않습니다.

callback은 PKCE code 교환 뒤 고정 APP_ORIGIN의 /feed로만 이동합니다. 같은 브라우저에서 가입 인증 링크를 열어야 합니다. PKCE verifier가 없는 다른 기기 흐름/비밀번호 재설정/소셜 로그인은 후속 범위입니다.

## 정규화와 중복 제거

1. NFKC, HTML 태그/스크립트/스타일/제어 문자 제거, 공백 정규화.
2. URL scheme/host 소문자, fragment 제거, 기본 포트 제거, IDNA 정규화.
3. `utm_*`, fbclid/gclid 등 추적 파라미터 제거. 업무 파라미터와 중복 query 값은 유지·정렬. 경로 대소문자·trailing slash·http/https는 임의 통합하지 않습니다.
4. 표준 URL의 SHA-256으로 tenant 내부 article UNIQUE를 검사합니다. 동일 URL의 여러 출처는 각 observation으로 연결합니다.
5. 출처+외부 ID가 기존에 있으면 기존 article 연결을 유지하고 변경된 observation만 업데이트합니다. 동일 content_hash면 UPDATE/피드 last_seen 갱신도 하지 않습니다.

다른 URL의 같은 내용은 article을 강제로 합치지 않고 사건 후보로 연결합니다. 서로 다른 게시자의 원문 링크를 보존합니다. 정규 URL은 페이지 HTML을 읽거나 공급자의 임의 canonical 태그를 신뢰해서 얻지 않습니다.

## Event Graph Lite v1

제목의 Unicode word 토큰을 소문자화하고 일부 영어 stopword를 제거합니다. anchor와 게시 시각 차이 72시간 이내, 양쪽 숫자 집합 일치, 공통 토큰 3개 이상, Jaccard >= 0.72인 후보 중 점수가 가장 높은 하나를 선택합니다. 동률은 event UUID 순으로 결정합니다. 없으면 새 event를 만듭니다. anchor 토큰/시각을 나중에 확장하지 않아 연쇄적 오병합을 줄입니다. tenant advisory transaction lock으로 동시 생성 경합을 직렬화합니다.

이는 동일 사건 사실 판정이 아닙니다. 숫자 다른 기사는 별도 후보로 남기므로 모순 검출 기능도 아닙니다. 날짜/수치의 불필요한 표현 차이나 한국어 형태 변화에는 recall이 낮을 수 있습니다. 사람이 확인한 labeled 사건 쌍으로 precision/recall을 측정하기 전까지 자동 행동 판단에 사용하지 않습니다. 군집의 대표 제목과 article은 최초 관측 스냅샷이며, 변경된 원 출처 제목은 observation에서 확인합니다. 과거 revision 전체 이력은 아직 저장하지 않습니다.

## 데이터 품질 계약

제목은 정제 후 8~500자·정보 토큰 2개 이상, 외부 ID 1~1000자, 타임존 필수, 게시 시각은 현재-90일~현재+24시간, URL은 허용 호스트·표준 포트·http(s)만 통과합니다. live endpoint는 HTTPS만 허용합니다. 개별 오류는 사유별 집계 후 제외합니다. 비어 있는 정상 피드는 성공, 모든 항목이 오류면 `quality_all_rejected`로 실패합니다. RSS/API는 최대 200개 항목과 2MiB만 처리합니다. 결과 범위를 넘는 항목은 다음 페이지로 수집하지 않으므로 coverage 지표와 구분해야 합니다.

후속 품질 목표: labeled same-event precision >=0.95(아직 측정하지 않은 목표), 처리한 동일 피드의 재수집 신규 중복=0, 저장 observation의 허용 라이선스/원문 링크 보유율=100%, 비승인/만료 출처 신규 저장=0, 테넌트 간 접근 성공=0. 합성 fixture 결과는 품질 실험의 대체가 아닙니다.

## 사용한 공식 문서

- [Supabase SSR client와 인증 검증](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase 함수와 definer 권한](https://supabase.com/docs/guides/database/functions)
- [Next.js 인증 및 Server Action 권한 검사](https://nextjs.org/docs/app/guides/authentication)
- [Next.js 비동기 cookies API](https://nextjs.org/docs/app/api-reference/functions/cookies)
