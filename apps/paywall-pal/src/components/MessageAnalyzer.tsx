"use client";

import { AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { useAppStore } from "@/store";

/**
 * @description 消息分析组件 - 粘贴客户消息并分析是否为免费请求
 */
export function MessageAnalyzer() {
  const { inputMessage, setInputMessage, runAnalysis, analysisResult, canUseFeature } =
    useAppStore();

  const handleAnalyze = () => {
    if (!inputMessage.trim()) return;
    runAnalysis();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analyze Client Message</h2>
        <p className="text-(--color-muted)">
          Paste a message from a potential client to detect if they&apos;re asking for free work.
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Paste the client's message here... e.g. 'Hey! I have a quick project that won't take long. Great for your portfolio!'"
          className="w-full h-48 p-4 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-foreground) placeholder:text-(--color-muted) resize-none focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all"
        />

        <button
          onClick={handleAnalyze}
          disabled={!inputMessage.trim() || !canUseFeature()}
          className="w-full py-3 px-6 bg-(--color-primary) hover:bg-(--color-primary-hover) disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Analyze Message
        </button>
      </div>

      {analysisResult && (
        <div
          className={`p-6 rounded-xl border ${
            analysisResult.isFreeWorkRequest
              ? "border-(--color-warning) bg-amber-50 dark:bg-amber-950/20"
              : "border-(--color-success) bg-emerald-50 dark:bg-emerald-950/20"
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            {analysisResult.isFreeWorkRequest ? (
              <AlertTriangle className="w-6 h-6 text-(--color-warning) shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-6 h-6 text-(--color-success) shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-semibold text-lg">{analysisResult.summary}</h3>
              <p className="text-sm text-(--color-muted) mt-1">
                Confidence: {Math.round(analysisResult.confidence * 100)}%
              </p>
            </div>
          </div>

          {analysisResult.indicators.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Detected Indicators:</h4>
              <ul className="space-y-1">
                {analysisResult.indicators.map((indicator, index) => (
                  <li
                    key={index}
                    className="text-sm text-(--color-muted) flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-(--color-warning)" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.isFreeWorkRequest && (
            <div className="mt-4 pt-4 border-t border-(--color-border)">
              <p className="text-sm font-medium">
                💡 Recommended: Generate a polite rejection and include your rates.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl bg-(--color-surface) border border-(--color-border)">
        <h3 className="font-medium mb-2">💡 Example Messages to Test</h3>
        <div className="space-y-2">
          {EXAMPLE_MESSAGES.map((msg, i) => (
            <button
              key={i}
              onClick={() => setInputMessage(msg)}
              className="block w-full text-left text-sm text-(--color-muted) hover:text-(--color-foreground) p-2 rounded-lg hover:bg-(--color-background) transition-colors"
            >
              &quot;{msg.slice(0, 80)}...&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const EXAMPLE_MESSAGES = [
  "Hey! I have this quick project for a logo. Won't take you long and it'll be great exposure for your portfolio! Maybe we can work something out without payment this time?",
  "Hi, we're a startup and don't have much budget right now, but this could turn into a long-term paid gig. Can you do this one for free as a trial?",
  "Hello, I'd like to hire you for a website redesign. Our budget is $5,000 and we need it done in 3 weeks. Can you send me a quote?",
];
