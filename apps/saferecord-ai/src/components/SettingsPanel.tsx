'use client';

/**
 * @fileoverview 设置面板组件
 * 应用设置界面，支持主题、语言、音频质量等配置
 */

import { Moon, Sun, Monitor, Shield, Volume2, Globe } from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';
import type { AppSettings, SupportedLanguage } from '@/types';
import { getLanguageName } from '@/lib/formatters';

/**
 * @description 设置面板
 */
export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useRecordingStore();

  const themes: { value: AppSettings['theme']; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '浅色', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: '深色', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: '跟随系统', icon: <Monitor className="w-4 h-4" /> },
  ];

  const languages: SupportedLanguage[] = ['auto', 'zh', 'en', 'ja', 'ko', 'es', 'fr', 'de'];

  const audioQualities: { value: AppSettings['audioQuality']; label: string }[] = [
    { value: 16, label: '标准 (16kHz)' },
    { value: 44.1, label: '高质量 (44.1kHz)' },
    { value: 48, label: '专业 (48kHz)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-surface dark:bg-surface-dark w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface dark:bg-surface-dark p-4 border-b border-border dark:border-border-dark flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">设置</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-accent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            完成
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* 主题设置 */}
          <section>
            <h3 className="text-sm font-medium text-muted dark:text-muted-dark mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4" />
              外观
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ theme: value })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    settings.theme === value
                      ? 'border-accent bg-accent/5'
                      : 'border-border dark:border-border-dark hover:border-accent/50'
                  }`}
                >
                  {icon}
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 默认语言 */}
          <section>
            <h3 className="text-sm font-medium text-muted dark:text-muted-dark mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              默认转录语言
            </h3>
            <select
              value={settings.defaultLanguage}
              onChange={(e) =>
                updateSettings({ defaultLanguage: e.target.value as SupportedLanguage })
              }
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-border dark:border-border-dark rounded-xl text-sm text-text dark:text-text-dark"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageName(lang)}
                </option>
              ))}
            </select>
          </section>

          {/* 音频质量 */}
          <section>
            <h3 className="text-sm font-medium text-muted dark:text-muted-dark mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              录音质量
            </h3>
            <div className="space-y-2">
              {audioQualities.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ audioQuality: value })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    settings.audioQuality === value
                      ? 'border-accent bg-accent/5'
                      : 'border-border dark:border-border-dark hover:border-accent/50'
                  }`}
                >
                  <span className="text-sm text-text dark:text-text-dark">{label}</span>
                  {settings.audioQuality === value && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 后台保护 */}
          <section>
            <h3 className="text-sm font-medium text-muted dark:text-muted-dark mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              录音保护
            </h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="text-sm text-text dark:text-text-dark">后台防中断保护</p>
                <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
                  防止录音被系统或其他应用意外中断
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({ backgroundProtection: !settings.backgroundProtection })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.backgroundProtection ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.backgroundProtection ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* 自动转录 */}
          <section>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="text-sm text-text dark:text-text-dark">录音后自动转录</p>
                <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
                  录音结束后自动调用 AI 转录
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({ autoTranscribe: !settings.autoTranscribe })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.autoTranscribe ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoTranscribe ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
