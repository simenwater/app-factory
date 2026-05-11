"use client";

import { useState } from "react";
import { Scissors, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { splitPDF, downloadMultiplePDFs } from "@/lib/pdf-utils";
import FileDropzone from "./FileDropzone";
import type { SplitMode } from "@/types";

/**
 * @description PDF 分割面板
 */
export default function SplitPanel() {
  const files = useStore((s) => s.files);
  const isProcessing = useStore((s) => s.isProcessing);
  const setProcessing = useStore((s) => s.setProcessing);

  const [mode, setMode] = useState<SplitMode>("range");
  const [rangeInput, setRangeInput] = useState("1-3");
  const [everyN, setEveryN] = useState(1);

  const file = files[0];

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const results = await splitPDF(file.file, {
        mode,
        ranges: mode === "range" ? rangeInput : undefined,
        everyN: mode === "every" ? everyN : undefined,
        pages:
          mode === "extract"
            ? rangeInput
                .split(",")
                .map((s) => parseInt(s.trim(), 10))
                .filter((n) => !isNaN(n))
            : undefined,
      });

      if (results.length > 0) {
        downloadMultiplePDFs(results);
      } else {
        alert("未生成任何文件，请检查配置。");
      }
    } catch (err) {
      console.error("分割失败:", err);
      alert("分割失败，请检查文件和配置。");
    } finally {
      setProcessing(false);
    }
  };

  const modeOptions: { value: SplitMode; label: string; desc: string }[] = [
    { value: "range", label: "按范围", desc: '提取指定范围的页面，如 "1-3,5,7-9"' },
    { value: "every", label: "等分", desc: "每 N 页分割为一个文件" },
    { value: "extract", label: "逐页提取", desc: '将指定页面单独提取，如 "1,3,5"' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">分割 PDF</h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          将 PDF 按页面范围分割为多个文件。
        </p>
      </div>

      {!file && (
        <FileDropzone multiple={false} />
      )}

      {file && (
        <>
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-secondary)",
            }}
          >
            <p className="text-sm font-medium">{file.name}</p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {file.pageCount} 页
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">分割模式</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {modeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  className="rounded-lg border p-3 text-left transition-colors"
                  style={{
                    borderColor:
                      mode === opt.value
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    backgroundColor:
                      mode === opt.value
                        ? "var(--color-primary-light)"
                        : "var(--color-bg)",
                  }}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {(mode === "range" || mode === "extract") && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {mode === "range" ? "页码范围" : "提取页码"}
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder={mode === "range" ? "1-3,5,7-9" : "1,3,5"}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                  "--tw-ring-color": "var(--color-primary)",
                } as React.CSSProperties}
              />
            </div>
          )}

          {mode === "every" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                每组页数
              </label>
              <input
                type="number"
                min={1}
                max={file.pageCount}
                value={everyN}
                onChange={(e) => setEveryN(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                } as React.CSSProperties}
              />
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                分割中...
              </>
            ) : (
              <>
                <Scissors size={18} />
                开始分割
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
