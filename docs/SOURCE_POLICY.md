# 출처 이용 정책과 라이선스 레지스트리

## 적용 원칙

RSS가 공개되었다는 사실만으로 전문·이미지·요약 재배포 권한이 생긴다고 간주하지 않습니다. 출처 운영자의 계약·이용약관·API 정책과 해당 자료의 별도 권리를 검토한 후 허용한 필드만 처리합니다. robots.txt는 저작권 라이선스의 대체가 아닙니다. 이 프로젝트는 robots 정책을 수집 승인 근거로 자동 해석하지 않으며 일반 웹페이지 수집기를 제공하지 않습니다.

현재 정책은 모든 출처에서 allow_full_text=false, max_excerpt_chars=0입니다. 어댑터는 RSS description/content와 API body/abstract를 저장용 Item으로 전달하지 않습니다. HTTP payload는 최대 2MiB 메모리에서 일시 처리되고 파일·DB·로그에 원본을 보관하지 않습니다. DB observation 트리거도 승인 상태·만료 시점·정확한 라이선스 연결·인용 길이를 검사합니다. 제목·URL·게시일·출처 ID·외부 문서번호·SHA-256 hash만 저장하는 기본 정책입니다.

## 초기 레지스트리

| ID | 승인 근거 | 허용 | 제한 |
|---|---|---|---|
| synthetic-v1 | 프로젝트가 직접 작성한 합성 fixture | 제목·날짜·예약 도메인 링크 | 실제 보도/실제 기관 발표로 표현 금지 |
| fr-metadata-v1 | Federal Register 공개 API 및 1 CFR 2.6 재사용 안내 | 제목·publication_date·document_number·html_url | 전문/abstract/이미지 제외; API 20개 최근 결과만; 재검토 2027-01-15 |
| unreviewed-v1 | 이용 근거 미확인 | 없음 | pending, 소스 disabled |

Federal Register의 [About This Site](https://www.federalregister.gov/reader-aids/government-policy-and-ofr-procedures/about-this-site)는 Federal Register 정기/특별판 자료의 재사용 정책을 설명합니다. [API 문서](https://www.federalregister.gov/developers/documentation/api/v1)는 공개 API 접근 방식을 제공합니다. 이 근거를 제3자 사이트 전체나 연결된 이미지/첨부에 확대하지 않습니다. 화면의 XML/HTML은 공식 법적 판본이 아니라는 출처의 설명을 존중합니다.

## 새 출처 승인

1. 관리자가 발행 주체·자료 유형·RSS/API endpoint·정확한 호스트 목록을 확인합니다. 사용자가 arbitrary URL을 등록할 수 없습니다.
2. 계약 또는 공식 약관의 URL, 검토일, 재검토 기한, attribution, 허용 메타데이터/발췌 길이, 저장·캐시·삭제·상업적 사용·AI 전송 제한을 기록합니다. 필요한 경우 별도 승인 자료를 내부에서 보관합니다.
3. 검토 중에는 `pending`, allow_metadata=false, source enabled=false를 유지합니다. 레지스트리 검토 주체와 승인 결정을 운영 변경 기록에 남깁니다. 현재 DB의 reviewed_at은 검토 시각이며 사람의 법률 검토 완료 증명은 아닙니다.
4. 필드별 허용 범위가 명확한 후 관리자 migration으로 승인/활성화합니다. 이 버전에서는 excerpt 허용을 늘려도 기본 어댑터가 description을 가져오지 않습니다. 별도 파서/테스트 검토가 필요합니다.
5. 운영 연락처를 User-Agent에 넣고 공급자 제한보다 보수적인 요청 간격을 적용합니다.

출처·license는 일반 사용자/worker에게 수정 권한이 없습니다. 승인 변경은 신뢰된 DB 관리 경로로 수행합니다. 사용자별 새 약관 승인/계약 파일 관리 UI는 아직 없습니다.

## 만료·철회·삭제

review_due_at<=now 또는 status가 approved가 아니면 신규 구독/재활성·수집 요청과 worker 저장을 차단합니다. 워커는 fetch 전과 DB commit 직전에 재확인합니다. DB의 공유 잠금은 commit과 철회 변경의 경합을 직렬화합니다. 네트워크 요청을 이미 보낸 뒤 철회된 경우 취소를 보장하지는 않지만 새 저장을 막습니다.

철회는 이전에 저장된 메타데이터의 법적 보유/표시 허용 여부와 별도입니다. **이 버전에서 status만 revoked로 바꾸면 기존 메타데이터가 자동 삭제되지 않습니다.** 계약이 과거 자료의 표시 중단/삭제를 요구하면, 해당 테넌트 화면을 유지보수 모드로 전환하고 아래 운영자 절차를 수행한 뒤 다시 공개해야 합니다. 백업·외부 발행본도 별도로 확인합니다.

안전하게 보수적으로 처리하는 절차: 해당 source를 disable하고 license를 revoked로 변경 → source observation이 연결된 event ID를 확보 → 관련 event 전체의 saved/observation/article/event를 한 트랜잭션으로 제거 → 로그에는 콘텐츠 없이 삭제 건수·승인 티켓만 남김 → 백업 보존과 복구 시 삭제 재적용을 관리합니다. 다른 합법 출처가 같은 event에 연결되어 있어도 대표 제목의 출처 추적이 충분하지 않으므로 event 전체를 제거합니다. `scripts/purge-source.sql`은 검토 후 관리자만 사용하는 예제입니다.

개인정보가 제목/링크 query에 포함될 수 있으므로 새 출처 검토 시 허용 필드에 개인정보가 없는지도 확인합니다. 워커는 secret/쿠키/헤더/원문/DSN을 로그로 출력하지 않으며 URL의 query를 임의로 로그에 남기지 않습니다.
