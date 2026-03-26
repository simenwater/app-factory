import { analyzeSentiment } from "@/lib/sentiment";

describe("analyzeSentiment", () => {
  it("should return low risk for neutral text", () => {
    const result = analyzeSentiment("The service was okay, nothing special.");
    expect(result.riskLevel).toBe("low");
    expect(result.score).toBeLessThan(25);
  });

  it("should detect negative keywords", () => {
    const result = analyzeSentiment("This was terrible and awful service!");
    expect(result.keywords).toContain("terrible");
    expect(result.keywords).toContain("awful");
    expect(result.score).toBeGreaterThan(0);
  });

  it("should return high risk for strongly negative reviews", () => {
    const result = analyzeSentiment(
      "Terrible! This is the worst service ever. Totally unprofessional and rude. I want a refund. Avoid this scam!"
    );
    expect(["high", "critical"]).toContain(result.riskLevel);
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("should detect emotion tags", () => {
    const result = analyzeSentiment("This is a scam! They are liars and cheaters!");
    expect(result.emotionTags).toContain("distrust");
  });

  it("should detect anger emotion", () => {
    const result = analyzeSentiment("Terrible and horrible experience, so rude!");
    expect(result.emotionTags).toContain("anger");
  });

  it("should detect pricing concerns", () => {
    const result = analyzeSentiment("Way overpriced for what you get. Total rip off.");
    expect(result.emotionTags).toContain("pricing");
  });

  it("should add points for exclamation marks", () => {
    const base = analyzeSentiment("Bad service");
    const withExclaim = analyzeSentiment("Bad service!");
    expect(withExclaim.score).toBeGreaterThan(base.score);
  });

  it("should generate a summary", () => {
    const result = analyzeSentiment("Terrible service, very disappointed.");
    expect(result.summary).toBeTruthy();
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it("should handle Chinese reviews", () => {
    const result = analyzeSentiment("这家店太糟糕了，服务态度差，完全是垃圾！");
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThan(0);
  });

  it("should handle empty text", () => {
    const result = analyzeSentiment("");
    expect(result.score).toBe(0);
    expect(result.riskLevel).toBe("low");
    expect(result.keywords).toEqual([]);
  });

  it("should cap score at 100", () => {
    const result = analyzeSentiment(
      "Terrible awful horrible worst disgusting scam fraud cheat lie liar bad poor slow rude unprofessional disappointed frustrating waste overpriced never avoid refund complaint broken!"
    );
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
