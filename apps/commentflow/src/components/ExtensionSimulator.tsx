'use client';

/**
 * @fileoverview Chrome 扩展模拟器 — 演示在网页上直接评论的体验
 */

import { useState } from 'react';
import {
  Chrome,
  MousePointer2,
  MessageSquarePlus,
  X,
  Send,
  Eye,
  Crosshair,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import Avatar from './Avatar';

/**
 * @description 模拟网页上可点击评论的 HTML 元素
 */
interface SimulatedElement {
  id: string;
  label: string;
  tagName: string;
  selector: string;
  position: { top: string; left: string; width: string; height: string };
}

const simulatedElements: SimulatedElement[] = [
  {
    id: 'el-nav',
    label: 'Navigation Bar',
    tagName: 'NAV',
    selector: 'header > nav',
    position: { top: '0', left: '0', width: '100%', height: '48px' },
  },
  {
    id: 'el-hero',
    label: 'Hero Section',
    tagName: 'SECTION',
    selector: '.hero-section',
    position: { top: '48px', left: '0', width: '100%', height: '180px' },
  },
  {
    id: 'el-cta',
    label: 'CTA Button',
    tagName: 'BUTTON',
    selector: '.hero-section > button.cta',
    position: { top: '170px', left: '30%', width: '120px', height: '36px' },
  },
  {
    id: 'el-card',
    label: 'Feature Card',
    tagName: 'DIV',
    selector: '.features > .card:first-child',
    position: { top: '240px', left: '5%', width: '28%', height: '100px' },
  },
  {
    id: 'el-footer',
    label: 'Footer',
    tagName: 'FOOTER',
    selector: 'footer',
    position: { top: '360px', left: '0', width: '100%', height: '48px' },
  },
];

export default function ExtensionSimulator() {
  const { currentUser, addComment, projects } = useStore();
  const [mode, setMode] = useState<'view' | 'select'>('view');
  const [selectedElement, setSelectedElement] = useState<SimulatedElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /** @description 模拟选中元素后添加评论 */
  const handleSubmitComment = () => {
    if (!commentText.trim() || !selectedElement) return;

    addComment({
      id: `c-ext-${Date.now()}`,
      projectId: projects[0]?.id || 'p1',
      author: currentUser,
      content: commentText.trim(),
      element: {
        selector: selectedElement.selector,
        xpath: '',
        tagName: selectedElement.tagName,
        textContent: selectedElement.label,
      },
      pageUrl: 'https://www.example.com',
      status: 'open',
      priority: 'medium',
      category: 'other',
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setCommentText('');
      setSelectedElement(null);
      setSubmitted(false);
      setMode('view');
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* 模拟浏览器标题栏 */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Chrome className="w-3 h-3" />
          https://www.example.com
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'select' ? 'view' : 'select')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              mode === 'select'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            )}
          >
            {mode === 'select' ? (
              <><Crosshair className="w-3 h-3" /> 选择模式</>
            ) : (
              <><Eye className="w-3 h-3" /> 查看模式</>
            )}
          </button>
        </div>
      </div>

      {/* 模拟网页内容 */}
      <div className="relative h-[420px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        {/* 模拟导航 */}
        <div className="h-12 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 justify-between">
          <span className="font-bold text-sm">Example.com</span>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Products</span>
            <span>Pricing</span>
            <span>About</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Hero 区域 */}
        <div className="h-[180px] bg-gradient-to-r from-primary-500 to-indigo-600 flex flex-col items-center justify-center text-white px-8">
          <h2 className="text-xl font-bold">Build Something Amazing</h2>
          <p className="text-sm opacity-80 mt-2">The fastest way to ship your next project</p>
          <button className="mt-4 px-6 py-2 bg-white text-primary-600 rounded-lg text-sm font-medium">
            Get Started
          </button>
        </div>

        {/* Feature cards */}
        <div className="flex gap-4 px-6 mt-4">
          {['Fast', 'Secure', 'Scalable'].map((f) => (
            <div key={f} className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm font-medium">{f}</p>
              <p className="text-xs text-gray-500 mt-1">Lorem ipsum dolor sit amet</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-400">
          © 2026 Example.com · Privacy · Terms
        </div>

        {/* 可点击的元素覆盖层 */}
        {mode === 'select' && simulatedElements.map((el) => (
          <div
            key={el.id}
            onClick={() => setSelectedElement(el)}
            onMouseEnter={() => setHoveredElement(el.id)}
            onMouseLeave={() => setHoveredElement(null)}
            className={cn(
              'absolute cursor-crosshair transition-all border-2 rounded',
              hoveredElement === el.id || selectedElement?.id === el.id
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-transparent hover:border-primary-300 hover:bg-primary-300/5'
            )}
            style={{
              top: el.position.top,
              left: el.position.left,
              width: el.position.width,
              height: el.position.height,
            }}
          >
            {(hoveredElement === el.id || selectedElement?.id === el.id) && (
              <span className="absolute -top-5 left-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                {el.selector}
              </span>
            )}
          </div>
        ))}

        {/* 评论气泡 */}
        {selectedElement && (
          <div className="absolute right-4 top-14 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium">添加评论</span>
              </div>
              <button
                onClick={() => { setSelectedElement(null); setCommentText(''); }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                  &lt;{selectedElement.tagName.toLowerCase()}&gt;
                </span>
                <span className="text-gray-400 truncate">{selectedElement.selector}</span>
              </div>
              {submitted ? (
                <div className="text-center py-4">
                  <div className="text-green-500 text-lg mb-1">✓</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">评论已添加！</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <Avatar user={currentUser} size="sm" />
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="输入评论..."
                      rows={3}
                      className="flex-1 px-2 py-1.5 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      提交
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 选择模式提示 */}
        {mode === 'select' && !selectedElement && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
            <MousePointer2 className="w-4 h-4" />
            点击任意元素添加评论
          </div>
        )}
      </div>
    </div>
  );
}
