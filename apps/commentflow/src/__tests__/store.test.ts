/**
 * @fileoverview Zustand store 单元测试
 */

import { useStore } from '@/store/useStore';

describe('CommentFlow Store', () => {
  beforeEach(() => {
    useStore.setState({
      comments: useStore.getState().comments,
      projects: useStore.getState().projects,
    });
  });

  describe('评论管理', () => {
    it('应当能添加新评论', () => {
      const initial = useStore.getState().comments.length;
      useStore.getState().addComment({
        id: 'test-c1',
        projectId: 'p1',
        author: { id: 'u1', name: 'Test User', email: 'test@example.com', role: 'member' },
        content: '测试评论',
        element: {
          selector: 'div.test',
          xpath: '/html/body/div',
          tagName: 'DIV',
          textContent: 'test',
        },
        pageUrl: 'https://test.com',
        status: 'open',
        priority: 'medium',
        category: 'bug',
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      expect(useStore.getState().comments.length).toBe(initial + 1);
      expect(useStore.getState().comments[0].id).toBe('test-c1');
    });

    it('应当能更新评论状态', () => {
      const commentId = useStore.getState().comments[0].id;
      useStore.getState().updateCommentStatus(commentId, 'resolved');
      const updated = useStore.getState().comments.find((c) => c.id === commentId);
      expect(updated?.status).toBe('resolved');
    });

    it('应当能删除评论', () => {
      const initial = useStore.getState().comments.length;
      const commentId = useStore.getState().comments[0].id;
      useStore.getState().deleteComment(commentId);
      expect(useStore.getState().comments.length).toBe(initial - 1);
    });

    it('应当能分配评论给用户', () => {
      const commentId = useStore.getState().comments[0].id;
      useStore.getState().assignComment(commentId, 'u2');
      const updated = useStore.getState().comments.find((c) => c.id === commentId);
      expect(updated?.assignee?.id).toBe('u2');
    });

    it('应当能添加回复到评论', () => {
      const commentId = useStore.getState().comments[0].id;
      const initialReplies = useStore.getState().comments.find((c) => c.id === commentId)?.replies.length ?? 0;
      useStore.getState().addReply(commentId, {
        id: 'reply-test',
        author: { id: 'u1', name: 'Test', email: 'test@example.com', role: 'member' },
        content: '测试回复',
        createdAt: new Date().toISOString(),
      });
      const updated = useStore.getState().comments.find((c) => c.id === commentId);
      expect(updated?.replies.length).toBe(initialReplies + 1);
    });
  });

  describe('项目管理', () => {
    it('应当能添加新项目', () => {
      const initial = useStore.getState().projects.length;
      useStore.getState().addProject({
        id: 'test-p1',
        name: 'Test Project',
        url: 'https://test.com',
        members: [],
        commentCount: 0,
        openCommentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      expect(useStore.getState().projects.length).toBe(initial + 1);
    });
  });

  describe('集成管理', () => {
    it('应当能切换集成启用状态', () => {
      const integrationId = useStore.getState().integrations[0].id;
      const initial = useStore.getState().integrations[0].enabled;
      useStore.getState().toggleIntegration(integrationId);
      expect(useStore.getState().integrations[0].enabled).toBe(!initial);
    });
  });

  describe('通知管理', () => {
    it('应当能标记单条通知已读', () => {
      const notificationId = useStore.getState().notifications[0].id;
      useStore.getState().markNotificationRead(notificationId);
      expect(useStore.getState().notifications.find((n) => n.id === notificationId)?.read).toBe(true);
    });

    it('应当能标记全部通知已读', () => {
      useStore.getState().markAllNotificationsRead();
      const allRead = useStore.getState().notifications.every((n) => n.read);
      expect(allRead).toBe(true);
    });
  });

  describe('主题切换', () => {
    it('应当能在浅色和深色模式之间切换', () => {
      const initial = useStore.getState().theme;
      useStore.getState().toggleTheme();
      expect(useStore.getState().theme).toBe(initial === 'light' ? 'dark' : 'light');
    });
  });
});
