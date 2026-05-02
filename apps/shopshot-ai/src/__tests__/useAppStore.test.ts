import { useAppStore } from '@/store/useAppStore';
import type { ProductImage } from '@/types';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      currentImage: null,
      tasks: [],
      subscription: {
        plan: 'free',
        creditsUsed: 0,
        creditsTotal: 10,
        expiresAt: null,
      },
      darkMode: false,
    });
  });

  describe('setCurrentImage', () => {
    it('should set current image', () => {
      const image: ProductImage = {
        id: 'test-id',
        file: null,
        previewUrl: 'http://example.com/img.jpg',
        name: 'test.jpg',
        uploadedAt: '2024-01-01T00:00:00.000Z',
      };
      useAppStore.getState().setCurrentImage(image);
      expect(useAppStore.getState().currentImage).toEqual(image);
    });

    it('should clear current image when set to null', () => {
      useAppStore.getState().setCurrentImage({
        id: 'test-id',
        file: null,
        previewUrl: 'url',
        name: 'test.jpg',
        uploadedAt: '2024-01-01T00:00:00.000Z',
      });
      useAppStore.getState().setCurrentImage(null);
      expect(useAppStore.getState().currentImage).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should return null when no image is set', () => {
      const taskId = useAppStore.getState().createTask('multi-angle');
      expect(taskId).toBeNull();
    });

    it('should create a task when image is set', () => {
      useAppStore.getState().setCurrentImage({
        id: 'img-1',
        file: null,
        previewUrl: 'url',
        name: 'test.jpg',
        uploadedAt: '2024-01-01T00:00:00.000Z',
      });
      const taskId = useAppStore.getState().createTask('background-removal');
      expect(taskId).toBeDefined();
      expect(useAppStore.getState().tasks).toHaveLength(1);
      expect(useAppStore.getState().tasks[0].mode).toBe('background-removal');
      expect(useAppStore.getState().tasks[0].status).toBe('processing');
    });

    it('should return null when credits are insufficient for multi-angle', () => {
      useAppStore.setState({
        currentImage: {
          id: 'img-1',
          file: null,
          previewUrl: 'url',
          name: 'test.jpg',
          uploadedAt: '2024-01-01T00:00:00.000Z',
        },
        subscription: {
          plan: 'free',
          creditsUsed: 8,
          creditsTotal: 10,
          expiresAt: null,
        },
      });
      const taskId = useAppStore.getState().createTask('multi-angle');
      expect(taskId).toBeNull();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', () => {
      useAppStore.getState().setCurrentImage({
        id: 'img-1',
        file: null,
        previewUrl: 'url',
        name: 'test.jpg',
        uploadedAt: '2024-01-01T00:00:00.000Z',
      });
      const taskId = useAppStore.getState().createTask('resize')!;
      useAppStore.getState().updateTaskStatus(taskId, 'completed');
      expect(useAppStore.getState().tasks[0].status).toBe('completed');
    });

    it('should update task with error message', () => {
      useAppStore.getState().setCurrentImage({
        id: 'img-1',
        file: null,
        previewUrl: 'url',
        name: 'test.jpg',
        uploadedAt: '2024-01-01T00:00:00.000Z',
      });
      const taskId = useAppStore.getState().createTask('resize')!;
      useAppStore.getState().updateTaskStatus(taskId, 'error', '网络错误');
      expect(useAppStore.getState().tasks[0].status).toBe('error');
      expect(useAppStore.getState().tasks[0].error).toBe('网络错误');
    });
  });

  describe('toggleDarkMode', () => {
    it('should toggle dark mode on', () => {
      useAppStore.getState().toggleDarkMode();
      expect(useAppStore.getState().darkMode).toBe(true);
    });

    it('should toggle dark mode off', () => {
      useAppStore.getState().toggleDarkMode();
      useAppStore.getState().toggleDarkMode();
      expect(useAppStore.getState().darkMode).toBe(false);
    });
  });

  describe('useCredit', () => {
    it('should deduct credits successfully', () => {
      const result = useAppStore.getState().useCredit(3);
      expect(result).toBe(true);
      expect(useAppStore.getState().subscription.creditsUsed).toBe(3);
    });

    it('should reject when insufficient credits', () => {
      useAppStore.setState({
        subscription: {
          plan: 'free',
          creditsUsed: 9,
          creditsTotal: 10,
          expiresAt: null,
        },
      });
      const result = useAppStore.getState().useCredit(3);
      expect(result).toBe(false);
      expect(useAppStore.getState().subscription.creditsUsed).toBe(9);
    });

    it('should allow using exactly remaining credits', () => {
      useAppStore.setState({
        subscription: {
          plan: 'free',
          creditsUsed: 7,
          creditsTotal: 10,
          expiresAt: null,
        },
      });
      const result = useAppStore.getState().useCredit(3);
      expect(result).toBe(true);
      expect(useAppStore.getState().subscription.creditsUsed).toBe(10);
    });
  });

  describe('addTaskResults', () => {
    it('should add results and mark task completed', () => {
      useAppStore.getState().setCurrentImage({
        id: 'img-1',
        file: null,
        previewUrl: 'url',
        name: 'test.jpg',
        uploadedAt: '2024-01-01T00:00:00.000Z',
      });
      const taskId = useAppStore.getState().createTask('multi-angle')!;
      const results = [
        { id: 'r1', url: 'url1', mode: 'multi-angle' as const, angle: '正面', createdAt: new Date().toISOString() },
        { id: 'r2', url: 'url2', mode: 'multi-angle' as const, angle: '侧面', createdAt: new Date().toISOString() },
      ];
      useAppStore.getState().addTaskResults(taskId, results);
      expect(useAppStore.getState().tasks[0].results).toHaveLength(2);
      expect(useAppStore.getState().tasks[0].status).toBe('completed');
    });
  });
});
