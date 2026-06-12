"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { X, Plus, Trash2 } from "lucide-react";
import type { Trait, Relationship, RelationshipType } from "@/types";
import { RELATIONSHIP_TYPE_LABELS } from "@/types";

/**
 * @param props - 组件属性
 * @param props.onClose - 关闭回调
 * @param props.editId - 编辑模式时传入的角色 ID
 */
export function CharacterForm({
  onClose,
  editId,
}: {
  onClose: () => void;
  editId?: string;
}) {
  const { addCharacter, updateCharacter, characters } = useAppStore();
  const editChar = editId ? characters.find((c) => c.id === editId) : null;

  const [name, setName] = useState(editChar?.name ?? "");
  const [age, setAge] = useState(editChar?.age ?? "");
  const [gender, setGender] = useState(editChar?.gender ?? "");
  const [role, setRole] = useState(editChar?.role ?? "");
  const [backstory, setBackstory] = useState(editChar?.backstory ?? "");
  const [tags, setTags] = useState(editChar?.tags.join("、") ?? "");
  const [traits, setTraits] = useState<Trait[]>(
    editChar?.traits ?? [{ name: "", description: "", importance: 3 }]
  );
  const [relationships, setRelationships] = useState<Relationship[]>(
    editChar?.relationships ?? []
  );

  const otherCharacters = characters.filter((c) => c.id !== editId);

  /** 提交表单 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const validTraits = traits.filter((t) => t.name.trim());
    const parsedTags = tags
      .split(/[、,，]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const data = {
      name: name.trim(),
      age: age.trim() || undefined,
      gender: gender.trim() || undefined,
      role: role.trim() || undefined,
      backstory: backstory.trim() || undefined,
      traits: validTraits,
      relationships,
      tags: parsedTags,
    };

    if (editId) {
      updateCharacter(editId, data);
    } else {
      addCharacter(data);
    }

    onClose();
  };

  /** 添加特质行 */
  const addTrait = () => {
    setTraits([...traits, { name: "", description: "", importance: 3 }]);
  };

  /** 删除特质行 */
  const removeTrait = (idx: number) => {
    setTraits(traits.filter((_, i) => i !== idx));
  };

  /** 更新特质 */
  const updateTrait = (idx: number, patch: Partial<Trait>) => {
    setTraits(traits.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  /** 添加关系 */
  const addRelationship = () => {
    if (otherCharacters.length === 0) return;
    setRelationships([
      ...relationships,
      {
        targetCharacterId: otherCharacters[0].id,
        type: "friend",
        description: "",
      },
    ]);
  };

  /** 删除关系 */
  const removeRelationship = (idx: number) => {
    setRelationships(relationships.filter((_, i) => i !== idx));
  };

  /** 更新关系 */
  const updateRelationship = (idx: number, patch: Partial<Relationship>) => {
    setRelationships(
      relationships.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    );
  };

  const inputStyle = {
    backgroundColor: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {editId ? "编辑角色" : "创建角色"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 基本信息 */}
        <section className="space-y-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            基本信息
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                名称 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                身份/职业
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                年龄
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                性别
              </label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              背景故事
            </label>
            <textarea
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              标签（用顿号或逗号分隔）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="主角、战士、勇敢"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </section>

        {/* 性格特质 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              性格特质
            </h3>
            <button
              type="button"
              onClick={addTrait}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
              style={{ color: "var(--accent)" }}
            >
              <Plus className="w-3 h-3" /> 添加
            </button>
          </div>
          {traits.map((trait, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={trait.name}
                  onChange={(e) => updateTrait(idx, { name: e.target.value })}
                  placeholder="特质名称"
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={trait.description}
                  onChange={(e) =>
                    updateTrait(idx, { description: e.target.value })
                  }
                  placeholder="描述"
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
                <select
                  value={trait.importance}
                  onChange={(e) =>
                    updateTrait(idx, { importance: Number(e.target.value) })
                  }
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                >
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option key={v} value={v}>
                      重要度 {v}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeTrait(idx)}
                className="p-2 rounded-lg"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        {/* 角色关系 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              角色关系
            </h3>
            <button
              type="button"
              onClick={addRelationship}
              disabled={otherCharacters.length === 0}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors disabled:opacity-40"
              style={{ color: "var(--accent)" }}
            >
              <Plus className="w-3 h-3" /> 添加
            </button>
          </div>
          {otherCharacters.length === 0 && relationships.length === 0 && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              需要先创建其他角色才能设定关系
            </p>
          )}
          {relationships.map((rel, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                value={rel.targetCharacterId}
                onChange={(e) =>
                  updateRelationship(idx, {
                    targetCharacterId: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              >
                {otherCharacters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={rel.type}
                onChange={(e) =>
                  updateRelationship(idx, {
                    type: e.target.value as RelationshipType,
                  })
                }
                className="px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              >
                {Object.entries(RELATIONSHIP_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={rel.description}
                onChange={(e) =>
                  updateRelationship(idx, { description: e.target.value })
                }
                placeholder="描述"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeRelationship(idx)}
                className="p-2 rounded-lg"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {editId ? "保存修改" : "创建角色"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
