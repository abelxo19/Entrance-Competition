# Supabase student access setup

1. Open the Supabase SQL Editor.
2. Run `migrations/202606230001_student_access.sql` once.
3. The migration creates and synchronizes:
   - `profiles`: student identity and selected stream.
   - `package_status`: selected plan and payment approval status.
4. New authenticated users automatically receive both records. Package status
   starts as `pending`.
5. After verifying payment proof, run:

```sql
select public.approve_student_package('student@example.com');
```

The student can then refresh the payment page and enter the portal.

Students can read only their own records. Stream and plan changes go through
controlled database functions. Approval is not granted to application users.
