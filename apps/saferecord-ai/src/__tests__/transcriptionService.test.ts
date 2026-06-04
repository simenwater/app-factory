/**
 * @fileoverview 转录服务单元测试
 */

import { TranscriptionService } from '@/lib/transcriptionService';

describe('TranscriptionService', () => {
  describe('hasQuota', () => {
    it('当已用时长小于总配额时应返回 true', () => {
      expect(TranscriptionService.hasQuota(5, 10)).toBe(true);
      expect(TranscriptionService.hasQuota(0, 10)).toBe(true);
    });

    it('当已用时长等于或超过总配额时应返回 false', () => {
      expect(TranscriptionService.hasQuota(10, 10)).toBe(false);
      expect(TranscriptionService.hasQuota(15, 10)).toBe(false);
    });
  });

  describe('estimateCost', () => {
    it('应基于 Whisper API 定价正确估算费用', () => {
      expect(TranscriptionService.estimateCost(60)).toBe(0.006);
      expect(TranscriptionService.estimateCost(120)).toBe(0.012);
      expect(TranscriptionService.estimateCost(90)).toBe(0.012);
    });

    it('不足一分钟按一分钟计费', () => {
      expect(TranscriptionService.estimateCost(30)).toBe(0.006);
      expect(TranscriptionService.estimateCost(1)).toBe(0.006);
    });
  });

  describe('transcribe', () => {
    it('应在 API 返回错误时抛出异常', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      const service = new TranscriptionService({ apiEndpoint: 'http://test/api' });
      const blob = new Blob(['test'], { type: 'audio/webm' });

      await expect(service.transcribe(blob, 'auto')).rejects.toThrow('转录失败');
    });

    it('应正确解析成功的 API 响应', async () => {
      const mockResponse = {
        text: '你好世界',
        segments: [
          { id: 0, start: 0, end: 2.5, text: '你好', avg_logprob: -0.1 },
          { id: 1, start: 2.5, end: 5.0, text: '世界', avg_logprob: -0.2 },
        ],
        language: 'zh',
        duration: 5.0,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const service = new TranscriptionService({ apiEndpoint: 'http://test/api' });
      const blob = new Blob(['test'], { type: 'audio/webm' });
      const result = await service.transcribe(blob, 'zh');

      expect(result.fullText).toBe('你好世界');
      expect(result.segments).toHaveLength(2);
      expect(result.segments[0].text).toBe('你好');
      expect(result.segments[0].startTime).toBe(0);
      expect(result.segments[0].endTime).toBe(2.5);
      expect(result.detectedLanguage).toBe('zh');
      expect(result.duration).toBe(5.0);
    });
  });
});
