-- Run after installing the migration and verifying the payment proof.
-- Replace the email before running in Supabase SQL Editor.
select public.approve_student_package('student@example.com');

-- Inspect pending students:
select
  p.email,
  p.full_name,
  p.stream,
  ps.plan,
  ps.status,
  ps.created_at
from public.profiles p
join public.package_status ps on ps.user_id = p.user_id
where ps.status = 'pending'
order by ps.created_at asc;
