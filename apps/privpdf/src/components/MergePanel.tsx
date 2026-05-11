"use client";

import { useState } from "react";
import { Combine, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { mergePDFs, downloadPDF } from "@/lib/pdf-utils";
import FileDropzone from "./FileDropzone";
import FileList from "./FileList";

/**
 * @description PDF 合并面板
 */
export default function MergePanel() {
  const files = useStore((s) => s.files);
  const setProcessing = useStore((s) => s.setProcessing);
  const isProcessing = useStore((s) => s.isProcessing);
  const [progress, setProgress] = useState(0);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setProgress(0);

    try {
      const result = await mergePDFs(files, (p) => {
        setProgress(Math.round(p * 100));
      });
      downloadPDF(result, "merged.pdf");
    } catch (err) {
      console.error("合并失败:", err);
      alert("合并失败，请检查文件是否有效。");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">合并 PDF</h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          将多个 PDF 文件按顺序合并为一个文件。拖拽调整文件顺序。
        </p>
      </div>

      <FileDropzone multiple />
      <FileList />

      {files.length >= 2 && (
        <button
          onClick={handleMerge}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
          onMouseEnter={(e) => {
            if (!isProcessing)
              e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              合并中... {progress}%
            </>
          ) : (
            <>
              <Combine size={18} />
              合并 {files.length} 个文件
            </>
          )}
        </button>
      )}
    </div>
  );
}
