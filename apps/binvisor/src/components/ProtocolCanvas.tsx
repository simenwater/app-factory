"use client";

/**
 * @fileoverview 交互式二进制结构可视化画布
 * 根据解析后的 ProtocolStructure 渲染可交互的位级结构图
 */

import { useRef, useCallback, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { ProtocolField } from "@/types";

/** 每行的位数（标准网络协议用 32） */
const BITS_PER_ROW = 32;
/** 单个 bit 单元的宽度 */
const BIT_CELL_WIDTH = 28;
/** 行高 */
const ROW_HEIGHT = 52;
/** 头部区域高度 */
const HEADER_HEIGHT = 70;

/** 段信息：字段在一行中的片段 */
interface Segment {
  field: ProtocolField;
  fieldIndex: number;
  startBit: number;
  endBit: number;
  isFirstSegment: boolean;
}

/**
 * 将字段列表拆分为行级段列表
 * @param {ProtocolField[]} fields - 协议字段列表
 * @returns {Segment[][]} 每行的段列表
 */
function buildRows(fields: ProtocolField[]): Segment[][] {
  const rows: Segment[][] = [];
  let currentRow: Segment[] = [];
  let bitInRow = 0;

  fields.forEach((field, fieldIndex) => {
    let remaining = field.bits;
    let isFirst = true;
    while (remaining > 0) {
      const available = BITS_PER_ROW - bitInRow;
      const take = Math.min(remaining, available);

      currentRow.push({
        field,
        fieldIndex,
        startBit: bitInRow,
        endBit: bitInRow + take - 1,
        isFirstSegment: isFirst,
      });

      bitInRow += take;
      remaining -= take;
      isFirst = false;

      if (bitInRow >= BITS_PER_ROW) {
        rows.push(currentRow);
        currentRow = [];
        bitInRow = 0;
      }
    }
  });

  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
}

/**
 * 协议可视化画布组件
 * @returns {React.ReactElement}
 */
export default function ProtocolCanvas() {
  const structure = useStore((s) => s.structure);
  const zoom = useStore((s) => s.zoom);
  const setZoom = useStore((s) => s.setZoom);
  const resetZoom = useStore((s) => s.resetZoom);
  const selectedFieldIndex = useStore((s) => s.selectedFieldIndex);
  const selectField = useStore((s) => s.selectField);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hoveredField, setHoveredField] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [tooltipField, setTooltipField] = useState<ProtocolField | null>(null);

  /** 处理缩放 */
  const handleZoomIn = useCallback(() => {
    setZoom({ scale: Math.min(zoom.scale + 0.2, 3) });
  }, [zoom.scale, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom({ scale: Math.max(zoom.scale - 0.2, 0.4) });
  }, [zoom.scale, setZoom]);

  /** 处理鼠标滚轮缩放 */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom({ scale: Math.max(0.4, Math.min(3, zoom.scale + delta)) });
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoom.scale, setZoom]);

  if (!structure) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <p className="text-sm font-medium">No protocol loaded</p>
          <p className="text-xs mt-1">
            Enter a specification or load an example
          </p>
        </div>
      </div>
    );
  }

  const rows = buildRows(structure.fields);
  const totalWidth = BITS_PER_ROW * BIT_CELL_WIDTH + 100;
  const totalHeight = HEADER_HEIGHT + rows.length * ROW_HEIGHT + 60;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {structure.name}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
            {structure.endianness === "big" ? "Big Endian" : "Little Endian"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-xs text-gray-500 min-w-[3rem] text-center">
            {Math.round(zoom.scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Reset zoom"
          >
            <Maximize2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        id="binvisor-canvas"
        className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/50 p-6 relative"
      >
        <div
          style={{
            transform: `scale(${zoom.scale})`,
            transformOrigin: "top left",
            minWidth: totalWidth,
            minHeight: totalHeight,
          }}
        >
          {/* Bit number labels */}
          <div className="flex items-end mb-1 ml-[50px]">
            {Array.from({ length: BITS_PER_ROW }, (_, i) => (
              <div
                key={i}
                className="text-center"
                style={{ width: BIT_CELL_WIDTH }}
              >
                {i % 4 === 0 && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">
                    {i}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-stretch mb-0.5">
                {/* Row byte offset */}
                <div
                  className="flex items-center justify-end pr-3 text-[10px] font-mono text-gray-400 dark:text-gray-600"
                  style={{ width: 50 }}
                >
                  {rowIdx * (BITS_PER_ROW / 8)}
                </div>

                {/* Segments */}
                {row.map((seg, segIdx) => {
                  const w = (seg.endBit - seg.startBit + 1) * BIT_CELL_WIDTH;
                  const isHovered = hoveredField === seg.fieldIndex;
                  const isSelected = selectedFieldIndex === seg.fieldIndex;

                  return (
                    <div
                      key={segIdx}
                      className="relative flex items-center justify-center cursor-pointer transition-all duration-150"
                      style={{
                        width: w,
                        height: ROW_HEIGHT,
                        backgroundColor: seg.field.color || "#6366f1",
                        opacity: isHovered || isSelected ? 1 : 0.85,
                        borderRadius: 6,
                        margin: "0 1px",
                        transform:
                          isHovered || isSelected ? "scale(1.02)" : "scale(1)",
                        zIndex: isHovered || isSelected ? 10 : 1,
                        boxShadow:
                          isHovered || isSelected
                            ? `0 4px 20px ${seg.field.color}66`
                            : "none",
                      }}
                      onClick={() => selectField(seg.fieldIndex)}
                      onMouseEnter={(e) => {
                        setHoveredField(seg.fieldIndex);
                        setTooltipField(seg.field);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => {
                        setHoveredField(null);
                        setTooltipField(null);
                        setTooltipPos(null);
                      }}
                    >
                      {w > 40 && (
                        <div className="text-center overflow-hidden px-1">
                          <p className="text-[11px] font-semibold text-white truncate leading-tight">
                            {seg.field.name}
                          </p>
                          <p className="text-[9px] text-white/70 leading-tight mt-0.5">
                            {seg.field.type} · {seg.endBit - seg.startBit + 1}b
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltipField && tooltipPos && (
          <div
            className="fixed z-50 px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white shadow-xl pointer-events-none"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y + 12,
            }}
          >
            <p className="text-sm font-semibold">{tooltipField.name}</p>
            <p className="text-xs text-gray-300 mt-0.5">
              Type: {tooltipField.type} · {tooltipField.bits} bits
            </p>
            {tooltipField.description && (
              <p className="text-xs text-gray-400 mt-0.5">
                {tooltipField.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
