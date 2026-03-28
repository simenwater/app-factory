import { toPng, toSvg } from 'html-to-image';

/**
 * @description 导出图表为 PNG 格式
 * @param element - 需要导出的 DOM 元素
 * @param filename - 导出文件名
 */
export async function exportToPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * @description 导出图表为 SVG 格式
 * @param element - 需要导出的 DOM 元素
 * @param filename - 导出文件名
 */
export async function exportToSvg(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toSvg(element, {
    quality: 1.0,
  });

  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = dataUrl;
  link.click();
}

/**
 * @description 生成嵌入代码（HTML iframe 或 img 标签）
 * @param code - 图表代码（Mermaid 或 PlantUML）
 * @param format - 渲染格式
 * @returns 可嵌入的 HTML 代码
 */
export function generateEmbedCode(
  code: string,
  format: 'mermaid' | 'plantuml'
): string {
  if (format === 'mermaid') {
    const encoded = btoa(encodeURIComponent(code));
    return `<!-- Mermaid 嵌入代码 -->
<div class="mermaid">
${code}
</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>

<!-- 或使用 Mermaid Live Editor 链接 -->
<!-- https://mermaid.live/edit#base64:${encoded} -->`;
  }

  const encodedPuml = encodeURIComponent(code);
  return `<!-- PlantUML 嵌入代码 -->
<img src="https://www.plantuml.com/plantuml/svg/~1${encodedPuml}" alt="PlantUML Diagram" />

<!-- 原始 PlantUML 代码 -->
<!--
${code}
-->`;
}

/**
 * @description 复制文本到剪贴板
 * @param text - 需要复制的文本
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
