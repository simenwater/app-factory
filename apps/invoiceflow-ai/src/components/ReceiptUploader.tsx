"use client";

import { useState, useCallback } from "react";
import { Upload, Camera, Loader2, CheckCircle } from "lucide-react";
import type { OCRResult } from "@/types";

interface ReceiptUploaderProps {
  onResult: (result: OCRResult) => void;
}

/**
 * @description 收据/合同拍照上传与 OCR 识别组件
 */
export function ReceiptUploader({ onResult }: ReceiptUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请上传图片文件（JPG, PNG, etc.）");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!ocrResponse.ok) throw new Error("OCR 识别失败");
      const { text } = await ocrResponse.json();

      const parseResponse = await fetch("/api/ocr", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!parseResponse.ok) throw new Error("AI 解析失败");
      const result: OCRResult = await parseResponse.json();

      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  }, [onResult]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="font-semibold text-[var(--foreground)]">
          Scan Receipt / Contract
        </h3>
      </div>

      <div
        className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
            <p className="text-sm text-[var(--muted-foreground)]">
              AI is analyzing your receipt...
            </p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10 text-[var(--success)]" />
            <p className="text-sm text-[var(--muted-foreground)]">
              Receipt processed successfully!
            </p>
            <p className="text-xs text-[var(--primary)] cursor-pointer hover:underline">
              Upload another
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-[var(--muted-foreground)]" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Drop receipt image here or click to upload
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Supports JPG, PNG • AI will extract invoice data automatically
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-[var(--destructive)]">{error}</p>
      )}

      <input
        id="file-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
