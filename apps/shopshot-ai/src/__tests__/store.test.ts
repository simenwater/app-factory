import { useStore } from "@/store/useStore";
import type { GenerationJob, GeneratedImage } from "@/types";

const createMockImage = (overrides?: Partial<GeneratedImage>): GeneratedImage => ({
  id: "img-1",
  originalImageData: "data:image/png;base64,abc",
  resultImageData: "data:image/png;base64,xyz",
  scene: "studio-white",
  angle: 0,
  width: 1024,
  height: 1024,
  status: "completed",
  createdAt: new Date().toISOString(),
  ...overrides,
});

const createMockJob = (overrides?: Partial<GenerationJob>): GenerationJob => ({
  id: "job-1",
  originalImage: "data:image/png;base64,original",
  originalFileName: "product.png",
  scenes: ["studio-white"],
  angles: [0],
  images: [createMockImage()],
  status: "completed",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

beforeEach(() => {
  useStore.setState({
    jobs: [],
    settings: {
      subscription: "free",
      darkMode: false,
      defaultExportFormat: "shopify",
      watermarkEnabled: true,
      autoBackgroundRemoval: true,
      imagesGeneratedThisMonth: 0,
      lastResetDate: new Date().toISOString().slice(0, 7),
    },
    stats: {
      totalGenerated: 0,
      totalExported: 0,
      favoriteScene: null,
    },
  });
});

describe("Job Management", () => {
  it("should add a job", () => {
    const job = createMockJob();
    useStore.getState().addJob(job);
    expect(useStore.getState().jobs).toHaveLength(1);
    expect(useStore.getState().jobs[0].id).toBe("job-1");
  });

  it("should add jobs in reverse chronological order", () => {
    useStore.getState().addJob(createMockJob({ id: "job-1" }));
    useStore.getState().addJob(createMockJob({ id: "job-2" }));
    expect(useStore.getState().jobs[0].id).toBe("job-2");
    expect(useStore.getState().jobs[1].id).toBe("job-1");
  });

  it("should update a job", () => {
    useStore.getState().addJob(createMockJob());
    useStore.getState().updateJob("job-1", { status: "processing" });
    expect(useStore.getState().jobs[0].status).toBe("processing");
  });

  it("should delete a job", () => {
    useStore.getState().addJob(createMockJob());
    useStore.getState().deleteJob("job-1");
    expect(useStore.getState().jobs).toHaveLength(0);
  });

  it("should add images to a job", () => {
    useStore.getState().addJob(createMockJob({ images: [] }));
    const newImages = [createMockImage({ id: "img-new" })];
    useStore.getState().addImagesToJob("job-1", newImages);
    expect(useStore.getState().jobs[0].images).toHaveLength(1);
    expect(useStore.getState().jobs[0].images[0].id).toBe("img-new");
  });
});

describe("Settings", () => {
  it("should update settings", () => {
    useStore.getState().updateSettings({ darkMode: true });
    expect(useStore.getState().settings.darkMode).toBe(true);
  });

  it("should set subscription tier", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().settings.subscription).toBe("pro");
  });

  it("should not overwrite other settings when updating", () => {
    useStore.getState().updateSettings({ darkMode: true });
    useStore.getState().updateSettings({ autoBackgroundRemoval: false });
    expect(useStore.getState().settings.darkMode).toBe(true);
    expect(useStore.getState().settings.autoBackgroundRemoval).toBe(false);
  });
});

describe("Usage & Quota", () => {
  it("should increment usage", () => {
    useStore.getState().incrementUsage(5);
    expect(useStore.getState().settings.imagesGeneratedThisMonth).toBe(5);
    expect(useStore.getState().stats.totalGenerated).toBe(5);
  });

  it("should increment exports", () => {
    useStore.getState().incrementExports(3);
    expect(useStore.getState().stats.totalExported).toBe(3);
  });

  it("should report canGenerate=true for free tier with usage < 3", () => {
    expect(useStore.getState().canGenerate()).toBe(true);
  });

  it("should report canGenerate=false when free tier limit reached", () => {
    useStore.getState().incrementUsage(3);
    expect(useStore.getState().canGenerate()).toBe(false);
  });

  it("should report canGenerate=true for pro tier regardless of usage", () => {
    useStore.getState().setSubscription("pro");
    useStore.getState().incrementUsage(1000);
    expect(useStore.getState().canGenerate()).toBe(true);
  });

  it("should return correct remaining quota", () => {
    expect(useStore.getState().getRemainingQuota()).toBe(3);
    useStore.getState().incrementUsage(1);
    expect(useStore.getState().getRemainingQuota()).toBe(2);
  });

  it("should return -1 remaining for pro tier", () => {
    useStore.getState().setSubscription("pro");
    expect(useStore.getState().getRemainingQuota()).toBe(-1);
  });

  it("should reset monthly usage", () => {
    useStore.getState().incrementUsage(3);
    useStore.getState().resetMonthlyUsage();
    expect(useStore.getState().settings.imagesGeneratedThisMonth).toBe(0);
  });
});

describe("Export Formats", () => {
  it("should track export format preference", () => {
    useStore.getState().updateSettings({ defaultExportFormat: "amazon" });
    expect(useStore.getState().settings.defaultExportFormat).toBe("amazon");
  });
});
