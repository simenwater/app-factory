'use client';

/**
 * @fileoverview 用户头像组件
 */

import { cn, getInitials, getAvatarColor } from '@/lib/utils';
import type { User } from '@/types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

/**
 * @description 用户头像 — 支持首字母生成
 */
export default function Avatar({ user, size = 'md' }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium shrink-0',
        getAvatarColor(user.name),
        sizeClasses[size]
      )}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
}
