'use client';

import { useState } from 'react';
import {
  Play,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CodeEditor from '@/components/CodeEditor';
import { useStore } from '@/store/useStore';
import type { CodeEvalResult, CodeIssue } from '@/types';
import ReactMarkdown from 'react-markdown';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX / React' },
  { value: 'tsx', label: 'TSX' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
];

const ISSUE_ICONS: Record<CodeIssue['type'], typeof AlertCircle> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const ISSUE_COLORS: Record<CodeIssue['type'], string> = {
  error: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

const SAMPLE_CODE = `function UserList({ users }) {
  let filtered = users.filter(u => u.active == true);
  let sorted = filtered.sort((a, b) => a.name > b.name ? 1 : -1);

  return (
    <div>
      {sorted.map(user => (
        <div style={{padding: '10px', margin: '5px'}}>
          <span>{user.name}</span>
          <span>{user.email}</span>
        </div>
      ))}
    </div>
  );
}`;

/**
 * @description 代码评估页面 — 提交代码获取 AI 评分和优化建议
 */
export default function ReviewPage() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState('jsx');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<CodeEvalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCodeEval } = useStore();

  /** @description 提交代码进行评估 */
  const handleEvaluate = async () => {
    if (!code.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, context }),
      });
      const data = await res.json();

      if (data.result) {
        setResult(data.result);
        setCodeEval(data.result);
      }
    } catch (err) {
      console.error('Evaluate error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @description 获取评分颜色
   * @param {number} score - 评分
   * @returns {string} 颜色 class
   */
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">代码评估</h1>
          <p className="text-gray-600 dark:text-gray-400">
            提交你的前端代码片段，AI 将从正确性、性能、可读性和最佳实践等维度进行评估
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左侧：代码输入 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50"
              >
                {LANGUAGES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="可选：描述代码上下文..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50"
              />
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              placeholder="在此粘贴你的代码..."
            />

            <button
              onClick={handleEvaluate}
              disabled={!code.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在评估...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  开始评估
                </>
              )}
            </button>
          </div>

          {/* 右侧：评估结果 */}
          <div className="space-y-4">
            {!result && !isLoading && (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                <p className="text-center">
                  提交代码后，评估结果将在这里显示
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500">AI 正在分析你的代码...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* 评分 */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">综合评分</p>
                  <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">/ 100</p>
                </div>

                {/* 总体评价 */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-sm font-semibold mb-2">总体评价</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{result.explanation}</ReactMarkdown>
                  </div>
                </div>

                {/* 问题列表 */}
                {result.issues && result.issues.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">发现的问题</h3>
                    {result.issues.map((issue, i) => {
                      const Icon = ISSUE_ICONS[issue.type];
                      return (
                        <div
                          key={i}
                          className={`rounded-lg border p-3 ${ISSUE_COLORS[issue.type]}`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{issue.message}</p>
                              <p className="text-xs mt-1 opacity-80">{issue.suggestion}</p>
                              {issue.line && (
                                <p className="text-xs mt-1 opacity-60">第 {issue.line} 行</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 优化建议 */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <h3 className="text-sm font-semibold mb-2">优化建议</h3>
                    <ul className="space-y-1.5">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 优化后代码 */}
                {result.optimizedCode && (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <h3 className="text-sm font-semibold mb-2">优化后的代码</h3>
                    <pre className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-gray-100">{result.optimizedCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
