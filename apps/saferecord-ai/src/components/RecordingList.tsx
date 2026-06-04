'use client';

/**
 * @fileoverview 录音历史列表组件
 * 展示所有录音记录，支持播放、转录和管理
 */

import { useState } from 'react';
import {
  Clock,
  FileText,
  Heart,
  MoreVertical,
  Play,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';
import { formatDuration, formatRelativeTime, formatFileSize } from '@/lib/formatters';
import type { Recording } from '@/types';

/**
 * @description 单条录音记录卡片
 */
function RecordingCard({
  recording,
  onSelect,
}: {
  recording: Recording;
  onSelect: (id: string) => void;
}) {
  const { toggleFavorite, deleteRecording } = useRecordingStore();
  const [showMenu, setShowMenu] = useState(false);

  const statusBadge = () => {
    switch (recording.transcriptionStatus) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            <FileText className="w-3 h-3" />
            已转录
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" />
            转录中
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
            转录失败
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="group relative p-4 bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark hover:shadow-md transition-all cursor-pointer"
      onClick={() => onSelect(recording.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text dark:text-text-dark truncate">
            {recording.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted dark:text-muted-dark">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(recording.duration)}
            </span>
            <span>{formatFileSize(recording.fileSize)}</span>
            <span>{formatRelativeTime(recording.createdAt)}</span>
          </div>
          <div className="mt-2">{statusBadge()}</div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recording.id);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={recording.isFavorite ? '取消收藏' : '收藏'}
          >
            <Heart
              className={`w-4 h-4 ${
                recording.isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-muted dark:text-muted-dark'
              }`}
            />
          </button>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="更多操作"
            >
              <MoreVertical className="w-4 h-4 text-muted dark:text-muted-dark" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecording(recording.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  删除录音
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {recording.transcriptionStatus === 'completed' && recording.fullText && (
        <p className="mt-3 text-sm text-muted dark:text-muted-dark line-clamp-2">
          {recording.fullText}
        </p>
      )}
    </div>
  );
}

/**
 * @description 录音历史列表
 */
export function RecordingList({ onSelect }: { onSelect: (id: string) => void }) {
  const recordings = useRecordingStore((s) => s.recordings);

  if (recordings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Play className="w-8 h-8 text-muted dark:text-muted-dark" />
        </div>
        <h3 className="text-lg font-medium text-text dark:text-text-dark">暂无录音</h3>
        <p className="text-sm text-muted dark:text-muted-dark mt-1">
          点击上方按钮开始你的第一段录音
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recordings.map((recording) => (
        <RecordingCard
          key={recording.id}
          recording={recording}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
