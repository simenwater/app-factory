/**
 * @class AudioRecorder
 * 封装 MediaRecorder API 的音频录制工具类
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * @method start
   * 开始录音
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(1000);
  }

  /**
   * @method stop
   * 停止录音并返回音频 Blob
   * @returns {Promise<Blob>} 录制的音频数据
   */
  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("未在录音中"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * @method cleanup
   * 释放媒体资源
   */
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  /**
   * @method isRecording
   * 是否正在录音
   * @returns {boolean}
   */
  get isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}
