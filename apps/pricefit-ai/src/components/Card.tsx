'use client';

/**
 * @description 通用卡片容器
 * @param {object} props
 * @param {string} [props.title] - 卡片标题
 * @param {React.ReactNode} props.children - 子内容
 * @param {string} [props.className] - 额外样式
 */
export default function Card({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      )}
      {children}
    </div>
  );
}
