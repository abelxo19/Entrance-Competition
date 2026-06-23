-- Create subject_notes table for PDF metadata
create table public.subject_notes (
  id uuid default gen_random_uuid() primary key,
  subject_id text not null,
  grade integer not null check (grade >= 9 and grade <= 12), -- Grade 9-12
  title text not null,
  summary text, -- Brief description
  file_path text not null, -- Path in storage: subjects/{subject_id}/{grade}/{filename}
  file_size integer, -- Size in bytes
  order_by integer default 0, -- Display order
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes for faster queries
create index subject_notes_subject_grade_idx on public.subject_notes(subject_id, grade);
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
