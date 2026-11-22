begin;

create table public.education_classes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  reading_level text not null check (reading_level in ('upper_elementary','middle_school','high_school')),
  created_at timestamptz not null default now()
);
create index education_classes_tenant on public.education_classes(tenant_id);

create table public.education_students (
  class_id uuid references public.education_classes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 40),
  joined_at timestamptz not null default now(),
  primary key (class_id,user_id)
);
create index education_students_user on public.education_students(user_id,class_id);

create table private.education_invites (
  class_id uuid primary key references public.education_classes(id) on delete cascade,
  code_hash bytea not null unique,
  expires_at timestamptz not null
);

create table public.education_lessons (
  id uuid primary key,
  class_id uuid not null references public.education_classes(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  content jsonb not null check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 120000),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (id,class_id)
);
create index education_lessons_class_date on public.education_lessons(class_id,created_at desc,id);

create table public.education_writings (
  lesson_id uuid not null,
  class_id uuid not null,
  student_id uuid not null,
  body text not null check (char_length(body) <= 6000),
  submitted_at timestamptz check (submitted_at is null or char_length(btrim(body)) >= 20),
  feedback text check (feedback is null or char_length(btrim(feedback)) between 1 and 2000),
  feedback_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (lesson_id,student_id),
  foreign key (lesson_id,class_id) references public.education_lessons(id,class_id) on delete cascade,
  foreign key (class_id,student_id) references public.education_students(class_id,user_id) on delete cascade
);
create index education_writings_class_student on public.education_writings(class_id,student_id);
create index education_writings_submitted on public.education_writings(lesson_id,submitted_at desc,student_id)
  where submitted_at is not null;

create function private.education_access(target_class uuid, teacher_only boolean) returns boolean
language sql stable security definer set search_path = '' as $$
  select actor.id is not null and (
    exists (
      select 1 from public.education_classes c
      join public.memberships m on m.tenant_id=c.tenant_id
      where c.id=target_class and m.user_id=actor.id and m.role='owner'
    ) or (not teacher_only and exists (
      select 1 from public.education_students s where s.class_id=target_class and s.user_id=actor.id
    ))
  ) from (select auth.uid() as id) actor
$$;

alter table public.education_classes enable row level security;
alter table public.education_students enable row level security;
alter table private.education_invites enable row level security;
alter table public.education_lessons enable row level security;
alter table public.education_writings enable row level security;

create policy education_class_read on public.education_classes for select to authenticated
  using ((select private.is_member(tenant_id,true)) or (select private.education_access(id,false)));
create policy education_class_create on public.education_classes for insert to authenticated
  with check ((select private.is_member(tenant_id,true)));
create policy education_student_read on public.education_students for select to authenticated
  using (user_id=(select auth.uid()) or (select private.education_access(class_id,true)));
create policy education_lesson_read on public.education_lessons for select to authenticated using (
  (select private.education_access(class_id,true))
  or (published_at is not null and (select private.education_access(class_id,false)))
);
create policy education_draft_create on public.education_lessons for insert to authenticated
  with check (published_at is null and (select private.education_access(class_id,true)));
create policy education_draft_edit on public.education_lessons for update to authenticated
  using (published_at is null and (select private.education_access(class_id,true)))
  with check ((select private.education_access(class_id,true)));
create policy education_writing_read on public.education_writings for select to authenticated using (
  (student_id=(select auth.uid()) and (select private.education_access(class_id,false)))
  or (submitted_at is not null and (select private.education_access(class_id,true)))
);
create policy education_writing_start on public.education_writings for insert to authenticated with check (
  student_id=(select auth.uid()) and submitted_at is null and exists (
    select 1 from public.education_lessons l where l.id=lesson_id and l.class_id=education_writings.class_id and l.published_at is not null
  )
);
create policy education_writing_edit on public.education_writings for update to authenticated
  using (student_id=(select auth.uid()) and submitted_at is null and (select private.education_access(class_id,false)))
  with check (student_id=(select auth.uid()) and (select private.education_access(class_id,false)));

-- Only the first submission uses the supplied intent to submit. The DB records the actual time.
create function private.education_writing_timestamps() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  if old.submitted_at is null and new.submitted_at is not null then new.submitted_at := now(); end if;
  return new;
end
$$;
create trigger education_writing_timestamps before update of body,submitted_at on public.education_writings
for each row execute function private.education_writing_timestamps();

create function private.rotate_education_invite(target_class uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  code text := replace(gen_random_uuid()::text || gen_random_uuid()::text,'-','');
  expiry timestamptz := now() + interval '7 days';
begin
  if not private.education_access(target_class,true) then
    raise exception 'Class teacher required' using errcode='42501';
  end if;
  insert into private.education_invites(class_id,code_hash,expires_at)
    values(target_class,sha256(convert_to(code,'UTF8')),expiry)
  on conflict(class_id) do update set code_hash=excluded.code_hash,expires_at=excluded.expires_at;
  return jsonb_build_object('code',code,'expires_at',expiry);
end
$$;

create function private.join_education_class(invite_code text, student_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid();
declare target uuid;
begin
  if actor is null then raise exception 'Sign in required' using errcode='42501'; end if;
  if invite_code is null or invite_code !~ '^[a-f0-9]{64}$'
    or student_name is null or char_length(btrim(student_name)) not between 1 and 40 then
    raise exception 'Invalid invitation input' using errcode='22023';
  end if;
  select i.class_id into target from private.education_invites i
    where i.code_hash=sha256(convert_to(invite_code,'UTF8')) and i.expires_at>now() for share;
  if target is null then raise exception 'Invitation unavailable' using errcode='22023'; end if;
  if private.education_access(target,true) then raise exception 'Teacher already has access' using errcode='42501'; end if;
  insert into public.education_students(class_id,user_id,display_name)
    values(target,actor,btrim(student_name)) on conflict (class_id,user_id) do nothing;
  return target;
end
$$;

create function private.review_education_writing(target_lesson uuid,target_student uuid,comment_text text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.education_writings w set feedback=btrim(comment_text),feedback_at=now()
    where w.lesson_id=target_lesson and w.student_id=target_student
      and w.submitted_at is not null and private.education_access(w.class_id,true);
  return found;
end
$$;

create function public.rotate_education_invite(target_class uuid) returns jsonb
language sql security invoker set search_path = '' as $$
  select private.rotate_education_invite(target_class)
$$;
create function public.join_education_class(invite_code text,student_name text) returns uuid
language sql security invoker set search_path = '' as $$
  select private.join_education_class(invite_code,student_name)
$$;
create function public.review_education_writing(target_lesson uuid,target_student uuid,comment_text text) returns boolean
language sql security invoker set search_path = '' as $$
  select private.review_education_writing(target_lesson,target_student,comment_text)
$$;
create function public.save_education_draft(target_lesson uuid,target_class uuid,draft_body text)
returns setof public.education_writings
language sql security invoker set search_path = '' as $$
  insert into public.education_writings(lesson_id,class_id,student_id,body)
    values(target_lesson,target_class,auth.uid(),draft_body)
  on conflict (lesson_id,student_id) do update set body=excluded.body
    where education_writings.submitted_at is null
  returning *
$$;

revoke all on public.education_classes,public.education_students,public.education_lessons,
  public.education_writings,private.education_invites from public,anon,authenticated,pil_worker;
grant select on public.education_classes,public.education_students,public.education_lessons,public.education_writings to authenticated;
grant insert(tenant_id,name,reading_level) on public.education_classes to authenticated;
grant insert(id,class_id,title,content),update(title,content,published_at) on public.education_lessons to authenticated;
grant insert(lesson_id,class_id,student_id,body),update(body,submitted_at) on public.education_writings to authenticated;

revoke all on function private.education_writing_timestamps(),private.education_access(uuid,boolean),
  private.rotate_education_invite(uuid),private.join_education_class(text,text),private.review_education_writing(uuid,uuid,text),
  public.rotate_education_invite(uuid),public.join_education_class(text,text),public.review_education_writing(uuid,uuid,text),
  public.save_education_draft(uuid,uuid,text)
  from public,anon,pil_worker;
grant execute on function private.education_access(uuid,boolean),private.rotate_education_invite(uuid),
  private.join_education_class(text,text),private.review_education_writing(uuid,uuid,text),
  public.rotate_education_invite(uuid),public.join_education_class(text,text),public.review_education_writing(uuid,uuid,text),
  public.save_education_draft(uuid,uuid,text)
  to authenticated;
commit;
