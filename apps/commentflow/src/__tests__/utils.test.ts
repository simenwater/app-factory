/**
 * @fileoverview 工具函数单元测试
 */

import {
  cn,
  getStatusConfig,
  getPriorityConfig,
  getCategoryConfig,
  getInitials,
  getAvatarColor,
} from '@/lib/utils';

describe('cn()', () => {
  it('应当合并多个 class', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('应当过滤 falsy 值', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('应当处理空参数', () => {
    expect(cn()).toBe('');
  });
});

describe('getStatusConfig()', () => {
  it('应当返回 open 状态的配置', () => {
    const config = getStatusConfig('open');
    expect(config.label).toBe('待处理');
    expect(config.color).toBeDefined();
    expect(config.bg).toBeDefined();
  });

  it('应当返回 resolved 状态的配置', () => {
    const config = getStatusConfig('resolved');
    expect(config.label).toBe('已解决');
  });

  it('应当返回 in_progress 状态的配置', () => {
    const config = getStatusConfig('in_progress');
    expect(config.label).toBe('处理中');
  });

  it('应当返回 closed 状态的配置', () => {
    const config = getStatusConfig('closed');
    expect(config.label).toBe('已关闭');
  });
});

describe('getPriorityConfig()', () => {
  it('应当返回各优先级的正确标签', () => {
    expect(getPriorityConfig('low').label).toBe('低');
    expect(getPriorityConfig('medium').label).toBe('中');
    expect(getPriorityConfig('high').label).toBe('高');
    expect(getPriorityConfig('critical').label).toBe('紧急');
  });
});

describe('getCategoryConfig()', () => {
  it('应当返回各分类的正确标签', () => {
    expect(getCategoryConfig('bug').label).toBe('Bug');
    expect(getCategoryConfig('design').label).toBe('设计');
    expect(getCategoryConfig('content').label).toBe('内容');
    expect(getCategoryConfig('functionality').label).toBe('功能');
    expect(getCategoryConfig('performance').label).toBe('性能');
    expect(getCategoryConfig('other').label).toBe('其他');
  });
});

describe('getInitials()', () => {
  it('应当从中文名取首字符', () => {
    expect(getInitials('张明')).toBe('张');
  });

  it('应当从英文名取首字母', () => {
    expect(getInitials('Sarah Chen')).toBe('SC');
  });

  it('应当限制最多返回两个字符', () => {
    expect(getInitials('A B C D').length).toBeLessThanOrEqual(2);
  });
});

describe('getAvatarColor()', () => {
  it('应当返回一致的颜色', () => {
    const color1 = getAvatarColor('Test User');
    const color2 = getAvatarColor('Test User');
    expect(color1).toBe(color2);
  });

  it('应当返回 bg- 开头的 Tailwind class', () => {
    const color = getAvatarColor('Alice');
    expect(color).toMatch(/^bg-/);
  });
});
