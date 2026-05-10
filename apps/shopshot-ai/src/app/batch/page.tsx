"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Layers, Upload, Loader2, Download, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { SceneSelector } from "@/components/SceneSelector";
import { ExportDialog } from "@/components/ExportDialog";
import { UsageBadge } from "@/components/UsageBadge";
import { generateId, fileToDataUrl, validateImageFile } from "@/lib/utils";
import { removeBackground, generateProductImage } from "@/lib/imageProcessing";
import type { SceneType, GeneratedImage, GenerationJob } from "@/types";

/**
 * @description 批量处理页面 — 多张产品图一键生成
 */
export default function BatchPage() {
  const [sourceImages, setSourceImages] = useState<{ dataUrl: string; name: string }[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<SceneType[]>(["studio-white"]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [showExport, setShowExport] = useState(false);

  const addJob = useStore((s) => s.addJob);
  const incrementUsage = useStore((s) => s.incrementUsage);
  const canGenerate = useStore((s) => s.canGenerate());
  const settings = useStore((s) => s.settings);

  const handleFilesSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const validFiles: { dataUrl: string; name: string }[] = [];

    for (const file of files) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        const dataUrl = await fileToDataUrl(file);
        validFiles.push({ dataUrl, name: file.name });
      }
    }

    setSourceImages((prev) => [...prev, ...validFiles]);
  }, []);

  const removeImage = (index: number) => {
    setSourceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBatchGenerate = useCallback(async () => {
    if (sourceImages.length === 0 || selectedScenes.length === 0 || !canGenerate) return;

    setIsProcessing(true);
    const total = sourceImages.length * selectedScenes.length;
    setProgress({ current: 0, total });

    const allResults: GeneratedImage[] = [];
    let completed = 0;

    for (const src of sourceImages) {
      let processed = src.dataUrl;
      if (settings.autoBackgroundRemoval) {
        try {
          processed = await removeBackground(src.dataUrl);
        } catch { /* use original */ }
      }

      const jobImages: GeneratedImage[] = [];
      for (const scene of selectedScenes) {
        const image = await generateProductImage(processed, scene, 0);
        jobImages.push(image);
        allResults.push(image);
        completed++;
        setProgress({ current: completed, total });
      }

      const job: GenerationJob = {
        id: generateId(),
        originalImage: src.dataUrl,
        originalFileName: src.name,
        scenes: selectedScenes,
        angles: [0],
        images: jobImages,
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addJob(job);
    }

    incrementUsage(allResults.length);
    setResults(allResults);
    setIsProcessing(false);
  }, [sourceImages, selectedScenes, canGenerate, settings.autoBackgroundRemoval, addJob, incrementUsage]);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full p-2 text-text-muted hover:bg-surface dark:text-text-muted-dark dark:hover:bg-surface-dark"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-text dark:text-text-dark">
            Batch Process
          </h1>
        </div>
        <UsageBadge />
      </div>

      {/* Source Images */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Product Images ({sourceImages.length})
        </h2>

        {sourceImages.length > 0 && (
          <div className="mb-3 grid grid-cols-4 gap-2">
            {sourceImages.map((img, i) => (
              <div key={i} className="group relative">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -right-1 -top-1 rounded-full bg-danger p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-border-dark">
          <Upload size={20} className="text-primary" />
          <span className="text-sm font-medium text-text dark:text-text-dark">
            Add Images
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
        </label>
      </div>

      {/* Scene Selection */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Scenes
        </h2>
        <SceneSelector selected={selectedScenes} onChange={setSelectedScenes} />
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className="mb-6 flex flex-col items-center rounded-xl bg-surface p-6 shadow-sm dark:bg-surface-dark">
          <Loader2 size={32} className="mb-3 animate-spin text-primary" />
          <p className="mb-2 font-medium text-text dark:text-text-dark">
            Processing batch…
          </p>
          <p className="mb-3 text-sm text-text-muted dark:text-text-muted-dark">
            {progress.current} / {progress.total}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border dark:bg-border-dark">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: progress.total > 0
                  ? `${(progress.current / progress.total) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isProcessing && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Results ({results.length})
            </h2>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white"
            >
              <Download size={14} />
              Export All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {results.map((img) => (
              <img
                key={img.id}
                src={img.resultImageData}
                alt={`${img.scene}`}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!isProcessing && results.length === 0 && (
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-text-muted dark:text-text-muted-dark">
              Total images
            </span>
            <span className="font-bold text-text dark:text-text-dark">
              {sourceImages.length * selectedScenes.length}
            </span>
          </div>
          {!canGenerate && (
            <p className="mb-3 text-center text-sm text-danger">
              Monthly limit reached.{" "}
              <Link href="/pricing" className="font-medium underline">
                Upgrade
              </Link>
            </p>
          )}
          <button
            onClick={handleBatchGenerate}
            disabled={!canGenerate || sourceImages.length === 0 || selectedScenes.length === 0 || isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Layers size={18} />
            Process {sourceImages.length} Image{sourceImages.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      <ExportDialog
        images={results}
        open={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
