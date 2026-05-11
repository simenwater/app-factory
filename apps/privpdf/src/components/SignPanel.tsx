"use client";

import { useState } from "react";
import { PenTool, Download, Trash2, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { addSignaturesToPDF, downloadPDF, generateId } from "@/lib/pdf-utils";
import FileDropzone from "./FileDropzone";
import SignatureCanvas from "./SignatureCanvas";
import type { SignaturePlacement } from "@/types";

/**
 * @description 电子签名面板，支持创建签名并应用到 PDF
 */
export default function SignPanel() {
  const files = useStore((s) => s.files);
  const signatures = useStore((s) => s.signatures);
  const addSignature = useStore((s) => s.addSignature);
  const removeSignature = useStore((s) => s.removeSignature);
  const isProcessing = useStore((s) => s.isProcessing);
  const setProcessing = useStore((s) => s.setProcessing);

  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedSigId, setSelectedSigId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(100);
  const [sigWidth, setSigWidth] = useState(200);
  const [sigHeight, setSigHeight] = useState(80);

  const file = files[0];

  const handleSaveSignature = (dataUrl: string) => {
    const sig = {
      id: generateId(),
      dataUrl,
      createdAt: Date.now(),
    };
    addSignature(sig);
    setSelectedSigId(sig.id);
    setShowCanvas(false);
  };

  const handleApplySignature = async () => {
    if (!file || !selectedSigId) return;
    const sig = signatures.find((s) => s.id === selectedSigId);
    if (!sig) return;

    setProcessing(true);
    try {
      const placement: SignaturePlacement = {
        signatureId: sig.id,
        pageIndex,
        x: posX,
        y: posY,
        width: sigWidth,
        height: sigHeight,
      };

      const sigMap = new Map([[sig.id, sig.dataUrl]]);
      const result = await addSignaturesToPDF(file.file, [placement], sigMap);
      downloadPDF(result, `signed_${file.name}`);
    } catch (err) {
      console.error("签名失败:", err);
      alert("签名应用失败，请重试。");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">电子签名</h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          在 PDF 上添加手写签名，所有操作均在本地完成。
        </p>
      </div>

      {!file && <FileDropzone multiple={false} />}

      {file && (
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-secondary)",
          }}
        >
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {file.pageCount} 页
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">我的签名</p>
          <button
            onClick={() => setShowCanvas(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <PenTool size={14} />
            新建签名
          </button>
        </div>

        {showCanvas && (
          <SignatureCanvas
            onSave={handleSaveSignature}
            onCancel={() => setShowCanvas(false)}
          />
        )}

        {signatures.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {signatures.map((sig) => (
              <div
                key={sig.id}
                onClick={() => setSelectedSigId(sig.id)}
                className="relative cursor-pointer rounded-lg border p-2 transition-colors"
                style={{
                  borderColor:
                    selectedSigId === sig.id
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                  backgroundColor:
                    selectedSigId === sig.id
                      ? "var(--color-primary-light)"
                      : "var(--color-bg)",
                }}
              >
                <img
                  src={sig.dataUrl}
                  alt="签名"
                  className="h-16 w-full object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSignature(sig.id);
                    if (selectedSigId === sig.id) setSelectedSigId(null);
                  }}
                  className="absolute right-1 top-1 rounded p-0.5"
                  style={{ color: "var(--color-danger)" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {file && selectedSigId && (
        <div className="space-y-3">
          <p className="text-sm font-medium">签名位置</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label
                className="mb-1 block text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                页码
              </label>
              <input
                type="number"
                min={0}
                max={file.pageCount - 1}
                value={pageIndex}
                onChange={(e) => setPageIndex(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded border px-2 py-1.5 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                X 位置
              </label>
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded border px-2 py-1.5 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Y 位置
              </label>
              <input
                type="number"
                value={posY}
                onChange={(e) => setPosY(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded border px-2 py-1.5 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                宽度
              </label>
              <input
                type="number"
                value={sigWidth}
                onChange={(e) => setSigWidth(parseInt(e.target.value, 10) || 100)}
                className="w-full rounded border px-2 py-1.5 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleApplySignature}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                应用签名中...
              </>
            ) : (
              <>
                <Download size={18} />
                应用签名并下载
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
