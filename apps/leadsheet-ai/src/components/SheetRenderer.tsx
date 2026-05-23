"use client";

/**
 * @fileoverview 乐谱渲染组件
 * 使用 abcjs 将 ABC 记谱法渲染为 SVG 五线谱。
 */

import { useEffect, useRef } from "react";
import type { LeadSheet } from "@/types";
import { toABC } from "@/lib/exportUtils";

interface SheetRendererProps {
  sheet: LeadSheet;
  currentMeasure?: number;
}

/**
 * @description 五线谱渲染组件（基于 abcjs）
 */
export function SheetRenderer({ sheet, currentMeasure = -1 }: SheetRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    async function render() {
      const abcjs = await import("abcjs");
      if (cancelled || !containerRef.current) return;

      const abc = toABC(sheet);

      abcjs.renderAbc(containerRef.current!, abc, {
        responsive: "resize",
        staffwidth: 700,
        paddingtop: 10,
        paddingbottom: 10,
        add_classes: true,
      });

      if (currentMeasure >= 0 && containerRef.current) {
        const measures = containerRef.current.querySelectorAll(".abcjs-measure");
        measures.forEach((el, idx) => {
          if (idx === currentMeasure) {
            (el as HTMLElement).style.backgroundColor = "rgba(139, 92, 246, 0.15)";
            (el as HTMLElement).style.borderRadius = "4px";
          } else {
            (el as HTMLElement).style.backgroundColor = "";
          }
        });
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [sheet, currentMeasure]);

  return (
    <div className="overflow-x-auto rounded-xl bg-white p-4 dark:bg-gray-900">
      <div ref={containerRef} className="min-h-[120px]" />
    </div>
  );
}
