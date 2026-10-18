# 화면 설계 근거와 결정 기록

이 문서는 최초 Sprint 0–1의 설계 기록입니다. **2026-10-17 이후 현재 디자인은 [REDESIGN.md](REDESIGN.md)와 [레퍼런스 기준](REDESIGN_REFERENCE_LOCK.md)을 따릅니다.** 새 버전에서는 사용자 지정 Matter/Bloomberg 원본 화면을 브라우저로 확인했습니다. 아래의 참조 접근 실패와 밝은 UI 기준은 최초 버전에 대한 기록입니다.

이 제품은 산업 업무용 읽기/검토 도구입니다. 핵심 행동은 사건을 스캔하고, 근거를 확인하고, 저장하고, 다음 소통에 사용할 자료를 선택하는 것입니다. 기술 설정이나 내부 구현 세부사항은 설정·수집 현황에만 노출합니다.

Refero MCP로 monochrome publishing, Feedly intelligence, Linear light SaaS 방향과 Feedly feed/settings 화면을 조회했으나 계정의 NO_SUBSCRIPTION 오류로 실제 reference를 읽지 못했습니다. 실제 화면을 검토했다고 주장하지 않습니다. Refero skill에 번들된 Typography Guide와 Craft Details Guide를 근거로 직접 구현했습니다. 기존 참조 페이지의 시각적 복제는 아닙니다.

## 구현 전 방향 잠금

주 참조는 번들 Typography Guide의 업무 도구 규칙입니다. 중립 sans 한 계열, 16px 본문, 13px 메타데이터, 검은 글자/흰 바탕, 한정된 회색 단계, 약 1.2배 타입 스케일, 최대 65ch 읽기 폭을 유지합니다. 보조 참조 Craft Details는 레이블·focus-visible·44px 조작 대상·실제 링크/버튼·폼 autocomplete·반응형 구성에만 적용합니다.

색상 역할: ink #111820=본문/주 버튼, muted #535e69=보조 정보, line #dce1e6=구분선, accent #165aab=링크/focus, pale blue=명시적 정보 안내. accent를 장식 배경에 무분별하게 확장하지 않습니다. radius 5px, 그림자 없음, 콘텐츠 우선 화면입니다. 뉴스 본문/사진을 가져오지 않는 정책이므로 이미지 슬롯/이미지 생성은 필요하지 않습니다.

## 결정 기록

| 선택 | 근거 | 역할·이유 |
|---|---|---|
| 좌측 작업 메뉴·우측 사건 목록 | 사용자의 필수 화면 목록 | 반복적인 피드/설정/저장/발행/운영 이동 |
| 사건별 번호·출처 수·문서 수 | Event Graph/출처 추적 요구 | 기사 수와 사건 수를 분리해 스캔 |
| 고정된 anchor 후보임을 명시 | 알고리즘 실제 능력 | 검증되지 않은 의미 판단과 사실을 구분 |
| source strip의 외부 링크 | 근거 출처 연결 요구 | 재배포 대신 원문으로 이동 |
| 산세리프·3단계 글자색·1.55 본문 | Typography Guide | 한국어와 영문 혼합 자료의 업무 가독성 |
| 소수점 없는 표 수치·tabular nums | Typography Guide | 수집 건수/시도 비교 |
| label·키보드 outline·44px 버튼 | Craft Details | 폼/키보드 접근성 |
| 모바일 가로 메뉴·한 열 사건 상세 | Craft Details/사용자 웹 요구 | 작은 화면의 읽기 폭과 터치 영역 확보 |
| 합성 미리보기 안내 | fixture 데이터 조건 | 실제 뉴스와 혼동 방지 |

## 점검 범위

빌드와 HTTP 테스트 외에 실제 브라우저 렌더링을 데스크톱/모바일에서 확인합니다. 결과는 VERIFICATION.md에 기록하며, 라이브 Refero 참고 이미지에 대한 정밀 일치 검증을 주장하지 않습니다. Auth 서버와 연결한 동적 화면은 별도 로컬 Supabase 수용 절차가 필요합니다.
