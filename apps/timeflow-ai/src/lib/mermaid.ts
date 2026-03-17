import type { TimelineEvent } from '@/types';

/**
 * 将时间线事件转换为 Mermaid 语法
 */
export function generateMermaidCode(title: string, events: TimelineEvent[]): string {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lines = ['timeline'];
  lines.push(`    title ${title}`);
  
  sortedEvents.forEach(event => {
    const dateStr = new Date(event.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    lines.push(`    ${dateStr} : ${event.title}`);
    if (event.description) {
      lines.push(`                : ${event.description}`);
    }
  });

  return lines.join('\n');
}
