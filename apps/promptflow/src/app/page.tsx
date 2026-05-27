'use client';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TemplateList } from '@/components/TemplateList';
import { TemplateDetail } from '@/components/TemplateDetail';
import { PricingModal } from '@/components/PricingModal';
import { TeamPanel } from '@/components/TeamPanel';
import { Toast } from '@/components/Toast';
import { useThemeStore } from '@/store/themeStore';
import { useTemplateStore } from '@/store/templateStore';
import { useState } from 'react';

/**
 * @description 主页面组件，管理全局视图状态
 */
export default function HomePage() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const selectedTemplateId = useTemplateStore((s) => s.selectedTemplateId);
  const [showPricing, setShowPricing] = useState(false);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
      <div className="flex h-screen flex-col" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Header
          onShowPricing={() => setShowPricing(true)}
          onShowTeam={() => setShowTeamPanel(true)}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex flex-1 overflow-hidden">
            <TemplateList onToast={showToast} />
            {selectedTemplateId && <TemplateDetail onToast={showToast} />}
          </main>
        </div>

        {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
        {showTeamPanel && <TeamPanel onClose={() => setShowTeamPanel(false)} onToast={showToast} />}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
