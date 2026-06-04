'use client';

/**
 * @fileoverview SafeRecord AI 主页
 * 录音应用主界面，集成录音、历史列表和转录视图
 */

import { useState } from 'react';
import { Settings, Shield } from 'lucide-react';
import { RecordButton } from '@/components/RecordButton';
import { RecordingList } from '@/components/RecordingList';
import { TranscriptionView } from '@/components/TranscriptionView';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useRecordingStore } from '@/store/recordingStore';

/**
 * @description 主页面组件
 */
export default function HomePage() {
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const recordings = useRecordingStore((s) => s.recordings);
  const status = useRecordingStore((s) => s.status);

  const selectedRecording = recordings.find((r) => r.id === selectedRecordingId);

  if (selectedRecording) {
    return (
      <TranscriptionView
        recording={selectedRecording}
        onBack={() => setSelectedRecordingId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-text dark:text-text-dark">
            SafeRecord AI
          </h1>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="设置"
        >
          <Settings className="w-5 h-5 text-muted dark:text-muted-dark" />
        </button>
      </header>

      {/* 录音控制区 */}
      <section className="px-4 py-8">
        <RecordButton />
      </section>

      {/* 订阅引导 */}
      {status === 'idle' && <SubscriptionBanner />}

      {/* 录音历史 */}
      <section className="flex-1 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted dark:text-muted-dark">
            录音历史 ({recordings.length})
          </h2>
        </div>
        <RecordingList onSelect={setSelectedRecordingId} />
      </section>

      {/* 设置面板 */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}
