import { INDUSTRY_LABELS, type IndustryType } from "@/types";

/**
 * @component IndustryTag
 * 行业标签
 * @param {Object} props
 * @param {IndustryType} props.industry - 行业类型
 * @param {boolean} [props.active=false] - 是否为激活状态
 * @param {() => void} [props.onClick] - 点击回调
 */
export function IndustryTag({
  industry,
  active = false,
  onClick,
}: {
  industry: IndustryType;
  active?: boolean;
  onClick?: () => void;
}) {
  const label = INDUSTRY_LABELS[industry];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
    </button>
  );
}
