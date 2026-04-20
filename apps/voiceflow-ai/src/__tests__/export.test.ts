import { exportNote, formatDuration } from '@/lib/export';
import type { VoiceNote } from '@/types';

/**
 * @description 导出功能单元测试
 */
describe('exportNote', () => {
  const mockNote: VoiceNote = {
    id: 'test-1',
    title: '测试笔记',
    originalText: '这是原始转录文本',
    rewrittenText: '这是整理后的文本内容',
    style: 'summary',
    duration: 125,
    createdAt: '2025-01-15T10:30:00.000Z',
    language: 'chinese',
  };

  describe('markdown 格式', () => {
    it('应包含标题', () => {
      const result = exportNote(mockNote, 'markdown');
      expect(result).toContain('# 测试笔记');
    });

    it('应包含重写后的内容', () => {
      const result = exportNote(mockNote, 'markdown');
      expect(result).toContain('这是整理后的文本内容');
    });

    it('应包含原始文本', () => {
      const result = exportNote(mockNote, 'markdown');
      expect(result).toContain('这是原始转录文本');
    });

    it('应包含元数据', () => {
      const result = exportNote(mockNote, 'markdown');
      expect(result).toContain('02:05');
    });
  });

  describe('text 格式', () => {
    it('应包含标题', () => {
      const result = exportNote(mockNote, 'text');
      expect(result).toContain('测试笔记');
    });

    it('应包含分隔线', () => {
      const result = exportNote(mockNote, 'text');
      expect(result).toContain('--- 整理后内容 ---');
      expect(result).toContain('--- 原始转录 ---');
    });

    it('应包含两种文本内容', () => {
      const result = exportNote(mockNote, 'text');
      expect(result).toContain('这是整理后的文本内容');
      expect(result).toContain('这是原始转录文本');
    });
  });
});

describe('formatDuration', () => {
  it('应正确格式化 0 秒', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('应正确格式化不满一分钟', () => {
    expect(formatDuration(45)).toBe('00:45');
  });

  it('应正确格式化分钟和秒', () => {
    expect(formatDuration(125)).toBe('02:05');
  });

  it('应正确格式化整分钟', () => {
    expect(formatDuration(300)).toBe('05:00');
  });

  it('应处理小数秒数', () => {
    expect(formatDuration(61.7)).toBe('01:01');
  });
});
