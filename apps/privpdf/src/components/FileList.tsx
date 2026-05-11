"use client";

import { useStore } from "@/store/useStore";
import { FileText, X, GripVertical } from "lucide-react";

/**
 * @description 文件列表组件，展示已添加的 PDF 文件，支持删除和排序
 */
export default function FileList() {
  const files = useStore((s) => s.files);
  const removeFile = useStore((s) => s.removeFile);
  const reorderFiles = useStore((s) => s.reorderFiles);

  if (files.length === 0) return null;

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小字符串
   */
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (fromIndex !== toIndex) {
      reorderFiles(fromIndex, toIndex);
    }
  };

  return (
    <div className="space-y-2">
      <p
        className="text-sm font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        已添加 {files.length} 个文件
      </p>
      <div className="space-y-1.5">
        {files.map((file, index) => (
          <div
            key={file.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:shadow-sm"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
            }}
          >
            <GripVertical
              size={16}
              className="shrink-0 cursor-grab"
              style={{ color: "var(--color-text-muted)" }}
            />
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              <FileText
                size={16}
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {formatSize(file.size)}
                {file.pageCount > 0 && ` · ${file.pageCount} 页`}
              </p>
            </div>
            <button
              onClick={() => removeFile(file.id)}
              className="shrink-0 rounded-md p-1 transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-danger)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
