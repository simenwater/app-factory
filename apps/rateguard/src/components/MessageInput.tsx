"use client";

/**
 * @fileoverview 消息输入组件，用户粘贴客户消息进行分析
 */

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useAppStore } from "@/store";

/**
 * MessageInput - 消息输入及分析触发组件
 */
export function MessageInput() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const analyzeMessage = useAppStore((s) => s.analyzeMessage);

  const handleAnalyze = () => {
    if (message.trim().length < 10) {
      setError("请输入至少 10 个字符的客户消息");
      return;
    }
    setError("");
    const success = analyzeMessage(message.trim());
    if (!success) {
      setError("免费次数已用完，请升级到 Pro 计划继续使用");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          分析客户消息
        </h2>
      </div>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        粘贴客户的询价邮件或消息，AI 将自动分析预算意图、识别低价风险，并生成定价建议和谈判话术。
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="在此粘贴客户消息...&#10;&#10;例如：Hi, I have a quick project for you. It's just a simple website, shouldn't take long. My budget is around $200-300. I have many more projects coming after this one."
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:ring-indigo-800"
        rows={6}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
      <button
        onClick={handleAnalyze}
        disabled={!message.trim()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <Search className="h-4 w-4" />
        开始分析
      </button>
    </div>
  );
}
