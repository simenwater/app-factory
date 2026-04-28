'use client';

/**
 * @fileoverview 集成管理页面 — Slack/Jira/Linear 配置
 */

import { useState } from 'react';
import {
  Puzzle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatDate } from '@/lib/utils';
import type { IntegrationType } from '@/types';

/**
 * @description 集成配置详情
 */
const integrationInfo: Record<IntegrationType, { name: string; description: string; icon: string; color: string }> = {
  slack: {
    name: 'Slack',
    description: '新评论自动发送通知到指定 Slack 频道，支持 @mention 和线程回复。',
    icon: '💬',
    color: 'bg-[#4A154B]',
  },
  jira: {
    name: 'Jira',
    description: '评论自动同步为 Jira Issue，状态变更双向同步，支持自定义字段映射。',
    icon: '🔷',
    color: 'bg-[#0052CC]',
  },
  linear: {
    name: 'Linear',
    description: '评论自动创建 Linear Issue，支持项目和标签映射，状态自动同步。',
    icon: '📐',
    color: 'bg-[#5E6AD2]',
  },
};

export default function IntegrationsPage() {
  const { integrations, toggleIntegration } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">集成管理</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          连接你常用的工具，让评论工作流更高效
        </p>
      </div>

      {/* 集成卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const info = integrationInfo[integration.type];
          const isEditing = editingId === integration.id;

          return (
            <div
              key={integration.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              {/* 头部 */}
              <div className={cn('p-4 text-white', info.color)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{info.name}</h3>
                      <span className="text-xs opacity-80">
                        {integration.connected ? '已连接' : '未连接'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration(integration.id)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      integration.enabled ? 'bg-white/30' : 'bg-white/10'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        integration.enabled ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {info.description}
                </p>

                {/* 状态 */}
                <div className="flex items-center gap-2 text-sm">
                  {integration.connected ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={integration.connected ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                    {integration.connected ? '运行正常' : '未配置'}
                  </span>
                  {integration.lastSyncAt && (
                    <span className="text-xs text-gray-400 ml-auto">
                      上次同步: {formatDate(integration.lastSyncAt)}
                    </span>
                  )}
                </div>

                {/* 配置项 */}
                {integration.connected && (
                  <div className="space-y-2">
                    {Object.entries(integration.config).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                          {key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')
                            ? '••••••••'
                            : value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                  {integration.connected ? (
                    <>
                      <button
                        onClick={() => setEditingId(isEditing ? null : integration.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        配置
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />
                        同步
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                      连接 {info.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook 配置 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-2">Webhook</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          使用 Webhook 将评论事件推送到自定义端点。
        </p>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://your-api.com/webhook/commentflow"
            className="flex-1 px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            保存
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          支持的事件类型：comment.created, comment.updated, comment.resolved, comment.assigned
        </div>
      </div>
    </div>
  );
}
