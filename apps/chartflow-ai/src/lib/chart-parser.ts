import type { ChartType } from '@/types';

/**
 * @description 根据关键词推断图表类型
 * @param text - 用户输入文本
 * @returns 推断的图表类型
 */
export function inferChartType(text: string): ChartType {
  const lower = text.toLowerCase();

  if (
    lower.includes('时间线') ||
    lower.includes('timeline') ||
    lower.includes('历程') ||
    lower.includes('发展史')
  ) {
    return 'timeline';
  }

  if (
    lower.includes('流程') ||
    lower.includes('flow') ||
    lower.includes('步骤') ||
    lower.includes('process')
  ) {
    return 'flowchart';
  }

  if (
    lower.includes('时序') ||
    lower.includes('sequence') ||
    lower.includes('交互') ||
    lower.includes('调用')
  ) {
    return 'sequence';
  }

  if (
    lower.includes('类图') ||
    lower.includes('class') ||
    lower.includes('继承') ||
    lower.includes('接口')
  ) {
    return 'class';
  }

  if (
    lower.includes('状态') ||
    lower.includes('state') ||
    lower.includes('转换')
  ) {
    return 'state';
  }

  if (
    lower.includes('er') ||
    lower.includes('实体') ||
    lower.includes('关系') ||
    lower.includes('数据库')
  ) {
    return 'er';
  }

  if (
    lower.includes('甘特') ||
    lower.includes('gantt') ||
    lower.includes('项目计划') ||
    lower.includes('排期')
  ) {
    return 'gantt';
  }

  if (
    lower.includes('饼图') ||
    lower.includes('pie') ||
    lower.includes('占比') ||
    lower.includes('比例')
  ) {
    return 'pie';
  }

  if (
    lower.includes('思维导图') ||
    lower.includes('mindmap') ||
    lower.includes('脑图')
  ) {
    return 'mindmap';
  }

  if (
    lower.includes('协议') ||
    lower.includes('protocol') ||
    lower.includes('数据格式') ||
    lower.includes('二进制') ||
    lower.includes('字段')
  ) {
    return 'binary-protocol';
  }

  return 'flowchart';
}

/**
 * @description 验证 Mermaid 代码基本语法
 * @param code - Mermaid 代码
 * @returns 是否有效
 */
export function isValidMermaidCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const trimmed = code.trim();
  const validPrefixes = [
    'graph',
    'flowchart',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram',
    'erDiagram',
    'gantt',
    'pie',
    'mindmap',
    'timeline',
    'block-beta',
  ];
  return validPrefixes.some((p) => trimmed.startsWith(p));
}

/**
 * @description 验证 PlantUML 代码基本语法
 * @param code - PlantUML 代码
 * @returns 是否有效
 */
export function isValidPlantUMLCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const trimmed = code.trim();
  return trimmed.startsWith('@start') && trimmed.includes('@end');
}
