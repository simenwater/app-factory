'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AVAILABLE_ROLES, EXPERIENCE_LABELS } from '@/lib/market-data';
import { Plus, Trash2, ArrowLeft, Play, Briefcase } from 'lucide-react';
import type { ExperienceLevel } from '@/types';

/**
 * @description 岗位添加/管理表单
 */
export default function PositionForm() {
  const { positions, addPosition, removePosition, setStep, runSimulation, isSimulating } = useStore();
  const [title, setTitle] = useState(AVAILABLE_ROLES[0]);
  const [level, setLevel] = useState<ExperienceLevel>('mid');
  const [currentSalary, setCurrentSalary] = useState<number>(0);
  const [headcount, setHeadcount] = useState<number>(1);

  const handleAdd = () => {
    addPosition({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title,
      experienceLevel: level,
      currentSalary: currentSalary > 0 ? currentSalary : undefined,
      headcount,
    });
    setCurrentSalary(0);
    setHeadcount(1);
  };

  const handleSimulate = () => {
    runSimulation();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add positions to simulate
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Add the roles you want to evaluate. We&apos;ll find market data and recommend fair compensation.
        </p>
      </div>

      {/* Add Position Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add a Position
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Role / Title
            </label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
            >
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Experience Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
            >
              {Object.entries(EXPERIENCE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Current Salary ($) <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              value={currentSalary || ''}
              onChange={(e) => setCurrentSalary(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
              placeholder="Leave blank for market estimate"
              min={0}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Headcount
            </label>
            <input
              type="number"
              value={headcount}
              onChange={(e) => setHeadcount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
              min={1}
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium rounded-xl border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-sm"
        >
          <Plus className="w-4 h-4 inline mr-1" /> Add Position
        </button>
      </div>

      {/* Position List */}
      {positions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Added Positions ({positions.length})
          </h3>
          <div className="space-y-3">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {pos.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {EXPERIENCE_LABELS[pos.experienceLevel]} &middot; {pos.headcount} {pos.headcount > 1 ? 'people' : 'person'}
                    {pos.currentSalary ? ` · $${pos.currentSalary.toLocaleString()}/yr` : ''}
                  </p>
                </div>
                <button
                  onClick={() => removePosition(pos.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setStep(0)}
          className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleSimulate}
          disabled={positions.length === 0 || isSimulating}
          className="flex-[2] py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
