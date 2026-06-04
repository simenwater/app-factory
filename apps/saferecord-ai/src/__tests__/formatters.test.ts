/**
 * @fileoverview 格式化工具函数单元测试
 */

import { formatDuration, formatFileSize, formatRelativeTime, getLanguageName } from '@/lib/formatters';

describe('formatDuration', () => {
  it('应正确格式化秒数为 MM:SS', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(5)).toBe('00:05');
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(599)).toBe('09:59');
  });

  it('应正确格式化超过一小时的时长为 HH:MM:SS', () => {
    expect(formatDuration(3600)).toBe('01:00:00');
    expect(formatDuration(3661)).toBe('01:01:01');
    expect(formatDuration(7200)).toBe('02:00:00');
  });

  it('应处理小数秒数', () => {
    expect(formatDuration(1.5)).toBe('00:01');
    expect(formatDuration(59.9)).toBe('00:59');
  });
});

describe('formatFileSize', () => {
  it('应正确格式化字节数', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500.0 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('应正确格式化 MB 和 GB', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });
});

describe('formatRelativeTime', () => {
  it('应返回"刚刚"对于刚发生的时间', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('刚刚');
  });

  it('应返回分钟前', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toBe('5 分钟前');
  });

  it('应返回小时前', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2 小时前');
  });

  it('应返回天前', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 天前');
  });
});

describe('getLanguageName', () => {
  it('应返回正确的语言名称', () => {
    expect(getLanguageName('zh')).toBe('中文');
    expect(getLanguageName('en')).toBe('English');
    expect(getLanguageName('ja')).toBe('日本語');
    expect(getLanguageName('auto')).toBe('自动检测');
  });

  it('应返回未知语言代码本身', () => {
    expect(getLanguageName('unknown')).toBe('unknown');
  });
});
