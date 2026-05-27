import { create } from 'zustand';
import type { TeamSpace, TeamMember } from '@/types';
import { generateId } from '@/lib/utils';

/** @description 团队 Store 状态接口 */
interface TeamState {
  teams: TeamSpace[];
  activeTeamId: string | null;

  createTeam: (name: string) => TeamSpace;
  deleteTeam: (id: string) => void;
  setActiveTeam: (id: string | null) => void;

  addMember: (teamId: string, member: Omit<TeamMember, 'id'>) => void;
  removeMember: (teamId: string, memberId: string) => void;
  updateMemberRole: (teamId: string, memberId: string, role: TeamMember['role']) => void;

  shareTemplate: (teamId: string, templateId: string) => void;
  unshareTemplate: (teamId: string, templateId: string) => void;

  getActiveTeam: () => TeamSpace | undefined;
}

/** @description 团队协作全局 Store */
export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  activeTeamId: null,

  createTeam: (name) => {
    const team: TeamSpace = {
      id: generateId(),
      name,
      members: [
        {
          id: 'current-user',
          name: '我',
          email: 'me@example.com',
          avatar: '',
          role: 'owner',
        },
      ],
      sharedTemplateIds: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      teams: [...state.teams, team],
      activeTeamId: team.id,
    }));
    return team;
  },

  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      activeTeamId: state.activeTeamId === id ? null : state.activeTeamId,
    })),

  setActiveTeam: (id) => set({ activeTeamId: id }),

  addMember: (teamId, memberData) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [...team.members, { ...memberData, id: generateId() }],
            }
          : team
      ),
    })),

  removeMember: (teamId, memberId) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, members: team.members.filter((m) => m.id !== memberId) }
          : team
      ),
    })),

  updateMemberRole: (teamId, memberId, role) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
            }
          : team
      ),
    })),

  shareTemplate: (teamId, templateId) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId && !team.sharedTemplateIds.includes(templateId)
          ? { ...team, sharedTemplateIds: [...team.sharedTemplateIds, templateId] }
          : team
      ),
    })),

  unshareTemplate: (teamId, templateId) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, sharedTemplateIds: team.sharedTemplateIds.filter((id) => id !== templateId) }
          : team
      ),
    })),

  getActiveTeam: () => {
    const { teams, activeTeamId } = get();
    return teams.find((t) => t.id === activeTeamId);
  },
}));
