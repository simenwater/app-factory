/**
 * @module vectorStore.test
 * @description VectorStore 单元测试
 */

import { VectorStore, RecordMetadata } from '../../src/core/vectorStore';

describe('VectorStore', () => {
  let store: VectorStore;

  /** 创建测试用元数据 */
  function createMetadata(overrides?: Partial<RecordMetadata>): RecordMetadata {
    return {
      type: 'file',
      summary: 'test summary',
      content: 'test content',
      ...overrides,
    };
  }

  /** 创建随机归一化向量 */
  function randomVector(dim = 128): number[] {
    const v = Array.from({ length: dim }, () => Math.random() - 0.5);
    const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    return v.map((x) => x / mag);
  }

  beforeEach(() => {
    store = new VectorStore(100);
  });

  describe('upsert', () => {
    it('应添加新记录', () => {
      store.upsert('test-1', randomVector(), createMetadata());
      expect(store.size).toBe(1);
    });

    it('应更新已有记录', () => {
      const v1 = randomVector();
      const v2 = randomVector();
      store.upsert('test-1', v1, createMetadata({ summary: 'v1' }));
      store.upsert('test-1', v2, createMetadata({ summary: 'v2' }));

      expect(store.size).toBe(1);
      const record = store.get('test-1');
      expect(record?.metadata.summary).toBe('v2');
    });

    it('更新时应保留 createdAt', () => {
      store.upsert('test-1', randomVector(), createMetadata());
      const created = store.get('test-1')?.createdAt;

      store.upsert('test-1', randomVector(), createMetadata());
      expect(store.get('test-1')?.createdAt).toBe(created);
    });
  });

  describe('search', () => {
    it('应返回最相似的结果', () => {
      const target = randomVector();
      const similar = target.map((v) => v + (Math.random() - 0.5) * 0.1);
      const dissimilar = randomVector();

      store.upsert('similar', similar, createMetadata({ summary: 'similar' }));
      store.upsert(
        'dissimilar',
        dissimilar,
        createMetadata({ summary: 'dissimilar' })
      );

      const results = store.search(target, 1);
      expect(results.length).toBe(1);
      expect(results[0].record.id).toBe('similar');
    });

    it('应遵守 topK 限制', () => {
      for (let i = 0; i < 20; i++) {
        store.upsert(`item-${i}`, randomVector(), createMetadata());
      }
      const results = store.search(randomVector(), 5);
      expect(results.length).toBe(5);
    });

    it('应支持元数据过滤', () => {
      store.upsert(
        'file-1',
        randomVector(),
        createMetadata({ type: 'file' })
      );
      store.upsert(
        'note-1',
        randomVector(),
        createMetadata({ type: 'note' })
      );

      const results = store.search(randomVector(), 10, (m) => m.type === 'note');
      expect(results.every((r) => r.record.metadata.type === 'note')).toBe(
        true
      );
    });

    it('结果应按相似度降序排列', () => {
      for (let i = 0; i < 10; i++) {
        store.upsert(`item-${i}`, randomVector(), createMetadata());
      }
      const results = store.search(randomVector(), 10);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });
  });

  describe('delete', () => {
    it('应删除指定记录', () => {
      store.upsert('test-1', randomVector(), createMetadata());
      expect(store.delete('test-1')).toBe(true);
      expect(store.size).toBe(0);
    });

    it('删除不存在的记录应返回 false', () => {
      expect(store.delete('nonexistent')).toBe(false);
    });
  });

  describe('deleteWhere', () => {
    it('应删除满足条件的记录', () => {
      store.upsert('file-1', randomVector(), createMetadata({ type: 'file' }));
      store.upsert('file-2', randomVector(), createMetadata({ type: 'file' }));
      store.upsert('note-1', randomVector(), createMetadata({ type: 'note' }));

      const count = store.deleteWhere((r) => r.metadata.type === 'file');
      expect(count).toBe(2);
      expect(store.size).toBe(1);
    });
  });

  describe('eviction', () => {
    it('超过容量时应淘汰最久未访问的记录', () => {
      const smallStore = new VectorStore(10);
      for (let i = 0; i < 15; i++) {
        smallStore.upsert(`item-${i}`, randomVector(), createMetadata());
      }
      expect(smallStore.size).toBeLessThanOrEqual(10);
    });
  });

  describe('getStats', () => {
    it('应返回正确的统计信息', () => {
      store.upsert(
        'file-1',
        randomVector(),
        createMetadata({ type: 'file', language: 'typescript' })
      );
      store.upsert(
        'note-1',
        randomVector(),
        createMetadata({ type: 'note' })
      );
      store.upsert(
        'file-2',
        randomVector(),
        createMetadata({ type: 'file', language: 'python' })
      );

      const stats = store.getStats();
      expect(stats.totalRecords).toBe(3);
      expect(stats.typeDistribution.file).toBe(2);
      expect(stats.typeDistribution.note).toBe(1);
      expect(stats.languageDistribution.typescript).toBe(1);
      expect(stats.languageDistribution.python).toBe(1);
    });
  });

  describe('serialization', () => {
    it('应正确序列化和反序列化', () => {
      const v = randomVector();
      store.upsert('test-1', v, createMetadata({ summary: 'persistent' }));
      store.upsert('test-2', randomVector(), createMetadata());

      const state = store.serialize();
      const restored = VectorStore.deserialize(state, 100);

      expect(restored.size).toBe(2);
      const record = restored.get('test-1');
      expect(record?.metadata.summary).toBe('persistent');
      expect(record?.vector).toEqual(v);
    });

    it('版本不匹配时应返回空存储', () => {
      const state = store.serialize();
      state.version = 999;
      const restored = VectorStore.deserialize(state);
      expect(restored.size).toBe(0);
    });
  });

  describe('clear', () => {
    it('应清除所有记录', () => {
      store.upsert('test-1', randomVector(), createMetadata());
      store.upsert('test-2', randomVector(), createMetadata());
      store.clear();
      expect(store.size).toBe(0);
    });
  });
});
