'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface TextInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

/**
 * 文本输入组件
 */
export function TextInput({ onGenerate, isLoading, disabled }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onGenerate(text.trim());
    }
  };

  const examples = [
    '我们公司2020年成立，同年6月获得天使轮融资，12月发布了第一个产品。2021年8月完成A轮融资，2022年3月用户突破10万。',
    '项目于2024年1月启动，2月完成需求分析，3月完成原型设计，5月进入开发阶段，预计8月上线。',
    '苹果公司1976年创立，1984年发布Macintosh，2001年推出iPod，2007年发布iPhone，2010年推出iPad。',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="timeline-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          描述你的事件序列
        </label>
        <textarea
          id="timeline-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入包含时间和事件的文本描述，例如：我们公司2020年成立，同年6月获得天使轮融资..."
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          disabled={disabled || isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled || isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            生成中...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            生成时间线
          </>
        )}
      </button>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">试试这些示例：</p>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setText(example)}
              disabled={disabled || isLoading}
              className="w-full text-left px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example.substring(0, 80)}...
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
