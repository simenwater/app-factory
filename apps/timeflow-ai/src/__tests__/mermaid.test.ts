import { generateMermaidCode } from '@/lib/mermaid';
import type { TimelineEvent } from '@/types';

describe('Mermaid 时间线生成', () => {
  it('应该生成正确的 Mermaid 语法', () => {
    const events: TimelineEvent[] = [
      {
        id: '1',
        title: '项目启动',
        date: '2024-01-01',
        description: '项目正式启动',
      },
      {
        id: '2',
        title: '完成设计',
        date: '2024-02-15',
      },
    ];

    const result = generateMermaidCode('测试时间线', events);

    expect(result).toContain('timeline');
    expect(result).toContain('title 测试时间线');
    expect(result).toContain('项目启动');
    expect(result).toContain('完成设计');
  });

  it('应该按日期排序事件', () => {
    const events: TimelineEvent[] = [
      {
        id: '1',
        title: '第二个事件',
        date: '2024-02-01',
      },
      {
        id: '2',
        title: '第一个事件',
        date: '2024-01-01',
      },
    ];

    const result = generateMermaidCode('排序测试', events);
    const firstIndex = result.indexOf('第一个事件');
    const secondIndex = result.indexOf('第二个事件');

    expect(firstIndex).toBeLessThan(secondIndex);
  });

  it('应该包含事件描述', () => {
    const events: TimelineEvent[] = [
      {
        id: '1',
        title: '事件',
        date: '2024-01-01',
        description: '详细描述',
      },
    ];

    const result = generateMermaidCode('描述测试', events);

    expect(result).toContain('详细描述');
  });
});
