import { getDefaultTemplates, fillTemplate } from "@/lib/templates";

describe("getDefaultTemplates", () => {
  it("should return an array of templates", () => {
    const templates = getDefaultTemplates();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);
  });

  it("should include both email and sms templates", () => {
    const templates = getDefaultTemplates();
    const channels = new Set(templates.map((t) => t.channel));
    expect(channels.has("email")).toBe(true);
    expect(channels.has("sms")).toBe(true);
  });

  it("should have unique IDs", () => {
    const templates = getDefaultTemplates();
    const ids = templates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each template should have required fields", () => {
    const templates = getDefaultTemplates();
    templates.forEach((t) => {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.channel).toBeTruthy();
      expect(t.body).toBeTruthy();
      expect(typeof t.daysAfterQuote).toBe("number");
    });
  });
});

describe("fillTemplate", () => {
  it("should replace single variable", () => {
    const result = fillTemplate("Hello {{name}}!", { name: "Alice" });
    expect(result).toBe("Hello Alice!");
  });

  it("should replace multiple variables", () => {
    const result = fillTemplate(
      "Hi {{name}}, your quote {{quoteNumber}} is ready.",
      { name: "Bob", quoteNumber: "QF-202501-0001" }
    );
    expect(result).toBe("Hi Bob, your quote QF-202501-0001 is ready.");
  });

  it("should replace all occurrences of the same variable", () => {
    const result = fillTemplate("{{name}} said hello to {{name}}", {
      name: "Alice",
    });
    expect(result).toBe("Alice said hello to Alice");
  });

  it("should leave unreplaced placeholders as-is", () => {
    const result = fillTemplate("Hello {{name}}, your {{status}} is ready", {
      name: "Alice",
    });
    expect(result).toBe("Hello Alice, your {{status}} is ready");
  });

  it("should handle empty variables", () => {
    const result = fillTemplate("Hello {{name}}", {});
    expect(result).toBe("Hello {{name}}");
  });

  it("should work with real template data", () => {
    const templates = getDefaultTemplates();
    const emailTemplate = templates.find((t) => t.channel === "email");
    expect(emailTemplate).toBeTruthy();

    const filled = fillTemplate(emailTemplate!.body, {
      clientName: "Alice Johnson",
      quoteNumber: "QF-202501-0001",
      serviceDescription: "Website Design",
      businessName: "My Agency",
      validUntil: "Feb 15, 2025",
      daysSince: "3",
    });

    expect(filled).toContain("Alice Johnson");
    expect(filled).toContain("QF-202501-0001");
    expect(filled).not.toContain("{{clientName}}");
  });
});
