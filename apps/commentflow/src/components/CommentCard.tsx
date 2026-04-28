'use client';

/**
 * @fileoverview 评论卡片组件
 */

import { useState } from 'react';
import {
  MessageSquare,
  MoreHorizontal,
  ExternalLink,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatRelativeTime, getCategoryConfig } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Comment, CommentStatus } from '@/types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Avatar from './Avatar';

interface CommentCardProps {
  comment: Comment;
}

/**
 * @description 评论卡片 — 展示评论详情，支持回复和状态变更
 */
export default function CommentCard({ comment }: CommentCardProps) {
  const { currentUser, updateCommentStatus, addReply, deleteComment } = useStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const categoryConfig = getCategoryConfig(comment.category);

  /** @description 提交回复 */
  const handleReply = () => {
    if (!replyText.trim()) return;
    addReply(comment.id, {
      id: `r-${Date.now()}`,
      author: currentUser,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    });
    setReplyText('');
    setShowReplyInput(false);
  };

  const statusActions: { status: CommentStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'in_progress', label: '标记处理中', icon: <Clock className="w-3.5 h-3.5" /> },
    { status: 'resolved', label: '标记已解决', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { status: 'closed', label: '关闭', icon: <ArrowRight className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
      {/* 头部 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar user={comment.author} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{comment.author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(comment.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={comment.status} />
          <PriorityBadge priority={comment.priority} />
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1">
                {statusActions
                  .filter((a) => a.status !== comment.status)
                  .map((action) => (
                    <button
                      key={action.status}
                      onClick={() => {
                        updateCommentStatus(comment.id, action.status);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => {
                    deleteComment(comment.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  删除评论
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 评论内容 */}
      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {comment.content}
      </p>

      {/* 元素信息 */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-400 font-mono">
          &lt;{comment.element.tagName.toLowerCase()}&gt;
          {comment.element.textContent && ` "${comment.element.textContent.slice(0, 30)}"`}
        </span>
        <span className="inline-flex items-center gap-1">
          {categoryConfig.icon} {categoryConfig.label}
        </span>
        {comment.jiraTicketId && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400">
            <ExternalLink className="w-3 h-3" />
            {comment.jiraTicketId}
          </span>
        )}
        {comment.assignee && (
          <span className="inline-flex items-center gap-1.5">
            <Avatar user={comment.assignee} size="sm" />
            <span className="text-gray-500 dark:text-gray-400">{comment.assignee.name}</span>
          </span>
        )}
      </div>

      {/* 回复列表 */}
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              <Avatar user={reply.author} size="sm" />
              <div>
                <p className="text-xs">
                  <span className="font-medium">{reply.author.name}</span>
                  <span className="text-gray-400 ml-2">{formatRelativeTime(reply.createdAt)}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 回复输入 */}
      <div className="mt-3 flex items-center gap-2">
        {showReplyInput ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
              placeholder="输入回复..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowReplyInput(true)}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            回复 ({comment.replies.length})
          </button>
        )}
      </div>
    </div>
  );
}
