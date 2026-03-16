import { toPng, toSvg } from 'html-to-image';

/**
 * 导出时间线为 PNG 格式
 */
export async function exportToPng(element: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2,
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * 导出时间线为 SVG 格式
 */
export async function exportToSvg(element: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toSvg(element, {
    quality: 1.0,
  });

  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = dataUrl;
  link.click();
}

/**
 * 生成分享链接
 */
export function generateShareLink(timelineId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/share/${timelineId}`;
}
