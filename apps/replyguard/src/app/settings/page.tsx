"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { ArrowLeft, Moon, Sun, User, Globe, Trash2 } from "lucide-react";

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const { settings, updateSettings, resetStore } = useStore();

  const handleReset = () => {
    if (confirm("确定要重置所有数据吗？此操作不可撤销。")) {
      resetStore();
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-1.5 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} className="text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-lg font-bold text-text dark:text-text-dark">
          设置
        </h1>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
            外观
          </h2>
          <div className="rounded-xl border border-border bg-surface dark:border-border-dark dark:bg-surface-dark">
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className="flex w-full items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon size={18} className="text-primary" />
                ) : (
                  <Sun size={18} className="text-warning" />
                )}
                <span className="text-sm text-text dark:text-text-dark">
                  深色模式
                </span>
              </div>
              <div
                className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.darkMode ? "bg-primary" : "bg-border dark:bg-border-dark"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    settings.darkMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Business Profile */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
            <User size={14} className="mb-0.5 mr-1 inline" />
            商家信息
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                商家/个人名称
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) =>
                  updateSettings({ businessName: e.target.value })
                }
                placeholder="输入您的名称..."
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                行业类型
              </label>
              <select
                value={settings.businessType}
                onChange={(e) =>
                  updateSettings({ businessType: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
              >
                <option value="">选择行业（可选）</option>
                <option value="设计师">设计师</option>
                <option value="摄影师">摄影师</option>
                <option value="开发者">开发者</option>
                <option value="咨询师">咨询师</option>
                <option value="教师/教练">教师/教练</option>
                <option value="美容美发">美容美发</option>
                <option value="家政服务">家政服务</option>
                <option value="餐饮">餐饮</option>
                <option value="医疗">医疗</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
            <Globe size={14} className="mb-0.5 mr-1 inline" />
            语言
          </h2>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        {/* Stats */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
            使用统计
          </h2>
          <div className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
            <div className="flex justify-between border-b border-border py-2 dark:border-border-dark">
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                已生成回复
              </span>
              <span className="text-xs font-medium text-text dark:text-text-dark">
                {settings.totalRepliesGenerated}
              </span>
            </div>
            <div className="flex justify-between border-b border-border py-2 dark:border-border-dark">
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                当前计划
              </span>
              <span className="text-xs font-medium text-text dark:text-text-dark">
                {settings.plan === "free"
                  ? "免费版"
                  : settings.plan === "single"
                    ? "单次购买"
                    : "Pro"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                剩余免费额度
              </span>
              <span className="text-xs font-medium text-text dark:text-text-dark">
                {settings.freeRepliesRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <Trash2 size={16} />
          重置所有数据
        </button>

        {/* About */}
        <div className="py-4 text-center">
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            ReplyGuard v0.1.0
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            AI 负面评价应急回复工具
          </p>
        </div>
      </div>
    </div>
  );
}
