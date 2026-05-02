'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { validateImageFile, createPreviewUrl } from '@/lib/imageProcessing';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description 图片上传组件 - 支持拖拽和点击上传
 */
export function ImageUploader() {
  const { currentImage, setCurrentImage } = useAppStore();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || '文件无效');
        return;
      }

      const previewUrl = createPreviewUrl(file);
      setCurrentImage({
        id: uuidv4(),
        file,
        previewUrl,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      });
    },
    [setCurrentImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setCurrentImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [setCurrentImage]);

  if (currentImage) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="aspect-square max-h-80 mx-auto flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <img
            src={currentImage.previewUrl}
            alt={currentImage.name}
            className="max-w-full max-h-80 object-contain"
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 min-w-0">
            <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {currentImage.name}
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
            aria-label="移除图片"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          dragOver
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
          <Upload className="w-6 h-6 text-indigo-500" />
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            拖拽或点击上传产品图
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            支持 JPG、PNG、WebP，最大 10MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
