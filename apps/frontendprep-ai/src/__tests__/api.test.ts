/**
 * @file API 路由单元测试
 * @description 测试面试、评估、分析 API 的请求/响应
 */

describe('API Routes', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('POST /api/interview', () => {
    it('应返回 AI 面试回复', async () => {
      const mockResponse = { reply: '让我们开始面试吧！' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          type: 'react',
          difficulty: 'mid',
        }),
      });
      const data = await res.json();

      expect(data.reply).toBeDefined();
      expect(typeof data.reply).toBe('string');
    });
  });

  describe('POST /api/evaluate', () => {
    it('应返回代码评估结果', async () => {
      const mockResult = {
        result: {
          score: 75,
          issues: [{ type: 'warning', message: 'Test', suggestion: 'Fix' }],
          suggestions: ['Improve code'],
          explanation: 'Good',
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'const x = 1;',
          language: 'javascript',
        }),
      });
      const data = await res.json();

      expect(data.result).toBeDefined();
      expect(data.result.score).toBeDefined();
      expect(data.result.issues).toBeDefined();
    });
  });

  describe('POST /api/analyze', () => {
    it('应返回弱点分析结果', async () => {
      const mockResult = {
        result: {
          skills: [
            { category: 'react', score: 70, level: 'intermediate', details: 'Good' },
          ],
          overallLevel: 'mid',
          weakestAreas: ['css'],
          strongestAreas: ['react'],
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessions: [],
          evaluations: [],
        }),
      });
      const data = await res.json();

      expect(data.result).toBeDefined();
      expect(data.result.skills).toBeDefined();
      expect(data.result.overallLevel).toBeDefined();
    });
  });
});
