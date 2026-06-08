/**
 * @module memoryManager.test
 * @description MemoryManager 集成测试（使用 VS Code mock）
 */

import { MemoryManager } from '../../src/core/memoryManager';

describe('MemoryManager', () => {
  let manager: MemoryManager;

  beforeEach(() => {
    manager = new MemoryManager();
  });

  describe('constructor', () => {
    it('应正确初始化', () => {
      expect(manager).toBeDefined();
      expect(manager.isIndexing).toBe(false);
    });
  });

  describe('getStats', () => {
    it('初始状态应为空', () => {
      const stats = manager.getStats();
      expect(stats.totalRecords).toBe(0);
    });
  });

  describe('addNote', () => {
    it('应成功添加笔记', () => {
      const id = manager.addNote('测试笔记内容', ['test']);
      expect(id).toContain('note:');

      const stats = manager.getStats();
      expect(stats.totalRecords).toBe(1);
    });

    it('应能搜索到添加的笔记', () => {
      manager.addNote('用户认证使用 JWT token 机制');
      manager.addNote('数据库使用 PostgreSQL');
      manager.addNote('前端使用 React 框架');

      const results = manager.search('用户认证 JWT');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('addDecision', () => {
    it('应成功记录决策', () => {
      const id = manager.addDecision(
        '使用 TypeScript 而非 JavaScript',
        '为了类型安全和更好的 IDE 支持'
      );
      expect(id).toContain('decision:');
      expect(manager.getStats().totalRecords).toBe(1);
    });
  });

  describe('search', () => {
    it('空存储应返回空结果', () => {
      const results = manager.search('anything');
      expect(results).toEqual([]);
    });

    it('应支持 topK 参数', () => {
      for (let i = 0; i < 20; i++) {
        manager.addNote(`测试笔记 ${i}`);
      }
      const results = manager.search('测试', 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe('generateContextInjection', () => {
    it('空存储应返回提示信息', () => {
      const context = manager.generateContextInjection('test query');
      expect(context).toBe('没有找到相关上下文。');
    });

    it('应生成格式化的上下文文本', () => {
      manager.addNote('用户服务使用 REST API');
      manager.addNote('认证使用 OAuth2 + JWT');

      const context = manager.generateContextInjection('用户认证');
      expect(context).toContain('ContextKeep');
      expect(context).toContain('记忆总数');
    });
  });

  describe('clearMemory', () => {
    it('应清除所有记忆', async () => {
      manager.addNote('test note 1');
      manager.addNote('test note 2');
      expect(manager.getStats().totalRecords).toBe(2);

      await manager.clearMemory();
      expect(manager.getStats().totalRecords).toBe(0);
    });
  });
});
