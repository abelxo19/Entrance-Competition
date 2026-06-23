-- Add admin role column to profiles table
alter table public.profiles add column if not exists role text default 'student' check (role in ('student', 'admin'));

-- Update storage RLS policies
-- Note: Storage buckets need to be created manually via Supabase dashboard first

-- RLS Policy for subject-notes bucket: Students can read, admins can write
create policy "Students can read subject notes PDFs"
on storage.objects for select
to authenticated
using (bucket_id = 'subject-notes');

create policy "Admins can upload subject notes PDFs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'subject-notes'
  and (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  )
);

create policy "Admins can delete subject notes PDFs"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'subject-notes'
  and (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  )
);
