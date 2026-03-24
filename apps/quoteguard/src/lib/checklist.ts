import type { ChecklistItem, ChecklistCategory, ClientChecklist } from "@/types";
import { generateId } from "./utils";

/**
 * @description 默认清单模板，涵盖项目各阶段的客户期望管理
 */
export const DEFAULT_CHECKLIST_ITEMS: Array<{
  text: string;
  category: ChecklistCategory;
}> = [
  { text: "明确项目范围和交付物清单", category: "scope" },
  { text: "排除不在范围内的工作内容", category: "scope" },
  { text: "约定如何处理范围变更请求", category: "scope" },
  { text: "设定项目起止日期", category: "timeline" },
  { text: "确认各里程碑的截止时间", category: "timeline" },
  { text: "约定延期的处理方式", category: "timeline" },
  { text: "确认总报价和付款方式", category: "payment" },
  { text: "约定预付款比例（建议 30%-50%）", category: "payment" },
  { text: "明确额外费用的计算方式", category: "payment" },
  { text: "确定主要联系人和沟通渠道", category: "communication" },
  { text: "约定回复时间预期（如 24 小时内）", category: "communication" },
  { text: "安排定期进度汇报节点", category: "communication" },
  { text: "明确交付物的格式和标准", category: "deliverables" },
  { text: "约定验收标准和流程", category: "deliverables" },
  { text: "确认最终文件的交付方式", category: "deliverables" },
  { text: "约定修改次数上限（建议 2-3 次）", category: "revision" },
  { text: "明确超出修改次数的额外收费", category: "revision" },
  { text: "约定修改请求的提交方式和截止时间", category: "revision" },
];

/**
 * @description 根据默认模板创建客户清单
 * @param {string} clientName - 客户姓名
 * @param {string} projectName - 项目名称
 * @returns {ClientChecklist} 新的客户清单
 */
export function createChecklist(
  clientName: string,
  projectName: string
): ClientChecklist {
  const items: ChecklistItem[] = DEFAULT_CHECKLIST_ITEMS.map((item) => ({
    id: generateId(),
    text: item.text,
    category: item.category,
    checked: false,
  }));

  return {
    id: generateId(),
    clientName,
    projectName,
    items,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

/**
 * @description 按类别分组清单项
 * @param {ChecklistItem[]} items - 清单项列表
 * @returns {Record<ChecklistCategory, ChecklistItem[]>} 分组后的清单
 */
export function groupByCategory(
  items: ChecklistItem[]
): Record<string, ChecklistItem[]> {
  return items.reduce(
    (groups, item) => {
      const key = item.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<string, ChecklistItem[]>
  );
}

/**
 * @description 检查清单是否全部完成
 * @param {ChecklistItem[]} items - 清单项
 * @returns {boolean} 是否全部完成
 */
export function isChecklistComplete(items: ChecklistItem[]): boolean {
  return items.length > 0 && items.every((i) => i.checked);
}
