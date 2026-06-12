import { useStore } from "@/store/useStore";
import type { Recording } from "@/types";
import { getCurrentMonthResetDate } from "@/lib/utils";

/**
 * @description 重置 store 到初始状态以确保测试隔离
 */
function resetStore() {
  useStore.setState({
    recordings: [],
    settings: {
      subscription: "free",
      darkMode: false,
      language: "auto",
      email: "",
      usageCount: 0,
      usageResetDate: getCurrentMonthResetDate(),
    },
    currentStatus: "idle",
    currentTranscript: "",
    currentFormatted: "",
    selectedTemplate: "email",
    recordingDuration: 0,
    errorMessage: "",
  });
}

const mockRecording: Recording = {
  id: "rec-1",
  transcript: "Hello, this is a test recording.",
  formatted: "# Test\n\nThis is a formatted test recording.",
  template: "blog",
  language: "en",
  duration: 30,
  createdAt: new Date().toISOString(),
};

describe("Store - Recordings", () => {
  beforeEach(resetStore);

  it("should add a recording", () => {
    useStore.getState().addRecording(mockRecording);
    expect(useStore.getState().recordings).toHaveLength(1);
    expect(useStore.getState().recordings[0].id).toBe("rec-1");
  });

  it("should prepend new recordings (newest first)", () => {
    useStore.getState().addRecording(mockRecording);
    const second: Recording = { ...mockRecording, id: "rec-2" };
    useStore.getState().addRecording(second);
    expect(useStore.getState().recordings[0].id).toBe("rec-2");
    expect(useStore.getState().recordings[1].id).toBe("rec-1");
  });

  it("should delete a recording", () => {
    useStore.getState().addRecording(mockRecording);
    useStore.getState().deleteRecording("rec-1");
    expect(useStore.getState().recordings).toHaveLength(0);
  });

  it("should clear all recordings", () => {
    useStore.getState().addRecording(mockRecording);
    useStore.getState().addRecording({ ...mockRecording, id: "rec-2" });
    useStore.getState().clearRecordings();
    expect(useStore.getState().recordings).toHaveLength(0);
  });
});

describe("Store - Current State", () => {
  beforeEach(resetStore);

  it("should set status", () => {
    useStore.getState().setStatus("recording");
    expect(useStore.getState().currentStatus).toBe("recording");
  });

  it("should set transcript", () => {
    useStore.getState().setCurrentTranscript("hello world");
    expect(useStore.getState().currentTranscript).toBe("hello world");
  });

  it("should set formatted", () => {
    useStore.getState().setCurrentFormatted("# Hello World");
    expect(useStore.getState().currentFormatted).toBe("# Hello World");
  });

  it("should set selected template", () => {
    useStore.getState().setSelectedTemplate("todo");
    expect(useStore.getState().selectedTemplate).toBe("todo");
  });

  it("should set recording duration", () => {
    useStore.getState().setRecordingDuration(45);
    expect(useStore.getState().recordingDuration).toBe(45);
  });

  it("should reset current state", () => {
    useStore.getState().setStatus("done");
    useStore.getState().setCurrentTranscript("test");
    useStore.getState().setCurrentFormatted("formatted");
    useStore.getState().setRecordingDuration(10);
    useStore.getState().setErrorMessage("error");

    useStore.getState().resetCurrent();

    expect(useStore.getState().currentStatus).toBe("idle");
    expect(useStore.getState().currentTranscript).toBe("");
    expect(useStore.getState().currentFormatted).toBe("");
    expect(useStore.getState().recordingDuration).toBe(0);
    expect(useStore.getState().errorMessage).toBe("");
  });
});

describe("Store - Settings", () => {
  beforeEach(resetStore);

  it("should update settings", () => {
    useStore.getState().updateSettings({ email: "test@example.com" });
    expect(useStore.getState().settings.email).toBe("test@example.com");
  });

  it("should toggle dark mode", () => {
    useStore.getState().updateSettings({ darkMode: true });
    expect(useStore.getState().settings.darkMode).toBe(true);
  });

  it("should set subscription", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().settings.subscription).toBe("pro");
  });
});

describe("Store - Usage Limits", () => {
  beforeEach(resetStore);

  it("should return false when under limit", () => {
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });

  it("should increment usage count", () => {
    useStore.getState().incrementUsage();
    expect(useStore.getState().settings.usageCount).toBe(1);
  });

  it("should return true when 3 uses reached", () => {
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    expect(useStore.getState().isFreeLimitReached()).toBe(true);
  });

  it("should return false for pro users regardless of usage", () => {
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    useStore.getState().incrementUsage();
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().isFreeLimitReached()).toBe(false);
  });

  it("should return correct remaining free uses", () => {
    expect(useStore.getState().getRemainingFreeUses()).toBe(3);
    useStore.getState().incrementUsage();
    expect(useStore.getState().getRemainingFreeUses()).toBe(2);
    useStore.getState().incrementUsage();
    expect(useStore.getState().getRemainingFreeUses()).toBe(1);
    useStore.getState().incrementUsage();
    expect(useStore.getState().getRemainingFreeUses()).toBe(0);
  });

  it("should return Infinity for pro users", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().getRemainingFreeUses()).toBe(Infinity);
  });
});
