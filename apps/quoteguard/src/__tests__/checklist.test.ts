import {
  DEFAULT_CHECKLIST_ITEMS,
  createChecklist,
  groupByCategory,
  isChecklistComplete,
} from "@/lib/checklist";

describe("DEFAULT_CHECKLIST_ITEMS", () => {
  it("should contain items for all categories", () => {
    const categories = new Set(
      DEFAULT_CHECKLIST_ITEMS.map((item) => item.category)
    );
    expect(categories.has("scope")).toBe(true);
    expect(categories.has("timeline")).toBe(true);
    expect(categories.has("payment")).toBe(true);
    expect(categories.has("communication")).toBe(true);
    expect(categories.has("deliverables")).toBe(true);
    expect(categories.has("revision")).toBe(true);
  });

  it("should have at least 15 items", () => {
    expect(DEFAULT_CHECKLIST_ITEMS.length).toBeGreaterThanOrEqual(15);
  });
});

describe("createChecklist", () => {
  it("should create a checklist with correct client info", () => {
    const cl = createChecklist("Alice", "Brand Design");
    expect(cl.clientName).toBe("Alice");
    expect(cl.projectName).toBe("Brand Design");
    expect(cl.completedAt).toBeNull();
    expect(cl.id).toBeDefined();
    expect(cl.createdAt).toBeDefined();
  });

  it("should create items from default template", () => {
    const cl = createChecklist("Bob", "Website");
    expect(cl.items.length).toBe(DEFAULT_CHECKLIST_ITEMS.length);
    cl.items.forEach((item) => {
      expect(item.checked).toBe(false);
      expect(item.id).toBeDefined();
    });
  });
});

describe("groupByCategory", () => {
  it("should group items by their category", () => {
    const cl = createChecklist("Test", "Test");
    const groups = groupByCategory(cl.items);
    expect(Object.keys(groups)).toContain("scope");
    expect(Object.keys(groups)).toContain("payment");
    Object.values(groups).forEach((items) => {
      expect(items.length).toBeGreaterThan(0);
    });
  });
});

describe("isChecklistComplete", () => {
  it("should return false when not all items checked", () => {
    const items = [
      { id: "1", text: "a", category: "scope" as const, checked: true },
      { id: "2", text: "b", category: "scope" as const, checked: false },
    ];
    expect(isChecklistComplete(items)).toBe(false);
  });

  it("should return true when all items checked", () => {
    const items = [
      { id: "1", text: "a", category: "scope" as const, checked: true },
      { id: "2", text: "b", category: "scope" as const, checked: true },
    ];
    expect(isChecklistComplete(items)).toBe(true);
  });

  it("should return false for empty items", () => {
    expect(isChecklistComplete([])).toBe(false);
  });
});
