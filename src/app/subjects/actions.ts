"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SubjectNote } from "@/types/exam";

/**
 * Fetch all notes for a specific subject and grade, ordered by display order
 */
export async function getSubjectNotes(subjectId: string, grade: number): Promise<SubjectNote[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subject_notes")
    .select("*")
    .eq("subject_id", subjectId)
    .eq("grade", grade)
    .order("order_by", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subject notes:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single note by ID
 */
export async function getSubjectNote(noteId: string): Promise<SubjectNote | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subject_notes")
    .select("*")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("Error fetching note:", error);
    return null;
  }

  return data;
}

/**
 * Get signed URL for streaming PDF (non-downloadable)
 * Expires in 1 hour
 */
export async function getNotePdfUrl(filePath: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("subject-notes")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }

  return data?.signedUrl || null;
}

/**
 * Upload note PDF (Admin only)
 */
export async function uploadNotePdf(
  formData: FormData,
): Promise<{ success: boolean; error?: string; noteId?: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  const subjectId = formData.get("subjectId") as string;
  const grade = parseInt(formData.get("grade") as string);
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;

  // Validate inputs
  if (!file || !subjectId || !title || !grade) {
    return { success: false, error: "Missing required fields" };
  }

  if (grade < 9 || grade > 12) {
    return { success: false, error: "Grade must be between 9 and 12" };
  }

  if (!file.type.includes("pdf")) {
    return { success: false, error: "Only PDF files are allowed" };
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user is admin
  const { data: userData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Profile lookup error:", profileError);
    return { success: false, error: "Could not verify admin status" };
  }

  if (userData?.role !== "admin") {
    console.error("User is not admin:", { userId: user.id, role: userData?.role });
    return { success: false, error: "Only admins can upload notes" };
  }

  // Upload file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `subjects/${subjectId}/${grade}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("subject-notes")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload error details:", {
      message: uploadError.message,
      statusCode: uploadError.statusCode,
      error: uploadError,
      filePath,
      fileName,
    });
    return { 
      success: false, 
      error: `Failed to upload file: ${uploadError.message}` 
    };
  }

  // Create note record in database
  const { data: note, error: dbError } = await supabase
    .from("subject_notes")
    .insert({
      subject_id: subjectId,
      grade,
      title,
      summary,
      file_path: filePath,
      file_size: file.size,
      order_by: 0,
    })
    .select()
    .single();

  if (dbError) {
    console.error("Database error:", {
      message: dbError.message,
      code: dbError.code,
      error: dbError,
    });
    // TODO: Clean up uploaded file if DB insert fails
    return { success: false, error: `Failed to save note: ${dbError.message}` };
  }

  return { success: true, noteId: note.id };
}

/**
 * Delete note (Admin only)
 */
export async function deleteNote(noteId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userData?.role !== "admin") {
    return { success: false, error: "Only admins can delete notes" };
  }

  // Get the note to find file path
  const { data: note, error: fetchError } = await supabase
    .from("subject_notes")
    .select("file_path")
    .eq("id", noteId)
    .single();

  if (fetchError || !note) {
    return { success: false, error: "Note not found" };
  }

  // Delete file from storage
  await supabase.storage.from("subject-notes").remove([note.file_path]);

  // Delete note record
  const { error: deleteError } = await supabase.from("subject_notes").delete().eq("id", noteId);

  if (deleteError) {
    return { success: false, error: "Failed to delete note" };
  }

  return { success: true };
}
