import { useStore } from "@/store/useStore";
import type { VoiceNote } from "@/types";

/**
 * @description Store 单元测试
 */
describe("VoicePolish Store", () => {
  beforeEach(() => {
    const { getState } = useStore;
    const state = getState();
    state.notes.forEach((n) => state.removeNote(n.id));
    state.setCurrentTranscript("");
    state.setRecordingStatus("idle");
    state.setRecordingDuration(0);
    state.setIsPolishing(false);
    state.setError(null);
  });

  it("should have correct initial state", () => {
    const state = useStore.getState();
    expect(state.notes).toEqual([]);
    expect(state.currentTranscript).toBe("");
    expect(state.recordingStatus).toBe("idle");
    expect(state.isPolishing).toBe(false);
    expect(state.settings.subscriptionTier).toBe("free");
  });

  it("should add and remove notes", () => {
    const note: VoiceNote = {
      id: "test-1",
      title: "Test Note",
      rawTranscript: "Hello world",
      polishedOutputs: [],
      duration: 60,
      createdAt: new Date().toISOString(),
    };

    useStore.getState().addNote(note);
    expect(useStore.getState().notes).toHaveLength(1);
    expect(useStore.getState().notes[0].id).toBe("test-1");

    useStore.getState().removeNote("test-1");
    expect(useStore.getState().notes).toHaveLength(0);
  });

  it("should toggle dark mode", () => {
    expect(useStore.getState().settings.darkMode).toBe(false);
    useStore.getState().toggleDarkMode();
    expect(useStore.getState().settings.darkMode).toBe(true);
    useStore.getState().toggleDarkMode();
    expect(useStore.getState().settings.darkMode).toBe(false);
  });

  it("should set subscription tier and update minutes limit", () => {
    useStore.getState().setSubscriptionTier("pro");
    expect(useStore.getState().settings.subscriptionTier).toBe("pro");
    expect(useStore.getState().settings.monthlyMinutesLimit).toBe(600);

    useStore.getState().setSubscriptionTier("free");
    expect(useStore.getState().settings.subscriptionTier).toBe("free");
    expect(useStore.getState().settings.monthlyMinutesLimit).toBe(30);
  });

  it("should track minutes usage", () => {
    useStore.getState().addMinutesUsed(5);
    expect(useStore.getState().settings.monthlyMinutesUsed).toBe(5);

    useStore.getState().addMinutesUsed(3);
    expect(useStore.getState().settings.monthlyMinutesUsed).toBe(8);

    useStore.getState().resetMonthlyUsage();
    expect(useStore.getState().settings.monthlyMinutesUsed).toBe(0);
  });

  it("should set current transcript", () => {
    useStore.getState().setCurrentTranscript("test transcript");
    expect(useStore.getState().currentTranscript).toBe("test transcript");
  });

  it("should set recording status", () => {
    useStore.getState().setRecordingStatus("recording");
    expect(useStore.getState().recordingStatus).toBe("recording");
  });

  it("should add polished output to a note", () => {
    const note: VoiceNote = {
      id: "test-2",
      title: "Test",
      rawTranscript: "Hello",
      polishedOutputs: [],
      duration: 30,
      createdAt: new Date().toISOString(),
    };

    useStore.getState().addNote(note);
    useStore.getState().addPolishedOutput("test-2", {
      id: "output-1",
      format: "email",
      content: "Polished email content",
      createdAt: new Date().toISOString(),
    });

    const updated = useStore.getState().notes.find((n) => n.id === "test-2");
    expect(updated?.polishedOutputs).toHaveLength(1);
    expect(updated?.polishedOutputs[0].format).toBe("email");
  });

  it("should set selected format", () => {
    useStore.getState().setSelectedFormat("blog");
    expect(useStore.getState().selectedFormat).toBe("blog");
  });

  it("should set language", () => {
    useStore.getState().setLanguage("en");
    expect(useStore.getState().settings.language).toBe("en");
  });
});
