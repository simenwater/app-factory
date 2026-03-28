/**
 * @description 支持的图表类型
 */
export type ChartType =
  | 'flowchart'
  | 'sequence'
  | 'class'
  | 'state'
  | 'er'
  | 'gantt'
  | 'pie'
  | 'mindmap'
  | 'timeline'
  | 'block'
  | 'binary-protocol'
  | 'plantuml';

/**
 * @description 支持的渲染格式
 */
export type RenderFormat = 'mermaid' | 'plantuml';

/**
 * @description 图表数据接口
 */
export interface Chart {
  id: string;
  title: string;
  description: string;
  chartType: ChartType;
  renderFormat: RenderFormat;
  code: string;
  createdAt: Date;
}

/**
 * @description 用户订阅类型
 */
export type SubscriptionTier = 'free' | 'pro';

/**
 * @description 用户接口
 */
export interface User {
  id: string;
  subscription: SubscriptionTier;
  generationsUsed: number;
  generationsLimit: number;
  exportsUsed: number;
  exportsLimit: number;
}

/**
 * @description LLM 响应接口
 */
export interface LLMResponse {
  title: string;
  chartType: ChartType;
  mermaidCode: string;
  plantumlCode: string;
}

/**
 * @description 导出格式类型
 */
export type ExportFormat = 'png' | 'svg' | 'embed';

/**
 * @description 图表模板
 */
export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  chartType: ChartType;
  examplePrompt: string;
  icon: string;
}
