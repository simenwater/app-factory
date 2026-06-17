/**
 * @fileoverview 行业费率数据库
 * 包含各行业不同经验等级的市场基准费率（USD/小时）
 */

import { Industry, ExperienceLevel } from "@/types";

/** 行业费率数据结构 */
interface IndustryRateData {
  label: string;
  rates: Record<ExperienceLevel, { min: number; mid: number; max: number }>;
}

/**
 * 行业费率数据库
 * 数据基于 2024 年全球自由职业市场调研
 */
export const INDUSTRY_RATES: Record<Industry, IndustryRateData> = {
  "web-development": {
    label: "Web 开发",
    rates: {
      junior: { min: 30, mid: 50, max: 75 },
      mid: { min: 60, mid: 90, max: 130 },
      senior: { min: 100, mid: 150, max: 220 },
      expert: { min: 150, mid: 250, max: 400 },
    },
  },
  "mobile-development": {
    label: "移动开发",
    rates: {
      junior: { min: 35, mid: 55, max: 80 },
      mid: { min: 65, mid: 100, max: 140 },
      senior: { min: 110, mid: 165, max: 240 },
      expert: { min: 160, mid: 270, max: 450 },
    },
  },
  "ui-ux-design": {
    label: "UI/UX 设计",
    rates: {
      junior: { min: 25, mid: 45, max: 65 },
      mid: { min: 50, mid: 80, max: 120 },
      senior: { min: 90, mid: 135, max: 200 },
      expert: { min: 140, mid: 220, max: 350 },
    },
  },
  "graphic-design": {
    label: "平面设计",
    rates: {
      junior: { min: 20, mid: 35, max: 55 },
      mid: { min: 40, mid: 65, max: 95 },
      senior: { min: 70, mid: 110, max: 160 },
      expert: { min: 110, mid: 175, max: 280 },
    },
  },
  copywriting: {
    label: "文案写作",
    rates: {
      junior: { min: 20, mid: 35, max: 50 },
      mid: { min: 40, mid: 65, max: 90 },
      senior: { min: 70, mid: 110, max: 150 },
      expert: { min: 100, mid: 160, max: 250 },
    },
  },
  "video-production": {
    label: "视频制作",
    rates: {
      junior: { min: 25, mid: 45, max: 70 },
      mid: { min: 50, mid: 85, max: 120 },
      senior: { min: 90, mid: 140, max: 200 },
      expert: { min: 130, mid: 220, max: 350 },
    },
  },
  consulting: {
    label: "咨询",
    rates: {
      junior: { min: 40, mid: 65, max: 90 },
      mid: { min: 75, mid: 120, max: 175 },
      senior: { min: 130, mid: 200, max: 300 },
      expert: { min: 200, mid: 350, max: 500 },
    },
  },
  marketing: {
    label: "营销",
    rates: {
      junior: { min: 25, mid: 40, max: 60 },
      mid: { min: 45, mid: 75, max: 110 },
      senior: { min: 80, mid: 125, max: 180 },
      expert: { min: 120, mid: 200, max: 320 },
    },
  },
  "data-science": {
    label: "数据科学",
    rates: {
      junior: { min: 35, mid: 55, max: 80 },
      mid: { min: 70, mid: 110, max: 150 },
      senior: { min: 120, mid: 180, max: 260 },
      expert: { min: 180, mid: 300, max: 450 },
    },
  },
  devops: {
    label: "DevOps",
    rates: {
      junior: { min: 35, mid: 55, max: 80 },
      mid: { min: 65, mid: 100, max: 140 },
      senior: { min: 110, mid: 165, max: 230 },
      expert: { min: 160, mid: 260, max: 400 },
    },
  },
  other: {
    label: "其他",
    rates: {
      junior: { min: 20, mid: 35, max: 55 },
      mid: { min: 40, mid: 65, max: 100 },
      senior: { min: 75, mid: 120, max: 175 },
      expert: { min: 120, mid: 190, max: 300 },
    },
  },
};

/**
 * 获取指定行业和经验等级的费率数据
 * @param industry - 行业类别
 * @param level - 经验等级
 * @returns 费率数据 { min, mid, max }
 */
export function getRate(
  industry: Industry,
  level: ExperienceLevel
): { min: number; mid: number; max: number } {
  return INDUSTRY_RATES[industry].rates[level];
}

/**
 * 获取行业显示名称
 * @param industry - 行业类别
 * @returns 行业中文名
 */
export function getIndustryLabel(industry: Industry): string {
  return INDUSTRY_RATES[industry].label;
}
