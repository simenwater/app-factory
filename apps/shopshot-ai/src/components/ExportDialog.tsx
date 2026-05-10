"use client";

import { useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import type { GeneratedImage, ExportFormat } from "@/types";
import { EXPORT_PRESETS, exportImage, downloadBlob } from "@/lib/exportFormats";
import { useStore } from "@/store/useStore";

/**
 * @description 导出对话框组件
 * @param {Object} props
 * @param {GeneratedImage[]} props.images - 待导出的图片列表
 * @param {boolean} props.open - 是否打开
 * @param {() => void} props.onClose - 关闭回调
 */
export function ExportDialog({
  images,
  open,
  onClose,
}: {
  images: GeneratedImage[];
  open: boolean;
  onClose: () => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("shopify");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const incrementExports = useStore((s) => s.incrementExports);

  if (!open) return null;

  const preset = EXPORT_PRESETS[selectedFormat];

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);

    for (let i = 0; i < images.length; i++) {
      try {
        const blob = await exportImage(images[i].resultImageData, preset);
        const ext = preset.fileType;
        downloadBlob(blob, `shopshot-${images[i].scene}-${images[i].angle}deg.${ext}`);
        incrementExports(1);
      } catch {
        console.error(`Failed to export image ${i}`);
      }
      setProgress(i + 1);
      if (i < images.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    setExporting(false);
    onClose();
  };

  const formats = Object.values(EXPORT_PRESETS);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-surface p-6 shadow-xl dark:bg-surface-dark sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text dark:text-text-dark">
            Export {images.length} Image{images.length !== 1 ? "s" : ""}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:bg-border/50 dark:text-text-muted-dark"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 space-y-3">
          {formats.map((fmt) => (
            <button
              key={fmt.format}
              onClick={() => setSelectedFormat(fmt.format)}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                selectedFormat === fmt.format
                  ? "border-primary bg-primary/5"
                  : "border-border dark:border-border-dark"
              }`}
            >
              <p className="font-medium text-text dark:text-text-dark">
                {fmt.name}
              </p>
              <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
                {fmt.description}
              </p>
            </button>
          ))}
        </div>

        {exporting && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-text-muted dark:text-text-muted-dark">
              <span>Exporting…</span>
              <span>
                {progress}/{images.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border dark:bg-border-dark">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(progress / images.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleExport}
          disabled={exporting || images.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Exporting…
            </>
          ) : (
            <>
              <Download size={18} />
              Export as {preset.name}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
