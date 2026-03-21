/**
 * @description 项目 Store 单元测试
 */

import { useProjectStore } from "@/store/projectStore";

beforeEach(() => {
  useProjectStore.setState({ projects: [] });
});

describe("ProjectStore", () => {
  it("应能添加新项目", () => {
    const { addProject } = useProjectStore.getState();
    const project = addProject({
      clientId: "client-1",
      name: "网站重设计",
      description: "为客户重新设计官方网站",
      status: "inquiry",
      budget: 5000,
      deadline: "2026-06-01",
      tags: ["设计", "前端"],
    });

    expect(project.id).toBeDefined();
    expect(project.name).toBe("网站重设计");
    expect(project.budget).toBe(5000);
    expect(useProjectStore.getState().projects).toHaveLength(1);
  });

  it("应能通过拖拽更新项目状态", () => {
    const { addProject, moveProject } = useProjectStore.getState();
    const project = addProject({
      clientId: "client-1",
      name: "移动端 App",
      description: "",
      status: "inquiry",
      budget: 10000,
      deadline: "",
      tags: [],
    });

    moveProject(project.id, "quoted");
    expect(useProjectStore.getState().projects[0].status).toBe("quoted");

    moveProject(project.id, "in_progress");
    expect(useProjectStore.getState().projects[0].status).toBe("in_progress");

    moveProject(project.id, "completed");
    expect(useProjectStore.getState().projects[0].status).toBe("completed");
  });

  it("应能按客户筛选项目", () => {
    const { addProject, getProjectsByClient } = useProjectStore.getState();
    addProject({
      clientId: "client-1",
      name: "项目 A",
      description: "",
      status: "inquiry",
      budget: 1000,
      deadline: "",
      tags: [],
    });
    addProject({
      clientId: "client-2",
      name: "项目 B",
      description: "",
      status: "inquiry",
      budget: 2000,
      deadline: "",
      tags: [],
    });
    addProject({
      clientId: "client-1",
      name: "项目 C",
      description: "",
      status: "in_progress",
      budget: 3000,
      deadline: "",
      tags: [],
    });

    expect(getProjectsByClient("client-1")).toHaveLength(2);
    expect(getProjectsByClient("client-2")).toHaveLength(1);
    expect(getProjectsByClient("client-3")).toHaveLength(0);
  });

  it("应能删除项目", () => {
    const { addProject, deleteProject } = useProjectStore.getState();
    const project = addProject({
      clientId: "client-1",
      name: "待删除项目",
      description: "",
      status: "cancelled",
      budget: 0,
      deadline: "",
      tags: [],
    });

    deleteProject(project.id);
    expect(useProjectStore.getState().projects).toHaveLength(0);
  });
});
