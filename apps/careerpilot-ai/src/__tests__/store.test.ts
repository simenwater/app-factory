/**
 * @fileoverview Zustand Store 单元测试
 */
import { useStore } from "@/store/useStore";

describe("useStore", () => {
  beforeEach(() => {
    const { getState } = useStore;
    const state = getState();
    state.resumes.forEach((r) => state.deleteResume(r.id));
    state.applications.forEach((a) => state.deleteApplication(a.id));
    state.upgradePlan("free");
  });

  describe("resumes", () => {
    it("should add a resume", () => {
      const resume = useStore.getState().addResume("test.pdf", "test content");
      expect(resume.id).toBeDefined();
      expect(resume.fileName).toBe("test.pdf");
      expect(resume.rawText).toBe("test content");
      expect(useStore.getState().resumes).toHaveLength(1);
    });

    it("should update optimized text", () => {
      const resume = useStore.getState().addResume("test.pdf", "raw");
      useStore.getState().updateResumeOptimized(resume.id, "optimized");
      const updated = useStore.getState().resumes.find((r) => r.id === resume.id);
      expect(updated?.optimizedText).toBe("optimized");
      expect(updated?.lastOptimizedAt).toBeDefined();
    });

    it("should delete a resume", () => {
      const resume = useStore.getState().addResume("test.pdf", "test");
      useStore.getState().deleteResume(resume.id);
      expect(useStore.getState().resumes).toHaveLength(0);
    });
  });

  describe("applications", () => {
    it("should add an application", () => {
      const app = useStore.getState().addApplication({
        jobTitle: "Software Engineer",
        company: "ACME Inc",
        status: "applied",
        notes: "",
      });
      expect(app.id).toBeDefined();
      expect(app.jobTitle).toBe("Software Engineer");
      expect(useStore.getState().applications).toHaveLength(1);
    });

    it("should update application status", () => {
      const app = useStore.getState().addApplication({
        jobTitle: "Dev",
        company: "Co",
        status: "applied",
        notes: "",
      });
      useStore.getState().updateApplicationStatus(app.id, "interviewing");
      const updated = useStore.getState().applications.find((a) => a.id === app.id);
      expect(updated?.status).toBe("interviewing");
    });

    it("should delete an application", () => {
      const app = useStore.getState().addApplication({
        jobTitle: "Dev",
        company: "Co",
        status: "applied",
        notes: "",
      });
      useStore.getState().deleteApplication(app.id);
      expect(useStore.getState().applications).toHaveLength(0);
    });
  });

  describe("quota", () => {
    it("should start with free plan", () => {
      expect(useStore.getState().quota.plan).toBe("free");
      expect(useStore.getState().quota.optimizationsLimit).toBe(3);
    });

    it("should consume optimization quota", () => {
      const result = useStore.getState().consumeOptimization();
      expect(result).toBe(true);
      expect(useStore.getState().quota.optimizationsUsed).toBe(1);
    });

    it("should deny when quota exceeded", () => {
      for (let i = 0; i < 3; i++) {
        useStore.getState().consumeOptimization();
      }
      const result = useStore.getState().consumeOptimization();
      expect(result).toBe(false);
    });

    it("should upgrade plan and reset quota", () => {
      useStore.getState().consumeOptimization();
      useStore.getState().upgradePlan("monthly");
      const q = useStore.getState().quota;
      expect(q.plan).toBe("monthly");
      expect(q.optimizationsUsed).toBe(0);
      expect(q.optimizationsLimit).toBe(Infinity);
    });
  });

  describe("darkMode", () => {
    it("should toggle dark mode", () => {
      expect(useStore.getState().darkMode).toBe(false);
      useStore.getState().toggleDarkMode();
      expect(useStore.getState().darkMode).toBe(true);
      useStore.getState().toggleDarkMode();
      expect(useStore.getState().darkMode).toBe(false);
    });
  });
});
