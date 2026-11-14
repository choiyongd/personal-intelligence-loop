# 매일 새 소식 (라이브 에디션)

2026-11-01 추가. 미리 써 둔 해설 기사에 더해, 매일 새벽 공식 기관의 새 발표를 모아 AI가 짧은 소식 기사를 쓰고 그날 호와 메일 맨 앞에 싣습니다.

## 흐름

1. **수집** (`/api/live?step=collect`): `apps/web/src/lib/live/feeds.ts`에 등록된 공식 RSS/Atom을 읽어 최근 4일 안의 새 항목만 `live_items`에 넣습니다(같은 주소는 한 번만).
2. **편집** (`step=plan`): 지난 48시간에 모였지만 아직 쓰이지 않은 항목(최대 150건)에서 행사·일정·채용·인사 공지를 제목으로 걸러 내고(`lib/live/quality.ts`), 한 출처가 목록을 채우지 않게 출처당 25건까지만 남겨 Claude 편집장 호출 한 번에 넘겨, 그날 쓸 이야기를 최대 `LIVE_DAILY_STORIES`개(기본 10) 고르고 분야·주제·지역을 정합니다. 하루 한 번만 실행됩니다.
3. **작성** (`step=write`): 이야기마다 Claude 기자 호출 한 번. 근거는 우리가 번호를 붙인 자료뿐이라 모델이 링크를 지어낼 수 없습니다. 근거 자료가 다 합쳐 400자도 안 되면(제목뿐인 항목) Claude를 부르지 않고 `thin-material`로 접습니다. 모든 문단에 [번호]가 없거나 없는 번호를 가리키면 버리고 다음 실행에서 한 번 더 시도합니다(최대 2회).
4. **지면 반영**: 발행된 기사는 서버 메모리에 올라가(`lib/live/registry.ts`, 5분마다 갱신) 매일 받는 독자는 최근 3일, 매주 받는 독자는 최근 7일 안의 소식 중 고른 분야에 맞는 것을 핫 픽 다음, 해설 기사 앞에 받습니다(한 호의 절반까지). 지난 날짜의 호에는 그 날짜 이후에 쓴 소식이 들어가지 않습니다.

`.github/workflows/live-news.yml`이 매일 01:07, 03:07, 04:37(한국 시간) 세 번 위 순서로 호출합니다. GitHub 예약 실행은 몇 시간씩 늦게 시작하는 일이 잦아(2026-11 확인 결과 4~6시간) 한 번만 걸면 아침 7시 메일보다 늦습니다. 각 단계는 다시 돌려도 안전합니다(수집은 아는 링크를 건너뛰고, 편집은 그날 이미 했으면 건너뛰고, 작성은 남은 이야기만 씀). 작성은 한 번에 4편씩, 남은 것이 없을 때까지 최대 8번 부릅니다.

## 출처와 저작권 원칙

- 언론사 기사는 수집하지 않습니다. 재사용이 허용된 공공 자료(미국 연방정부 저작물, 영국 Open Government Licence, ECB 출처 표기 조건 등)만 등록했습니다.
- `fullText:true`인 출처(공공 영역·개방 라이선스)만 링크된 발표 원문을 읽어 근거로 씁니다. 나머지는 피드의 제목과 짧은 설명만 씁니다. DB에는 피드 설명(1,500자 이하)만 저장하고 원문 전문은 저장하지 않습니다.
- 기사는 원문 문장을 옮기지 않고 새로 쓰며, 기사 화면에 "공식 발표를 바탕으로 AI가 쓴 소식"임을 표시하고 원문 링크를 번호로 답니다.
- WHO(비상업 라이선스), 유럽연합 집행위 보도자료(피드가 8월 이후 갱신 없음), 미국 에너지부(2020년 이후 갱신 없음), EIA(robots 거부), UN News(접속 실패)는 넣지 않았습니다.
- 대한민국 정책브리핑(공공누리) 피드 두 개는 확인 도구에서 접속되지 않았습니다. 수집은 서울 리전(icn1)에서 돌고, 실패해도 다른 출처는 그대로 진행되며 결과에 출처별 상태가 남습니다.
- 새 출처를 넣을 때는 먼저 이용 조건을 확인하고 `feeds.ts`에 라이선스와 근거 링크를 적습니다.

## 설정

| 어디 | 이름 | 값 |
|---|---|---|
| Supabase SQL Editor | `supabase/migrations/202611011001_live_news.sql` | 한 번 실행 |
| Supabase SQL Editor | `supabase/migrations/202611140001_live_costs.sql` | 위 다음에 한 번 실행 (비용 기록) |
| Vercel 환경 변수 | `ANTHROPIC_API_KEY` | console.anthropic.com에서 만든 키 (필수) |
| Vercel 환경 변수 (선택) | `LIVE_MODEL` | 기본 `claude-opus-5-5`. 비용을 줄이려면 `claude-sonnet-5-5` |
| Vercel 환경 변수 (선택) | `LIVE_DAILY_STORIES` | 하루 최대 기사 수, 기본 10 (1~20) |
| Vercel 환경 변수 (선택) | `LIVE_EFFORT` | `low`/`medium`/`high`, 기본 `medium` |

GitHub 저장소 비밀값(Settings → Secrets and variables → Actions)에 메일 발송용 `DISPATCH_URL`(`https://<배포 주소>/api/dispatch`)과 `CRON_SECRET`(Vercel과 같은 값)이 있어야 합니다. 이 둘이 비어 있으면 워크플로는 "not set; skipping"만 남기고 아무것도 하지 않습니다(2026-11-14 확인 당시 이 상태). 키가 없으면 `/api/live`는 503을 돌려주고 사이트는 해설 기사만으로 지금처럼 동작합니다.

처음 한 번은 GitHub 저장소의 Actions → live-news → Run workflow로 직접 돌려 결과를 확인하세요.

## 비용 어림 (2026-11 기준 단가)

Claude Opus 5.5는 입력 100만 토큰당 4달러, 출력 20달러입니다. 편집 호출은 하루 한 번 약 0.2달러, 기사 한 편은 근거 자료와 생각 과정을 합쳐 약 0.15~0.25달러로 어림합니다. 하루 10편이면 약 2달러, 한 달 약 60~70달러(9만 원 안팎)입니다. `LIVE_MODEL=claude-sonnet-5-5`로 바꾸면 절반쯤으로 줄어듭니다. 실제 사용량은 첫 주에 console.anthropic.com의 사용량 화면에서 확인하고, 월 사용 한도를 걸어 두세요. 독자 수와 무관하게 하루 기사 수만큼만 듭니다.

## 운영

- 실행 기록: `live_runs` 표(단계, 건수, 짧은 오류). 편집·작성 단계의 `stats.usage`에 그 실행의 토큰과 달러 비용이, `stats.screened`에 걸러 낸 공지·초과 건수가 남습니다.
- 기사별 비용: `live_articles.input_tokens`, `output_tokens`, `cost_usd`(재시도까지 합산). 날짜별 요약은 `select * from live_daily_report order by issue_date desc;` (작성 비용만, 편집 비용은 `live_runs`).
- 품질 점검: `select issue_date, status, last_error, article->>'title', cost_usd from live_articles order by created_at desc limit 30;`
- 잘못된 기사 내리기: `update live_articles set status='withdrawn' where id='n-…';` 5분 안에 지면에서 빠집니다(이미 보낸 메일은 회수되지 않음).
- 같은 날 다시 편집하려면 그날 `live_articles` 행을 지우고 해당 `live_items.story_id`를 비운 뒤 Run workflow.
