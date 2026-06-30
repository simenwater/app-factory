/**
 * @fileoverview 仓库分析结果展示组件
 */

'use client';

import {
  GitBranch,
  Star,
  GitFork,
  Code2,
  Wrench,
  TestTube,
  Package,
  FolderTree,
  FileCode,
  Settings,
} from 'lucide-react';
import type { AnalysisResult } from '@/types';

/**
 * @param {{ analysis: AnalysisResult }} props
 * @returns {JSX.Element}
 */
export default function AnalysisView({ analysis }: { analysis: AnalysisResult }) {
  const { repo } = analysis;

  /** 语言按占比排序 */
  const sortedLangs = Object.entries(repo.languages)
    .sort(([, a], [, b]) => b - a);
  const totalBytes = sortedLangs.reduce((sum, [, bytes]) => sum + bytes, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {repo.fullName}
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {repo.description || '无描述'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" /> {repo.stars.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" /> {repo.forks.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" /> {repo.defaultBranch}
            </span>
          </div>
        </div>

        {repo.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={<Code2 className="h-5 w-5 text-blue-500" />}
          title="语言"
          items={sortedLangs.slice(0, 5).map(
            ([lang, bytes]) =>
              `${lang} (${((bytes / totalBytes) * 100).toFixed(1)}%)`
          )}
        />
        <InfoCard
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          title="框架"
          items={analysis.frameworks.length > 0 ? analysis.frameworks : ['未检测到']}
        />
        <InfoCard
          icon={<Package className="h-5 w-5 text-green-500" />}
          title="构建工具"
          items={[
            ...analysis.buildTools,
            `包管理: ${analysis.packageManager}`,
          ]}
        />
        <InfoCard
          icon={<TestTube className="h-5 w-5 text-purple-500" />}
          title="测试"
          items={analysis.testingTools.length > 0 ? analysis.testingTools : ['未检测到']}
        />
        <InfoCard
          icon={<FileCode className="h-5 w-5 text-rose-500" />}
          title="入口文件"
          items={analysis.entryPoints.length > 0 ? analysis.entryPoints : ['未检测到']}
        />
        <InfoCard
          icon={<Settings className="h-5 w-5 text-gray-500" />}
          title="配置文件"
          items={analysis.configFiles.slice(0, 5)}
          extra={analysis.configFiles.length > 5 ? `+${analysis.configFiles.length - 5} 个` : undefined}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-violet-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white">项目结构</h4>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {analysis.structure.length} 项
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4 font-mono text-sm dark:bg-gray-950">
          {analysis.structure
            .filter((n) => n.type === 'dir' && n.path.split('/').length <= 2)
            .slice(0, 25)
            .map((node) => (
              <div key={node.path} className="text-gray-600 dark:text-gray-400">
                📁 {node.path}/
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 信息卡片子组件
 * @param {{ icon: React.ReactNode; title: string; items: string[]; extra?: string }} props
 * @returns {JSX.Element}
 */
function InfoCard({
  icon,
  title,
  items,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  extra?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
            {item}
          </li>
        ))}
        {extra && (
          <li className="text-xs text-gray-400 dark:text-gray-500">{extra}</li>
        )}
      </ul>
    </div>
  );
}
