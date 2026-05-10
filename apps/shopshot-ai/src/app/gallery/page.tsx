"use client";

import { useState } from "react";
import { ArrowLeft, Camera, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ImagePreview } from "@/components/ImagePreview";
import { ExportDialog } from "@/components/ExportDialog";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";
import type { GeneratedImage } from "@/types";

/**
 * @description 图片画廊页面 — 浏览所有已生成的图片
 */
export default function GalleryPage() {
  const jobs = useStore((s) => s.jobs);
  const deleteJob = useStore((s) => s.deleteJob);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportImages, setExportImages] = useState<GeneratedImage[]>([]);

  const handleExport = (images: GeneratedImage[]) => {
    setExportImages(images);
    setShowExport(true);
  };

  const handleDelete = (jobId: string) => {
    if (confirm("Delete this project and all its images?")) {
      deleteJob(jobId);
      if (selectedJobId === jobId) setSelectedJobId(null);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full p-2 text-text-muted hover:bg-surface dark:text-text-muted-dark dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-text dark:text-text-dark">
          Gallery
        </h1>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No images yet"
          description="Generate your first product image to see it here."
          action={
            <Link
              href="/generate"
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Generate Now
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Job List */}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl bg-surface shadow-sm dark:bg-surface-dark"
            >
              <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() =>
                  setSelectedJobId(selectedJobId === job.id ? null : job.id)
                }
              >
                <div className="flex items-center gap-3">
                  {job.images[0] ? (
                    <img
                      src={job.images[0].resultImageData}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Camera size={20} className="text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {job.originalFileName}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {job.images.length} images · {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(job.images);
                    }}
                    className="rounded-full p-2 text-primary hover:bg-primary/10"
                    aria-label="Export"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job.id);
                    }}
                    className="rounded-full p-2 text-danger hover:bg-danger/10"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded preview */}
              {selectedJobId === job.id && (
                <div className="border-t border-border p-4 dark:border-border-dark">
                  <ImagePreview images={job.images} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ExportDialog
        images={exportImages}
        open={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
