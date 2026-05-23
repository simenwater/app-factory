/**
 * @fileoverview Zustand Store 单元测试
 */

import { useStore } from "@/store/useStore";
import type { LeadSheet } from "@/types";

const mockSheet: LeadSheet = {
  id: "test-1",
  title: "Test Sheet",
  composer: "AI Generated",
  style: "jazz-swing",
  key: "C",
  timeSignature: [4, 4],
  tempo: 140,
  measures: [
    {
      chords: [{ root: "C", accidental: "", quality: "major7", beats: 4 }],
      melody: [{ name: "E", accidental: "", octave: 4, duration: "quarter" }],
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  isFavorite: false,
  tags: ["jazz-swing", "C"],
};

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      sheets: [],
      activeSheet: null,
      generationsThisMonth: 0,
      playback: {
        isPlaying: false,
        currentMeasure: 0,
        currentBeat: 0,
        tempo: 140,
        loop: true,
        style: "jazz-swing",
        volume: 0.8,
      },
      settings: {
        theme: "dark",
        defaultTempo: 140,
        defaultStyle: "jazz-swing",
        defaultKey: "C",
        defaultTimeSignature: [4, 4],
        metronomeEnabled: false,
        countInBars: 0,
        subscription: "free",
      },
    });
  });

  describe("sheet management", () => {
    it("should add a sheet", () => {
      useStore.getState().addSheet(mockSheet);
      expect(useStore.getState().sheets).toHaveLength(1);
      expect(useStore.getState().sheets[0].id).toBe("test-1");
    });

    it("should remove a sheet", () => {
      useStore.getState().addSheet(mockSheet);
      useStore.getState().removeSheet("test-1");
      expect(useStore.getState().sheets).toHaveLength(0);
    });

    it("should clear activeSheet when removing the active sheet", () => {
      useStore.getState().addSheet(mockSheet);
      useStore.getState().setActiveSheet(mockSheet);
      useStore.getState().removeSheet("test-1");
      expect(useStore.getState().activeSheet).toBeNull();
    });

    it("should update a sheet", () => {
      useStore.getState().addSheet(mockSheet);
      useStore.getState().updateSheet("test-1", { title: "Updated Title" });
      expect(useStore.getState().sheets[0].title).toBe("Updated Title");
    });

    it("should toggle favorite", () => {
      useStore.getState().addSheet(mockSheet);
      useStore.getState().toggleFavorite("test-1");
      expect(useStore.getState().sheets[0].isFavorite).toBe(true);

      useStore.getState().toggleFavorite("test-1");
      expect(useStore.getState().sheets[0].isFavorite).toBe(false);
    });

    it("should set sheets list", () => {
      const sheets = [mockSheet, { ...mockSheet, id: "test-2", title: "Second" }];
      useStore.getState().setSheets(sheets);
      expect(useStore.getState().sheets).toHaveLength(2);
    });
  });

  describe("playback", () => {
    it("should toggle playback", () => {
      expect(useStore.getState().playback.isPlaying).toBe(false);
      useStore.getState().togglePlayback();
      expect(useStore.getState().playback.isPlaying).toBe(true);
      useStore.getState().togglePlayback();
      expect(useStore.getState().playback.isPlaying).toBe(false);
    });

    it("should update playback state", () => {
      useStore.getState().setPlayback({ tempo: 180, style: "jazz-bossa" });
      expect(useStore.getState().playback.tempo).toBe(180);
      expect(useStore.getState().playback.style).toBe("jazz-bossa");
    });

    it("should set current position", () => {
      useStore.getState().setCurrentPosition(5, 2);
      expect(useStore.getState().playback.currentMeasure).toBe(5);
      expect(useStore.getState().playback.currentBeat).toBe(2);
    });
  });

  describe("settings", () => {
    it("should update settings", () => {
      useStore.getState().updateSettings({ theme: "light", defaultTempo: 120 });
      expect(useStore.getState().settings.theme).toBe("light");
      expect(useStore.getState().settings.defaultTempo).toBe(120);
    });
  });

  describe("generation limits", () => {
    it("should increment generation count", () => {
      useStore.getState().incrementGenerations();
      expect(useStore.getState().generationsThisMonth).toBe(1);
    });

    it("should allow generation when under limit (free tier)", () => {
      expect(useStore.getState().canGenerate()).toBe(true);
    });

    it("should block generation when at limit (free tier)", () => {
      for (let i = 0; i < 5; i++) {
        useStore.getState().incrementGenerations();
      }
      expect(useStore.getState().canGenerate()).toBe(false);
    });

    it("should allow more generations for pro tier", () => {
      useStore.getState().updateSettings({ subscription: "pro" });
      for (let i = 0; i < 5; i++) {
        useStore.getState().incrementGenerations();
      }
      expect(useStore.getState().canGenerate()).toBe(true);
    });
  });
});
