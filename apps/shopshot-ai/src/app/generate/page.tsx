"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Sparkles, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/ImageUploader";
import { SceneSelector } from "@/components/SceneSelector";
import { AngleSelector } from "@/components/AngleSelector";
import { ImagePreview } from "@/components/ImagePreview";
import { ExportDialog } from "@/components/ExportDialog";
import { UsageBadge } from "@/components/UsageBadge";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";
import { removeBackground, batchGenerate } from "@/lib/imageProcessing";
import { EXPORT_PRESETS, exportImage, downloadBlob } from "@/lib/exportFormats";
import type { SceneType, ViewAngle, GeneratedImage, GenerationJob } from "@/types";

/**
 * @description 图片生成页面 — 核心功能入口
 */
export default function GeneratePage() {
  const [step, setStep] = useState<"upload" | "configure" | "generating" | "results">("upload");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedScenes, setSelectedScenes] = useState<SceneType[]>(["studio-white"]);
  const [selectedAngles, setSelectedAngles] = useState<ViewAngle[]>([0, 45, 90]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isRemoving, setIsRemoving] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const addJob = useStore((s) => s.addJob);
  const incrementUsage = useStore((s) => s.incrementUsage);
  const canGenerate = useStore((s) => s.canGenerate());
  const settings = useStore((s) => s.settings);

  const handleImageSelected = useCallback(
    async (dataUrl: string, name: string) => {
      setSourceImage(dataUrl);
      setFileName(name);

      if (settings.autoBackgroundRemoval) {
        setIsRemoving(true);
        try {
          const processed = await removeBackground(dataUrl);
          setProcessedImage(processed);
        } catch {
          setProcessedImage(dataUrl);
        }
        setIsRemoving(false);
      } else {
        setProcessedImage(dataUrl);
      }
      setStep("configure");
    },
    [settings.autoBackgroundRemoval]
  );

  const handleClear = useCallback(() => {
    setSourceImage(null);
    setProcessedImage(null);
    setFileName("");
    setGeneratedImages([]);
    setStep("upload");
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!processedImage || selectedScenes.length === 0 || selectedAngles.length === 0) return;
    if (!canGenerate) return;

    setStep("generating");
    const total = selectedScenes.length * selectedAngles.length;
    setProgress({ current: 0, total });

    try {
      const images = await batchGenerate(
        processedImage,
        selectedScenes,
        selectedAngles,
        (current, t) => setProgress({ current, total: t })
      );
      setGeneratedImages(images);
      incrementUsage(images.length);

      const job: GenerationJob = {
        id: generateId(),
        originalImage: sourceImage!,
        originalFileName: fileName,
        scenes: selectedScenes,
        angles: selectedAngles,
        images,
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addJob(job);
      setStep("results");
    } catch {
      setStep("configure");
    }
  }, [processedImage, selectedScenes, selectedAngles, canGenerate, sourceImage, fileName, addJob, incrementUsage]);

  const handleSingleDownload = useCallback(async (image: GeneratedImage) => {
    const preset = EXPORT_PRESETS[settings.defaultExportFormat];
    try {
      const blob = await exportImage(image.resultImageData, preset);
      downloadBlob(blob, `shopshot-${image.scene}-${image.angle}deg.${preset.fileType}`);
    } catch {
      console.error("Download failed");
    }
  }, [settings.defaultExportFormat]);

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
            Generate
          </h1>
        </div>
        <UsageBadge />
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <ImageUploader
          onImageSelected={handleImageSelected}
          currentImage={undefined}
        />
      )}

      {/* Step: Configure */}
      {step === "configure" && (
        <div className="space-y-6">
          {/* Source Image Preview */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Product Image
            </h2>
            {isRemoving ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border p-10 dark:border-border-dark">
                <Loader2 size={32} className="mb-3 animate-spin text-primary" />
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  Removing background…
                </p>
              </div>
            ) : (
              <ImageUploader
                onImageSelected={handleImageSelected}
                currentImage={processedImage ?? undefined}
                onClear={handleClear}
              />
            )}
          </div>

          {/* Scene Selection */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Scenes
            </h2>
            <SceneSelector selected={selectedScenes} onChange={setSelectedScenes} />
          </div>

          {/* Angle Selection */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Angles
            </h2>
            <AngleSelector selected={selectedAngles} onChange={setSelectedAngles} />
          </div>

          {/* Generate Count + Button */}
          <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">
                Images to generate
              </span>
              <span className="font-bold text-text dark:text-text-dark">
                {selectedScenes.length * selectedAngles.length}
              </span>
            </div>
            {!canGenerate && (
              <p className="mb-3 text-center text-sm text-danger">
                You&apos;ve reached your monthly limit.{" "}
                <Link href="/pricing" className="font-medium underline">
                  Upgrade
                </Link>{" "}
                to continue.
              </p>
            )}
            <button
              onClick={handleGenerate}
              disabled={
                !canGenerate ||
                selectedScenes.length === 0 ||
                selectedAngles.length === 0 ||
                isRemoving
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Sparkles size={18} />
              Generate Images
            </button>
          </div>
        </div>
      )}

      {/* Step: Generating */}
      {step === "generating" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <Loader2 size={40} className="animate-spin text-primary" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-text dark:text-text-dark">
            Generating Images…
          </h2>
          <p className="mb-6 text-sm text-text-muted dark:text-text-muted-dark">
            {progress.current} of {progress.total} completed
          </p>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-border dark:bg-border-dark">
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

      {/* Step: Results */}
      {step === "results" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Results ({generatedImages.length} images)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                <Download size={14} />
                Export All
              </button>
              <button
                onClick={handleClear}
                className="rounded-full bg-surface px-4 py-1.5 text-xs font-medium text-text-muted shadow-sm dark:bg-surface-dark dark:text-text-muted-dark"
              >
                New Image
              </button>
            </div>
          </div>

          <ImagePreview images={generatedImages} onDownload={handleSingleDownload} />

          <ExportDialog
            images={generatedImages}
            open={showExport}
            onClose={() => setShowExport(false)}
          />
        </div>
      )}
    </div>
  );
}
