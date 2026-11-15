-- Readers' answers to the questions at the end of each article, with reports and moderation.
-- Server-only tables (service-role key), like the other beta tables: anon and authenticated clients get nothing.
create table if not exists public.discussion_answers (
  id uuid primary key default gen_random_uuid(),
  article_id text not null check (length(article_id) between 1 and 80),
  -- Which prompt the answer is for: 'q0', 'q1'… for check questions, 't0', 't1'… for things to think about.
  question_key text not null check (question_key ~ '^[qt][0-9]{1,2}$'),
  -- The prompt as the reader saw it, so the answer still reads right if the article is later edited.
  question text not null check (length(question) between 1 and 600),
  reader_id uuid not null references public.beta_readers(id) on delete cascade,
  author_name text not null check (length(trim(author_name)) between 1 and 20),
  body text not null check (length(trim(body)) between 2 and 1000),
  -- 'visible' shows to everyone; 'hidden' only to its author and the moderator (by reports or by the moderator).
  status text not null default 'visible' check (status in ('visible','hidden')),
  hidden_reason text check (hidden_reason is null or hidden_reason in ('reports','moderator')),
  report_count integer not null default 0 check (report_count >= 0),
  created_at timestamptz not null default now()
);
create index if not exists discussion_answers_article on public.discussion_answers (article_id, created_at desc);
create index if not exists discussion_answers_reader on public.discussion_answers (reader_id, created_at desc);
create index if not exists discussion_answers_flagged on public.discussion_answers (report_count desc, created_at desc) where report_count > 0 or status = 'hidden';

create table if not exists public.discussion_reports (
  answer_id uuid not null references public.discussion_answers(id) on delete cascade,
  reader_id uuid not null references public.beta_readers(id) on delete cascade,
  reason text not null default 'other' check (reason in ('abuse','spam','privacy','other')),
  created_at timestamptz not null default now(),
  primary key (answer_id, reader_id)
);

-- Each new report bumps the count; three reports from different readers hide the answer until the moderator looks.
create or replace function public.discussion_report_added() returns trigger language plpgsql as $$
begin
  update public.discussion_answers
     set report_count = report_count + 1,
         status = case when report_count + 1 >= 3 then 'hidden' else status end,
         hidden_reason = case when report_count + 1 >= 3 and status = 'visible' then 'reports' else hidden_reason end
   where id = new.answer_id;
  return new;
end $$;
drop trigger if exists discussion_report_added on public.discussion_reports;
create trigger discussion_report_added after insert on public.discussion_reports
  for each row execute function public.discussion_report_added();

alter table public.discussion_answers enable row level security;
alter table public.discussion_reports enable row level security;
revoke all on public.discussion_answers from anon, authenticated;
revoke all on public.discussion_reports from anon, authenticated;
revoke all on function public.discussion_report_added() from public, anon, authenticated;
