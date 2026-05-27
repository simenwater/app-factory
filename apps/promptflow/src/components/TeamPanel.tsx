'use client';

import { useState } from 'react';
import { X, Plus, Users, Trash2, Mail } from 'lucide-react';
import { useTeamStore } from '@/store/teamStore';

/** @description TeamPanel 组件 Props */
interface TeamPanelProps {
  onClose: () => void;
  onToast: (message: string, type?: 'success' | 'error') => void;
}

/**
 * @description 团队管理面板，支持创建团队、邀请成员
 * @param {TeamPanelProps} props
 */
export function TeamPanel({ onClose, onToast }: TeamPanelProps) {
  const { teams, activeTeamId, createTeam, deleteTeam, setActiveTeam, addMember, removeMember } =
    useTeamStore();
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      onToast('请输入团队名称', 'error');
      return;
    }
    createTeam(newTeamName.trim());
    setNewTeamName('');
    onToast('团队已创建');
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || !activeTeamId) {
      onToast('请输入邮箱地址', 'error');
      return;
    }
    addMember(activeTeamId, {
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      avatar: '',
      role: 'editor',
    });
    setInviteEmail('');
    onToast('成员已邀请');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} style={{ color: 'var(--accent)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              团队管理
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2" style={{ color: 'var(--text-tertiary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* 创建团队 */}
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            创建新团队
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="团队名称"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={handleCreateTeam}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--accent)' }}
            >
              <Plus size={14} />
              创建
            </button>
          </div>
        </div>

        {/* 团队列表 */}
        {teams.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              我的团队
            </h3>
            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-lg border p-3 cursor-pointer"
                  style={{
                    borderColor: team.id === activeTeamId ? 'var(--accent)' : 'var(--border)',
                    background: team.id === activeTeamId ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  }}
                  onClick={() => setActiveTeam(team.id)}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {team.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {team.members.length} 名成员 · {team.sharedTemplateIds.length} 个共享模板
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTeam(team.id);
                      onToast('团队已删除');
                    }}
                    className="rounded p-1"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 团队成员 */}
        {activeTeam && (
          <div>
            <h3 className="mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              「{activeTeam.name}」成员
            </h3>
            <div className="mb-3 flex gap-2">
              <div className="relative flex-1">
                <Mail
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}
                />
                <input
                  type="email"
                  placeholder="输入邮箱邀请成员"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  className="w-full rounded-lg border py-2 pl-8 pr-3 text-sm"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <button
                onClick={handleInvite}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--accent)' }}
              >
                邀请
              </button>
            </div>
            <div className="space-y-1">
              {activeTeam.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg p-2"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white"
                      style={{ background: 'var(--accent)' }}
                    >
                      {member.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {member.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                      {member.role === 'owner' ? '所有者' : member.role === 'editor' ? '编辑者' : '查看者'}
                    </span>
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => {
                          removeMember(activeTeam.id, member.id);
                          onToast('成员已移除');
                        }}
                        className="rounded p-1"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
