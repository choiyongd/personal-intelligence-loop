# 검증 기록

**2026-10-17 추가 검증:** 새 디자인 production build·타입 검사, Python 35개, 워커 통합 5개, DB/RLS 8개, 선택 검증 6개, HTTP 4개로 **총 58개가 통과**했습니다. 홈·로그인·선택·뉴스레터 페이지가 실제 HTTP 200을 반환하는지 같은 실행 프로세스에서 확인했습니다. Codex 내장 브라우저의 localhost 연결이 시간 초과하여 새 디자인의 렌더링·모바일 시각 검증은 완료하지 못했습니다. 아래의 스크린샷과 49개 검증 수치는 2026-10-16 최초 버전의 기록입니다.

검증 마무리일: 2026-10-16 (Asia/Seoul). 이 기록은 실제 실행한 검사와 미검증 경계를 구분합니다.

## 통과한 검사

| 검사 | 결과 | 확인 내용 |
|---|---|---|
| Next.js production build | 통과 | 11개 라우트와 proxy 컴파일, TypeScript 확인 |
| TypeScript tsc --noEmit | 통과 | strict 설정의 프로젝트 타입 확인 |
| Python pytest | 35개 통과 | URL 추적 제거/기능 query 보존, 사설 주소·credentials·비표준 포트 차단, 날짜·정제·라이선스, RSS/Atom/API, XXE 차단, DNS private 차단, retry 분류, stale token fence |
| PostgreSQL migration/RLS 테스트 | 6개 통과 | 12개 전 테이블 RLS, anon 차단, 타 테넌트 조회·수정 차단, owner/member 차이, 개인 saved 격리, 복합 FK, 라이선스 트리거, active job/article UNIQUE |
| 실제 psycopg ↔ PGlite PostgreSQL 프로토콜 통합 | 5개 통과 | 2개 팀의 수집·군집·중복 재실행, 4 article/3 event/5 observation, lease reclaim·구 token 차단·durable retry, 정책 실패 전체 롤백, 스케줄러 중복 억제, 같은 작업 재시도의 source cooldown |
| HTTP 웹 테스트 | 3개 통과 | 공개 demo의 합성 표시·보안 헤더, 5개 보호 경로의 비인증 /login 이동, 로그인 폼 레이블/필드 |
| 실제 Edge 브라우저 | 1440px·390px 통과 | 사건 카드 3개, 합성 안내, 문서 가로 넘침 0, page error 0, 미설정 로그인 제출 시 setup 안내 |
| npm 설치 시 audit | 취약점 0건 보고 | 설치 당시 의존성 데이터베이스 결과; 지속적인 무결성/보안 보증은 아님 |

자동 테스트 합계 **49개**. 브라우저의 두 viewport 검사는 위 합계와 별도입니다. 초기 테스트에서 발견한 PostgreSQL FOR SHARE 권한 문제는 registry UPDATE 권한을 부여하지 않고 고정 검증/잠금 함수로 수정했습니다. source cooldown은 같은 job의 재시도까지 검사합니다.

## 실행 환경

- Windows, Node.js 24.21.0, Python 3.12.14.
- 실제 npm lockfile: Next.js 16.4.0, React 19.3.1, @supabase/ssr 0.8.0, supabase-js 2.117.3.
- 테스트 DB: @electric-sql/pglite 0.5.10, pglite-socket 0.2.13.
- psycopg 3.3.6, defusedxml 0.7.1, pytest 8.4.2.
- 설치/일부 실행 시 Windows 샌드박스의 DNS·파일 경로·로컬 TCP 제한이 있었으며 허용된 실행 경로에서 재검증했습니다.

## 화면 증거

- [데스크톱 미리보기](screenshots/demo-desktop.png)
- [모바일 미리보기](screenshots/demo-mobile.png)

화면 데이터는 프로젝트가 작성한 합성 예제입니다. 실제 뉴스나 로그인한 사용자 피드의 스크린샷이 아닙니다.

## 미검증 경계

Docker와 Supabase CLI가 설치되어 있지 않아 실제 GoTrue Auth 서비스의 가입 메일·인증 링크·쿠키 갱신 및 PostgREST 중첩 관계 조회를 포함한 전체 브라우저 흐름은 이 환경에서 실행하지 못했습니다. README의 전체 로컬 절차로 재현할 수 있게 설정과 migration을 제공합니다.

PGlite의 auth.uid/users는 최소 스텁이며 Supabase 인증 보안 검증을 대체하지 않습니다. DB 역할·RLS·저장 SQL은 실제 PostgreSQL 엔진에서 실행했으나, 테스트 소켓은 초기 세션에 worker 역할을 지정하므로 DB 패스워드 로그인/네트워크 TLS를 검증한 것은 아닙니다. PGlite는 단일 엔진 연결이어서 실제 다중 워커 프로세스의 트랜잭션 경합·복제·성능은 검증하지 않았습니다.

공식 Federal Register API 문서와 재사용 근거는 확인했습니다. live HTTP 수집은 기본 opt-out으로 유지했고 실제 공급자 응답을 수집·저장하는 네트워크 smoke test는 수행하지 않았습니다. RSS/API 파서와 워커 저장은 합성 payload로 검증했습니다. 공급자의 현재 가용성·쿼터·약관 변경은 실제 운영 시작 시 재확인해야 합니다.

Event Graph Lite의 실제 산업별 precision/recall, 모순 검출·중요도·행동 제안·이메일 발송은 검증 대상이 아니라 미구현 범위입니다. 민감한 개인정보/기사 원문/운영 키가 포함된 테스트 자료를 사용하지 않았습니다.
