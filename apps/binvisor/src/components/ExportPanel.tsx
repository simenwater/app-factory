"use client";

/**
 * @fileoverview 导出面板组件
 */

import { useStore } from "@/store/useStore";
import { Download, FileImage, FileCode, FileText } from "lucide-react";
import { exportStructure } from "@/lib/exporter";
import type { ExportFormat } from "@/types";

/** 导出格式选项 */
const EXPORT_OPTIONS: {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    format: "svg",
    label: "SVG",
    icon: <FileImage className="w-4 h-4" />,
    description: "Vector graphics",
  },
  {
    format: "png",
    label: "PNG",
    icon: <FileImage className="w-4 h-4" />,
    description: "Raster image",
  },
  {
    format: "json",
    label: "JSON",
    icon: <FileCode className="w-4 h-4" />,
    description: "Structured data",
  },
  {
    format: "markdown",
    label: "Markdown",
    icon: <FileText className="w-4 h-4" />,
    description: "Documentation",
  },
];

/**
 * 导出面板组件
 * @returns {React.ReactElement | null}
 */
export default function ExportPanel() {
  const structure = useStore((s) => s.structure);

  if (!structure) return null;

  /**
   * 处理导出
   * @param {ExportFormat} format - 导出格式
   */
  const handleExport = async (format: ExportFormat) => {
    try {
      await exportStructure(structure, format);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Download className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Export
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {EXPORT_OPTIONS.map((opt) => (
          <button
            key={opt.format}
            onClick={() => handleExport(opt.format)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <span className="text-gray-500 dark:text-gray-400">
              {opt.icon}
            </span>
            <div className="text-left">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {opt.label}
              </p>
              <p className="text-[10px] text-gray-400">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
