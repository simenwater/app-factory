import type { QuoteTemplate } from "@/types";

/**
 * @description 预置的报价单模板列表
 */
export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: "cleaning-basic",
    name: "基础清洁服务",
    description: "适用于家庭日常清洁服务",
    category: "清洁",
    isPremium: false,
    defaultItems: [
      { description: "客厅清洁", quantity: 1, unitPrice: 50, unit: "间" },
      { description: "厨房深度清洁", quantity: 1, unitPrice: 80, unit: "间" },
      { description: "卫生间清洁", quantity: 1, unitPrice: 60, unit: "间" },
      { description: "卧室清洁", quantity: 1, unitPrice: 40, unit: "间" },
    ],
  },
  {
    id: "cleaning-deep",
    name: "深度清洁服务",
    description: "全屋深度清洁，含家电清洗",
    category: "清洁",
    isPremium: false,
    defaultItems: [
      { description: "全屋基础清洁", quantity: 1, unitPrice: 200, unit: "套" },
      { description: "油烟机深度清洁", quantity: 1, unitPrice: 120, unit: "台" },
      { description: "空调清洗", quantity: 1, unitPrice: 100, unit: "台" },
      { description: "冰箱清洁消毒", quantity: 1, unitPrice: 80, unit: "台" },
    ],
  },
  {
    id: "repair-plumbing",
    name: "水管维修服务",
    description: "水管维修和安装服务",
    category: "维修",
    isPremium: false,
    defaultItems: [
      { description: "上门检查费", quantity: 1, unitPrice: 30, unit: "次" },
      { description: "水管维修（人工）", quantity: 1, unitPrice: 80, unit: "小时" },
      { description: "材料费", quantity: 1, unitPrice: 50, unit: "批" },
    ],
  },
  {
    id: "repair-electrical",
    name: "电路维修服务",
    description: "电路检修和安装",
    category: "维修",
    isPremium: true,
    defaultItems: [
      { description: "电路检测", quantity: 1, unitPrice: 50, unit: "次" },
      { description: "线路维修（人工）", quantity: 1, unitPrice: 100, unit: "小时" },
      { description: "开关/插座安装", quantity: 1, unitPrice: 30, unit: "个" },
      { description: "电气材料", quantity: 1, unitPrice: 80, unit: "批" },
    ],
  },
  {
    id: "landscaping",
    name: "园艺修剪服务",
    description: "草坪修剪和庭院维护",
    category: "园艺",
    isPremium: true,
    defaultItems: [
      { description: "草坪修剪", quantity: 1, unitPrice: 60, unit: "次" },
      { description: "树木修剪", quantity: 1, unitPrice: 100, unit: "棵" },
      { description: "花坛整理", quantity: 1, unitPrice: 40, unit: "平米" },
      { description: "绿化垃圾清运", quantity: 1, unitPrice: 50, unit: "次" },
    ],
  },
  {
    id: "painting",
    name: "室内粉刷服务",
    description: "墙面粉刷和翻新",
    category: "装修",
    isPremium: true,
    defaultItems: [
      { description: "墙面处理（打磨+批腻子）", quantity: 1, unitPrice: 15, unit: "平米" },
      { description: "乳胶漆涂刷", quantity: 1, unitPrice: 20, unit: "平米" },
      { description: "油漆材料", quantity: 1, unitPrice: 200, unit: "桶" },
      { description: "家具保护覆盖", quantity: 1, unitPrice: 100, unit: "套" },
    ],
  },
];

/**
 * @description 获取免费模板
 * @returns {QuoteTemplate[]} 免费模板列表
 */
export function getFreeTemplates(): QuoteTemplate[] {
  return QUOTE_TEMPLATES.filter((t) => !t.isPremium);
}

/**
 * @description 获取所有模板分类
 * @returns {string[]} 分类列表
 */
export function getTemplateCategories(): string[] {
  return [...new Set(QUOTE_TEMPLATES.map((t) => t.category))];
}
