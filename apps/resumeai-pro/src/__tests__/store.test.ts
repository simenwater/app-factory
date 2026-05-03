import { useStore, createEmptyResume } from "@/store/useStore";

/**
 * @description Store 单元测试
 */

beforeEach(() => {
  useStore.setState({
    resumes: [],
    currentResumeId: null,
    settings: { darkMode: false, language: "en" },
  });
});

describe("createEmptyResume", () => {
  it("should create a resume with all required fields", () => {
    const resume = createEmptyResume();

    expect(resume.id).toBeDefined();
    expect(resume.title).toBe("Untitled Resume");
    expect(resume.personalInfo.fullName).toBe("");
    expect(resume.workExperience).toHaveLength(0);
    expect(resume.education).toHaveLength(0);
    expect(resume.skills).toHaveLength(0);
    expect(resume.projects).toHaveLength(0);
    expect(resume.template).toBe("professional");
  });

  it("should generate unique IDs", () => {
    const r1 = createEmptyResume();
    const r2 = createEmptyResume();
    expect(r1.id).not.toBe(r2.id);
  });
});

describe("useStore", () => {
  it("should create a new resume", () => {
    const { createResume } = useStore.getState();
    const id = createResume();

    const state = useStore.getState();
    expect(state.resumes).toHaveLength(1);
    expect(state.resumes[0].id).toBe(id);
    expect(state.currentResumeId).toBe(id);
  });

  it("should delete a resume", () => {
    const { createResume, deleteResume } = useStore.getState();
    const id = createResume();

    deleteResume(id);
    const state = useStore.getState();
    expect(state.resumes).toHaveLength(0);
    expect(state.currentResumeId).toBeNull();
  });

  it("should update personal info", () => {
    const { createResume, updatePersonalInfo } =
      useStore.getState();
    createResume();

    updatePersonalInfo({ fullName: "Jane Doe", email: "jane@test.com" });

    const resume = useStore.getState().getCurrentResume();
    expect(resume?.personalInfo.fullName).toBe("Jane Doe");
    expect(resume?.personalInfo.email).toBe("jane@test.com");
  });

  it("should add and remove work experience", () => {
    const { createResume, addWorkExperience, removeWorkExperience } =
      useStore.getState();
    createResume();

    addWorkExperience({
      company: "Test Corp",
      position: "Developer",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description: "Developing things",
      achievements: ["Built stuff"],
    });

    let resume = useStore.getState().getCurrentResume();
    expect(resume?.workExperience).toHaveLength(1);
    expect(resume?.workExperience[0].company).toBe("Test Corp");

    const expId = resume!.workExperience[0].id;
    removeWorkExperience(expId);

    resume = useStore.getState().getCurrentResume();
    expect(resume?.workExperience).toHaveLength(0);
  });

  it("should add and remove education", () => {
    const { createResume, addEducation, removeEducation } =
      useStore.getState();
    createResume();

    addEducation({
      institution: "Test University",
      degree: "BSc",
      field: "CS",
      startDate: "2020",
      endDate: "2024",
      gpa: "3.9",
    });

    let resume = useStore.getState().getCurrentResume();
    expect(resume?.education).toHaveLength(1);

    removeEducation(resume!.education[0].id);
    resume = useStore.getState().getCurrentResume();
    expect(resume?.education).toHaveLength(0);
  });

  it("should add and remove skills", () => {
    const { createResume, addSkill, removeSkill } = useStore.getState();
    createResume();

    addSkill({ name: "React", level: "expert" });
    addSkill({ name: "TypeScript", level: "advanced" });

    let resume = useStore.getState().getCurrentResume();
    expect(resume?.skills).toHaveLength(2);

    removeSkill(resume!.skills[0].id);
    resume = useStore.getState().getCurrentResume();
    expect(resume?.skills).toHaveLength(1);
    expect(resume?.skills[0].name).toBe("TypeScript");
  });

  it("should add and remove projects", () => {
    const { createResume, addProject, removeProject } = useStore.getState();
    createResume();

    addProject({
      name: "Test Project",
      description: "A test project",
      technologies: ["React", "Node"],
      url: "example.com",
    });

    let resume = useStore.getState().getCurrentResume();
    expect(resume?.projects).toHaveLength(1);

    removeProject(resume!.projects[0].id);
    resume = useStore.getState().getCurrentResume();
    expect(resume?.projects).toHaveLength(0);
  });

  it("should set template", () => {
    const { createResume, setTemplate } = useStore.getState();
    createResume();

    setTemplate("modern");
    const resume = useStore.getState().getCurrentResume();
    expect(resume?.template).toBe("modern");
  });

  it("should toggle dark mode", () => {
    const { toggleDarkMode } = useStore.getState();

    expect(useStore.getState().settings.darkMode).toBe(false);
    toggleDarkMode();
    expect(useStore.getState().settings.darkMode).toBe(true);
    toggleDarkMode();
    expect(useStore.getState().settings.darkMode).toBe(false);
  });

  it("should set resume title", () => {
    const { createResume, setResumeTitle } = useStore.getState();
    createResume();

    setResumeTitle("My Awesome Resume");
    const resume = useStore.getState().getCurrentResume();
    expect(resume?.title).toBe("My Awesome Resume");
  });
});
