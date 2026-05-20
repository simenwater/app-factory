"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Check, Clock, Copy, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatDate, generateId } from "@/lib/utils";
import { fillTemplate } from "@/lib/templates";
import { EmptyState } from "@/components/EmptyState";
import type { FollowUp, FollowUpTemplate } from "@/types";

/**
 * @description 跟进模板与自动化页面
 */
export default function FollowUpsPage() {
  const {
    quotes,
    followUps,
    templates,
    addFollowUp,
    updateFollowUp,
    settings,
  } = useStore();
  const [activeTab, setActiveTab] = useState<"pending" | "templates" | "history">("pending");
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const pendingFollowUps = followUps.filter((f) => f.status === "pending");
  const sentFollowUps = followUps.filter((f) => f.status === "sent");

  const sentQuotes = quotes.filter((q) => q.quoteStatus === "sent");

  /**
   * @description 从模板创建跟进
   */
  const createFollowUpFromTemplate = (template: FollowUpTemplate, quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;

    const variables: Record<string, string> = {
      clientName: quote.client.name,
      quoteNumber: quote.quoteNumber,
      serviceDescription: quote.serviceDescription,
      businessName: settings.businessName || "QuoteFlow AI",
      validUntil: formatDate(quote.validUntil),
      totalAmount: `$${quote.total.toFixed(2)}`,
      dueDate: formatDate(quote.validUntil),
      daysSince: String(
        Math.floor(
          (Date.now() - new Date(quote.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),
    };

    const followUp: FollowUp = {
      id: generateId(),
      quoteId: quote.id,
      clientId: quote.client.id,
      channel: template.channel,
      subject: fillTemplate(template.subject, variables),
      body: fillTemplate(template.body, variables),
      scheduledAt: new Date().toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    addFollowUp(followUp);
  };

  /**
   * @description 标记跟进已发送
   */
  const markAsSent = (id: string) => {
    updateFollowUp(id, {
      status: "sent",
      sentAt: new Date().toISOString(),
    });
  };

  /**
   * @description 复制跟进内容到剪贴板
   */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback silently
    }
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Follow-ups</h1>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {(["pending", "templates", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-surface text-text-muted dark:bg-surface-dark dark:text-text-muted-dark"
            }`}
          >
            {tab}
            {tab === "pending" && pendingFollowUps.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                {pendingFollowUps.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending Tab */}
      {activeTab === "pending" && (
        <div>
          {pendingFollowUps.length === 0 ? (
            <div>
              <EmptyState
                icon={Clock}
                title="No pending follow-ups"
                description="Create follow-ups from templates for your sent quotes"
              />

              {/* Quick Create from Sent Quotes */}
              {sentQuotes.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
                    Quick Create for Sent Quotes
                  </h3>
                  {sentQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="mb-3 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark"
                    >
                      <p className="mb-2 font-medium">
                        {quote.client.name} — {quote.quoteNumber}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {templates.slice(0, 3).map((template) => (
                          <button
                            key={template.id}
                            onClick={() =>
                              createFollowUpFromTemplate(template, quote.id)
                            }
                            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                          >
                            <Sparkles size={12} /> {template.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {pendingFollowUps.map((fu) => {
                const quote = quotes.find((q) => q.id === fu.quoteId);
                return (
                  <div
                    key={fu.id}
                    className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {fu.channel === "email" ? (
                          <Mail size={14} className="text-blue-500" />
                        ) : (
                          <MessageSquare size={14} className="text-green-500" />
                        )}
                        <span className="text-sm font-medium">
                          {quote?.client.name ?? "Unknown"}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted dark:text-text-muted-dark">
                        {quote?.quoteNumber}
                      </span>
                    </div>
                    {fu.subject && (
                      <p className="mb-1 text-sm font-medium">{fu.subject}</p>
                    )}
                    <p className="mb-3 text-xs text-text-muted line-clamp-2 dark:text-text-muted-dark">
                      {fu.body}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setShowPreview(showPreview === fu.id ? null : fu.id)
                        }
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium dark:bg-gray-800"
                      >
                        {showPreview === fu.id ? "Hide" : "Preview"}
                      </button>
                      <button
                        onClick={() => copyToClipboard(fu.body)}
                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium dark:bg-gray-800"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <button
                        onClick={() => markAsSent(fu.id)}
                        className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        <Check size={12} /> Mark Sent
                      </button>
                    </div>
                    {showPreview === fu.id && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs whitespace-pre-line dark:bg-gray-800">
                        {fu.body}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {template.channel === "email" ? (
                    <Mail size={14} className="text-blue-500" />
                  ) : (
                    <MessageSquare size={14} className="text-green-500" />
                  )}
                  <span className="font-medium">{template.name}</span>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize dark:bg-gray-800">
                  {template.channel}
                </span>
              </div>
              {template.subject && (
                <p className="mb-1 text-sm text-text-muted dark:text-text-muted-dark">
                  Subject: {template.subject}
                </p>
              )}
              <p className="text-xs text-text-muted line-clamp-2 dark:text-text-muted-dark">
                {template.body}
              </p>
              {template.daysAfterQuote > 0 && (
                <p className="mt-2 text-xs font-medium text-indigo-500">
                  Auto-trigger: {template.daysAfterQuote} days after quote sent
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div>
          {sentFollowUps.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No sent follow-ups"
              description="Your sent follow-up history will appear here"
            />
          ) : (
            <div className="space-y-3">
              {sentFollowUps.map((fu) => {
                const quote = quotes.find((q) => q.id === fu.quoteId);
                return (
                  <div
                    key={fu.id}
                    className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {quote?.client.name ?? "Unknown"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Check size={12} /> Sent
                      </span>
                    </div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {fu.sentAt ? formatDate(fu.sentAt) : ""} &middot;{" "}
                      {quote?.quoteNumber}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
