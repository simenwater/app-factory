/**
 * @fileoverview 通用工具函数
 */

import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { CommentStatus, CommentPriority, CommentCategory } from '@/types';

/**
 * @description 合并 className
 * @param classes - CSS class 列表
 * @returns 合并后的 className 字符串
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * @description 格式化日期为相对时间
 * @param dateStr - ISO 日期字符串
 */
export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: zhCN });
}

/**
 * @description 格式化日期
 * @param dateStr - ISO 日期字符串
 * @param pattern - 日期格式
 */
export function formatDate(dateStr: string, pattern = 'yyyy-MM-dd HH:mm'): string {
  return format(new Date(dateStr), pattern);
}

/**
 * @description 获取状态对应的标签文案和颜色
 */
export function getStatusConfig(status: CommentStatus) {
  const map: Record<CommentStatus, { label: string; color: string; bg: string }> = {
    open: { label: '待处理', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    in_progress: { label: '处理中', color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/40' },
    resolved: { label: '已解决', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' },
    closed: { label: '已关闭', color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-700/40' },
  };
  return map[status];
}

/**
 * @description 获取优先级对应的标签文案和颜色
 */
export function getPriorityConfig(priority: CommentPriority) {
  const map: Record<CommentPriority, { label: string; color: string; bg: string }> = {
    low: { label: '低', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700/40' },
    medium: { label: '中', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    high: { label: '高', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40' },
    critical: { label: '紧急', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
  };
  return map[priority];
}

/**
 * @description 获取分类对应的标签文案
 */
export function getCategoryConfig(category: CommentCategory) {
  const map: Record<CommentCategory, { label: string; icon: string }> = {
    bug: { label: 'Bug', icon: '🐛' },
    design: { label: '设计', icon: '🎨' },
    content: { label: '内容', icon: '📝' },
    functionality: { label: '功能', icon: '⚙️' },
    performance: { label: '性能', icon: '⚡' },
    other: { label: '其他', icon: '💬' },
  };
  return map[category];
}

/**
 * @description 生成用户头像的首字母
 * @param name - 用户姓名
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * @description 生成基于用户名的一致性颜色
 * @param name - 用户姓名
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-cyan-500', 'bg-purple-500', 'bg-rose-500', 'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
