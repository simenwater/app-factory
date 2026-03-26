import { generateReply, generateAllReplies } from "@/lib/replyGenerator";
import { analyzeSentiment } from "@/lib/sentiment";
import type { SentimentAnalysis } from "@/types";

describe("replyGenerator", () => {
  const mockSentiment: SentimentAnalysis = {
    score: 60,
    riskLevel: "high",
    keywords: ["terrible", "rude"],
    emotionTags: ["anger"],
    summary: "该评价负面情绪较强",
  };

  const testText = "Terrible service, the staff was very rude.";
  const businessName = "TestBiz";

  describe("generateReply", () => {
    it("should generate an apology reply", () => {
      const reply = generateReply("apology", testText, mockSentiment, businessName);
      expect(reply.style).toBe("apology");
      expect(reply.content.length).toBeGreaterThan(0);
      expect(reply.tone).toBe("诚恳道歉型");
      expect(reply.id).toBeTruthy();
      expect(reply.createdAt).toBeTruthy();
    });

    it("should generate an explanation reply", () => {
      const reply = generateReply("explanation", testText, mockSentiment, businessName);
      expect(reply.style).toBe("explanation");
      expect(reply.tone).toBe("专业解释型");
    });

    it("should generate a counter reply", () => {
      const reply = generateReply("counter", testText, mockSentiment, businessName);
      expect(reply.style).toBe("counter");
      expect(reply.tone).toBe("专业反驳型");
    });

    it("should include business name in the reply", () => {
      const reply = generateReply("apology", testText, mockSentiment, businessName);
      expect(reply.content).toContain(businessName);
    });

    it("should handle empty business name", () => {
      const reply = generateReply("apology", testText, mockSentiment, "");
      expect(reply.content.length).toBeGreaterThan(0);
    });
  });

  describe("generateAllReplies", () => {
    it("should generate exactly 3 replies", () => {
      const replies = generateAllReplies(testText, mockSentiment, businessName);
      expect(replies).toHaveLength(3);
    });

    it("should generate one reply of each style", () => {
      const replies = generateAllReplies(testText, mockSentiment, businessName);
      const styles = replies.map((r) => r.style);
      expect(styles).toContain("apology");
      expect(styles).toContain("explanation");
      expect(styles).toContain("counter");
    });

    it("should generate unique IDs for each reply", () => {
      const replies = generateAllReplies(testText, mockSentiment, businessName);
      const ids = replies.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it("should work with real sentiment analysis", () => {
      const sentiment = analyzeSentiment(testText);
      const replies = generateAllReplies(testText, sentiment, businessName);
      expect(replies).toHaveLength(3);
      replies.forEach((reply) => {
        expect(reply.content.length).toBeGreaterThan(50);
      });
    });
  });
});
