"use client";

import { Copy, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store";
import { getToneOptions } from "@/lib/rejection-generator";
import { RejectionTone } from "@/types";

/**
 * @description 礼貌拒绝消息生成组件
 */
export function RejectionGenerator() {
  const {
    rejectionConfig,
    setRejectionConfig,
    generateRejectionMsg,
    rejectionMessage,
    canUseFeature,
  } = useAppStore();
  const [copied, setCopied] = useState(false);

  const toneOptions = getToneOptions();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Generate Polite Rejection</h2>
        <p className="text-(--color-muted)">
          Create a professional message to decline free work requests while maintaining good
          relationships.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <div className="space-y-2">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRejectionConfig({ tone: option.value as RejectionTone })}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    rejectionConfig.tone === option.value
                      ? "border-(--color-primary) bg-(--color-primary)/5"
                      : "border-(--color-border) hover:border-(--color-primary)/50"
                  }`}
                >
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="block text-xs text-(--color-muted) mt-0.5">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeQuote"
              checked={rejectionConfig.includeQuote}
              onChange={(e) => setRejectionConfig({ includeQuote: e.target.checked })}
              className="w-4 h-4 rounded accent-(--color-primary)"
            />
            <label htmlFor="includeQuote" className="text-sm">
              Include rate information
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Signature (optional)
            </label>
            <input
              type="text"
              value={rejectionConfig.signature || ""}
              onChange={(e) => setRejectionConfig({ signature: e.target.value })}
              placeholder="e.g. Sarah Chen, UX Designer"
              className="w-full p-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>

          <button
            onClick={generateRejectionMsg}
            disabled={!canUseFeature()}
            className="w-full py-3 px-6 bg-(--color-primary) hover:bg-(--color-primary-hover) disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Message
          </button>
        </div>

        <div>
          {rejectionMessage ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-(--color-border) bg-(--color-surface)">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-(--color-muted) uppercase">
                    Subject
                  </span>
                  <button
                    onClick={() => handleCopy(rejectionMessage.subject)}
                    className="text-xs text-(--color-primary) hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm font-medium">{rejectionMessage.subject}</p>
              </div>

              <div className="p-4 rounded-xl border border-(--color-border) bg-(--color-surface)">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-(--color-muted) uppercase">
                    Body
                  </span>
                  <button
                    onClick={() => handleCopy(rejectionMessage.body)}
                    className="flex items-center gap-1 text-xs text-(--color-primary) hover:underline"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {rejectionMessage.body}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 rounded-xl border border-dashed border-(--color-border)">
              <p className="text-(--color-muted) text-center text-sm">
                Configure your preferences and click &quot;Generate Message&quot; to create a
                polite rejection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
