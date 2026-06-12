/**
 * @fileoverview 剧情一致性检查引擎
 * 自动检测角色行为、性格、关系等方面的不一致性
 */

import type {
  Character,
  PlotEvent,
  ConsistencyIssue,
  ConflictWarning,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * 检查角色在事件中的性格一致性
 * @param character - 待检查的角色
 * @param events - 关联的剧情事件列表
 * @returns 发现的一致性问题列表
 */
export function checkCharacterConsistency(
  character: Character,
  events: PlotEvent[]
): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];
  const now = new Date().toISOString();

  if (!character.traits.length) {
    issues.push({
      id: uuidv4(),
      severity: "info",
      message: `角色「${character.name}」尚未设定性格特质，建议补充以便追踪一致性。`,
      characterId: character.id,
      suggestion: "为角色添加至少 2-3 个核心性格特质。",
      checkedAt: now,
    });
  }

  if (!character.backstory) {
    issues.push({
      id: uuidv4(),
      severity: "info",
      message: `角色「${character.name}」缺少背景故事，可能导致行为动机不清晰。`,
      characterId: character.id,
      suggestion: "添加角色的背景故事，说明其核心动机和经历。",
      checkedAt: now,
    });
  }

  const relatedEvents = events.filter((e) =>
    e.characterIds.includes(character.id)
  );

  if (relatedEvents.length >= 2) {
    const traitKeywords = character.traits.map((t) => t.name.toLowerCase());

    for (let i = 0; i < relatedEvents.length; i++) {
      for (let j = i + 1; j < relatedEvents.length; j++) {
        const contradictions = detectContentContradiction(
          relatedEvents[i],
          relatedEvents[j],
          traitKeywords
        );
        if (contradictions) {
          issues.push({
            id: uuidv4(),
            severity: "warning",
            message: `角色「${character.name}」在「${relatedEvents[i].title}」与「${relatedEvents[j].title}」中的行为可能存在矛盾。`,
            characterId: character.id,
            eventId: relatedEvents[j].id,
            suggestion: contradictions,
            checkedAt: now,
          });
        }
      }
    }
  }

  return issues;
}

/** 对立情感关键词对 */
const CONTRADICTION_PAIRS: [string[], string[]][] = [
  [["勇敢", "无畏", "大胆"], ["胆怯", "懦弱", "害怕", "恐惧"]],
  [["善良", "仁慈", "慈悲"], ["残忍", "无情", "冷酷"]],
  [["冷静", "理智", "沉着"], ["冲动", "暴躁", "失控"]],
  [["信任", "相信"], ["怀疑", "猜忌", "不信任"]],
  [["快乐", "高兴", "开心"], ["悲伤", "痛苦", "绝望"]],
  [["友好", "亲切"], ["敌对", "仇恨", "憎恶"]],
];

/**
 * 检测两个事件内容之间是否存在针对角色特质的矛盾
 * @param eventA - 事件A
 * @param eventB - 事件B
 * @param traitKeywords - 角色特质关键词
 * @returns 矛盾描述字符串，无矛盾则返回 null
 */
function detectContentContradiction(
  eventA: PlotEvent,
  eventB: PlotEvent,
  traitKeywords: string[]
): string | null {
  const contentA = eventA.content.toLowerCase();
  const contentB = eventB.content.toLowerCase();

  for (const [groupA, groupB] of CONTRADICTION_PAIRS) {
    const aHasGroupA = groupA.some(
      (w) => contentA.includes(w) || traitKeywords.includes(w)
    );
    const bHasGroupB = groupB.some((w) => contentB.includes(w));
    const aHasGroupB = groupB.some(
      (w) => contentA.includes(w) || traitKeywords.includes(w)
    );
    const bHasGroupA = groupA.some((w) => contentB.includes(w));

    if ((aHasGroupA && bHasGroupB) || (aHasGroupB && bHasGroupA)) {
      return `检测到情感/性格矛盾：请检查这两个事件中角色的行为是否合理，是否需要添加心理转变的过渡情节。`;
    }
  }

  return null;
}

/**
 * 检测角色间关系冲突
 * @param characters - 全部角色列表
 * @param events - 全部剧情事件
 * @returns 冲突预警列表
 */
export function detectConflicts(
  characters: Character[],
  events: PlotEvent[]
): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  const now = new Date().toISOString();
  const charMap = new Map(characters.map((c) => [c.id, c]));

  for (const character of characters) {
    for (const rel of character.relationships) {
      const target = charMap.get(rel.targetCharacterId);
      if (!target) continue;

      const reverseRel = target.relationships.find(
        (r) => r.targetCharacterId === character.id
      );

      if (reverseRel && isRelationshipConflict(rel.type, reverseRel.type)) {
        warnings.push({
          id: uuidv4(),
          type: "relationship",
          message: `关系矛盾：「${character.name}」视「${target.name}」为${getRelLabel(rel.type)}，但「${target.name}」视「${character.name}」为${getRelLabel(reverseRel.type)}。`,
          characterIds: [character.id, target.id],
          eventIds: [],
          severity: 3,
          detectedAt: now,
        });
      }
    }
  }

  for (const character of characters) {
    const highImportanceTraits = character.traits.filter(
      (t) => t.importance >= 4
    );
    const relatedEvents = events.filter((e) =>
      e.characterIds.includes(character.id)
    );

    for (const trait of highImportanceTraits) {
      for (const event of relatedEvents) {
        const violates = checkTraitViolation(trait.name, event.content);
        if (violates) {
          warnings.push({
            id: uuidv4(),
            type: "personality",
            message: `人设预警：「${character.name}」的核心特质「${trait.name}」在事件「${event.title}」中可能被违反。`,
            characterIds: [character.id],
            eventIds: [event.id],
            severity: 4,
            detectedAt: now,
          });
        }
      }
    }
  }

  const deduped = deduplicateWarnings(warnings);
  return deduped;
}

/**
 * 去重冲突预警（相同角色对只保留一条）
 * @param warnings - 原始预警列表
 * @returns 去重后的预警列表
 */
function deduplicateWarnings(warnings: ConflictWarning[]): ConflictWarning[] {
  const seen = new Set<string>();
  return warnings.filter((w) => {
    const key = [...w.characterIds].sort().join(",") + "|" + w.type;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** 关系类型对应中文 */
function getRelLabel(type: string): string {
  const map: Record<string, string> = {
    friend: "朋友",
    enemy: "敌人",
    lover: "恋人",
    family: "家人",
    mentor: "导师",
    rival: "对手",
    colleague: "同事",
    other: "其他",
  };
  return map[type] || type;
}

/**
 * 判断两种关系类型是否存在逻辑冲突
 * @param typeA - 关系类型A
 * @param typeB - 关系类型B
 * @returns 是否冲突
 */
function isRelationshipConflict(typeA: string, typeB: string): boolean {
  const conflicts: [string, string][] = [
    ["friend", "enemy"],
    ["lover", "enemy"],
    ["family", "enemy"],
    ["mentor", "enemy"],
  ];
  return conflicts.some(
    ([a, b]) => (typeA === a && typeB === b) || (typeA === b && typeB === a)
  );
}

/**
 * 检查事件内容是否违反角色特质
 * @param traitName - 特质名称
 * @param content - 事件内容
 * @returns 是否违反
 */
function checkTraitViolation(traitName: string, content: string): boolean {
  const lowerContent = content.toLowerCase();
  const lowerTrait = traitName.toLowerCase();

  for (const [groupA, groupB] of CONTRADICTION_PAIRS) {
    if (groupA.includes(lowerTrait)) {
      return groupB.some((w) => lowerContent.includes(w));
    }
    if (groupB.includes(lowerTrait)) {
      return groupA.some((w) => lowerContent.includes(w));
    }
  }

  return false;
}
