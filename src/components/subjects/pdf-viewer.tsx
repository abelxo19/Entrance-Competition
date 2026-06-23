"use client";

import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

// Set worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
}

export function PdfViewer({ pdfUrl, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError() {
    setError("Failed to load PDF");
    setIsLoading(false);
  }

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || prev));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {numPages && (
          <p className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages}
          </p>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="rounded-lg border bg-background p-4">
        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader className="animate-spin" />
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground">Please try again later</p>
            </div>
          </div>
        )}

        {!error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div />}
          >
            <div className="flex justify-center">
              <Page
                pageNumber={pageNumber}
                width={Math.min(window.innerWidth - 48, 700)}
              />
            </div>
          </Document>
        )}
      </div>

      {/* Navigation Controls */}
      {numPages && (
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>

          <div className="text-sm font-medium">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value)), numPages))}
              className="w-12 rounded border bg-background px-2 py-1 text-center"
            />
            <span className="mx-1">/ {numPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
          >
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      )}

      {/* Info: Non-downloadable */}
      <p className="text-xs text-muted-foreground">
        📄 This document is viewed online only and cannot be downloaded
      </p>
    </div>
  );
}
