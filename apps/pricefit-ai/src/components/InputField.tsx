'use client';

/**
 * @description 通用数字输入字段组件
 * @param {object} props
 * @param {string} props.label - 字段标签
 * @param {number} props.value - 当前值
 * @param {(v: number) => void} props.onChange - 值变更回调
 * @param {string} [props.unit] - 单位后缀
 * @param {number} [props.min] - 最小值
 * @param {number} [props.max] - 最大值
 * @param {number} [props.step] - 步进值
 * @param {string} [props.hint] - 提示文本
 */
export default function InputField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}
