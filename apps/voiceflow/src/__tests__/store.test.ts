import { useStore } from "@/store/useStore";

/**
 * @description 每次测试前重置 store
 */
beforeEach(() => {
  useStore.setState({
    notes: [],
    settings: {
      theme: "system",
      language: "zh-CN",
      defaultExportFormat: "markdown",
      subscription: "free",
      usageCount: 0,
      freeLimit: 3,
    },
  });
});

describe("useStore - notes", () => {
  it("should add a note and return id", () => {
    const id = useStore.getState().addNote({
      title: "测试笔记",
      fileName: "test.mp3",
      fileSize: 1024,
      duration: 60,
      transcript: "转录文本",
      summary: "摘要",
      keyPoints: ["要点"],
      actionItems: ["行动"],
      status: "completed",
    });

    expect(id).toBeDefined();
    expect(useStore.getState().notes).toHaveLength(1);
    expect(useStore.getState().notes[0].title).toBe("测试笔记");
  });

  it("should update a note", () => {
    const id = useStore.getState().addNote({
      title: "原始标题",
      fileName: "test.mp3",
      fileSize: 1024,
      duration: 60,
      transcript: "",
      summary: "",
      keyPoints: [],
      actionItems: [],
      status: "uploading",
    });

    useStore.getState().updateNote(id, {
      title: "更新后标题",
      summary: "新摘要",
    });

    const note = useStore.getState().notes.find((n) => n.id === id);
    expect(note?.title).toBe("更新后标题");
    expect(note?.summary).toBe("新摘要");
  });

  it("should delete a note", () => {
    const id = useStore.getState().addNote({
      title: "待删除",
      fileName: "test.mp3",
      fileSize: 1024,
      duration: 60,
      transcript: "",
      summary: "",
      keyPoints: [],
      actionItems: [],
      status: "completed",
    });

    useStore.getState().deleteNote(id);
    expect(useStore.getState().notes).toHaveLength(0);
  });

  it("should update note status", () => {
    const id = useStore.getState().addNote({
      title: "测试",
      fileName: "test.mp3",
      fileSize: 1024,
      duration: 60,
      transcript: "",
      summary: "",
      keyPoints: [],
      actionItems: [],
      status: "uploading",
    });

    useStore.getState().updateNoteStatus(id, "transcribing");
    expect(useStore.getState().notes[0].status).toBe("transcribing");

    useStore.getState().updateNoteStatus(id, "completed");
    expect(useStore.getState().notes[0].status).toBe("completed");
  });

  it("should add notes at the beginning", () => {
    useStore.getState().addNote({
      title: "第一条",
      fileName: "a.mp3",
      fileSize: 1024,
      duration: 30,
      transcript: "",
      summary: "",
      keyPoints: [],
      actionItems: [],
      status: "completed",
    });

    useStore.getState().addNote({
      title: "第二条",
      fileName: "b.mp3",
      fileSize: 2048,
      duration: 60,
      transcript: "",
      summary: "",
      keyPoints: [],
      actionItems: [],
      status: "completed",
    });

    expect(useStore.getState().notes[0].title).toBe("第二条");
    expect(useStore.getState().notes[1].title).toBe("第一条");
  });
});

describe("useStore - settings", () => {
  it("should update settings", () => {
    useStore.getState().updateSettings({ theme: "dark" });
    expect(useStore.getState().settings.theme).toBe("dark");
  });

  it("should set subscription plan", () => {
    useStore.getState().setSubscription("monthly");
    expect(useStore.getState().settings.subscription).toBe("monthly");
  });

  it("should increment usage count", () => {
    useStore.getState().incrementUsage();
    expect(useStore.getState().settings.usageCount).toBe(1);

    useStore.getState().incrementUsage();
    expect(useStore.getState().settings.usageCount).toBe(2);
  });
});

describe("useStore - canUseService", () => {
  it("should allow usage for free users under limit", () => {
    expect(useStore.getState().canUseService()).toBe(true);
  });

  it("should deny usage for free users at limit", () => {
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    expect(useStore.getState().canUseService()).toBe(false);
  });

  it("should always allow usage for paid users", () => {
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    useStore.getState().setSubscription("monthly");
    expect(useStore.getState().canUseService()).toBe(true);
  });

  it("should always allow usage for lifetime users", () => {
    useStore.setState({
      settings: {
        ...useStore.getState().settings,
        usageCount: 100,
        subscription: "lifetime",
      },
    });
    expect(useStore.getState().canUseService()).toBe(true);
  });
});
