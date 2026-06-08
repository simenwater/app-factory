/**
 * @module embeddings.test
 * @description TextEmbedder 单元测试
 */

import { TextEmbedder } from '../../src/core/embeddings';

describe('TextEmbedder', () => {
  let embedder: TextEmbedder;

  beforeEach(() => {
    embedder = new TextEmbedder(1000, 128);
  });

  describe('tokenize', () => {
    it('应正确分词英文文本', () => {
      const tokens = embedder.tokenize('Hello World test');
      expect(tokens).toContain('hello');
      expect(tokens).toContain('world');
      expect(tokens).toContain('test');
    });

    it('应过滤掉单字符 token', () => {
      const tokens = embedder.tokenize('a b cd ef');
      expect(tokens).not.toContain('a');
      expect(tokens).not.toContain('b');
      expect(tokens).toContain('cd');
      expect(tokens).toContain('ef');
    });

    it('应处理空字符串', () => {
      const tokens = embedder.tokenize('');
      expect(tokens).toEqual([]);
    });

    it('应移除特殊字符', () => {
      const tokens = embedder.tokenize('function() { return true; }');
      expect(tokens).toContain('function');
      expect(tokens).toContain('return');
      expect(tokens).toContain('true');
    });

    it('应保留中文字符', () => {
      const tokens = embedder.tokenize('用户认证 测试');
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe('fit', () => {
    it('应从文档中构建词汇表', () => {
      embedder.fit([
        'function hello world',
        'hello typescript code',
        'world function test',
      ]);
      const state = embedder.serialize();
      expect(state.vocabulary.length).toBeGreaterThan(0);
      expect(state.documentCount).toBe(3);
    });

    it('应计算 IDF 值', () => {
      embedder.fit([
        'common rare_word_one',
        'common another_text',
        'common rare_word_two',
      ]);
      const state = embedder.serialize();
      const vocab = new Map(state.vocabulary);

      const commonEntry = vocab.get('common');
      const rareEntry = vocab.get('rare_word_one');
      expect(commonEntry).toBeDefined();
      expect(rareEntry).toBeDefined();
      if (commonEntry && rareEntry) {
        expect(rareEntry.idf).toBeGreaterThan(commonEntry.idf);
      }
    });
  });

  describe('embed', () => {
    beforeEach(() => {
      embedder.fit([
        'typescript function component react',
        'python class module import',
        'database query select insert',
        'api endpoint request response',
      ]);
    });

    it('应返回正确维度的向量', () => {
      const vector = embedder.embed('typescript function');
      expect(vector.length).toBe(128);
    });

    it('应返回归一化后的向量', () => {
      const vector = embedder.embed('typescript function test');
      const magnitude = Math.sqrt(
        vector.reduce((sum, v) => sum + v * v, 0)
      );
      expect(magnitude).toBeCloseTo(1.0, 2);
    });

    it('空文本应返回零向量', () => {
      const vector = embedder.embed('');
      expect(vector.every((v) => v === 0)).toBe(true);
    });

    it('相似文本应有较高的余弦相似度', () => {
      const v1 = embedder.embed('typescript function component');
      const v2 = embedder.embed('typescript component react');
      const v3 = embedder.embed('database query select');

      const sim12 = TextEmbedder.cosineSimilarity(v1, v2);
      const sim13 = TextEmbedder.cosineSimilarity(v1, v3);

      expect(sim12).toBeGreaterThan(sim13);
    });
  });

  describe('cosineSimilarity', () => {
    it('相同向量的相似度应为 1', () => {
      const v = [0.5, 0.5, 0.5, 0.5];
      const magnitude = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
      const normalized = v.map((x) => x / magnitude);
      expect(TextEmbedder.cosineSimilarity(normalized, normalized)).toBeCloseTo(
        1.0,
        5
      );
    });

    it('不同长度向量应返回 0', () => {
      expect(TextEmbedder.cosineSimilarity([1, 0], [1, 0, 0])).toBe(0);
    });
  });

  describe('serialization', () => {
    it('应正确序列化和反序列化', () => {
      embedder.fit([
        'hello world typescript',
        'react component function',
      ]);

      const state = embedder.serialize();
      const restored = TextEmbedder.deserialize(state);

      const original = embedder.embed('hello typescript');
      const restoredVec = restored.embed('hello typescript');

      expect(original).toEqual(restoredVec);
    });
  });
});
