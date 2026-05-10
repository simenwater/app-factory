"use client";

import { useState } from "react";
import { Download, X, ZoomIn } from "lucide-react";
import type { GeneratedImage } from "@/types";

/**
 * @description 图片预览网格组件
 * @param {Object} props
 * @param {GeneratedImage[]} props.images - 生成的图片列表
 * @param {(image: GeneratedImage) => void} [props.onDownload] - 下载回调
 */
export function ImagePreview({
  images,
  onDownload,
}: {
  images: GeneratedImage[];
  onDownload?: (image: GeneratedImage) => void;
}) {
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
          >
            <img
              src={img.resultImageData}
              alt={`${img.scene} at ${img.angle}°`}
              className="aspect-square w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
              onClick={() => setLightboxImage(img)}
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex w-full items-center justify-between p-3">
                <span className="text-xs font-medium text-white">
                  {img.scene} · {img.angle}°
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLightboxImage(img)}
                    className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={14} />
                  </button>
                  {onDownload && (
                    <button
                      onClick={() => onDownload(img)}
                      className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
                      aria-label="Download"
                    >
                      <Download size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage.resultImageData}
            alt="Preview"
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
