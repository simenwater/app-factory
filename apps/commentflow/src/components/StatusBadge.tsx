'use client';

/**
 * @fileoverview 状态徽章组件
 */

import { cn } from '@/lib/utils';
import { getStatusConfig } from '@/lib/utils';
import type { CommentStatus } from '@/types';

interface StatusBadgeProps {
  status: CommentStatus;
  size?: 'sm' | 'md';
}

/**
 * @description 评论状态徽章
 */
export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.color,
        config.bg,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {config.label}
    </span>
  );
}
