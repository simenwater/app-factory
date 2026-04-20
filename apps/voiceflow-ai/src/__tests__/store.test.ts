import { useStore } from '@/store/useStore';
import type { VoiceNote } from '@/types';

/**
 * @description Store 状态管理单元测试
 */
describe('useStore', () => {
  beforeEach(() => {
    const { setState } = useStore;
    setState({
      user: { id: 'test', subscription: 'free', usageCount: 0, usageLimit: 3 },
      notes: [],
      currentNote: null,
      recordingStatus: 'idle',
      rewriteStyle: 'summary',
      theme: 'light',
    });
  });

  const mockNote: VoiceNote = {
    id: 'note-1',
    title: '测试笔记',
    originalText: '原始文本',
    rewrittenText: '重写文本',
    style: 'summary',
    duration: 60,
    createdAt: new Date().toISOString(),
    language: 'chinese',
  };

  describe('笔记管理', () => {
    it('应能添加笔记', () => {
      useStore.getState().addNote(mockNote);
      expect(useStore.getState().notes).toHaveLength(1);
      expect(useStore.getState().notes[0].id).toBe('note-1');
    });

    it('添加笔记后应自动设为当前笔记', () => {
      useStore.getState().addNote(mockNote);
      expect(useStore.getState().currentNote?.id).toBe('note-1');
    });

    it('应能删除笔记', () => {
      useStore.getState().addNote(mockNote);
      useStore.getState().deleteNote('note-1');
      expect(useStore.getState().notes).toHaveLength(0);
    });

    it('删除当前笔记后应清除 currentNote', () => {
      useStore.getState().addNote(mockNote);
      useStore.getState().deleteNote('note-1');
      expect(useStore.getState().currentNote).toBeNull();
    });

    it('应能更新笔记', () => {
      useStore.getState().addNote(mockNote);
      useStore.getState().updateNote('note-1', { title: '修改后标题' });
      expect(useStore.getState().notes[0].title).toBe('修改后标题');
    });

    it('更新当前笔记时应同步 currentNote', () => {
      useStore.getState().addNote(mockNote);
      useStore.getState().updateNote('note-1', { title: '新标题' });
      expect(useStore.getState().currentNote?.title).toBe('新标题');
    });

    it('新笔记应插入到列表最前面', () => {
      const note2: VoiceNote = { ...mockNote, id: 'note-2', title: '第二条' };
      useStore.getState().addNote(mockNote);
      useStore.getState().addNote(note2);
      expect(useStore.getState().notes[0].id).toBe('note-2');
    });
  });

  describe('使用限制', () => {
    it('免费用户初始可以使用', () => {
      expect(useStore.getState().canUse()).toBe(true);
    });

    it('达到限制后不可使用', () => {
      useStore.getState().incrementUsage();
      useStore.getState().incrementUsage();
      useStore.getState().incrementUsage();
      expect(useStore.getState().canUse()).toBe(false);
    });

    it('升级后可以无限使用', () => {
      useStore.getState().incrementUsage();
      useStore.getState().incrementUsage();
      useStore.getState().incrementUsage();
      useStore.getState().upgradeSubscription('monthly');
      expect(useStore.getState().canUse()).toBe(true);
    });
  });

  describe('状态设置', () => {
    it('应能设置录音状态', () => {
      useStore.getState().setRecordingStatus('recording');
      expect(useStore.getState().recordingStatus).toBe('recording');
    });

    it('应能设置重写风格', () => {
      useStore.getState().setRewriteStyle('formal');
      expect(useStore.getState().rewriteStyle).toBe('formal');
    });

    it('应能设置当前笔记', () => {
      useStore.getState().setCurrentNote(mockNote);
      expect(useStore.getState().currentNote?.id).toBe('note-1');
    });

    it('应能清除当前笔记', () => {
      useStore.getState().setCurrentNote(mockNote);
      useStore.getState().setCurrentNote(null);
      expect(useStore.getState().currentNote).toBeNull();
    });
  });
});
