import { useStore } from "@/store/useStore";

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      memos: [],
      currentMemo: null,
      settings: {
        darkMode: false,
        subscriptionTier: "free",
        language: "zh",
        defaultTone: "professional",
        defaultPlatform: "general",
        monthlyMinutesUsed: 0,
        monthlyMinutesLimit: 10,
      },
      isRecording: false,
      isTranscribing: false,
      isRewriting: false,
      recordingDuration: 0,
    });
  });

  describe("addMemo", () => {
    it("应该添加备忘录到列表开头", () => {
      const memo = {
        id: "test-1",
        title: "测试录音",
        originalText: "这是一段测试内容",
        duration: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useStore.getState().addMemo(memo);
      expect(useStore.getState().memos).toHaveLength(1);
      expect(useStore.getState().memos[0].id).toBe("test-1");
    });

    it("新备忘录应排在最前面", () => {
      const memo1 = {
        id: "test-1",
        title: "录音1",
        originalText: "内容1",
        duration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const memo2 = {
        id: "test-2",
        title: "录音2",
        originalText: "内容2",
        duration: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useStore.getState().addMemo(memo1);
      useStore.getState().addMemo(memo2);
      expect(useStore.getState().memos[0].id).toBe("test-2");
    });
  });

  describe("updateMemo", () => {
    it("应该更新指定备忘录", () => {
      const memo = {
        id: "test-1",
        title: "测试",
        originalText: "原文",
        duration: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useStore.getState().addMemo(memo);
      useStore.getState().updateMemo("test-1", {
        rewrittenText: "重写后的内容",
        toneStyle: "professional",
      });

      const updated = useStore.getState().memos[0];
      expect(updated.rewrittenText).toBe("重写后的内容");
      expect(updated.toneStyle).toBe("professional");
    });
  });

  describe("deleteMemo", () => {
    it("应该删除指定备忘录", () => {
      const memo = {
        id: "test-1",
        title: "测试",
        originalText: "内容",
        duration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useStore.getState().addMemo(memo);
      useStore.getState().deleteMemo("test-1");
      expect(useStore.getState().memos).toHaveLength(0);
    });

    it("如果删除的是当前备忘录，应清空 currentMemo", () => {
      const memo = {
        id: "test-1",
        title: "测试",
        originalText: "内容",
        duration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useStore.getState().addMemo(memo);
      useStore.getState().setCurrentMemo(memo);
      useStore.getState().deleteMemo("test-1");
      expect(useStore.getState().currentMemo).toBeNull();
    });
  });

  describe("toggleDarkMode", () => {
    it("应该切换深色模式", () => {
      expect(useStore.getState().settings.darkMode).toBe(false);
      useStore.getState().toggleDarkMode();
      expect(useStore.getState().settings.darkMode).toBe(true);
      useStore.getState().toggleDarkMode();
      expect(useStore.getState().settings.darkMode).toBe(false);
    });
  });

  describe("setDefaultTone", () => {
    it("应该设置默认语气风格", () => {
      useStore.getState().setDefaultTone("casual");
      expect(useStore.getState().settings.defaultTone).toBe("casual");
    });
  });

  describe("setDefaultPlatform", () => {
    it("应该设置默认平台格式", () => {
      useStore.getState().setDefaultPlatform("linkedin");
      expect(useStore.getState().settings.defaultPlatform).toBe("linkedin");
    });
  });

  describe("incrementMinutesUsed", () => {
    it("应该正确增加使用时间", () => {
      useStore.getState().incrementMinutesUsed(5);
      expect(useStore.getState().settings.monthlyMinutesUsed).toBe(5);
      useStore.getState().incrementMinutesUsed(3);
      expect(useStore.getState().settings.monthlyMinutesUsed).toBe(8);
    });
  });

  describe("setSubscriptionTier", () => {
    it("升级到 monthly 应设置 500 分钟限额", () => {
      useStore.getState().setSubscriptionTier("monthly");
      expect(useStore.getState().settings.subscriptionTier).toBe("monthly");
      expect(useStore.getState().settings.monthlyMinutesLimit).toBe(500);
    });

    it("降级到 free 应设置 10 分钟限额", () => {
      useStore.getState().setSubscriptionTier("monthly");
      useStore.getState().setSubscriptionTier("free");
      expect(useStore.getState().settings.monthlyMinutesLimit).toBe(10);
    });
  });

  describe("recording states", () => {
    it("应该正确设置录音状态", () => {
      useStore.getState().setRecording(true);
      expect(useStore.getState().isRecording).toBe(true);
    });

    it("应该正确设置转录状态", () => {
      useStore.getState().setTranscribing(true);
      expect(useStore.getState().isTranscribing).toBe(true);
    });

    it("应该正确设置重写状态", () => {
      useStore.getState().setRewriting(true);
      expect(useStore.getState().isRewriting).toBe(true);
    });

    it("应该正确设置录音时长", () => {
      useStore.getState().setRecordingDuration(120);
      expect(useStore.getState().recordingDuration).toBe(120);
    });
  });
});
