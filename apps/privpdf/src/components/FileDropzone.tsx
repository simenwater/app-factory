"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { getPDFPageCount, generateId } from "@/lib/pdf-utils";
import { useStore } from "@/store/useStore";
import type { PDFFileInfo } from "@/types";

/**
 * @description 文件拖放区域组件，支持拖拽和点击上传 PDF 文件
 * @param {Object} props
 * @param {boolean} [props.multiple=true] - 是否允许多文件选择
 * @param {string} [props.accept] - 接受的文件类型，默认 PDF 和图片
 */
export default function FileDropzone({
  multiple = true,
  accept = ".pdf",
  onFilesLoaded,
}: {
  multiple?: boolean;
  accept?: string;
  onFilesLoaded?: (files: PDFFileInfo[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addFiles = useStore((s) => s.addFiles);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(
        (f) =>
          f.type === "application/pdf" ||
          (accept.includes("image") && f.type.startsWith("image/"))
      );

      const fileInfos: PDFFileInfo[] = [];

      for (const file of files) {
        let pageCount = 0;
        if (file.type === "application/pdf") {
          try {
            pageCount = await getPDFPageCount(file);
          } catch {
            pageCount = 0;
          }
        }

        fileInfos.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          pageCount,
        });
      }

      addFiles(fileInfos);
      onFilesLoaded?.(fileInfos);
    },
    [addFiles, onFilesLoaded, accept]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all"
      style={{
        borderColor: isDragging
          ? "var(--color-primary)"
          : "var(--color-border)",
        backgroundColor: isDragging
          ? "var(--color-primary-light)"
          : "var(--color-bg-secondary)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          {accept.includes("image") ? (
            <FileText size={24} style={{ color: "var(--color-primary)" }} />
          ) : (
            <Upload size={24} style={{ color: "var(--color-primary)" }} />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            拖放文件到这里，或{" "}
            <span style={{ color: "var(--color-primary)" }}>点击选择</span>
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {accept === ".pdf"
              ? "支持 PDF 文件"
              : "支持 PDF 和图片文件（JPG、PNG）"}
          </p>
        </div>
      </div>
    </div>
  );
}
