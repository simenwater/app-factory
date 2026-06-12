"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { CharacterForm } from "./CharacterForm";
import { CharacterDetail } from "./CharacterDetail";
import { Plus, Search } from "lucide-react";
import { truncateText } from "@/lib/utils";

/**
 * 角色管理面板 — 显示角色列表 + 新增/编辑
 */
export function CharacterPanel() {
  const { characters, selectedCharacterId, selectCharacter, subscription } =
    useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const canAddMore = characters.length < subscription.maxCharacters;

  const filteredCharacters = characters.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedCharacter = characters.find(
    (c) => c.id === selectedCharacterId
  );

  return (
    <div className="flex h-full">
      {/* 角色列表 */}
      <div
        className="w-80 border-r flex flex-col shrink-0"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              角色管理
            </h2>
            <button
              onClick={() => {
                if (canAddMore) {
                  setShowForm(true);
                  selectCharacter(null);
                }
              }}
              disabled={!canAddMore}
              className="p-2 rounded-lg transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--accent)", color: "white" }}
              title={canAddMore ? "新增角色" : "已达上限，请升级订阅"}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            <Search className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="搜索角色…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {characters.length}/{subscription.maxCharacters === Infinity ? "∞" : subscription.maxCharacters} 角色
          </p>
        </div>

        <div className="flex-1 overflow-auto px-2 pb-2 space-y-1">
          {filteredCharacters.length === 0 && (
            <p
              className="text-center text-sm py-8"
              style={{ color: "var(--text-muted)" }}
            >
              {characters.length === 0
                ? "还没有角色，点击 + 创建第一个角色"
                : "没有匹配的角色"}
            </p>
          )}
          {filteredCharacters.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                selectCharacter(char.id);
                setShowForm(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                backgroundColor:
                  selectedCharacterId === char.id
                    ? "var(--bg-tertiary)"
                    : "transparent",
                border:
                  selectedCharacterId === char.id
                    ? "1px solid var(--border)"
                    : "1px solid transparent",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: char.avatarColor }}
              >
                {char.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div
                  className="font-medium text-sm truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {char.name}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {char.role || "未设定身份"}
                  {char.traits.length > 0 &&
                    ` · ${truncateText(char.traits.map((t) => t.name).join("、"), 20)}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧详情区 */}
      <div className="flex-1 overflow-auto">
        {showForm && (
          <CharacterForm onClose={() => setShowForm(false)} />
        )}
        {!showForm && selectedCharacter && (
          <CharacterDetail character={selectedCharacter} />
        )}
        {!showForm && !selectedCharacter && (
          <div
            className="flex items-center justify-center h-full"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🎭</div>
              <p className="text-sm">选择一个角色查看详情，或创建新角色</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
