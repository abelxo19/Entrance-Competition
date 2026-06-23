"use client";

import { FileUp, Loader, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadNotePdf } from "@/app/subjects/actions";

interface AdminNoteUploadProps {
  subjectId: string;
  onUploadSuccess?: (noteId: string) => void;
  onClose?: () => void;
}

export function AdminNoteUpload({ subjectId, onUploadSuccess, onClose }: AdminNoteUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectId", subjectId);
    formData.append("title", title);
    formData.append("summary", summary);

    const result = await uploadNotePdf(formData);

    if (result.success) {
      setSuccess(true);
      setFile(null);
      setTitle("");
      setSummary("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess?.(result.noteId!);
      setTimeout(() => {
        setSuccess(false);
        onClose?.();
      }, 2000);
    } else {
      setError(result.error || "Failed to upload note");
    }

    setIsLoading(false);
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload Subject Note</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Note Title *</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., High-Yield Summary Vault"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium">Summary (Optional)</label>
          <Input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief description of the note"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium">PDF File *</label>
          <div
            className="rounded-lg border-2 border-dashed p-6 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile?.type === "application/pdf") {
                setFile(droppedFile);
                setError(null);
              } else {
                setError("Please drop a PDF file");
              }
            }}
          >
            {file ? (
              <div className="space-y-2">
                <p className="font-medium text-green-600">✓ {file.name}</p>
                <p className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileUp className="mx-auto size-6 text-muted-foreground" />
                <p className="text-sm">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-medium text-primary hover:underline"
                  >
                    Click to upload
                  </button>
                  {" or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">PDF files only</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-500/10 p-3">
            <p className="text-sm text-green-600">✓ Note uploaded successfully!</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !file || !title}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Note"
          )}
        </Button>
      </form>
    </div>
  );
}
