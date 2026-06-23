import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminStudents } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/student-access";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const students = await getAdminStudents();
  const stats = {
    total: students.length,
    pending: students.filter((s) => s.paymentStatus === "pending").length,
    approved: students.filter((s) => s.paymentStatus === "approved").length,
    rejected: students.filter((s) => s.paymentStatus === "rejected").length,
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AdminDashboard students={students} stats={stats} />
      </main>
      <Footer />
    </>
  );
}
