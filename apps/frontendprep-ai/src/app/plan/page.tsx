'use client';

import { useState } from 'react';
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SkillRadar from '@/components/SkillRadar';
import { useStore } from '@/store/useStore';
import type { WeaknessAnalysis, PracticePlan, PracticeTask, SkillCategory } from '@/types';

/** @description 技能类别中文名映射 */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  css: 'CSS',
  html: 'HTML',
  performance: '性能优化',
  accessibility: '无障碍',
  testing: '测试',
};

/**
 * @description 练习计划页面 — 弱点分析和个性化练习任务
 */
export default function PlanPage() {
  const {
    user,
    sessions,
    lastCodeEval,
    setWeaknessAnalysis,
    addPracticePlan,
    toggleTask,
  } = useStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  /** @description 请求 AI 分析弱点并生成练习计划 */
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const evaluations = lastCodeEval ? [lastCodeEval] : [];
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions, evaluations }),
      });
      const data = await res.json();

      if (data.result) {
        const analysis: WeaknessAnalysis = {
          skills: data.result.skills || [],
          overallLevel: data.result.overallLevel || 'junior',
          weakestAreas: data.result.weakestAreas || [],
          strongestAreas: data.result.strongestAreas || [],
          generatedAt: Date.now(),
        };
        setWeaknessAnalysis(analysis);

        if (data.result.practicePlan) {
          const plan: PracticePlan = {
            id: Date.now().toString(),
            title: data.result.practicePlan.title || '个性化练习计划',
            description: data.result.practicePlan.description || '',
            tasks: (data.result.practicePlan.tasks || []).map(
              (t: Partial<PracticeTask>, i: number) => ({
                id: `task_${Date.now()}_${i}`,
                title: t.title || `任务 ${i + 1}`,
                description: t.description || '',
                category: t.category || 'javascript',
                difficulty: t.difficulty || 'mid',
                completed: false,
                resources: t.resources || [],
              })
            ),
            estimatedDays: data.result.practicePlan.estimatedDays || 14,
            difficulty: analysis.overallLevel,
            generatedAt: Date.now(),
          };
          addPracticePlan(plan);
          setExpandedPlan(plan.id);
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { weaknessAnalysis, practicePlans } = user;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">个性化练习计划</h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI 分析你的弱点领域，生成量身定制的练习路线图
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {weaknessAnalysis ? '重新分析' : '开始分析'}
              </>
            )}
          </button>
        </div>

        {/* 弱点分析结果 */}
        {weaknessAnalysis && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
            {/* 技能雷达 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4">技能分析</h2>
              <SkillRadar skills={weaknessAnalysis.skills} />
            </div>

            {/* 弱点和优势 */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold mb-3">综合评估</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">整体水平</p>
                    <p className="font-medium capitalize">
                      {weaknessAnalysis.overallLevel === 'junior' && '初级'}
                      {weaknessAnalysis.overallLevel === 'mid' && '中级'}
                      {weaknessAnalysis.overallLevel === 'senior' && '高级'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">需要加强</p>
                    <div className="flex flex-wrap gap-1.5">
                      {weaknessAnalysis.weakestAreas.map((area) => (
                        <span
                          key={area}
                          className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full"
                        >
                          {CATEGORY_LABELS[area as SkillCategory] || area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">优势领域</p>
                    <div className="flex flex-wrap gap-1.5">
                      {weaknessAnalysis.strongestAreas.map((area) => (
                        <span
                          key={area}
                          className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full"
                        >
                          {CATEGORY_LABELS[area as SkillCategory] || area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 rounded-xl p-4 border border-brand-200 dark:border-brand-800">
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  基于你的面试记录和代码评估结果，AI 已生成个性化的练习计划。
                  坚持完成每日任务，你的前端技能将快速提升！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 练习计划列表 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            练习计划 {practicePlans.length > 0 && `(${practicePlans.length})`}
          </h2>

          {practicePlans.length === 0 && !weaknessAnalysis && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                暂无练习计划
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                点击「开始分析」让 AI 分析你的弱点并生成个性化练习计划
              </p>
            </div>
          )}

          {practicePlans.map((plan) => {
            const isExpanded = expandedPlan === plan.id;
            const completedCount = plan.tasks.filter((t) => t.completed).length;
            const progress = plan.tasks.length > 0
              ? Math.round((completedCount / plan.tasks.length) * 100)
              : 0;

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {completedCount}/{plan.tasks.length}
                    </span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                    {plan.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          task.completed
                            ? 'bg-green-50 dark:bg-green-900/10'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(plan.id, task.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                              {CATEGORY_LABELS[task.category] || task.category}
                            </span>
                            {task.resources && task.resources.length > 0 && (
                              <span className="text-xs text-brand-500">
                                {task.resources.length} 个资源
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
