-- 단어장: 독자가 기사에서 뜻을 열어 본 낱말과 복습 일정을 저장합니다.
-- 서버 계정(pil_reader 쿠키)이 있는 독자만 여기에 저장되고, 그 밖의 방문자는 자기 브라우저에만 저장됩니다.
-- 다른 베타 표들과 마찬가지로 서버(서비스 키)만 읽고 쓸 수 있습니다.
create table if not exists public.reader_words (
  reader_id uuid not null references public.beta_readers(id) on delete cascade,
  lang text not null check (lang in ('ko','en')),
  term text not null check (length(trim(term)) between 1 and 120),
  meaning text not null check (length(trim(meaning)) between 1 and 1000),
  article_id text check (article_id is null or length(article_id) <= 160),
  article_title text check (article_title is null or length(article_title) <= 240),
  seen_count integer not null default 1 check (seen_count >= 1),
  -- 복습 상자: 0은 새 낱말(또는 잊은 낱말), 5는 잘 아는 낱말. due_at이 다음 복습 시각입니다.
  box smallint not null default 0 check (box between 0 and 5),
  due_at timestamptz not null default now(),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  reviewed_at timestamptz,
  primary key (reader_id, lang, term)
);
create index if not exists reader_words_due on public.reader_words (reader_id, due_at);
alter table public.reader_words enable row level security;
revoke all on public.reader_words from anon, authenticated;
