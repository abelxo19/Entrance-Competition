# Subject Notes Setup Guide

## Overview
This implementation replaces the mock portal content with a real note storage system:
- **PDFs stored** in Supabase Storage
- **PDFs streamed** in browser (non-downloadable)
- **Admin upload interface** for managing notes

## 1️⃣ Supabase Setup

### Create Storage Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **Create Bucket**
3. Name: `subject-notes`
4. Keep public/private as default
5. Click **Create Bucket**

### Run Migrations

Apply these migrations to your Supabase project in order:

```bash
supabase db push
```

Or manually run these SQL files in Supabase SQL Editor:
1. `supabase/migrations/202606230002_subject_notes.sql` - Notes table
2. `supabase/migrations/202606230003_storage_setup.sql` - Storage policies

### Add Admin Role

To make a user an admin, update their profile in Supabase:

```sql
-- In Supabase SQL Editor
update public.profiles 
set role = 'admin' 
where user_id = 'USER_ID_HERE';
```

## 2️⃣ File Structure

```
src/
├── app/subjects/
│   ├── actions.ts              # Server actions for notes
│   ├── [subjectId]/
│   │   ├── page.tsx            # Subject notes list
│   │   └── notes/
│   │       └── [noteId]/
│   │           └── page.tsx    # PDF viewer
├── components/subjects/
│   ├── pdf-viewer.tsx          # PDF streaming viewer (non-downloadable)
│   └── admin-note-upload.tsx   # Admin upload interface
└── types/exam.ts               # SubjectNote type
```

## 3️⃣ Features

### Student View
- ✅ See list of available notes for each subject
- ✅ Stream PDFs in browser
- ✅ Navigate between pages
- ✅ **Cannot download** PDFs
- ✅ Requires approval to view

### Admin Interface
- 📤 Upload PDF files for subjects
- 📝 Add title and summary
- 🗑️ Delete notes
- 🔐 Only admins can access

## 4️⃣ How to Use

### For Students

1. Login and get approved
2. Select stream (Natural/Social Science)
3. From `/exams` page, click "View Subject Notes"
4. Click on any note to open PDF viewer
5. Navigate pages and read online

### For Admins

1. Login (must be admin in `profiles.role`)
2. Go to `/admin/subjects/[subjectId]/upload` (create this page)
3. Upload PDF file with title and summary
4. Notes appear immediately for students

## 5️⃣ Create Admin Upload Page (Optional)

Create `/src/app/admin/subjects/[subjectId]/page.tsx`:

```tsx
import { AdminNoteUpload } from "@/components/subjects/admin-note-upload";
import { requireAdmin } from "@/lib/student-access";

export default async function AdminSubjectPage({ params }) {
  await requireAdmin();
  const { subjectId } = await params;
  
  return <AdminNoteUpload subjectId={subjectId} />;
}
```

## 6️⃣ Database Schema

### `subject_notes` Table
```
- id (uuid)           Primary key
- subject_id (text)   Subject identifier
- title (text)        Note title
- summary (text)      Optional description
- file_path (text)    Path in storage
- file_size (int)     Size in bytes
- order_by (int)      Display order
- created_at          Timestamp
- updated_at          Timestamp
```

### `profiles` Table (Updated)
```
- role (text)         'student' or 'admin'
```

## 7️⃣ Security

- ✅ Students can only read notes
- ✅ Only admins can upload/delete
- ✅ PDFs streamed via signed URLs (1 hour expiry)
- ✅ RLS policies enforce access control
- ✅ No download functionality

## 8️⃣ Next Steps

1. Run migrations
2. Create storage bucket
3. Make test user an admin
4. Upload test PDF
5. Verify student can stream but not download

## Troubleshooting

**PDF fails to load?**
- Check storage bucket exists: `subject-notes`
- Verify file path is correct in database
- Check signed URL expiry isn't exceeded

**Upload fails?**
- Verify user is admin in profiles
- Check file is valid PDF
- Ensure storage bucket exists and RLS allows uploads

**Students can't see notes?**
- Verify they're approved (`package_status.status = 'approved'`)
- Check notes exist for their subject_id
- Verify RLS policies allow select

---

For more details, see the code comments in:
- `src/app/subjects/actions.ts` - API functions
- `src/components/subjects/pdf-viewer.tsx` - Viewer implementation
- `src/components/subjects/admin-note-upload.tsx` - Upload form
