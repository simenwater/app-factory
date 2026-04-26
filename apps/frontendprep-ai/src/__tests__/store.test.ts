/**
 * @file Zustand Store 单元测试
 * @description 测试核心状态管理逻辑
 */

import { useStore } from '@/store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    const { setState } = useStore;
    setState({
      user: {
        interviewCount: 0,
        maxFreeInterviews: 3,
        subscription: 'free',
        practicePlans: [],
      },
      sessions: [],
      currentSession: null,
      lastCodeEval: null,
      darkMode: false,
    });
  });

  describe('createSession', () => {
    it('应创建新的面试会话并增加面试计数', () => {
      const { createSession } = useStore.getState();
      const session = createSession('react', 'mid');

      expect(session).toBeDefined();
      expect(session.type).toBe('react');
      expect(session.difficulty).toBe('mid');
      expect(session.messages).toEqual([]);

      const state = useStore.getState();
      expect(state.currentSession).not.toBeNull();
      expect(state.user.interviewCount).toBe(1);
    });
  });

  describe('addMessage', () => {
    it('应向当前会话添加消息', () => {
      const { createSession, addMessage } = useStore.getState();
      createSession('javascript', 'junior');

      addMessage({
        id: 'msg1',
        role: 'user',
        content: 'Hello',
        timestamp: Date.now(),
      });

      const state = useStore.getState();
      expect(state.currentSession?.messages).toHaveLength(1);
      expect(state.currentSession?.messages[0].content).toBe('Hello');
    });

    it('无当前会话时不应添加消息', () => {
      const { addMessage } = useStore.getState();
      addMessage({
        id: 'msg1',
        role: 'user',
        content: 'Hello',
        timestamp: Date.now(),
      });

      const state = useStore.getState();
      expect(state.currentSession).toBeNull();
    });
  });

  describe('endSession', () => {
    it('应结束当前会话并移至历史记录', () => {
      const { createSession, endSession } = useStore.getState();
      createSession('css', 'senior');
      endSession();

      const state = useStore.getState();
      expect(state.currentSession).toBeNull();
      expect(state.sessions).toHaveLength(1);
      expect(state.sessions[0].endedAt).toBeDefined();
    });
  });

  describe('canStartInterview', () => {
    it('免费用户未超额时应返回 true', () => {
      const { canStartInterview } = useStore.getState();
      expect(canStartInterview()).toBe(true);
    });

    it('免费用户超额时应返回 false', () => {
      const { setState } = useStore;
      setState({
        user: {
          interviewCount: 3,
          maxFreeInterviews: 3,
          subscription: 'free',
          practicePlans: [],
        },
      });

      const { canStartInterview } = useStore.getState();
      expect(canStartInterview()).toBe(false);
    });

    it('Pro 用户应始终返回 true', () => {
      const { setState } = useStore;
      setState({
        user: {
          interviewCount: 100,
          maxFreeInterviews: 3,
          subscription: 'pro',
          practicePlans: [],
        },
      });

      const { canStartInterview } = useStore.getState();
      expect(canStartInterview()).toBe(true);
    });
  });

  describe('setSubscription', () => {
    it('应正确更新订阅等级', () => {
      const { setSubscription } = useStore.getState();
      setSubscription('pro');

      const state = useStore.getState();
      expect(state.user.subscription).toBe('pro');
    });
  });

  describe('toggleDarkMode', () => {
    it('应切换深色模式', () => {
      const { toggleDarkMode } = useStore.getState();
      expect(useStore.getState().darkMode).toBe(false);

      toggleDarkMode();
      expect(useStore.getState().darkMode).toBe(true);

      toggleDarkMode();
      expect(useStore.getState().darkMode).toBe(false);
    });
  });

  describe('setCodeEval', () => {
    it('应存储代码评估结果', () => {
      const { setCodeEval } = useStore.getState();
      const result = {
        score: 85,
        issues: [],
        suggestions: ['Good code!'],
        explanation: 'Well done',
      };
      setCodeEval(result);

      expect(useStore.getState().lastCodeEval).toEqual(result);
    });
  });

  describe('toggleTask', () => {
    it('应切换练习任务的完成状态', () => {
      const { setState } = useStore;
      setState({
        user: {
          interviewCount: 0,
          maxFreeInterviews: 3,
          subscription: 'free',
          practicePlans: [
            {
              id: 'plan1',
              title: 'Test Plan',
              description: '',
              tasks: [
                {
                  id: 'task1',
                  title: 'Task 1',
                  description: '',
                  category: 'react',
                  difficulty: 'mid',
                  completed: false,
                },
              ],
              estimatedDays: 7,
              difficulty: 'mid',
              generatedAt: Date.now(),
            },
          ],
        },
      });

      const { toggleTask } = useStore.getState();
      toggleTask('plan1', 'task1');

      const task = useStore.getState().user.practicePlans[0].tasks[0];
      expect(task.completed).toBe(true);

      toggleTask('plan1', 'task1');
      const taskAfter = useStore.getState().user.practicePlans[0].tasks[0];
      expect(taskAfter.completed).toBe(false);
    });
  });
});
