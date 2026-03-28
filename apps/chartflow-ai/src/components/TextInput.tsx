'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { chartTemplates } from '@/lib/templates';

interface TextInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

/**
 * @description 自然语言文本输入组件，支持模板快速选择
 */
export function TextInput({ onGenerate, isLoading, disabled }: TextInputProps) {
  const [text, setText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onGenerate(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="chart-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          描述你想要生成的图表
        </label>
        <textarea
          id="chart-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="用自然语言描述你想要的图表，例如：&#10;• 用户注册流程：填写表单 → 验证邮箱 → 创建账户&#10;• TCP 报文头格式：源端口、目的端口、序列号...&#10;• React 发展历程：2013年开源、2019年推出Hooks..."
          className="w-full h-36 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={disabled || isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled || isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            AI 生成中...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            生成图表
          </>
        )}
      </button>

      <div>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer"
        >
          {showTemplates ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {showTemplates ? '收起模板' : '查看图表模板'}
        </button>

        {showTemplates && (
          <div className="mt-3 grid grid-cols-2 gap-2 animate-fade-in">
            {chartTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setText(template.examplePrompt)}
                disabled={disabled || isLoading}
                className="text-left px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="text-lg mr-1.5">{template.icon}</span>
                <span className="text-sm font-medium">{template.name}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
