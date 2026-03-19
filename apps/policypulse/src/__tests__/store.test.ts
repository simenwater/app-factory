import { useStore } from "@/store/useStore";

/**
 * Store 单元测试
 */
describe("PolicyPulse Store", () => {
  beforeEach(() => {
    const { getState } = useStore;
    getState().resetFilters();
    getState().setSubscribedIndustries([]);
  });

  it("should have initial state", () => {
    const state = useStore.getState();
    expect(state.alerts.length).toBeGreaterThan(0);
    expect(state.selectedIndustries).toEqual([]);
    expect(state.selectedRiskLevels).toEqual([]);
    expect(state.searchQuery).toBe("");
    expect(state.isLoading).toBe(false);
  });

  it("should toggle dark mode", () => {
    const initial = useStore.getState().settings.darkMode;
    useStore.getState().toggleDarkMode();
    expect(useStore.getState().settings.darkMode).toBe(!initial);
  });

  it("should toggle industry filter", () => {
    useStore.getState().toggleIndustryFilter("tech");
    expect(useStore.getState().selectedIndustries).toContain("tech");

    useStore.getState().toggleIndustryFilter("tech");
    expect(useStore.getState().selectedIndustries).not.toContain("tech");
  });

  it("should toggle risk level filter", () => {
    useStore.getState().toggleRiskLevelFilter("critical");
    expect(useStore.getState().selectedRiskLevels).toContain("critical");

    useStore.getState().toggleRiskLevelFilter("critical");
    expect(useStore.getState().selectedRiskLevels).not.toContain("critical");
  });

  it("should set search query", () => {
    useStore.getState().setSearchQuery("半导体");
    expect(useStore.getState().searchQuery).toBe("半导体");
  });

  it("should reset all filters", () => {
    useStore.getState().toggleIndustryFilter("tech");
    useStore.getState().toggleRiskLevelFilter("high");
    useStore.getState().setSearchQuery("test");

    useStore.getState().resetFilters();
    expect(useStore.getState().selectedIndustries).toEqual([]);
    expect(useStore.getState().selectedRiskLevels).toEqual([]);
    expect(useStore.getState().searchQuery).toBe("");
  });

  it("should set subscription tier", () => {
    useStore.getState().setSubscriptionTier("pro");
    expect(useStore.getState().settings.subscriptionTier).toBe("pro");

    useStore.getState().setSubscriptionTier("free");
    expect(useStore.getState().settings.subscriptionTier).toBe("free");
  });

  it("should toggle email notifications", () => {
    const initial = useStore.getState().settings.emailNotifications;
    useStore.getState().toggleEmailNotifications();
    expect(useStore.getState().settings.emailNotifications).toBe(!initial);
  });

  it("should set subscribed industries", () => {
    useStore.getState().setSubscribedIndustries(["tech", "finance"]);
    expect(useStore.getState().settings.subscribedIndustries).toEqual([
      "tech",
      "finance",
    ]);
  });

  it("should set language", () => {
    useStore.getState().setLanguage("en");
    expect(useStore.getState().settings.language).toBe("en");

    useStore.getState().setLanguage("zh");
    expect(useStore.getState().settings.language).toBe("zh");
  });

  it("should set loading state", () => {
    useStore.getState().setLoading(true);
    expect(useStore.getState().isLoading).toBe(true);

    useStore.getState().setLoading(false);
    expect(useStore.getState().isLoading).toBe(false);
  });
});
