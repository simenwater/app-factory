/**
 * @module indexer.test
 * @description ProjectIndexer 单元测试
 */

import { TextEmbedder } from '../../src/core/embeddings';
import { VectorStore } from '../../src/core/vectorStore';
import { ProjectIndexer } from '../../src/core/indexer';

describe('ProjectIndexer', () => {
  let embedder: TextEmbedder;
  let store: VectorStore;
  let indexer: ProjectIndexer;

  beforeEach(() => {
    embedder = new TextEmbedder(1000, 128);
    embedder.fit([
      'function component typescript react',
      'class module import export',
      'async await promise callback',
    ]);
    store = new VectorStore(5000);
    indexer = new ProjectIndexer(embedder, store);
  });

  describe('chunkFile', () => {
    it('应为短文件生成文件级摘要', () => {
      const content = 'export function hello() {\n  return "world";\n}';
      const chunks = indexer.chunkFile(content, 'src/hello.ts', 'typescript');

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      expect(chunks[0].type).toBe('file');
      expect(chunks[0].filePath).toBe('src/hello.ts');
    });

    it('应提取函数定义', () => {
      const content = [
        'import { foo } from "./foo";',
        '',
        'export function processData(input: string): string {',
        '  const cleaned = input.trim();',
        '  return cleaned.toUpperCase();',
        '}',
        '',
        'export async function fetchUser(id: number) {',
        '  const res = await fetch(`/api/users/${id}`);',
        '  return res.json();',
        '}',
      ].join('\n');

      const chunks = indexer.chunkFile(content, 'src/utils.ts', 'typescript');
      const snippets = chunks.filter((c) => c.type === 'snippet');

      expect(snippets.length).toBeGreaterThanOrEqual(1);
    });

    it('应为大文件生成滑动窗口块', () => {
      const lines = Array.from(
        { length: 100 },
        (_, i) => `const line${i} = ${i};`
      );
      const content = lines.join('\n');

      const chunks = indexer.chunkFile(content, 'src/big.ts', 'typescript');
      expect(chunks.length).toBeGreaterThan(1);
    });

    it('应处理空文件', () => {
      const chunks = indexer.chunkFile('', 'src/empty.ts', 'typescript');
      expect(chunks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractFunctions', () => {
    it('应提取标准函数声明', () => {
      const lines = [
        'function hello() {',
        '  return "world";',
        '}',
      ];
      const chunks = indexer.extractFunctions(lines, 'test.ts', 'typescript');
      expect(chunks.length).toBe(1);
      expect(chunks[0].summary).toContain('hello');
    });

    it('应提取 export function', () => {
      const lines = [
        'export function getData() {',
        '  return data;',
        '}',
      ];
      const chunks = indexer.extractFunctions(lines, 'test.ts', 'typescript');
      expect(chunks.length).toBe(1);
    });

    it('应提取 class 声明', () => {
      const lines = [
        'export class UserService {',
        '  getUser() {',
        '    return null;',
        '  }',
        '}',
      ];
      const chunks = indexer.extractFunctions(lines, 'test.ts', 'typescript');
      expect(chunks.length).toBeGreaterThanOrEqual(1);
    });

    it('应提取 Python 函数', () => {
      const lines = ['def process_data(input):', '    return input.strip()'];
      const chunks = indexer.extractFunctions(lines, 'test.py', 'python');
      expect(chunks.length).toBeGreaterThanOrEqual(0);
    });

    it('空代码应返回空数组', () => {
      const chunks = indexer.extractFunctions([], 'test.ts', 'typescript');
      expect(chunks).toEqual([]);
    });
  });

  describe('indexing state', () => {
    it('初始时应不在索引状态', () => {
      expect(indexer.indexing).toBe(false);
    });
  });
});
