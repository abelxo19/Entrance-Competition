import type { PaymentStatus, StudentPlan, StudentStream } from "@/lib/student-access";

export interface AdminStudent {
  userId: string;
  email: string;
  fullName: string | null;
  stream: StudentStream | null;
  role: "student" | "admin";
  plan: StudentPlan | null;
  paymentStatus: PaymentStatus;
  approvedAt: string | null;
  createdAt: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface StudentFormInput {
  email: string;
  fullName: string;
  password?: string;
  stream: StudentStream | "";
  plan: StudentPlan | "";
  paymentStatus: PaymentStatus;
  role: "student" | "admin";
}
