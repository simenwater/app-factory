"use client";

/**
 * @fileoverview 协议文本输入面板
 */

import { useStore } from "@/store/useStore";
import {
  FileText,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { getExampleProtocol, getIPv4Example, getUDPExample } from "@/lib/parser";

/** 示例协议列表 */
const EXAMPLES = [
  { name: "TCP Header", generator: getExampleProtocol },
  { name: "IPv4 Header", generator: getIPv4Example },
  { name: "UDP Header", generator: getUDPExample },
];

/**
 * 协议输入面板组件
 * @returns {React.ReactElement}
 */
export default function ProtocolInput() {
  const inputText = useStore((s) => s.inputText);
  const setInputText = useStore((s) => s.setInputText);
  const errors = useStore((s) => s.errors);
  const structure = useStore((s) => s.structure);
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Protocol Spec
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              Examples
              <ChevronDown className="w-3 h-3" />
            </button>
            {showExamples && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => {
                      setInputText(ex.generator());
                      setShowExamples(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setInputText("")}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Clear"
          >
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Paste your protocol specification here...\n\nSupported formats:\n\n# Simple format:\nField Name: type(bits) description\n\n# Table format:\n| Field | Type | Bits | Description |\n\n# C-like format:\nuint16 field_name; // description`}
          className="w-full h-full resize-none p-4 bg-transparent text-sm font-mono text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {errors.length > 0 ? (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {errors[0]}
          </p>
        ) : structure ? (
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {structure.fields.length} fields · {structure.totalBits} bits (
            {structure.totalBits / 8} bytes)
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            Enter a protocol specification to visualize
          </p>
        )}
        <span className="text-xs text-gray-400">
          {inputText.split("\n").length} lines
        </span>
      </div>
    </div>
  );
}
