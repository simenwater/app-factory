import {
  BUILT_IN_TEMPLATES,
  filterTemplates,
  fillTemplate,
  createCustomTemplate,
} from "@/lib/templates";

describe("BUILT_IN_TEMPLATES", () => {
  it("should contain at least 5 templates", () => {
    expect(BUILT_IN_TEMPLATES.length).toBeGreaterThanOrEqual(5);
  });

  it("should all be marked as non-custom", () => {
    BUILT_IN_TEMPLATES.forEach((tpl) => {
      expect(tpl.isCustom).toBe(false);
    });
  });

  it("should all have required fields", () => {
    BUILT_IN_TEMPLATES.forEach((tpl) => {
      expect(tpl.id).toBeDefined();
      expect(tpl.title).toBeDefined();
      expect(tpl.scenario).toBeDefined();
      expect(tpl.tone).toBeDefined();
      expect(tpl.body.length).toBeGreaterThan(0);
    });
  });
});

describe("filterTemplates", () => {
  it("should return all when no filters", () => {
    const result = filterTemplates(BUILT_IN_TEMPLATES, "", "");
    expect(result.length).toBe(BUILT_IN_TEMPLATES.length);
  });

  it("should filter by scenario", () => {
    const result = filterTemplates(BUILT_IN_TEMPLATES, "free_work", "");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((tpl) => expect(tpl.scenario).toBe("free_work"));
  });

  it("should filter by tone", () => {
    const result = filterTemplates(BUILT_IN_TEMPLATES, "", "professional");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((tpl) => expect(tpl.tone).toBe("professional"));
  });

  it("should filter by both scenario and tone", () => {
    const result = filterTemplates(
      BUILT_IN_TEMPLATES,
      "free_work",
      "professional"
    );
    result.forEach((tpl) => {
      expect(tpl.scenario).toBe("free_work");
      expect(tpl.tone).toBe("professional");
    });
  });
});

describe("fillTemplate", () => {
  it("should replace all variables", () => {
    const body = "Hello {clientName}, about {projectName}.";
    const result = fillTemplate(body, {
      clientName: "Alice",
      projectName: "Logo Design",
    });
    expect(result).toBe("Hello Alice, about Logo Design.");
  });

  it("should replace multiple occurrences", () => {
    const body = "{name} and {name} again.";
    const result = fillTemplate(body, { name: "Bob" });
    expect(result).toBe("Bob and Bob again.");
  });

  it("should leave unmatched variables", () => {
    const body = "Hello {unknown}.";
    const result = fillTemplate(body, { clientName: "Alice" });
    expect(result).toBe("Hello {unknown}.");
  });
});

describe("createCustomTemplate", () => {
  it("should create a template marked as custom", () => {
    const tpl = createCustomTemplate({
      title: "My Template",
      scenario: "general",
      tone: "friendly",
      body: "Hello!",
    });
    expect(tpl.isCustom).toBe(true);
    expect(tpl.id).toBeDefined();
    expect(tpl.title).toBe("My Template");
  });
});
