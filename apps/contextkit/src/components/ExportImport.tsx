"use client";

import { useState, useRef } from "react";
import { Upload, Download, FileJson, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { createExportBundle, parseImportFile, exportProjectContent, downloadFile, getFormatInfo } from "@/lib/export-import";
import { ExportFormat } from "@/types";

/**
 * 导出/导入面板组件
 * @returns ExportImport 组件
 */
export default function ExportImport() {
  const { projects, templates, importProjects, importTemplates } = useStore();
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("json");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 导出所有项目和模板为 JSON 数据包
   */
  const handleExportAll = () => {
    const bundle = createExportBundle(projects, templates);
    const content = JSON.stringify(bundle, null, 2);
    downloadFile(content, "contextkit-backup.json", "application/json");
  };

  /**
   * 导出单个项目
   */
  const handleExportProject = () => {
    const project = projects.find((p) => p.id === selectedProjectId);
    if (!project) return;
    const content = exportProjectContent(project, selectedFormat);
    const { extension, mimeType } = getFormatInfo(selectedFormat);
    downloadFile(content, `${project.name}-AGENTS${extension}`, mimeType);
  };

  /**
   * 处理文件导入
   */
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseImportFile(content);

      if (result.valid && result.bundle) {
        importProjects(result.bundle.projects);
        importTemplates(result.bundle.customTemplates);
        setImportStatus({
          type: "success",
          message: `成功导入 ${result.bundle.projects.length} 个项目和 ${result.bundle.customTemplates.length} 个模板`,
        });
      } else {
        setImportStatus({ type: "error", message: result.error || "导入失败" });
      }

      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* 状态提示 */}
      {importStatus && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl animate-fade-in"
          style={{
            backgroundColor: importStatus.type === "success" ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--danger) 10%, transparent)",
            color: importStatus.type === "success" ? "var(--success)" : "var(--danger)",
          }}
        >
          {importStatus.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{importStatus.message}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 导出区域 */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Download size={20} style={{ color: "var(--accent)" }} />
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>导出</h3>
          </div>

          {/* 全量导出 */}
          <button
            onClick={handleExportAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white mb-4 transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <FileJson size={16} />
            导出所有项目与模板
          </button>

          {/* 单项目导出 */}
          <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>导出单个项目</p>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <option value="">选择项目...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <div className="flex gap-2">
              {(["md", "json", "yaml"] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: selectedFormat === fmt ? "var(--accent-light)" : "var(--bg-tertiary)",
                    color: selectedFormat === fmt ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  .{fmt}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportProject}
              disabled={!selectedProjectId}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            >
              <FileText size={14} />
              导出选中项目
            </button>
          </div>
        </div>

        {/* 导入区域 */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Upload size={20} style={{ color: "var(--accent)" }} />
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>导入</h3>
          </div>

          <div
            className="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
            style={{ borderColor: "var(--border-color)" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              点击或拖拽文件到此处
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              支持 ContextKit JSON 格式备份文件
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              导入会将新项目和模板添加到现有数据中，不会覆盖已有的项目。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
