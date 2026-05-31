"use client";

import { useStore } from "@/lib/store";
import {
  formatCost,
  formatDuration,
  formatTokens,
  formatTimestamp,
  getProviderLabel,
  getStatusLabel,
} from "@/lib/format";
import type { RequestLog } from "@/types";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

/**
 * @description JSON 语法高亮渲染
 */
function JsonView({ data }: { data: unknown }) {
  const str = JSON.stringify(data, null, 2);
  if (!str) return <span className="json-null">null</span>;

  const highlighted = str
    .replace(
      /"([^"]+)":/g,
      '<span class="json-key">"$1"</span>:'
    )
    .replace(
      /: "([^"]*?)"/g,
      ': <span class="json-string">"$1"</span>'
    )
    .replace(
      /: (\d+\.?\d*)/g,
      ': <span class="json-number">$1</span>'
    )
    .replace(
      /: (true|false)/g,
      ': <span class="json-boolean">$1</span>'
    )
    .replace(/: (null)/g, ': <span class="json-null">$1</span>');

  return (
    <pre
      className="overflow-auto text-xs leading-relaxed whitespace-pre-wrap break-all"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

interface LogDetailProps {
  log: RequestLog;
  onClose: () => void;
}

/**
 * @description 日志详情侧边面板
 */
export default function LogDetail({ log, onClose }: LogDetailProps) {
  const darkMode = useStore((s) => s.darkMode);
  const [activeTab, setActiveTab] = useState<"request" | "response" | "headers">(
    "request"
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const data = activeTab === "request"
      ? log.requestBody
      : activeTab === "response"
        ? log.responseBody
        : { request: log.requestHeaders, response: log.responseHeaders };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { key: "request" as const, label: "请求体" },
    { key: "response" as const, label: "响应体" },
    { key: "headers" as const, label: "请求头" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden
      />
      <div
        className={`relative w-full max-w-2xl animate-fade-in overflow-y-auto ${
          darkMode ? "bg-bg-secondary" : "bg-light-bg-secondary"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b p-4 backdrop-blur-xl ${
            darkMode
              ? "border-border bg-bg-secondary/90"
              : "border-light-border bg-light-bg-secondary/90"
          }`}
        >
          <div>
            <h3 className="text-sm font-semibold">请求详情</h3>
            <p
              className={`text-xs ${
                darkMode ? "text-text-muted" : "text-light-text-muted"
              }`}
            >
              {log.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-2 transition-colors ${
              darkMode
                ? "hover:bg-bg-tertiary"
                : "hover:bg-light-bg-tertiary"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 元数据 */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "时间", value: formatTimestamp(log.timestamp) },
              { label: "提供商", value: getProviderLabel(log.provider) },
              { label: "模型", value: log.model },
              { label: "代理", value: log.agentName },
              { label: "状态", value: getStatusLabel(log.status) },
              { label: "状态码", value: log.statusCode ?? "—" },
              { label: "耗时", value: log.duration ? formatDuration(log.duration) : "—" },
              { label: "URL", value: log.url },
              {
                label: "输入 Tokens",
                value: log.inputTokens != null ? formatTokens(log.inputTokens) : "—",
              },
              {
                label: "输出 Tokens",
                value: log.outputTokens != null ? formatTokens(log.outputTokens) : "—",
              },
              {
                label: "成本",
                value: log.estimatedCost != null ? formatCost(log.estimatedCost) : "—",
              },
              { label: "错误", value: log.error || "无" },
            ].map((item) => (
              <div key={item.label}>
                <div
                  className={`text-[10px] uppercase tracking-wider ${
                    darkMode ? "text-text-muted" : "text-light-text-muted"
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-xs font-medium mt-0.5 break-all">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tab 切换 */}
          <div
            className={`flex items-center gap-1 rounded-lg border p-1 ${
              darkMode ? "border-border bg-bg-tertiary" : "border-light-border bg-light-bg-tertiary"
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-accent text-white"
                    : darkMode
                      ? "text-text-secondary hover:text-text-primary"
                      : "text-light-text-secondary hover:text-light-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleCopy}
              className={`ml-1 rounded-md p-1.5 transition-colors ${
                darkMode ? "hover:bg-bg-card" : "hover:bg-light-bg-card"
              }`}
              title="复制到剪贴板"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* JSON 内容 */}
          <div
            className={`rounded-lg border p-4 ${
              darkMode
                ? "border-border bg-bg-primary"
                : "border-light-border bg-light-bg-tertiary"
            }`}
          >
            {activeTab === "request" && <JsonView data={log.requestBody} />}
            {activeTab === "response" && <JsonView data={log.responseBody} />}
            {activeTab === "headers" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
                    请求头
                  </h4>
                  <JsonView data={log.requestHeaders} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
                    响应头
                  </h4>
                  <JsonView data={log.responseHeaders} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
