/**
 * @description 客户 Store 单元测试
 */

import { useClientStore } from "@/store/clientStore";

beforeEach(() => {
  useClientStore.setState({ clients: [] });
});

describe("ClientStore", () => {
  it("应能添加新客户", () => {
    const { addClient } = useClientStore.getState();
    const client = addClient({
      name: "张三",
      email: "zhangsan@example.com",
      phone: "13800138000",
      company: "测试公司",
      status: "lead",
      notes: "测试备注",
    });

    expect(client.id).toBeDefined();
    expect(client.name).toBe("张三");
    expect(client.status).toBe("lead");
    expect(useClientStore.getState().clients).toHaveLength(1);
  });

  it("应能更新客户信息", () => {
    const { addClient, updateClient } = useClientStore.getState();
    const client = addClient({
      name: "李四",
      email: "lisi@example.com",
      phone: "",
      company: "",
      status: "lead",
      notes: "",
    });

    updateClient(client.id, { name: "李四（已更新）", status: "active" });

    const updated = useClientStore.getState().clients[0];
    expect(updated.name).toBe("李四（已更新）");
    expect(updated.status).toBe("active");
  });

  it("应能删除客户", () => {
    const { addClient, deleteClient } = useClientStore.getState();
    const client = addClient({
      name: "王五",
      email: "wangwu@example.com",
      phone: "",
      company: "",
      status: "lead",
      notes: "",
    });

    expect(useClientStore.getState().clients).toHaveLength(1);
    deleteClient(client.id);
    expect(useClientStore.getState().clients).toHaveLength(0);
  });

  it("应能移动客户到新状态", () => {
    const { addClient, moveClient } = useClientStore.getState();
    const client = addClient({
      name: "赵六",
      email: "zhaoliu@example.com",
      phone: "",
      company: "",
      status: "lead",
      notes: "",
    });

    moveClient(client.id, "active");
    expect(useClientStore.getState().clients[0].status).toBe("active");

    moveClient(client.id, "completed");
    expect(useClientStore.getState().clients[0].status).toBe("completed");
  });

  it("应能按状态筛选客户", () => {
    const { addClient, getClientsByStatus } = useClientStore.getState();
    addClient({ name: "A", email: "", phone: "", company: "", status: "lead", notes: "" });
    addClient({ name: "B", email: "", phone: "", company: "", status: "active", notes: "" });
    addClient({ name: "C", email: "", phone: "", company: "", status: "lead", notes: "" });

    const leads = getClientsByStatus("lead");
    expect(leads).toHaveLength(2);

    const actives = getClientsByStatus("active");
    expect(actives).toHaveLength(1);
  });

  it("应能根据 ID 获取客户", () => {
    const { addClient, getClientById } = useClientStore.getState();
    const client = addClient({
      name: "测试用户",
      email: "test@example.com",
      phone: "",
      company: "",
      status: "lead",
      notes: "",
    });

    const found = getClientById(client.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe("测试用户");

    const notFound = getClientById("nonexistent");
    expect(notFound).toBeUndefined();
  });
});
