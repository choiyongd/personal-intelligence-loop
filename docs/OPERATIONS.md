# 운영과 장애 대응

## 프로세스

웹은 요청/화면, 워커는 독립 장기 실행 프로세스입니다. 배포 시 `python -m pil_worker.cli run --schedule`을 systemd/컨테이너/작업 관리자 등 감독 프로세스 아래 실행합니다. 웹 요청에서 무한 루프를 시작하지 않습니다. CLI는 OS 신호 종료 시 DB 컨텍스트를 닫으며 처리 중 작업은 lease 만료 후 재획득됩니다. SIGKILL도 같은 reclaim 경로입니다.

일회 실행은 `once`, 현재 due 작업을 모두 처리하고 종료하려면 `drain`, 구독별 정기 작업 등록만 하려면 `schedule`입니다. `drain`은 미래 available_at의 retry 작업을 기다리지 않습니다. 실시간 스케줄러는 현재 구독에 대해 최소 1시간 주기로 등록하고 스케줄러 루프는 60초마다 확인합니다. 이는 이 프로젝트 워커 프로세스 안의 스케줄링이며 OS 예약 작업을 설치하지 않습니다.

## 상태 전이

queued → running → succeeded 또는 retry → running. 정책·파싱·모든 항목 품질 오류는 dead. 일시 네트워크/HTTP 408·429·5xx와 DB serialization/deadlock 등은 최대 4회 시도합니다. 30·60·120초 기반 지수 대기 + 0~15초 jitter, 최대 3600초입니다. 공급자 Retry-After의 정밀 해석은 후속 범위이며 출처 자체의 min_interval_seconds 전역 제한도 적용하므로 실제 대기가 더 길 수 있습니다.

claim은 advisory transaction lock과 FOR UPDATE SKIP LOCKED를 사용합니다. source별 다른 유효 running 작업/최근 시작 시각을 확인해 같은 공급자에 대한 동시 수집과 과도한 요청을 줄입니다. 각 작업은 lease_token UUID와 leased_until을 갖습니다. 기본 lease 120초, live fetch 전체 응답 deadline 30초·socket timeout 최대 15초입니다. DNS 조회 자체의 OS timeout은 별도이며 영구 차단은 감독 프로세스의 종료 제한으로 관리합니다. 데이터 크기/항목 상한은 2MiB/200개입니다.

commit/failure 처리는 job row를 잠그고 state·token·만료를 확인합니다. 이전 워커의 결과는 토큰이 바뀌거나 기한을 넘기면 기록되지 않습니다. 마지막 시도 중 종료된 작업은 만료 뒤 `lease_exhausted`로 dead 처리합니다. 다른 테넌트의 job을 실행할 때도 tenant/source는 신뢰된 DB job row에서 가져오며 요청 payload로 덮어쓰지 않습니다.

기사·사건·근거·완료 상태·완료 로그는 하나의 트랜잭션입니다. commit 전 실패하면 저장은 전부 롤백되고 별도 failure 트랜잭션이 retry/dead와 오류 코드를 기록합니다. 장애로 failure 기록도 불가능하면 lease 만료가 복구 수단입니다. attempt, lease_token은 로그 payload에 민감한 원문과 함께 기록하지 않습니다.

## 모니터링

수집 현황은 팀별 최근 50 job/log를 표시합니다. accepted는 품질검사를 통과한 이번 입력 항목 수이며 **새로 저장된 기사 수가 아닙니다**. 재수집에서도 3 accepted일 수 있습니다. rejected는 파싱/검증에서 제외된 항목 수입니다. 로그 `completed.details.reasons`에서 parse_error/private_host 등의 분포를 확인합니다.

운영 지표: oldest due job age, running lease expiry, dead 비율/오류 코드, accepted/rejected 비율, source 최종 성공 시각, 정책 만료까지 남은 일수, 신규 article 수/기존 observation 갱신 수, 중복 억제 수. 현재 화면에는 기본 집계만 구현되어 있고 외부 경보/추적 서비스는 연결하지 않았습니다. 유료 알림이나 외부 메시지 전송도 없습니다.

## 장애별 조치

| 코드/증상 | 조치 |
|---|---|
| license_denied/source_policy_changed | 약관·만료·source 활성 상태 검토. 승인되지 않은 채 재실행 금지 |
| live_fetch_disabled | 실제 수집 의도와 정책을 확인 후 worker .env opt-in |
| private_network_denied/host_not_allowed | endpoint/호스트 목록과 DNS 확인. 내부 주소를 allowlist로 우회하지 않기 |
| http_denied | 공급자의 접근·redirect·응답 정책 검토. 리다이렉트 목적지를 자동 추적하지 않음 |
| http_transient/network_failure/fetch_deadline | retry 대기, 공급자 상태/요청 간격 확인 |
| invalid_xml/invalid_json | 어댑터 스키마 확인; 원문을 공개 로그에 복사하지 않음 |
| quality_all_rejected | title/date/link 품질 계약 및 발행일 확인 |
| database_42501 | worker 역할 grants/정책 함수 적용 확인; 관리자 계정으로 바꿔 실행하지 않음 |
| lease_exhausted | 반복 종료 원인을 확인하고 정상 감독 프로세스로 재시작 |
| 오래 queued | worker 실행 여부, source 전역 간격/다른 tenant 실행 여부 확인 |

dead 작업 재처리는 원인을 수정한 뒤 소유자가 새 enqueue를 요청합니다. 기록을 지우거나 attempt를 낮추지 않습니다. 정책 변경 이력과 운영자 판단은 별도 변경 기록에 보존합니다.

## 보존·백업

원본 payload는 저장하지 않습니다. 업무 메타데이터/로그 보존기한은 출처 계약과 조직 정책에 따라 결정해야 하며 이 버전은 자동 삭제 배치를 활성화하지 않습니다. 90일은 **새 항목 유입 품질 범위**이고 자동 보존기한이 아닙니다. 백업은 암호화·접근 제한·주기적 복구 검증을 적용하고, 삭제 요구가 발생한 데이터는 백업 복구 후 재삭제해야 합니다. migration rollback으로 운영 자료를 제거하지 않습니다. 개발 db reset은 로컬 데이터만 대상으로 사용합니다.

## 운영 계정·배포

`pil_worker`는 nologin으로 생성되고 관리자가 환경별 로그인 비밀번호를 부여합니다. 운영에는 로컬 예제 비밀번호 대신 비밀 저장소를 사용하고 `DATABASE_URL`은 TLS 검증(`sslmode=verify-full` 및 필요 CA)으로 연결합니다. 연결 도구가 dedicated role의 직접 연결을 지원하는지 확인합니다. Supabase pooler는 사용자명·prepared statement/TLS 제약이 다를 수 있으므로 이 버전은 직접 DB 연결을 기본으로 합니다.

웹에는 URL/publishable key와 APP_ORIGIN만 필요합니다. 운영 APP_ORIGIN은 HTTPS이고 Supabase Auth site_url/redirect allowlist와 일치해야 합니다. production에서 localhost HTTP를 쓰면 가입 callback origin 검증이 실패하도록 되어 있습니다. 도메인별 preview cookie와 사용자별 데이터 캐시를 분리하세요. ENABLE_DEMO는 build 시 적용합니다.

실제 다중 프로세스 경쟁과 Auth 전체 흐름은 로컬/스테이징 Supabase에서 추가 검증해야 합니다. PGlite는 단일 세션 엔진이므로 PostgreSQL의 다중 세션 격리·운영 처리량 검증을 대신하지 않습니다.
