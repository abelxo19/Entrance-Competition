# Subject Notes Setup Guide

## Overview
This implementation replaces the mock portal content with a real note storage system:
- **PDFs stored** in Supabase Storage (organized by subject and grade)
- **Grade selector** (9-12) when opening a subject
- **PDFs streamed** in browser (non-downloadable)
- **Admin upload interface** for managing notes per grade

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
where user_id = '98be4d0d-dbc9-4d77-bbd8-12ccac349318';
```

## 2️⃣ File Structure

```
src/
├── app/subjects/
│   ├── actions.ts              # Server actions for notes
│   ├── [subjectId]/
│   │   ├── page.tsx            # Subject notes list (filtered by grade)
│   │   ├── grade/
│   │   │   └── page.tsx        # Grade selector (9-12)
│   │   └── notes/
│   │       └── [noteId]/
│   │           └── page.tsx    # PDF viewer
├── components/subjects/
│   ├── pdf-viewer.tsx          # PDF streaming viewer (non-downloadable)
│   ├── grade-selector.tsx      # Grade level selector component
│   └── admin-note-upload.tsx   # Admin upload interface with grade selector
└── types/exam.ts               # SubjectNote type
```

## 3️⃣ Features

### Student View
- ✅ Select a subject from `/exams`
- ✅ Choose a grade level (9-12)
- ✅ See list of available notes for that grade
- ✅ Stream PDFs in browser
- ✅ Navigate between pages
- ✅ **Cannot download** PDFs
- ✅ Requires approval to view

### Admin Interface
- 📤 Upload PDF files for specific subjects and grades
- 📝 Add title and summary
- 🎓 Select grade level (9-12) when uploading
- 🗑️ Delete notes
- 🔐 Only admins can access

## 4️⃣ How to Use

### For Students

1. Login and get approved
2. Select stream (Natural/Social Science)
3. From `/exams` page, click "Open [Subject]"
4. Select a grade level (9-12)
5. Click on any note to open PDF viewer
6. Navigate pages and read online
7. Notes cannot be downloaded

### For Admins

1. Login (must be admin in `profiles.role`)
2. Go to `/admin/subjects/[subjectId]/upload`
3. Select grade level (9-12)
4. Upload PDF file with title and summary
5. Notes appear immediately for students (in that grade)

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
- grade (integer)     Grade level (9-12)
- title (text)        Note title
- summary (text)      Optional description
- file_path (text)    Path in storage: subjects/{subject_id}/{grade}/{filename}
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

- ✅ Students can only read notes (filtered by grade)
- ✅ Only admins can upload/delete
- ✅ PDFs streamed via signed URLs (1 hour expiry)
- ✅ RLS policies enforce access control
- ✅ No download functionality
- ✅ Grade filtering on database queries

## 8️⃣ Next Steps

1. Run migrations
2. Create storage bucket
3. Make test user an admin
4. Upload test PDFs for different grades
5. Verify student can select grade then stream
6. Verify PDFs cannot be downloaded

## Troubleshooting

**Grade selector doesn't show?**
- Check `/subjects/[subjectId]/grade` route exists
- Verify URL structure: `/subjects/math/grade`

**Notes don't appear for a grade?**
- Check notes were uploaded with correct grade in database
- Query: `SELECT * FROM subject_notes WHERE subject_id='math' AND grade=9`
- Verify notes exist for that subject AND grade combination

**PDF fails to load?**
- Check storage bucket exists: `subject-notes`
- Verify file path format: `subjects/{subject_id}/{grade}/{filename}`
- Check signed URL expiry isn't exceeded
- Verify storage permissions allow authenticated reads

---

For more details, see the code comments in:
- `src/app/subjects/actions.ts` - API functions with grade filtering
- `src/components/subjects/pdf-viewer.tsx` - Viewer implementation
- `src/components/subjects/grade-selector.tsx` - Grade selector UI
- `src/components/subjects/admin-note-upload.tsx` - Upload form with grade selector
- `src/app/subjects/[subjectId]/grade/page.tsx` - Grade selection page
