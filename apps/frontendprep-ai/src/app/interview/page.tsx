'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RotateCcw, Settings2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { useStore } from '@/store/useStore';
import type { InterviewType, Difficulty, InterviewMessage } from '@/types';

const INTERVIEW_TYPES: { value: InterviewType; label: string }[] = [
  { value: 'mixed', label: '综合面试' },
  { value: 'behavioral', label: '行为面试' },
  { value: 'technical', label: '技术面试' },
  { value: 'react', label: 'React 专项' },
  { value: 'css', label: 'CSS 专项' },
  { value: 'javascript', label: 'JS 专项' },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'junior', label: '初级' },
  { value: 'mid', label: '中级' },
  { value: 'senior', label: '高级' },
];

/**
 * @description 模拟面试页面 — 与 AI 面试官对话
 */
export default function InterviewPage() {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('mid');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { createSession, addMessage, endSession, canStartInterview } = useStore();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /**
   * @description 调用面试 API 获取 AI 回复
   * @param {Array<{role: string; content: string}>} chatMessages - 消息历史
   */
  const fetchReply = useCallback(async (chatMessages: { role: string; content: string }[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          type: interviewType,
          difficulty,
        }),
      });
      const data = await res.json();

      if (data.reply) {
        const aiMsg: InterviewMessage = {
          id: Date.now().toString() + '_ai',
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        addMessage(aiMsg);
      }
    } catch (err) {
      console.error('Interview fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [interviewType, difficulty, addMessage]);

  /** @description 开始一场新面试 */
  const handleStart = async () => {
    if (!canStartInterview()) return;
    setIsStarted(true);
    setMessages([]);
    createSession(interviewType, difficulty);
    await fetchReply([]);
  };

  /** @description 发送用户消息 */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: InterviewMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    addMessage(userMsg);
    setInput('');

    const chatHistory = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));
    await fetchReply(chatHistory);
  };

  /** @description 键盘 Enter 发送（Shift+Enter 换行） */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /** @description 重新开始面试 */
  const handleReset = () => {
    endSession();
    setIsStarted(false);
    setMessages([]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        <SubscriptionBanner />

        {!isStarted ? (
          /* 面试配置面板 */
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Settings2 className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">开始模拟面试</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  选择面试类型和难度，AI 面试官即刻上线
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">面试类型</label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTERVIEW_TYPES.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setInterviewType(value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          interviewType === value
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">难度级别</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setDifficulty(value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          difficulty === value
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!canStartInterview()}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors"
              >
                {canStartInterview() ? '开始面试' : '免费次数已用完'}
              </button>
            </div>
          </div>
        ) : (
          /* 面试对话区域 */
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold">模拟面试进行中</h1>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                结束并重来
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-1">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role as 'user' | 'assistant'} content={msg.content} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-950 pt-2 pb-4">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的回答...（Shift+Enter 换行）"
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
