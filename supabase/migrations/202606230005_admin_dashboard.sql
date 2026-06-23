-- Admin dashboard: non-recursive role checks and full student management access.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can insert profiles" on public.profiles;
create policy "Admins can insert profiles"
on public.profiles for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
on public.profiles for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read all package status" on public.package_status;
create policy "Admins can read all package status"
on public.package_status for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all package status" on public.package_status;
create policy "Admins can update all package status"
on public.package_status for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can insert package status" on public.package_status;
create policy "Admins can insert package status"
on public.package_status for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can delete package status" on public.package_status;
create policy "Admins can delete package status"
on public.package_status for delete
to authenticated
using (public.is_admin());

create or replace function public.admin_approve_student(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden';
  end if;

  update public.package_status
  set status = 'approved',
      approved_at = now(),
      approved_by = auth.uid(),
      updated_at = now()
  where user_id = target_user_id;
end;
$$;

create or replace function public.admin_reject_student(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden';
  end if;

  update public.package_status
  set status = 'rejected',
      approved_at = null,
      approved_by = auth.uid(),
      updated_at = now()
  where user_id = target_user_id;
end;
$$;

revoke all on function public.admin_approve_student(uuid) from public;
revoke all on function public.admin_reject_student(uuid) from public;
grant execute on function public.admin_approve_student(uuid) to authenticated;
grant execute on function public.admin_reject_student(uuid) to authenticated;
