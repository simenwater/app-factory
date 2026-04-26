'use client';

import { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  readOnly?: boolean;
}

/**
 * @description 简易代码编辑器组件，支持语法高亮占位符
 * @param {CodeEditorProps} props - 编辑器配置
 */
export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  placeholder = '在此输入代码...',
  readOnly = false,
}: CodeEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative rounded-xl border transition-colors ${
        isFocused
          ? 'border-brand-400 dark:border-brand-500 ring-2 ring-brand-400/20'
          : 'border-gray-300 dark:border-gray-700'
      } bg-gray-900 overflow-hidden`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full min-h-[200px] p-4 bg-transparent text-gray-100 font-mono text-sm leading-relaxed resize-y focus:outline-none placeholder:text-gray-600"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}
