import { generateId, formatDate, formatForPlatform, matchesSearch, truncate } from '@/lib/utils';

/**
 * @description 工具函数单元测试
 */
describe('utils', () => {
  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string ids', () => {
      expect(typeof generateId()).toBe('string');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string to localized format', () => {
      const result = formatDate('2025-06-15T10:30:00Z');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatForPlatform', () => {
    const content = 'Test content';

    it('should wrap content for Cursor format', () => {
      const result = formatForPlatform(content, 'cursor');
      expect(result).toContain('# Cursor Rules');
      expect(result).toContain(content);
    });

    it('should wrap content for Claude format', () => {
      const result = formatForPlatform(content, 'claude');
      expect(result).toContain('<system>');
      expect(result).toContain('</system>');
      expect(result).toContain(content);
    });

    it('should wrap content for GitHub Copilot format', () => {
      const result = formatForPlatform(content, 'github-copilot');
      expect(result).toContain('# GitHub Copilot Instructions');
      expect(result).toContain(content);
    });

    it('should return raw content for generic platform', () => {
      const result = formatForPlatform(content, 'generic');
      expect(result).toBe(content);
    });
  });

  describe('matchesSearch', () => {
    it('should return true for empty query', () => {
      expect(matchesSearch('', 'anything')).toBe(true);
      expect(matchesSearch('  ', 'anything')).toBe(true);
    });

    it('should match case-insensitively', () => {
      expect(matchesSearch('test', 'This is a Test')).toBe(true);
      expect(matchesSearch('TEST', 'testing')).toBe(true);
    });

    it('should return false when no match', () => {
      expect(matchesSearch('xyz', 'hello world')).toBe(false);
    });
  });

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate long text and add ellipsis', () => {
      expect(truncate('hello world', 5)).toBe('hello...');
    });

    it('should handle exact length', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });
  });
});
