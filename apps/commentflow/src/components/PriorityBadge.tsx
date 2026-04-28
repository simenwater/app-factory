'use client';

/**
 * @fileoverview 优先级徽章组件
 */

import { cn } from '@/lib/utils';
import { getPriorityConfig } from '@/lib/utils';
import type { CommentPriority } from '@/types';

interface PriorityBadgeProps {
  priority: CommentPriority;
}

/**
 * @description 评论优先级徽章
 */
export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = getPriorityConfig(priority);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.color,
        config.bg
      )}
    >
      {config.label}
    </span>
  );
}
