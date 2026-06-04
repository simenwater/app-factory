/**
 * @fileoverview AI 转录服务
 * 集成 OpenAI Whisper API 实现语音转文字，支持多语言和时间轴同步
 */

import type { TranscriptionSegment, SupportedLanguage } from '@/types';

/** Whisper API 配置 */
interface TranscriptionConfig {
  /** API 端点 */
  apiEndpoint: string;
  /** API 密钥 */
  apiKey: string;
  /** 转录模型 */
  model: string;
  /** 响应格式 */
  responseFormat: 'verbose_json' | 'json' | 'text';
}

/** Whisper API 原始响应片段 */
interface WhisperSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  avg_logprob: number;
}

/** Whisper API 响应 */
interface WhisperResponse {
  text: string;
  segments: WhisperSegment[];
  language: string;
  duration: number;
}

/** 转录结果 */
export interface TranscriptionResult {
  /** 完整文本 */
  fullText: string;
  /** 时间轴片段 */
  segments: TranscriptionSegment[];
  /** 检测到的语言 */
  detectedLanguage: string;
  /** 音频时长 */
  duration: number;
}

/** 默认 API 配置 */
const defaultConfig: TranscriptionConfig = {
  apiEndpoint: '/api/transcribe',
  apiKey: '',
  model: 'whisper-1',
  responseFormat: 'verbose_json',
};

/**
 * 转录服务类
 * @description 封装 Whisper API 调用，处理音频上传和结果解析
 */
export class TranscriptionService {
  private config: TranscriptionConfig;

  constructor(config: Partial<TranscriptionConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * 将音频 Blob 转录为文字
   * @param audioBlob - 音频数据
   * @param language - 指定语言或自动检测
   * @returns 转录结果
   */
  async transcribe(
    audioBlob: Blob,
    language: SupportedLanguage = 'auto'
  ): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', this.config.model);
    formData.append('response_format', this.config.responseFormat);

    if (language !== 'auto') {
      formData.append('language', this.mapLanguageCode(language));
    }

    formData.append('timestamp_granularities[]', 'segment');

    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: this.config.apiKey
        ? { Authorization: `Bearer ${this.config.apiKey}` }
        : {},
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`转录失败: ${response.status} - ${errorText}`);
    }

    const data: WhisperResponse = await response.json();
    return this.parseResponse(data);
  }

  /**
   * 解析 Whisper API 响应为统一格式
   * @param response - API 原始响应
   * @returns 标准化转录结果
   */
  private parseResponse(response: WhisperResponse): TranscriptionResult {
    const segments: TranscriptionSegment[] = response.segments.map((seg) => ({
      id: `seg-${seg.id}`,
      startTime: seg.start,
      endTime: seg.end,
      text: seg.text.trim(),
      confidence: Math.exp(seg.avg_logprob),
    }));

    return {
      fullText: response.text,
      segments,
      detectedLanguage: response.language,
      duration: response.duration,
    };
  }

  /**
   * 将应用语言代码映射到 Whisper API 语言代码
   * @param language - 应用内语言代码
   * @returns Whisper API 语言代码
   */
  private mapLanguageCode(language: SupportedLanguage): string {
    const languageMap: Record<SupportedLanguage, string> = {
      zh: 'zh',
      en: 'en',
      ja: 'ja',
      ko: 'ko',
      es: 'es',
      fr: 'fr',
      de: 'de',
      auto: '',
    };
    return languageMap[language] || '';
  }

  /**
   * 检查剩余转录配额
   * @param usedMinutes - 已使用分钟数
   * @param totalMinutes - 总配额分钟数
   * @returns 是否还有剩余配额
   */
  static hasQuota(usedMinutes: number, totalMinutes: number): boolean {
    return usedMinutes < totalMinutes;
  }

  /**
   * 估算转录费用（基于 Whisper API 定价）
   * @param durationSeconds - 音频时长（秒）
   * @returns 预估费用（美元）
   */
  static estimateCost(durationSeconds: number): number {
    const minutes = Math.ceil(durationSeconds / 60);
    return minutes * 0.006;
  }
}

/**
 * 创建转录服务实例
 * @param config - 可选配置覆盖
 * @returns 转录服务实例
 */
export function createTranscriptionService(
  config?: Partial<TranscriptionConfig>
): TranscriptionService {
  return new TranscriptionService(config);
}
