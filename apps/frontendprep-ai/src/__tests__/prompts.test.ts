/**
 * @file Prompt 模板单元测试
 * @description 测试面试和代码评估的提示词生成
 */

import {
  getInterviewSystemPrompt,
  getCodeEvalSystemPrompt,
  getWeaknessAnalysisPrompt,
} from '@/lib/prompts';

describe('Prompt Templates', () => {
  describe('getInterviewSystemPrompt', () => {
    it('应生成包含面试类型的系统提示词', () => {
      const prompt = getInterviewSystemPrompt('react', 'mid');
      expect(prompt).toContain('React');
      expect(prompt).toContain('中级');
      expect(prompt).toContain('面试');
    });

    it('应生成包含难度级别的提示词', () => {
      const prompt = getInterviewSystemPrompt('javascript', 'senior');
      expect(prompt).toContain('高级');
      expect(prompt).toContain('JavaScript');
    });

    it('行为面试应包含行为题关键词', () => {
      const prompt = getInterviewSystemPrompt('behavioral', 'junior');
      expect(prompt).toContain('行为面试');
      expect(prompt).toContain('初级');
    });
  });

  describe('getCodeEvalSystemPrompt', () => {
    it('应包含指定的语言', () => {
      const prompt = getCodeEvalSystemPrompt('typescript');
      expect(prompt).toContain('typescript');
      expect(prompt).toContain('JSON');
    });

    it('应包含评估维度', () => {
      const prompt = getCodeEvalSystemPrompt('javascript');
      expect(prompt).toContain('性能');
      expect(prompt).toContain('可读性');
    });
  });

  describe('getWeaknessAnalysisPrompt', () => {
    it('应包含历史上下文', () => {
      const context = '## 面试记录\n- React 面试得分 70/100';
      const prompt = getWeaknessAnalysisPrompt(context);
      expect(prompt).toContain('React 面试得分');
      expect(prompt).toContain('JSON');
    });
  });
});
