"use client";

/**
 * @fileoverview 主页面 - BinVisor 应用入口
 */

import Header from "@/components/Header";
import ProtocolInput from "@/components/ProtocolInput";
import ProtocolCanvas from "@/components/ProtocolCanvas";
import FieldDetails from "@/components/FieldDetails";
import ExportPanel from "@/components/ExportPanel";
import PricingModal from "@/components/PricingModal";

/**
 * 主页面组件
 * @returns {React.ReactElement}
 */
export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Left panel: input + export */}
        <div className="w-[420px] min-w-[320px] border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950">
          <div className="flex-1 overflow-hidden">
            <ProtocolInput />
          </div>
          <ExportPanel />
        </div>

        {/* Right panel: canvas */}
        <div className="flex-1 relative bg-gray-50 dark:bg-gray-950">
          <ProtocolCanvas />
          <FieldDetails />
        </div>
      </main>

      <PricingModal />
    </div>
  );
}
