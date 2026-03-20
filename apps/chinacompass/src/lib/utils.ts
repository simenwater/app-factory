/**
 * @fileoverview 工具函数集合
 */

import type { Country, RiskLevel, CountryInfo } from "@/types";

/** 所有支持的国家信息 */
export const COUNTRIES: CountryInfo[] = [
  { code: "US", name: "美国", nameEn: "United States", flag: "🇺🇸", region: "北美" },
  { code: "EU", name: "欧盟", nameEn: "European Union", flag: "🇪🇺", region: "欧洲" },
  { code: "JP", name: "日本", nameEn: "Japan", flag: "🇯🇵", region: "东亚" },
  { code: "KR", name: "韩国", nameEn: "South Korea", flag: "🇰🇷", region: "东亚" },
  { code: "SG", name: "新加坡", nameEn: "Singapore", flag: "🇸🇬", region: "东南亚" },
  { code: "TH", name: "泰国", nameEn: "Thailand", flag: "🇹🇭", region: "东南亚" },
  { code: "VN", name: "越南", nameEn: "Vietnam", flag: "🇻🇳", region: "东南亚" },
  { code: "ID", name: "印尼", nameEn: "Indonesia", flag: "🇮🇩", region: "东南亚" },
  { code: "MY", name: "马来西亚", nameEn: "Malaysia", flag: "🇲🇾", region: "东南亚" },
  { code: "AU", name: "澳大利亚", nameEn: "Australia", flag: "🇦🇺", region: "大洋洲" },
];

/**
 * @description 根据国家代码获取国家信息
 * @param code - 国家代码
 */
export function getCountryInfo(code: Country): CountryInfo | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/**
 * @description 获取风险等级对应的样式类名
 * @param level - 风险等级
 */
export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return colors[level];
}

/**
 * @description 获取风险等级中文名
 * @param level - 风险等级
 */
export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: "低风险",
    medium: "中风险",
    high: "高风险",
    critical: "严重",
  };
  return labels[level];
}

/**
 * @description 格式化日期为中文显示
 * @param dateStr - ISO日期字符串
 */
export function formatDateCn(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * @description 截断文本到指定长度
 * @param text - 文本
 * @param maxLen - 最大长度
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}
