"use client";

import { useStore } from "@/store/useStore";

/**
 * @description 配置文件内容选项面板
 */
const TOGGLE_OPTIONS = [
  { key: "includeArchitecture" as const, label: "项目架构", desc: "包含目录结构" },
  { key: "includeCodeStyle" as const, label: "代码风格", desc: "Lint/格式化配置" },
  { key: "includeDependencies" as const, label: "依赖信息", desc: "生产和开发依赖" },
  { key: "includeTestingGuide" as const, label: "测试指南", desc: "测试框架和文件" },
  {
    key: "includeContributing" as const,
    label: "贡献指南",
    desc: "设置和 PR 流程",
  },
];

/**
 * @description 选项面板组件
 */
export function OptionsPanel() {
  const options = useStore((s) => s.options);
  const setOptions = useStore((s) => s.setOptions);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text dark:text-text-dark">
        配置内容
      </label>
      <div className="space-y-2">
        {TOGGLE_OPTIONS.map((opt) => (
          <label
            key={opt.key}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-border/20 dark:border-border-dark dark:hover:bg-border-dark/20"
          >
            <div>
              <div className="text-sm font-medium text-text dark:text-text-dark">
                {opt.label}
              </div>
              <div className="text-xs text-text-muted dark:text-text-muted-dark">
                {opt.desc}
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={(e) =>
                  setOptions({ [opt.key]: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary dark:bg-border-dark" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <label className="block text-sm font-semibold text-text dark:text-text-dark">
          自定义指令（可选）
        </label>
        <textarea
          value={options.customInstructions}
          onChange={(e) =>
            setOptions({ customInstructions: e.target.value })
          }
          placeholder="例如：优先使用函数式编程范式，避免使用 class 语法..."
          rows={3}
          className="w-full rounded-xl border-2 border-border bg-surface p-3 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
        />
      </div>
    </div>
  );
}
