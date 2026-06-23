-- Fix admin policies that incorrectly query auth.users from authenticated role.
-- Use profiles.role instead to avoid auth.users permission errors.

drop policy if exists "Only admins can manage notes" on public.subject_notes;
create policy "Only admins can manage notes"
on public.subject_notes for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "Admins can upload subject notes PDFs" on storage.objects;
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

drop policy if exists "Admins can delete subject notes PDFs" on storage.objects;
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
