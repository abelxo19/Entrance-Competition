create type public.student_stream as enum ('natural', 'social');
create type public.package_plan as enum ('individual', 'squad');
create type public.package_payment_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  stream public.student_stream,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.package_status (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan public.package_plan,
  status public.package_payment_status not null default 'pending',
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.package_status enable row level security;

create policy "Students can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Students can read their own package status"
on public.package_status for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (user_id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      updated_at = now();

  insert into public.package_status (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.handle_new_user();

-- Synchronize users who registered before this migration was installed.
insert into public.profiles (user_id, email, full_name, stream)
select
  id,
  coalesce(email, ''),
  raw_user_meta_data ->> 'full_name',
  case
    when raw_user_meta_data ->> 'stream' in ('natural', 'social')
      then (raw_user_meta_data ->> 'stream')::public.student_stream
    else null
  end
from auth.users
on conflict (user_id) do nothing;

insert into public.package_status (user_id, plan, status, approved_at)
select
  id,
  case
    when raw_user_meta_data ->> 'plan' in ('individual', 'squad')
      then (raw_user_meta_data ->> 'plan')::public.package_plan
    else null
  end,
  case
    when raw_app_meta_data ->> 'payment_status' in ('approved', 'rejected')
      then (raw_app_meta_data ->> 'payment_status')::public.package_payment_status
    else 'pending'::public.package_payment_status
  end,
  case
    when raw_app_meta_data ->> 'payment_status' = 'approved' then now()
    else null
  end
from auth.users
on conflict (user_id) do nothing;

create or replace function public.select_student_stream(
  selected_stream public.student_stream
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set stream = selected_stream, updated_at = now()
  where user_id = auth.uid();

  update public.package_status
  set plan = null, status = 'pending', approved_at = null, approved_by = null,
      updated_at = now()
  where user_id = auth.uid()
    and status <> 'approved';
end;
$$;

create or replace function public.select_package_plan(
  selected_plan public.package_plan
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where user_id = auth.uid() and stream is not null
  ) then
    raise exception 'Select a study stream first';
  end if;

  update public.package_status
  set plan = selected_plan, status = 'pending', approved_at = null,
      approved_by = null, updated_at = now()
  where user_id = auth.uid()
    and status <> 'approved';
end;
$$;

create or replace function public.reset_package_selection()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.package_status
  set plan = null, status = 'pending', approved_at = null, approved_by = null,
      updated_at = now()
  where user_id = auth.uid()
    and status <> 'approved';
end;
$$;

revoke all on function public.select_student_stream(public.student_stream) from public;
revoke all on function public.select_package_plan(public.package_plan) from public;
revoke all on function public.reset_package_selection() from public;

grant execute on function public.select_student_stream(public.student_stream) to authenticated;
grant execute on function public.select_package_plan(public.package_plan) to authenticated;
grant execute on function public.reset_package_selection() to authenticated;

create or replace function public.approve_student_package(student_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_user_id uuid;
begin
  select id into target_user_id
  from auth.users
  where lower(email) = lower(student_email)
  limit 1;

  if target_user_id is null then
    raise exception 'Student not found';
  end if;

  if not exists (
    select 1 from public.profiles
    where user_id = target_user_id and stream is not null
  ) then
    raise exception 'Student has not selected a stream';
  end if;

  if not exists (
    select 1 from public.package_status
    where user_id = target_user_id and plan is not null
  ) then
    raise exception 'Student has not selected a package';
  end if;

  update public.package_status
  set status = 'approved',
      approved_at = now(),
      approved_by = auth.uid(),
      updated_at = now()
  where user_id = target_user_id;
end;
$$;

revoke all on function public.approve_student_package(text) from public;
-- Keep approval unavailable to application users. Run it from the SQL Editor
-- or grant it later to a dedicated admin role.
