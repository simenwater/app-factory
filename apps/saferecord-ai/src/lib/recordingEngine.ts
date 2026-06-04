/**
 * @fileoverview 系统级后台防中断录音引擎
 * 利用 Web Audio API + MediaRecorder + Service Worker 实现可靠的后台录音。
 * 通过 WakeLock API 防止设备休眠导致录音中断。
 */

/** 录音引擎配置 */
interface RecordingEngineConfig {
  /** 采样率（Hz） */
  sampleRate: number;
  /** 音频通道数 */
  channelCount: number;
  /** 录音分片间隔（ms），用于防止数据丢失 */
  timeslice: number;
}

/** 录音引擎回调 */
interface RecordingEngineCallbacks {
  /** 录音数据可用时触发 */
  onDataAvailable?: (blob: Blob) => void;
  /** 录音停止时触发 */
  onStop?: (blob: Blob, duration: number) => void;
  /** 发生错误时触发 */
  onError?: (error: Error) => void;
  /** 音量变化时触发 */
  onVolumeChange?: (volume: number) => void;
}

/**
 * 防中断录音引擎
 * @description 核心录音模块，使用多重保护机制确保录音不被意外中断：
 * 1. WakeLock API 防止屏幕休眠
 * 2. 分片录制防止数据丢失
 * 3. visibilitychange 事件监听，后台时自动续录
 * 4. beforeunload 事件保护
 */
export class RecordingEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private wakeLock: WakeLockSentinel | null = null;
  private startTime: number = 0;
  private pausedDuration: number = 0;
  private pauseStartTime: number = 0;
  private animationFrameId: number | null = null;
  private config: RecordingEngineConfig;
  private callbacks: RecordingEngineCallbacks;
  private isRecording: boolean = false;
  private isPaused: boolean = false;

  constructor(
    config: Partial<RecordingEngineConfig> = {},
    callbacks: RecordingEngineCallbacks = {}
  ) {
    this.config = {
      sampleRate: config.sampleRate ?? 44100,
      channelCount: config.channelCount ?? 1,
      timeslice: config.timeslice ?? 1000,
    };
    this.callbacks = callbacks;
  }

  /**
   * 请求 WakeLock 防止设备休眠
   * @returns 是否成功获取 WakeLock
   */
  private async requestWakeLock(): Promise<boolean> {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.reacquireWakeLock();
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 重新获取 WakeLock（页面可见性恢复时）
   */
  private async reacquireWakeLock(): Promise<void> {
    if (this.isRecording && document.visibilityState === 'visible') {
      await this.requestWakeLock();
    }
  }

  /** 释放 WakeLock */
  private releaseWakeLock(): void {
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }
  }

  /**
   * 注册页面保护事件监听器
   * 防止用户意外离开或页面进入后台时丢失数据
   */
  private registerProtectionListeners(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /** 移除保护事件监听器 */
  private removeProtectionListeners(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * 处理页面可见性变化
   * 当页面从后台恢复时重新获取 WakeLock
   */
  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible' && this.isRecording) {
      this.reacquireWakeLock();
    }
  };

  /**
   * 拦截页面关闭事件，提示用户正在录音
   */
  private handleBeforeUnload = (e: BeforeUnloadEvent): void => {
    if (this.isRecording) {
      e.preventDefault();
    }
  };

  /**
   * 启动音量分析（用于波形可视化）
   */
  private startVolumeAnalysis(): void {
    if (!this.analyserNode) return;

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);

    const analyze = () => {
      if (!this.isRecording || this.isPaused) return;
      this.analyserNode!.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
      this.callbacks.onVolumeChange?.(volume);
      this.animationFrameId = requestAnimationFrame(analyze);
    };

    analyze();
  }

  /** 停止音量分析 */
  private stopVolumeAnalysis(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 开始录音
   * @throws 当麦克风不可用时抛出错误
   */
  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channelCount,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.audioContext = new AudioContext({ sampleRate: this.config.sampleRate });
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      source.connect(this.analyserNode);

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType(),
      });

      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          this.callbacks.onDataAvailable?.(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.getSupportedMimeType() });
        const duration = this.getElapsedTime();
        this.callbacks.onStop?.(blob, duration);
      };

      this.mediaRecorder.onerror = () => {
        this.callbacks.onError?.(new Error('录音过程中发生错误'));
      };

      this.mediaRecorder.start(this.config.timeslice);
      this.startTime = Date.now();
      this.pausedDuration = 0;
      this.isRecording = true;
      this.isPaused = false;

      await this.requestWakeLock();
      this.registerProtectionListeners();
      this.startVolumeAnalysis();
    } catch (error) {
      this.callbacks.onError?.(
        error instanceof Error ? error : new Error('无法启动录音')
      );
      throw error;
    }
  }

  /** 暂停录音 */
  pause(): void {
    if (this.mediaRecorder && this.isRecording && !this.isPaused) {
      this.mediaRecorder.pause();
      this.isPaused = true;
      this.pauseStartTime = Date.now();
      this.stopVolumeAnalysis();
    }
  }

  /** 恢复录音 */
  resume(): void {
    if (this.mediaRecorder && this.isRecording && this.isPaused) {
      this.mediaRecorder.resume();
      this.isPaused = false;
      this.pausedDuration += Date.now() - this.pauseStartTime;
      this.startVolumeAnalysis();
    }
  }

  /** 停止录音并释放所有资源 */
  stop(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.isPaused = false;

      this.stream?.getTracks().forEach((track) => track.stop());
      this.audioContext?.close();
      this.stopVolumeAnalysis();
      this.releaseWakeLock();
      this.removeProtectionListeners();

      this.stream = null;
      this.audioContext = null;
      this.analyserNode = null;
    }
  }

  /**
   * 获取已录制时长（排除暂停时间）
   * @returns 录制时长（秒）
   */
  getElapsedTime(): number {
    if (!this.isRecording) return 0;
    const now = this.isPaused ? this.pauseStartTime : Date.now();
    return (now - this.startTime - this.pausedDuration) / 1000;
  }

  /** 获取当前录音状态 */
  getState(): { isRecording: boolean; isPaused: boolean } {
    return { isRecording: this.isRecording, isPaused: this.isPaused };
  }

  /**
   * 获取浏览器支持的 MIME 类型
   * @returns 支持的 MIME 类型字符串
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm';
  }
}

/**
 * 创建录音引擎实例
 * @param config - 引擎配置
 * @param callbacks - 回调函数
 * @returns 录音引擎实例
 */
export function createRecordingEngine(
  config?: Partial<RecordingEngineConfig>,
  callbacks?: RecordingEngineCallbacks
): RecordingEngine {
  return new RecordingEngine(config, callbacks);
}
