/**
 * @fileoverview 一致性检查引擎单元测试
 */

import {
  checkCharacterConsistency,
  detectConflicts,
} from "@/lib/consistency-checker";
import type { Character, PlotEvent } from "@/types";

/** 创建测试用角色 */
function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    name: "测试角色",
    avatarColor: "#6366f1",
    traits: [],
    relationships: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/** 创建测试用事件 */
function makeEvent(overrides: Partial<PlotEvent> = {}): PlotEvent {
  return {
    id: "event-1",
    title: "测试事件",
    content: "这是测试事件内容",
    characterIds: ["char-1"],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("checkCharacterConsistency", () => {
  it("当角色没有特质时，应返回 info 级别提示", () => {
    const character = makeCharacter({ traits: [] });
    const issues = checkCharacterConsistency(character, []);

    expect(issues.length).toBeGreaterThanOrEqual(1);
    const traitIssue = issues.find((i) => i.message.includes("性格特质"));
    expect(traitIssue).toBeDefined();
    expect(traitIssue?.severity).toBe("info");
  });

  it("当角色缺少背景故事时，应返回 info 级别提示", () => {
    const character = makeCharacter({ backstory: undefined });
    const issues = checkCharacterConsistency(character, []);

    const backstoryIssue = issues.find((i) => i.message.includes("背景故事"));
    expect(backstoryIssue).toBeDefined();
    expect(backstoryIssue?.severity).toBe("info");
  });

  it("当角色有完整的特质和背景时，不应有 info 提示", () => {
    const character = makeCharacter({
      backstory: "来自远方的旅者",
      traits: [{ name: "勇敢", description: "从不退缩", importance: 5 }],
    });
    const issues = checkCharacterConsistency(character, []);

    const infoIssues = issues.filter((i) => i.severity === "info");
    expect(infoIssues.length).toBe(0);
  });

  it("当两个事件内容存在情感矛盾时，应发出 warning", () => {
    const character = makeCharacter({
      traits: [{ name: "勇敢", description: "无畏的战士", importance: 5 }],
    });

    const events = [
      makeEvent({
        id: "e1",
        title: "战斗场景",
        content: "他勇敢地冲向敌人，毫无畏惧",
        characterIds: ["char-1"],
      }),
      makeEvent({
        id: "e2",
        title: "逃跑场景",
        content: "他胆怯地逃跑了，充满恐惧",
        characterIds: ["char-1"],
      }),
    ];

    const issues = checkCharacterConsistency(character, events);
    const warnings = issues.filter((i) => i.severity === "warning");
    expect(warnings.length).toBeGreaterThanOrEqual(1);
  });

  it("当事件不涉及该角色时，不应检测到矛盾", () => {
    const character = makeCharacter({
      id: "char-1",
      traits: [{ name: "善良", description: "", importance: 5 }],
      backstory: "一个善良的人",
    });

    const events = [
      makeEvent({
        id: "e1",
        title: "事件A",
        content: "善良地帮助他人",
        characterIds: ["char-2"],
      }),
      makeEvent({
        id: "e2",
        title: "事件B",
        content: "残忍地对待敌人",
        characterIds: ["char-2"],
      }),
    ];

    const issues = checkCharacterConsistency(character, events);
    const warnings = issues.filter((i) => i.severity === "warning");
    expect(warnings.length).toBe(0);
  });
});

describe("detectConflicts", () => {
  it("当两个角色互相标记矛盾关系时，应检测到关系冲突", () => {
    const charA = makeCharacter({
      id: "char-a",
      name: "角色A",
      relationships: [
        { targetCharacterId: "char-b", type: "friend", description: "" },
      ],
    });
    const charB = makeCharacter({
      id: "char-b",
      name: "角色B",
      relationships: [
        { targetCharacterId: "char-a", type: "enemy", description: "" },
      ],
    });

    const warnings = detectConflicts([charA, charB], []);
    const relWarnings = warnings.filter((w) => w.type === "relationship");
    expect(relWarnings.length).toBeGreaterThanOrEqual(1);
    expect(relWarnings[0].message).toContain("关系矛盾");
  });

  it("当关系一致时，不应检测到关系冲突", () => {
    const charA = makeCharacter({
      id: "char-a",
      name: "角色A",
      relationships: [
        { targetCharacterId: "char-b", type: "friend", description: "" },
      ],
    });
    const charB = makeCharacter({
      id: "char-b",
      name: "角色B",
      relationships: [
        { targetCharacterId: "char-a", type: "friend", description: "" },
      ],
    });

    const warnings = detectConflicts([charA, charB], []);
    const relWarnings = warnings.filter((w) => w.type === "relationship");
    expect(relWarnings.length).toBe(0);
  });

  it("当核心特质被事件内容违反时，应产生 personality 类型预警", () => {
    const character = makeCharacter({
      id: "char-1",
      name: "勇者",
      traits: [{ name: "勇敢", description: "", importance: 5 }],
    });

    const events = [
      makeEvent({
        id: "e1",
        title: "逃跑",
        content: "他因为恐惧而胆怯地退缩了",
        characterIds: ["char-1"],
      }),
    ];

    const warnings = detectConflicts([character], events);
    const personWarnings = warnings.filter((w) => w.type === "personality");
    expect(personWarnings.length).toBeGreaterThanOrEqual(1);
    expect(personWarnings[0].message).toContain("人设预警");
  });

  it("低重要度的特质不应触发人设预警", () => {
    const character = makeCharacter({
      id: "char-1",
      name: "角色",
      traits: [{ name: "勇敢", description: "", importance: 2 }],
    });

    const events = [
      makeEvent({
        id: "e1",
        title: "逃跑",
        content: "他因为恐惧而胆怯地退缩了",
        characterIds: ["char-1"],
      }),
    ];

    const warnings = detectConflicts([character], events);
    const personWarnings = warnings.filter((w) => w.type === "personality");
    expect(personWarnings.length).toBe(0);
  });

  it("空角色列表应返回空预警", () => {
    const warnings = detectConflicts([], []);
    expect(warnings.length).toBe(0);
  });
});
