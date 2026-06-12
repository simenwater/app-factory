import { TEMPLATES, getTemplateById, FREE_TRIAL_LIMIT } from "@/lib/templates";

describe("TEMPLATES", () => {
  it("should have 5 predefined templates", () => {
    expect(TEMPLATES).toHaveLength(5);
  });

  it("should include email, todo, blog, meeting, custom", () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(ids).toContain("email");
    expect(ids).toContain("todo");
    expect(ids).toContain("blog");
    expect(ids).toContain("meeting");
    expect(ids).toContain("custom");
  });

  it("each template should have required fields", () => {
    TEMPLATES.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.icon).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.prompt).toBeTruthy();
    });
  });
});

describe("getTemplateById", () => {
  it("should return the correct template for a known ID", () => {
    const email = getTemplateById("email");
    expect(email).toBeDefined();
    expect(email?.id).toBe("email");
    expect(email?.name).toBe("Email");
  });

  it("should return undefined for an unknown ID", () => {
    expect(getTemplateById("nonexistent")).toBeUndefined();
  });
});

describe("FREE_TRIAL_LIMIT", () => {
  it("should be 3", () => {
    expect(FREE_TRIAL_LIMIT).toBe(3);
  });
});
