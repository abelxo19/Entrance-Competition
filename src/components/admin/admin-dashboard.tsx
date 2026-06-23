"use client";

import {
  Check,
  FileUp,
  Loader,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  approveStudentPayment,
  createStudent,
  deleteStudent,
  rejectStudentPayment,
  updateStudent,
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subjects } from "@/lib/data";
import type { PaymentStatus } from "@/lib/student-access";
import type { AdminStats, AdminStudent, StudentFormInput } from "@/types/admin";

interface AdminDashboardProps {
  students: AdminStudent[];
  stats: AdminStats;
}

type FormMode = "create" | "edit" | null;

const emptyForm: StudentFormInput = {
  email: "",
  fullName: "",
  password: "",
  stream: "",
  plan: "",
  paymentStatus: "pending",
  role: "student",
};

function paymentBadgeVariant(status: PaymentStatus) {
  if (status === "approved") return "secondary";
  if (status === "rejected") return "accent";
  return "muted";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminDashboard({ students, stats }: AdminDashboardProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentFormInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "all" || student.paymentStatus === statusFilter;
      const matchesQuery =
        !normalized ||
        student.email.toLowerCase().includes(normalized) ||
        (student.fullName?.toLowerCase().includes(normalized) ?? false);
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter, students]);

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  function openEditForm(student: AdminStudent) {
    setFormMode("edit");
    setEditingId(student.userId);
    setForm({
      email: student.email,
      fullName: student.fullName ?? "",
      password: "",
      stream: student.stream ?? "",
      plan: student.plan ?? "",
      paymentStatus: student.paymentStatus,
      role: student.role,
    });
    setError(null);
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  function handleFormChange<K extends keyof StudentFormInput>(
    key: K,
    value: StudentFormInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result =
        formMode === "create"
          ? await createStudent(form)
          : editingId
            ? await updateStudent(editingId, form)
            : { success: false, error: "No student selected" };

      if (!result.success) {
        setError(result.error ?? "Something went wrong");
        return;
      }

      closeForm();
    });
  }

  function handlePaymentAction(userId: string, action: "approve" | "reject") {
    setError(null);
    startTransition(async () => {
      const result =
        action === "approve"
          ? await approveStudentPayment(userId)
          : await rejectStudentPayment(userId);

      if (!result.success) {
        setError(result.error ?? "Action failed");
      }
    });
  }

  function handleDelete(userId: string, email: string) {
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await deleteStudent(userId);
      if (!result.success) {
        setError(result.error ?? "Failed to delete student");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Admin Console</p>
          <h1 className="mt-1 text-3xl font-bold tracking-normal sm:text-4xl">
            Student management
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Track registrations, approve payments, and manage student accounts.
          </p>
        </div>
        <Button onClick={openCreateForm} className="w-full sm:w-auto">
          <Plus className="mr-1 size-4" />
          Add student
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={stats.total} />
        <StatCard label="Pending payment" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:inline-flex sm:w-auto">
          <TabsTrigger value="students" className="gap-2">
            <Users className="size-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileUp className="size-4" />
            Upload notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6 space-y-6">
          {formMode && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {formMode === "create" ? "Add new student" : "Edit student"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input
                      value={form.fullName}
                      onChange={(e) => handleFormChange("fullName", e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      required
                    />
                  </Field>
                  <Field
                    label={
                      formMode === "create"
                        ? "Password"
                        : "New password (optional)"
                    }
                  >
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => handleFormChange("password", e.target.value)}
                      required={formMode === "create"}
                      minLength={formMode === "create" ? 6 : undefined}
                    />
                  </Field>
                  <Field label="Role">
                    <Select
                      value={form.role}
                      onValueChange={(value) =>
                        handleFormChange("role", value as StudentFormInput["role"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Stream">
                    <Select
                      value={form.stream || "none"}
                      onValueChange={(value) =>
                        handleFormChange(
                          "stream",
                          value === "none" ? "" : (value as StudentFormInput["stream"]),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Not set" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not set</SelectItem>
                        <SelectItem value="natural">Natural Science</SelectItem>
                        <SelectItem value="social">Social Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Package">
                    <Select
                      value={form.plan || "none"}
                      onValueChange={(value) =>
                        handleFormChange(
                          "plan",
                          value === "none" ? "" : (value as StudentFormInput["plan"]),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Not set" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not set</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="squad">Squad</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Payment status">
                    <Select
                      value={form.paymentStatus}
                      onValueChange={(value) =>
                        handleFormChange("paymentStatus", value as PaymentStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader className="mr-1 size-4 animate-spin" />}
                      {formMode === "create" ? "Create student" : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeForm}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as PaymentStatus | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden overflow-x-auto rounded-lg border md:block">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Stream</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No students match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.userId} className="border-b last:border-b-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{student.fullName || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                        {student.role === "admin" && (
                          <Badge variant="outline" className="mt-1">
                            Admin
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {student.stream ?? "—"}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {student.plan ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={paymentBadgeVariant(student.paymentStatus)}>
                          {student.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StudentActions
                          student={student}
                          isPending={isPending}
                          onApprove={() => handlePaymentAction(student.userId, "approve")}
                          onReject={() => handlePaymentAction(student.userId, "reject")}
                          onEdit={() => openEditForm(student)}
                          onDelete={() => handleDelete(student.userId, student.email)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredStudents.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No students match your filters.
                </CardContent>
              </Card>
            ) : (
              filteredStudents.map((student) => (
                <Card key={student.userId}>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{student.fullName || "Unnamed"}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <Badge variant={paymentBadgeVariant(student.paymentStatus)}>
                        {student.paymentStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Info label="Stream" value={student.stream ?? "—"} />
                      <Info label="Plan" value={student.plan ?? "—"} />
                      <Info label="Role" value={student.role} />
                      <Info label="Joined" value={formatDate(student.createdAt)} />
                    </div>
                    <StudentActions
                      student={student}
                      isPending={isPending}
                      stacked
                      onApprove={() => handlePaymentAction(student.userId, "approve")}
                      onReject={() => handlePaymentAction(student.userId, "reject")}
                      onEdit={() => openEditForm(student)}
                      onDelete={() => handleDelete(student.userId, student.email)}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id} className="transition-colors hover:border-primary/40">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-semibold">{subject.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload grade-level PDF notes
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/admin/subjects/${subject.id}/upload`}>
                      <FileUp className="mr-1 size-4" />
                      Upload notes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}

function StudentActions({
  student,
  isPending,
  stacked = false,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: {
  student: AdminStudent;
  isPending: boolean;
  stacked?: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={
        stacked
          ? "grid grid-cols-2 gap-2"
          : "flex flex-wrap items-center gap-1"
      }
    >
      {student.paymentStatus !== "approved" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={onApprove}
          className={stacked ? "w-full" : ""}
        >
          <Check className="mr-1 size-3.5" />
          Approve
        </Button>
      )}
      {student.paymentStatus !== "rejected" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={onReject}
          className={stacked ? "w-full" : ""}
        >
          <X className="mr-1 size-3.5" />
          Reject
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        onClick={onEdit}
        className={stacked ? "w-full" : ""}
      >
        <Pencil className="mr-1 size-3.5" />
        Edit
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        onClick={onDelete}
        className={`text-destructive hover:text-destructive ${stacked ? "w-full" : ""}`}
      >
        <Trash2 className="mr-1 size-3.5" />
        Delete
      </Button>
    </div>
  );
}
