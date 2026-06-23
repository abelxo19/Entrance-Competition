-- Limit each account to 2 active device sessions.

create table if not exists public.user_device_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null unique,
  device_label text not null default 'Unknown device',
  user_agent text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists user_device_sessions_user_id_idx
  on public.user_device_sessions(user_id);

create index if not exists user_device_sessions_active_user_idx
  on public.user_device_sessions(user_id)
  where revoked_at is null;

alter table public.user_device_sessions enable row level security;

drop policy if exists "Users can read their own device sessions" on public.user_device_sessions;
create policy "Users can read their own device sessions"
on public.user_device_sessions
for select
to authenticated
using (user_id = auth.uid());

drop function if exists public.register_device_session(text, text, text);
drop function if exists public.register_device_session(jsonb);

create or replace function public.register_device_session(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session_id text := nullif(trim(payload->>'session_id'), '');
  v_device_label text := coalesce(nullif(trim(payload->>'device_label'), ''), 'Unknown device');
  v_user_agent text := payload->>'user_agent';
  v_active_count integer;
  v_max_devices constant integer := 2;
begin
  if v_user_id is null or v_session_id is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated');
  end if;

  if exists (
    select 1
    from public.user_device_sessions
    where user_id = v_user_id
      and session_id = v_session_id
      and revoked_at is null
  ) then
    update public.user_device_sessions
    set last_seen_at = now(),
        device_label = v_device_label,
        user_agent = coalesce(v_user_agent, user_agent)
    where user_id = v_user_id
      and session_id = v_session_id;

    return jsonb_build_object('ok', true);
  end if;

  if exists (
    select 1
    from public.user_device_sessions
    where user_id = v_user_id
      and session_id = v_session_id
      and revoked_at is not null
  ) then
    update public.user_device_sessions
    set revoked_at = null,
        last_seen_at = now(),
        device_label = v_device_label,
        user_agent = coalesce(v_user_agent, user_agent)
    where user_id = v_user_id
      and session_id = v_session_id;

    return jsonb_build_object('ok', true);
  end if;

  select count(*) into v_active_count
  from public.user_device_sessions
  where user_id = v_user_id
    and revoked_at is null;

  if v_active_count >= v_max_devices then
    return jsonb_build_object(
      'ok', false,
      'error', 'This account is already signed in on 2 devices. Sign out on another device first.'
    );
  end if;

  insert into public.user_device_sessions (
    user_id,
    session_id,
    device_label,
    user_agent
  )
  values (
    v_user_id,
    v_session_id,
    v_device_label,
    v_user_agent
  );

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.revoke_device_session(p_session_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or p_session_id is null or length(trim(p_session_id)) = 0 then
    return;
  end if;

  update public.user_device_sessions
  set revoked_at = now(),
      last_seen_at = now()
  where user_id = auth.uid()
    and session_id = p_session_id
    and revoked_at is null;
end;
$$;

create or replace function public.is_device_session_active(p_session_id text)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_device_sessions
    where user_id = auth.uid()
      and session_id = p_session_id
      and revoked_at is null
  );
$$;

create or replace function public.clear_user_device_sessions()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  update public.user_device_sessions
  set revoked_at = now(),
      last_seen_at = now()
  where user_id = auth.uid()
    and revoked_at is null;
end;
$$;

revoke all on function public.register_device_session(jsonb) from public;
revoke all on function public.revoke_device_session(text) from public;
revoke all on function public.is_device_session_active(text) from public;
revoke all on function public.clear_user_device_sessions() from public;

grant execute on function public.register_device_session(jsonb) to authenticated;
grant execute on function public.revoke_device_session(text) to authenticated;
grant execute on function public.is_device_session_active(text) to authenticated;
grant execute on function public.clear_user_device_sessions() to authenticated;

