'use client';

/**
 * @fileoverview 评论管理页面 — 筛选、分配、跟踪评论状态
 */

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Plus,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import CommentCard from '@/components/CommentCard';
import type { CommentStatus, CommentPriority, CommentCategory } from '@/types';

/** @description 筛选状态选项 */
const statusFilters: { value: CommentStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'open', label: '待处理' },
  { value: 'in_progress', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'closed', label: '已关闭' },
];

const priorityFilters: { value: CommentPriority | 'all'; label: string }[] = [
  { value: 'all', label: '全部优先级' },
  { value: 'critical', label: '紧急' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const categoryFilters: { value: CommentCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部分类' },
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: '设计' },
  { value: 'content', label: '内容' },
  { value: 'functionality', label: '功能' },
  { value: 'performance', label: '性能' },
  { value: 'other', label: '其他' },
];

export default function CommentsPage() {
  const { comments, projects } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<CommentPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CommentCategory | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [showNewComment, setShowNewComment] = useState(false);

  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (projectFilter !== 'all' && c.projectId !== projectFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.content.toLowerCase().includes(q) ||
          c.author.name.toLowerCase().includes(q) ||
          c.element.selector.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [comments, statusFilter, priorityFilter, categoryFilter, projectFilter, searchQuery]);

  const activeFilters = [statusFilter, priorityFilter, categoryFilter, projectFilter].filter(
    (f) => f !== 'all'
  ).length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">评论管理</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            查看、筛选和管理所有项目的评论
          </p>
        </div>
        <button
          onClick={() => setShowNewComment(!showNewComment)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建评论
        </button>
      </div>

      {/* 提示：Chrome 扩展 */}
      {showNewComment && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
              💡 使用 Chrome 扩展直接在网页上添加评论
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
              安装 CommentFlow Chrome 扩展，点击任意网页元素即可添加评论，自动关联 CSS 选择器和截图。
            </p>
          </div>
          <button onClick={() => setShowNewComment(false)} className="p-1 text-primary-400 hover:text-primary-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 搜索与筛选 */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索评论内容、作者或元素..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredComments.length} / {comments.length} 条评论</span>
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                  setProjectFilter('all');
                }}
                className="text-primary-600 hover:text-primary-700 text-xs"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* 状态筛选 */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  statusFilter === f.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 优先级筛选 */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as CommentPriority | 'all')}
            className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none"
          >
            {priorityFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* 分类筛选 */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CommentCategory | 'all')}
            className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none"
          >
            {categoryFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* 项目筛选 */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none"
          >
            <option value="all">全部项目</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 评论列表 */}
      {filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
          <p className="mt-3 text-gray-500 dark:text-gray-400">没有找到匹配的评论</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
}
