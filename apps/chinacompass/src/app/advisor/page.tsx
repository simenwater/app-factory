"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Trash2, Lightbulb } from "lucide-react";
import ChatMessageComponent from "@/components/ChatMessage";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUESTIONS = [
  "中国电商企业进入欧盟市场需要注意哪些合规要求？",
  "美国对中国企业的出口管制有哪些最新变化？",
  "在新加坡注册公司需要什么条件？",
  "东南亚各国数据保护法有什么区别？",
  "中国制造企业出口产品到日本需要哪些认证？",
  "如何应对欧盟碳边境调节机制(CBAM)？",
];

/**
 * @description AI合规顾问聊天页面
 */
export default function AdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.reply || "抱歉，暂时无法回答您的问题。",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "网络错误，请稍后重试。",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-navy-600" />
          <div>
            <h1 className="text-lg font-bold">AI合规顾问</h1>
            <p className="text-xs text-gray-400">
              智能解答出海合规问题
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
          >
            <Trash2 className="w-4 h-4" />
            清除对话
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              您好！我是ChinaCompass AI顾问
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              我可以帮您解答出海合规方面的各种问题，包括各国政策法规、税务、数据保护、劳工法等。
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Lightbulb className="w-4 h-4" />
                <span>试试这些问题：</span>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-4 py-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 text-gray-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageComponent key={msg.id} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI顾问正在思考...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的出海合规问题..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="shrink-0 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white p-2.5 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
