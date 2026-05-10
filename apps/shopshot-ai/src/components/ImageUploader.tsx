"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { fileToDataUrl, validateImageFile } from "@/lib/utils";

/**
 * @description 图片上传组件，支持拖拽和点击上传
 * @param {Object} props
 * @param {(dataUrl: string, fileName: string) => void} props.onImageSelected - 图片选中回调
 * @param {string} [props.currentImage] - 当前已上传的图片
 * @param {() => void} [props.onClear] - 清除图片回调
 */
export function ImageUploader({
  onImageSelected,
  currentImage,
  onClear,
}: {
  onImageSelected: (dataUrl: string, fileName: string) => void;
  currentImage?: string;
  onClear?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error ?? "Invalid file");
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      onImageSelected(dataUrl, file.name);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (currentImage) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <img
          src={currentImage}
          alt="Uploaded product"
          className="h-64 w-full object-contain p-4"
        />
        {onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-3 rounded-full bg-danger/90 p-1.5 text-white shadow-md transition-transform hover:scale-110"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${
          isDragging
            ? "border-primary bg-primary/5 shadow-lg"
            : "border-border hover:border-primary/50 hover:bg-primary/5 dark:border-border-dark"
        }`}
      >
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          {isDragging ? (
            <ImageIcon size={32} className="text-primary" />
          ) : (
            <Upload size={32} className="text-primary" />
          )}
        </div>
        <p className="mb-1 font-medium text-text dark:text-text-dark">
          {isDragging ? "Drop your image here" : "Upload Product Image"}
        </p>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          PNG, JPEG, or WebP — up to 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-center text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
