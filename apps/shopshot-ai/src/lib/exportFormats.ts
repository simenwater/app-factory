import type { ExportPreset, ExportFormat } from "@/types";

/**
 * @description Shopify 和 Amazon 的图片导出预设
 */
export const EXPORT_PRESETS: Record<ExportFormat, ExportPreset> = {
  shopify: {
    format: "shopify",
    name: "Shopify",
    width: 2048,
    height: 2048,
    aspectRatio: "1:1",
    fileType: "png",
    quality: 0.92,
    maxFileSize: 20 * 1024 * 1024,
    description: "Shopify product images — 2048×2048, 1:1 square, PNG",
  },
  amazon: {
    format: "amazon",
    name: "Amazon",
    width: 2000,
    height: 2000,
    aspectRatio: "1:1",
    fileType: "jpg",
    quality: 0.9,
    maxFileSize: 10 * 1024 * 1024,
    description: "Amazon product images — 2000×2000, 1:1 square, JPEG",
  },
  custom: {
    format: "custom",
    name: "Custom",
    width: 1024,
    height: 1024,
    aspectRatio: "1:1",
    fileType: "png",
    quality: 0.95,
    description: "Custom export — configurable dimensions",
  },
};

/**
 * @description 将图片 Data URL 导出为指定格式的 Blob
 * @param {string} imageDataUrl - 图片 Data URL
 * @param {ExportPreset} preset - 导出预设
 * @returns {Promise<Blob>} 导出的图片 Blob
 */
export async function exportImage(
  imageDataUrl: string,
  preset: ExportPreset
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      const mimeType =
        preset.fileType === "jpg" ? "image/jpeg" :
        preset.fileType === "webp" ? "image/webp" :
        "image/png";

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to export image"));
        },
        mimeType,
        preset.quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image for export"));
    img.src = imageDataUrl;
  });
}

/**
 * @description 触发浏览器下载
 * @param {Blob} blob - 文件 Blob
 * @param {string} filename - 文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * @description 批量导出图片为 ZIP（简化版：逐个下载）
 * @param {Array<{ dataUrl: string; filename: string }>} images - 图片列表
 * @param {ExportPreset} preset - 导出预设
 */
export async function batchExport(
  images: { dataUrl: string; filename: string }[],
  preset: ExportPreset
): Promise<void> {
  for (let i = 0; i < images.length; i++) {
    const blob = await exportImage(images[i].dataUrl, preset);
    const ext = preset.fileType;
    downloadBlob(blob, `${images[i].filename}.${ext}`);
    if (i < images.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}
