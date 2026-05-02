'use client';

import { ImageUploader } from '@/components/ImageUploader';
import { ToolSelector } from '@/components/ToolSelector';
import { ResultsGallery } from '@/components/ResultsGallery';
import { useAppStore } from '@/store/useAppStore';

/**
 * @description 首页 - 产品图上传与工具选择
 */
export default function HomePage() {
  const currentImage = useAppStore((s) => s.currentImage);

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="text-center py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          ShopShot AI
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          上传产品图，一键生成专业电商素材
        </p>
      </section>

      <ImageUploader />

      {currentImage && <ToolSelector />}

      <ResultsGallery />
    </div>
  );
}
