-- Create subject_notes table for PDF metadata
create table public.subject_notes (
  id uuid default gen_random_uuid() primary key,
  subject_id text not null,
  title text not null,
  summary text, -- Brief description
  file_path text not null, -- Path in storage: subjects/{subject_id}/{filename}
  file_size integer, -- Size in bytes
  order_by integer default 0, -- Display order
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes for faster queries
create index subject_notes_subject_id_idx on public.subject_notes(subject_id);
create index subject_notes_created_at_idx on public.subject_notes(created_at desc);

-- Enable RLS
alter table public.subject_notes enable row level security;

-- RLS Policy: All authenticated students can read notes metadata
create policy "Authenticated students can view subject notes"
on public.subject_notes for select
to authenticated
using (true);

-- RLS Policy: Only admins can insert/update/delete
create policy "Only admins can manage notes"
on public.subject_notes for all
to authenticated
using (
  (select raw_user_meta_data->>'role' from auth.users where auth.users.id = auth.uid()) = 'admin'
)
with check (
  (select raw_user_meta_data->>'role' from auth.users where auth.users.id = auth.uid()) = 'admin'
);
