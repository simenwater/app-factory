'use client';

import Link from 'next/link';
import {
  MessageSquare,
  Code2,
  BarChart3,
  Zap,
  Target,
  Brain,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI 模拟面试',
    description: '行为面试 + 技术面试全覆盖，多难度级别，真实面试体验',
    href: '/interview',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Code2,
    title: '代码实时评估',
    description: '提交你的 JS/React/CSS 代码，获取评分、问题分析和优化建议',
    href: '/review',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: BarChart3,
    title: '个性化练习计划',
    description: 'AI 分析你的弱点领域，生成量身定制的技能提升路线图',
    href: '/plan',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

const HIGHLIGHTS = [
  { icon: Brain, text: 'GPT-4o 驱动，理解你的每一行代码' },
  { icon: Target, text: '聚焦前端，CSS / React / JS 深度覆盖' },
  { icon: Zap, text: '秒级反馈，不浪费任何准备时间' },
];

/**
 * @description 首页 — 产品介绍、功能入口和 CTA
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI 驱动的前端面试模拟
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">让每一次面试</span>
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              都成为涨薪机会
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            专为前端开发者打造的 AI 面试教练。模拟真实面试场景，
            实时评估你的代码，精准定位弱点并生成练习计划。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-brand-600/20"
            >
              开始模拟面试
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              评估我的代码
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <Icon className="w-4 h-4 text-brand-500" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          三大核心功能
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description, href, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 bg-white dark:bg-gray-900 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">简单透明的定价</h2>
          <p className="text-gray-600 dark:text-gray-400">
            免费开始，按需升级
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">免费试用</p>
              <p className="text-3xl font-bold">$0</p>
              <p className="text-xs text-gray-400 mt-1">3 次面试机会</p>
            </div>
            <div className="text-center p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl ring-2 ring-brand-500">
              <p className="text-sm text-brand-600 dark:text-brand-400 font-medium mb-1">Pro 月订阅</p>
              <p className="text-3xl font-bold">$9.9<span className="text-sm font-normal text-gray-500">/月</span></p>
              <p className="text-xs text-gray-400 mt-1">无限面试 + 详细报告</p>
            </div>
            <div className="text-center p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">面试冲刺包</p>
              <p className="text-3xl font-bold">$49</p>
              <p className="text-xs text-gray-400 mt-1">一次性购买，终身可用</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'AI 模拟面试对话',
                '代码实时评估',
                '弱点分析报告',
                '个性化练习计划',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              查看完整定价
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 FrontendPrep AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
