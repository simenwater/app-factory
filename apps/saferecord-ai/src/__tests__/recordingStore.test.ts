/**
 * @fileoverview 录音 Store 单元测试
 */

import { useRecordingStore } from '@/store/recordingStore';
import { act } from '@testing-library/react';

describe('useRecordingStore', () => {
  beforeEach(() => {
    const store = useRecordingStore.getState();
    useRecordingStore.setState({
      recordings: [],
      status: 'idle',
      currentRecordingId: null,
      currentDuration: 0,
    });
  });

  describe('startRecording', () => {
    it('应创建新录音并将状态设为 recording', () => {
      const id = useRecordingStore.getState().startRecording();

      const state = useRecordingStore.getState();
      expect(state.status).toBe('recording');
      expect(state.currentRecordingId).toBe(id);
      expect(state.recordings).toHaveLength(1);
      expect(state.recordings[0].id).toBe(id);
      expect(state.recordings[0].transcriptionStatus).toBe('pending');
    });

    it('应将新录音置于列表顶部', () => {
      useRecordingStore.getState().startRecording();
      useRecordingStore.getState().stopRecording(null, 0);
      const secondId = useRecordingStore.getState().startRecording();

      const state = useRecordingStore.getState();
      expect(state.recordings[0].id).toBe(secondId);
      expect(state.recordings).toHaveLength(2);
    });
  });

  describe('pauseRecording / resumeRecording', () => {
    it('应切换录音暂停状态', () => {
      useRecordingStore.getState().startRecording();

      useRecordingStore.getState().pauseRecording();
      expect(useRecordingStore.getState().status).toBe('paused');

      useRecordingStore.getState().resumeRecording();
      expect(useRecordingStore.getState().status).toBe('recording');
    });
  });

  describe('stopRecording', () => {
    it('应更新录音数据并重置状态', () => {
      const id = useRecordingStore.getState().startRecording();
      useRecordingStore.getState().updateDuration(30);
      useRecordingStore.getState().stopRecording('blob:test', 1024);

      const state = useRecordingStore.getState();
      expect(state.status).toBe('stopped');
      expect(state.currentRecordingId).toBeNull();
      expect(state.currentDuration).toBe(0);

      const recording = state.recordings.find((r) => r.id === id);
      expect(recording?.audioUrl).toBe('blob:test');
      expect(recording?.fileSize).toBe(1024);
      expect(recording?.duration).toBe(30);
    });
  });

  describe('deleteRecording', () => {
    it('应从列表中移除录音', () => {
      const id = useRecordingStore.getState().startRecording();
      useRecordingStore.getState().stopRecording(null, 0);

      useRecordingStore.getState().deleteRecording(id);
      expect(useRecordingStore.getState().recordings).toHaveLength(0);
    });
  });

  describe('toggleFavorite', () => {
    it('应切换录音的收藏状态', () => {
      const id = useRecordingStore.getState().startRecording();
      useRecordingStore.getState().stopRecording(null, 0);

      expect(useRecordingStore.getState().recordings[0].isFavorite).toBe(false);

      useRecordingStore.getState().toggleFavorite(id);
      expect(useRecordingStore.getState().recordings[0].isFavorite).toBe(true);

      useRecordingStore.getState().toggleFavorite(id);
      expect(useRecordingStore.getState().recordings[0].isFavorite).toBe(false);
    });
  });

  describe('setTranscription', () => {
    it('应设置转录结果并更新状态', () => {
      const id = useRecordingStore.getState().startRecording();
      useRecordingStore.getState().stopRecording(null, 0);

      const segments = [
        {
          id: 'seg-0',
          startTime: 0,
          endTime: 5,
          text: '测试文本',
          confidence: 0.95,
        },
      ];

      useRecordingStore.getState().setTranscription(id, segments, '测试文本');

      const recording = useRecordingStore.getState().recordings.find((r) => r.id === id);
      expect(recording?.transcriptionStatus).toBe('completed');
      expect(recording?.segments).toEqual(segments);
      expect(recording?.fullText).toBe('测试文本');
    });
  });

  describe('updateSettings', () => {
    it('应部分更新应用设置', () => {
      useRecordingStore.getState().updateSettings({ theme: 'dark' });
      expect(useRecordingStore.getState().settings.theme).toBe('dark');
      expect(useRecordingStore.getState().settings.audioQuality).toBe(44.1);
    });
  });
});
