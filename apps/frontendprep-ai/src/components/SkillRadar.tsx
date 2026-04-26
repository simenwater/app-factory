'use client';

import type { SkillAssessment, SkillCategory } from '@/types';

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

/** @description 技能评级对应的颜色 */
const LEVEL_COLORS = {
  beginner: 'bg-red-400 dark:bg-red-500',
  intermediate: 'bg-yellow-400 dark:bg-yellow-500',
  advanced: 'bg-green-400 dark:bg-green-500',
};

interface SkillRadarProps {
  skills: SkillAssessment[];
}

/**
 * @description 技能雷达图（条形图形式），展示各维度得分
 * @param {SkillRadarProps} props - 技能评估数据
 */
export default function SkillRadar({ skills }: SkillRadarProps) {
  const sorted = [...skills].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      {sorted.map((skill) => (
        <div key={skill.category} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {CATEGORY_LABELS[skill.category] || skill.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {skill.score}/100
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${LEVEL_COLORS[skill.level]}`}
              style={{ width: `${skill.score}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {skill.details}
          </p>
        </div>
      ))}
    </div>
  );
}
