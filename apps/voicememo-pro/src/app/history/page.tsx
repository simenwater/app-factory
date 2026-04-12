"use client";

import { useStore } from "@/store/useStore";
import { formatDate, formatDuration, truncateText } from "@/lib/utils";
import { Clock, Trash2, ChevronRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * @component HistoryPage
 * @description 历史记录页面
 */
export default function HistoryPage() {
  const memos = useStore((s) => s.memos);
  const deleteMemo = useStore((s) => s.deleteMemo);
  const setCurrentMemo = useStore((s) => s.setCurrentMemo);
  const router = useRouter();

  /**
   * @function handleSelect
   * @description 选择备忘录并跳转到首页进行重写
   */
  const handleSelect = (memo: (typeof memos)[0]) => {
    setCurrentMemo(memo);
    router.push("/");
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          历史记录
        </h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          共 {memos.length} 条
        </span>
      </div>

      {memos.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-slate-500 dark:text-slate-400">
            还没有录音记录，去首页开始录音吧
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => handleSelect(memo)}
                  className="flex-1 text-left space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                      {memo.title}
                    </h3>
                    {memo.rewrittenText && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                        已重写
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {truncateText(memo.originalText, 120)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(memo.duration)}
                    </span>
                    <span>{formatDate(memo.createdAt)}</span>
                  </div>
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteMemo(memo.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelect(memo)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                    title="查看"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
