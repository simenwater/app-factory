"use client";

/**
 * @fileoverview iReal Pro 导入页面
 * 支持从 irealb:// URL 导入歌曲，或从文本粘贴和弦字符串
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { parseIRealUrl, irealSongToLeadSheet, parseChordString } from "@/lib/ireal-parser";
import { useLibraryStore } from "@/store/library-store";
import type { LeadSheet } from "@/types";
import { v4 as uuidv4 } from "uuid";

type ImportMode = "url" | "text";

interface ImportResult {
  success: boolean;
  count: number;
  titles: string[];
  error?: string;
}

/**
 * @returns {JSX.Element} 导入页面
 */
export default function ImportPage() {
  const router = useRouter();
  const [mode, setMode] = useState<ImportMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textComposer, setTextComposer] = useState("");
  const [textKey, setTextKey] = useState("C");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const { importSheets, canSync, incrementSyncCount, subscription } =
    useLibraryStore();

  const handleImportUrl = async () => {
    if (!urlInput.trim()) return;

    if (!canSync()) {
      setResult({
        success: false,
        count: 0,
        titles: [],
        error: "Free sync limit reached. Please upgrade to Pro.",
      });
      return;
    }

    setIsImporting(true);
    try {
      const songs = parseIRealUrl(urlInput.trim());
      if (songs.length === 0) {
        setResult({
          success: false,
          count: 0,
          titles: [],
          error: "No songs found in the URL.",
        });
        return;
      }

      const sheets = songs.map(irealSongToLeadSheet);
      importSheets(sheets);
      incrementSyncCount();

      setResult({
        success: true,
        count: sheets.length,
        titles: sheets.map((s) => s.title),
      });
      setUrlInput("");
    } catch (err) {
      setResult({
        success: false,
        count: 0,
        titles: [],
        error: err instanceof Error ? err.message : "Failed to parse URL",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportText = async () => {
    if (!textInput.trim()) return;

    if (!canSync()) {
      setResult({
        success: false,
        count: 0,
        titles: [],
        error: "Free sync limit reached. Please upgrade to Pro.",
      });
      return;
    }

    setIsImporting(true);
    try {
      const sections = parseChordString(textInput.trim());
      const now = new Date().toISOString();
      const sheet: LeadSheet = {
        id: uuidv4(),
        title: textTitle || "Untitled",
        composer: textComposer || "Unknown",
        style: "Jazz",
        key: textKey,
        timeSignature: "4/4",
        sections,
        rawChordString: textInput.trim(),
        createdAt: now,
        updatedAt: now,
        tags: [],
        isFavorite: false,
      };

      importSheets([sheet]);
      incrementSyncCount();

      setResult({
        success: true,
        count: 1,
        titles: [sheet.title],
      });
      setTextInput("");
      setTextTitle("");
      setTextComposer("");
    } catch (err) {
      setResult({
        success: false,
        count: 0,
        titles: [],
        error: err instanceof Error ? err.message : "Failed to parse chord text",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4 px-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Import</h1>

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        Syncs used: {subscription.syncCount} / {subscription.plan === "free" ? subscription.maxFreeSync : "Unlimited"}
      </div>

      {/* Mode Tabs */}
      <div className="flex rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
        <button
          onClick={() => {
            setMode("url");
            setResult(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "url"
              ? "bg-indigo-600 text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          }`}
        >
          <Link2 size={16} /> iReal Pro URL
        </button>
        <button
          onClick={() => {
            setMode("text");
            setResult(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-indigo-600 text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          }`}
        >
          <FileText size={16} /> Chord Text
        </button>
      </div>

      {/* URL Import */}
      {mode === "url" && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Paste an <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-700">irealb://</code> URL to import songs directly from iReal Pro.
          </p>
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="irealb://Song%20Title=..."
            className="h-32 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-indigo-500"
          />
          <button
            onClick={handleImportUrl}
            disabled={!urlInput.trim() || isImporting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <Upload size={16} />
            {isImporting ? "Importing..." : "Import from iReal Pro"}
          </button>
        </div>
      )}

      {/* Text Import */}
      {mode === "text" && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Paste a chord chart using standard notation. Separate measures
            with <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-700">|</code> and chords with spaces.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="Song Title"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <input
              type="text"
              value={textComposer}
              onChange={(e) => setTextComposer(e.target.value)}
              placeholder="Composer"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <select
            value={textKey}
            onChange={(e) => setTextKey(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            {["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"].map(
              (k) => (
                <option key={k} value={k}>{k}</option>
              )
            )}
          </select>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="|Dm7 G7|Cmaj7 |Am7 |Dm7 G7|..."
            className="h-32 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-indigo-500"
          />
          <button
            onClick={handleImportText}
            disabled={!textInput.trim() || isImporting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <Upload size={16} />
            {isImporting ? "Importing..." : "Import Chord Chart"}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`animate-slide-up rounded-xl border p-4 ${
            result.success
              ? "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-950/20"
              : "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/20"
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2
                size={20}
                className="mt-0.5 text-green-600 dark:text-green-400"
              />
            ) : (
              <AlertCircle
                size={20}
                className="mt-0.5 text-red-600 dark:text-red-400"
              />
            )}
            <div>
              {result.success ? (
                <>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Imported {result.count} song{result.count > 1 ? "s" : ""} successfully!
                  </p>
                  <ul className="mt-1 text-sm text-green-700 dark:text-green-300">
                    {result.titles.map((t, i) => (
                      <li key={i}>&bull; {t}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push("/library")}
                    className="mt-2 text-sm font-medium text-green-700 underline dark:text-green-300"
                  >
                    Go to Library
                  </button>
                </>
              ) : (
                <p className="font-medium text-red-900 dark:text-red-100">
                  {result.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
