import { useStore } from "@/store/useStore";
import type { Review } from "@/types";

/**
 * @description 创建测试用评价数据
 */
function createMockReview(overrides: Partial<Review> = {}): Review {
  return {
    id: "test-id-1",
    platform: "Google",
    originalText: "Terrible service!",
    sentiment: {
      score: 60,
      riskLevel: "high",
      keywords: ["terrible"],
      emotionTags: ["anger"],
      summary: "负面评价",
    },
    replies: [
      {
        id: "reply-1",
        style: "apology",
        content: "Sorry for the experience",
        tone: "诚恳道歉型",
        createdAt: "2025-01-01",
      },
    ],
    selectedReplyId: null,
    trackingStatus: "draft",
    trackingNotes: "",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    ...overrides,
  };
}

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      reviews: [],
      settings: {
        darkMode: false,
        plan: "free",
        businessName: "",
        businessType: "",
        language: "zh",
        totalRepliesGenerated: 0,
        freeRepliesRemaining: 3,
      },
    });
  });

  describe("reviews", () => {
    it("should start with empty reviews", () => {
      const { reviews } = useStore.getState();
      expect(reviews).toEqual([]);
    });

    it("should add a review", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      const { reviews } = useStore.getState();
      expect(reviews).toHaveLength(1);
      expect(reviews[0].id).toBe("test-id-1");
    });

    it("should add reviews at the beginning (newest first)", () => {
      const review1 = createMockReview({ id: "id-1" });
      const review2 = createMockReview({ id: "id-2" });
      useStore.getState().addReview(review1);
      useStore.getState().addReview(review2);
      const { reviews } = useStore.getState();
      expect(reviews[0].id).toBe("id-2");
      expect(reviews[1].id).toBe("id-1");
    });

    it("should update a review", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      useStore.getState().updateReview("test-id-1", { platform: "Yelp" });
      const { reviews } = useStore.getState();
      expect(reviews[0].platform).toBe("Yelp");
    });

    it("should delete a review", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      useStore.getState().deleteReview("test-id-1");
      const { reviews } = useStore.getState();
      expect(reviews).toHaveLength(0);
    });
  });

  describe("tracking", () => {
    it("should update tracking status", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      useStore.getState().updateTrackingStatus("test-id-1", "sent");
      const { reviews } = useStore.getState();
      expect(reviews[0].trackingStatus).toBe("sent");
    });

    it("should update tracking notes", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      useStore.getState().updateTrackingStatus("test-id-1", "sent", "Replied on Google");
      const { reviews } = useStore.getState();
      expect(reviews[0].trackingNotes).toBe("Replied on Google");
    });
  });

  describe("reply selection", () => {
    it("should select a reply", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      useStore.getState().selectReply("test-id-1", "reply-1");
      const { reviews } = useStore.getState();
      expect(reviews[0].selectedReplyId).toBe("reply-1");
    });
  });

  describe("settings", () => {
    it("should start with default settings", () => {
      const { settings } = useStore.getState();
      expect(settings.darkMode).toBe(false);
      expect(settings.plan).toBe("free");
      expect(settings.freeRepliesRemaining).toBe(3);
    });

    it("should update settings", () => {
      useStore.getState().updateSettings({ darkMode: true });
      const { settings } = useStore.getState();
      expect(settings.darkMode).toBe(true);
    });

    it("should update business name", () => {
      useStore.getState().updateSettings({ businessName: "TestBiz" });
      const { settings } = useStore.getState();
      expect(settings.businessName).toBe("TestBiz");
    });

    it("should increment replies generated and decrement free remaining", () => {
      useStore.getState().incrementRepliesGenerated();
      const { settings } = useStore.getState();
      expect(settings.totalRepliesGenerated).toBe(1);
      expect(settings.freeRepliesRemaining).toBe(2);
    });

    it("should not go below 0 for free replies remaining", () => {
      useStore.getState().updateSettings({ freeRepliesRemaining: 0 });
      useStore.getState().incrementRepliesGenerated();
      const { settings } = useStore.getState();
      expect(settings.freeRepliesRemaining).toBe(0);
    });
  });

  describe("resetStore", () => {
    it("should reset all data", () => {
      const review = createMockReview();
      useStore.getState().addReview(review);
      useStore.getState().updateSettings({ darkMode: true, businessName: "Test" });
      useStore.getState().resetStore();
      const { reviews, settings } = useStore.getState();
      expect(reviews).toEqual([]);
      expect(settings.darkMode).toBe(false);
      expect(settings.businessName).toBe("");
    });
  });
});
