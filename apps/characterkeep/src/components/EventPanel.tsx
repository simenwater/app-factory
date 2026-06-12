"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { Plus, Trash2, Edit, X, Check, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * 剧情事件管理面板
 */
export function EventPanel() {
  const { events, characters, addEvent, updateEvent, deleteEvent } =
    useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chapter, setChapter] = useState("");
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);

  /** 重置表单 */
  const resetForm = () => {
    setTitle("");
    setContent("");
    setChapter("");
    setSelectedCharIds([]);
    setShowForm(false);
    setEditingId(null);
  };

  /** 提交事件 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      updateEvent(editingId, {
        title: title.trim(),
        content: content.trim(),
        chapter: chapter.trim() || undefined,
        characterIds: selectedCharIds,
      });
    } else {
      addEvent({
        title: title.trim(),
        content: content.trim(),
        chapter: chapter.trim() || undefined,
        characterIds: selectedCharIds,
      });
    }
    resetForm();
  };

  /** 开始编辑事件 */
  const startEdit = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;
    setTitle(ev.title);
    setContent(ev.content);
    setChapter(ev.chapter ?? "");
    setSelectedCharIds(ev.characterIds);
    setEditingId(eventId);
    setShowForm(true);
  };

  /** 切换角色选中状态 */
  const toggleCharacter = (charId: string) => {
    setSelectedCharIds((prev) =>
      prev.includes(charId)
        ? prev.filter((id) => id !== charId)
        : [...prev, charId]
    );
  };

  const inputStyle = {
    backgroundColor: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          剧情事件
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Plus className="w-4 h-4" /> 添加事件
        </button>
      </div>

      {/* 表单 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              {editingId ? "编辑事件" : "新建事件"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                事件标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                章节编号
              </label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="例如：第三章"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              事件内容 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
              required
            />
          </div>

          {/* 关联角色 */}
          <div>
            <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              关联角色
            </label>
            <div className="flex flex-wrap gap-2">
              {characters.map((char) => {
                const selected = selectedCharIds.includes(char.id);
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => toggleCharacter(char.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selected
                        ? char.avatarColor
                        : "var(--bg-tertiary)",
                      color: selected ? "white" : "var(--text-secondary)",
                      border: selected
                        ? `1px solid ${char.avatarColor}`
                        : "1px solid var(--border)",
                    }}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    {char.name}
                  </button>
                );
              })}
              {characters.length === 0 && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  请先创建角色
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {editingId ? "保存修改" : "添加事件"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              取消
            </button>
          </div>
        </form>
      )}

      {/* 事件列表 */}
      {events.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--text-muted)" }}
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">还没有剧情事件</p>
          <p className="text-xs mt-1">添加事件来追踪你的故事线</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const relatedChars = characters.filter((c) =>
              event.characterIds.includes(c.id)
            );
            return (
              <div
                key={event.id}
                className="rounded-xl p-4 transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {event.title}
                      </h3>
                      {event.chapter && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {event.chapter}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatDate(event.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(event.id)}
                      className="p-1.5 rounded-lg"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("确定删除此事件？")) deleteEvent(event.id);
                      }}
                      className="p-1.5 rounded-lg"
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {event.content}
                </p>

                {relatedChars.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {relatedChars.map((char) => (
                      <span
                        key={char.id}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: char.avatarColor + "20",
                          color: char.avatarColor,
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                          style={{ backgroundColor: char.avatarColor }}
                        >
                          {char.name.charAt(0)}
                        </span>
                        {char.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
