'use client';

/**
 * @fileoverview 仪表盘页面 — 项目概览与数据统计
 */

import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  FolderOpen,
  Users,
  ArrowRight,
  Chrome,
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { cn, formatRelativeTime } from '@/lib/utils';
import CommentCard from '@/components/CommentCard';
import StatusBadge from '@/components/StatusBadge';
import ExtensionSimulator from '@/components/ExtensionSimulator';

/**
 * @description 统计卡片
 */
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  change?: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {change}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { comments, projects } = useStore();

  const stats = {
    total: comments.length,
    open: comments.filter((c) => c.status === 'open').length,
    inProgress: comments.filter((c) => c.status === 'in_progress').length,
    resolved: comments.filter((c) => c.status === 'resolved').length,
  };

  const recentComments = [...comments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          项目评论概览与数据统计
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="总评论数" value={stats.total} change="+12%" color="bg-primary-500" />
        <StatCard icon={AlertCircle} label="待处理" value={stats.open} color="bg-blue-500" />
        <StatCard icon={Clock} label="处理中" value={stats.inProgress} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} label="已解决" value={stats.resolved} change="+8%" color="bg-green-500" />
      </div>

      {/* 项目概览 & 最近评论 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 项目列表 */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary-500" />
              项目
            </h2>
            <Link
              href="/projects"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{project.url}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-semibold">{project.commentCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.openCommentCount} 待处理
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近评论 */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              最近评论
            </h2>
            <Link
              href="/comments"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>

      {/* Chrome 扩展模拟器 */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Chrome className="w-5 h-5 text-primary-500" />
          Chrome 扩展预览
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          切换到「选择模式」，点击模拟网页中的元素来体验在线评论功能。
        </p>
        <ExtensionSimulator />
      </div>

      {/* 团队活跃度 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary-500" />
          团队活跃度
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: '张明', comments: 12, resolved: 8 },
            { name: 'Sarah Chen', comments: 18, resolved: 14 },
            { name: '李华', comments: 9, resolved: 6 },
            { name: 'Alex Kim', comments: 15, resolved: 10 },
            { name: '王芳', comments: 5, resolved: 3 },
          ].map((member) => (
            <div key={member.name} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {member.comments} 评论 · {member.resolved} 已解决
              </p>
              <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(member.resolved / member.comments) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
