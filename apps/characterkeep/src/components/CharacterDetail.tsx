"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import type { Character } from "@/types";
import { RELATIONSHIP_TYPE_LABELS } from "@/types";
import { CharacterForm } from "./CharacterForm";
import { Edit, Trash2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * 角色详情展示组件
 * @param props - 组件属性
 * @param props.character - 角色数据
 */
export function CharacterDetail({ character }: { character: Character }) {
  const { deleteCharacter, selectCharacter, characters } = useAppStore();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <CharacterForm editId={character.id} onClose={() => setEditing(false)} />
    );
  }

  /** 确认删除角色 */
  const handleDelete = () => {
    if (confirm(`确定要删除角色「${character.name}」吗？此操作不可撤销。`)) {
      deleteCharacter(character.id);
      selectCharacter(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 头部 */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
          style={{ backgroundColor: character.avatarColor }}
        >
          {character.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {character.name}
          </h2>
          <div className="flex flex-wrap gap-2 mt-1">
            {character.role && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {character.role}
              </span>
            )}
            {character.age && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {character.age}岁
              </span>
            )}
            {character.gender && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {character.gender}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-1 mt-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <Clock className="w-3 h-3" />
            创建于 {formatDate(character.createdAt)}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setEditing(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--accent)" }}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--danger)" }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 标签 */}
      {character.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {character.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: "var(--accent)",
                color: "white",
                opacity: 0.85,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 背景故事 */}
      {character.backstory && (
        <section className="mb-5">
          <h3
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            背景故事
          </h3>
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap rounded-xl p-4"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            {character.backstory}
          </p>
        </section>
      )}

      {/* 性格特质 */}
      <section className="mb-5">
        <h3
          className="text-sm font-semibold mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          性格特质
        </h3>
        {character.traits.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            暂无特质，点击编辑添加
          </p>
        ) : (
          <div className="space-y-2">
            {character.traits.map((trait, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex-1">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {trait.name}
                  </div>
                  {trait.description && (
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {trait.description}
                    </div>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          i < trait.importance
                            ? "var(--accent)"
                            : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 角色关系 */}
      <section>
        <h3
          className="text-sm font-semibold mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          角色关系
        </h3>
        {character.relationships.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            暂无关系，点击编辑添加
          </p>
        ) : (
          <div className="space-y-2">
            {character.relationships.map((rel, idx) => {
              const target = characters.find(
                (c) => c.id === rel.targetCharacterId
              );
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {target && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: target.avatarColor }}
                    >
                      {target.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {target?.name ?? "未知角色"}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {RELATIONSHIP_TYPE_LABELS[rel.type]}
                      {rel.description && ` — ${rel.description}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
