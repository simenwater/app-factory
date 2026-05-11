"use client";

import { useState, useCallback } from "react";
import { ScanText, Copy, Download, Loader2, Lock } from "lucide-react";
import { useStore } from "@/store/useStore";
import { performOCR, getSupportedLanguages } from "@/lib/ocr-utils";
import type { OCRResult } from "@/types";

/**
 * @description OCR 文本识别面板
 * 免费用户显示升级提示，Pro/终身版用户可使用
 */
export default function OCRPanel() {
  const plan = useStore((s) => s.plan);
  const setPlan = useStore((s) => s.setPlan);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState<OCRResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ status: "", progress: 0 });

  const languages = getSupportedLanguages();

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImage(file);
      setResult(null);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleOCR = async () => {
    if (!image) return;
    setIsProcessing(true);
    setResult(null);

    try {
      const ocrResult = await performOCR(image, language, (p) => {
        setProgress(p);
      });
      setResult(ocrResult);
    } catch (err) {
      console.error("OCR 识别失败:", err);
      alert("OCR 识别失败，请重试。");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
    }
  };

  const downloadText = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ocr-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (plan === "free") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">OCR 文本识别</h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            从图片或扫描的 PDF 中提取文字，完全本地运行。
          </p>
        </div>
        <div
          className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-10 text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-bg-tertiary)" }}
          >
            <Lock size={28} style={{ color: "var(--color-text-muted)" }} />
          </div>
          <div>
            <p className="text-lg font-semibold">Pro 功能</p>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              OCR 文本识别是 Pro 版专属功能。升级后即可使用。
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPlan("pro")}
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              升级 Pro · $5/月
            </button>
            <button
              onClick={() => setPlan("lifetime")}
              className="rounded-lg border px-6 py-2.5 text-sm font-medium"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
            >
              终身买断 · $29
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">OCR 文本识别</h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          从图片或扫描的 PDF 中提取文字，完全本地运行，数据不会离开你的设备。
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">识别语言</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        />
      </div>

      {imagePreview && (
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <img
            src={imagePreview}
            alt="待识别图片"
            className="max-h-64 w-full object-contain"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          />
        </div>
      )}

      {image && (
        <button
          onClick={handleOCR}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {progress.status || "识别中..."}
              {progress.progress > 0 &&
                ` ${Math.round(progress.progress * 100)}%`}
            </>
          ) : (
            <>
              <ScanText size={18} />
              开始识别
            </>
          )}
        </button>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              识别结果
              <span
                className="ml-2 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                置信度: {Math.round(result.confidence)}%
              </span>
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-bg-tertiary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <Copy size={12} />
                复制
              </button>
              <button
                onClick={downloadText}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-bg-tertiary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <Download size={12} />
                下载
              </button>
            </div>
          </div>
          <div
            className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-lg border p-4 text-sm"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-secondary)",
            }}
          >
            {result.text || "（未识别到文字）"}
          </div>
        </div>
      )}
    </div>
  );
}
