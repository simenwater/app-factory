'use client';

import { FileText, Briefcase, List, PenLine } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { RewriteStyle } from '@/types';

/**
 * @description 重写风格配置
 */
const styles: { value: RewriteStyle; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'summary', label: '智能摘要', desc: '精简提炼核心要点', icon: <FileText className="w-4 h-4" /> },
  { value: 'formal', label: '正式文档', desc: '商务邮件/报告风格', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'bullet', label: '要点列表', desc: '结构化条目整理', icon: <List className="w-4 h-4" /> },
  { value: 'blog', label: '博客文章', desc: '生动流畅的叙述', icon: <PenLine className="w-4 h-4" /> },
];

/**
 * @description 重写风格选择器组件
 */
export default function StyleSelector() {
  const { rewriteStyle, setRewriteStyle } = useStore();

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">
        选择输出风格
      </p>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(({ value, label, desc, icon }) => (
          <button
            key={value}
            onClick={() => setRewriteStyle(value)}
            className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${
              rewriteStyle === value
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div
              className={`mt-0.5 ${
                rewriteStyle === value ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'
              }`}
            >
              {icon}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  rewriteStyle === value ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
