"use client";

/**
 * @fileoverview 项目扫描页面
 * 允许用户输入项目名称并执行扫描，查看扫描结果并生成配置文件
 */

import { useState } from "react";
import { useStore } from "@/store/useStore";
import AssistantCard from "@/components/AssistantCard";
import ConfigPreview from "@/components/ConfigPreview";
import { AIAssistant } from "@/types";
import { FolderSearch, Loader2, FileCode, Layers, Code, ArrowRight } from "lucide-react";

/** 所有可选的 AI 助手 */
const ALL_ASSISTANTS: AIAssistant[] = ["cursor", "codex", "claude-code", "copilot", "windsurf"];

/**
 * 扫描页面组件
 * @returns JSX 元素
 */
export default function ScanPage() {
  const [projectName, setProjectName] = useState("");
  const {
    scanResult,
    isScanning,
    scanProject,
    selectedAssistants,
    toggleAssistant,
    generatedConfigs,
    generateConfigs,
  } = useStore();

  /**
   * 处理项目扫描
   */
  const handleScan = () => {
    if (!projectName.trim()) return;
    scanProject(projectName.trim());
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">项目扫描</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          输入项目名称，自动分析结构并生成 AI 助手配置文件
        </p>
      </div>

      {/* 扫描输入 */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="projectName" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              项目名称
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="例如: my-awesome-project"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleScan}
              disabled={!projectName.trim() || isScanning}
              className="flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  扫描中...
                </>
              ) : (
                <>
                  <FolderSearch size={16} />
                  开始扫描
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 扫描结果 */}
      {scanResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              扫描结果
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-950/20">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <FileCode size={16} />
                  <span className="text-xs font-medium">文件数</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {scanResult.totalFiles}
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Layers size={16} />
                  <span className="text-xs font-medium">目录数</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {scanResult.totalDirs}
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Code size={16} />
                  <span className="text-xs font-medium">语言</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {scanResult.languages.length}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Layers size={16} />
                  <span className="text-xs font-medium">框架</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                  {scanResult.frameworks.length}
                </div>
              </div>
            </div>

            {/* 语言分布 */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">语言分布</h3>
              <div className="space-y-2">
                {scanResult.languages.map((lang) => (
                  <div key={lang.language} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-zinc-600 dark:text-zinc-400">{lang.language}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-xs text-zinc-500">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 检测到的框架 */}
            {scanResult.frameworks.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">检测到的框架</h3>
                <div className="flex flex-wrap gap-2">
                  {scanResult.frameworks.map((fw) => (
                    <span
                      key={fw}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 选择 AI 助手 */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              选择 AI 助手
            </h2>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              选择需要生成配置文件的 AI 编码助手
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {ALL_ASSISTANTS.map((assistant) => (
                <AssistantCard
                  key={assistant}
                  assistant={assistant}
                  selected={selectedAssistants.includes(assistant)}
                  onToggle={() => toggleAssistant(assistant)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={generateConfigs}
                disabled={selectedAssistants.length === 0}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                生成配置文件
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 生成的配置文件预览 */}
          {generatedConfigs.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                生成的配置文件 ({generatedConfigs.length})
              </h2>
              {generatedConfigs.map((config) => (
                <ConfigPreview key={config.id} config={config} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
