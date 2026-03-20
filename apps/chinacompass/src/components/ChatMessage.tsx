"use client";

import type { ChatMessage as ChatMessageType } from "@/types";
import { Globe, User } from "lucide-react";

/**
 * @description 聊天消息气泡组件
 * @param message - 消息数据
 */
export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"} animate-fade-in`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAssistant ? "bg-navy-100 text-navy-600" : "bg-brand-100 text-brand-600"
        }`}
      >
        {isAssistant ? (
          <Globe className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-gray-100 text-gray-800"
            : "bg-brand-500 text-white"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
