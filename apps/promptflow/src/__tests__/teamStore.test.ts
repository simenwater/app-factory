import { useTeamStore } from '@/store/teamStore';

/**
 * @description 团队 Store 单元测试
 */
describe('teamStore', () => {
  beforeEach(() => {
    useTeamStore.setState({
      teams: [],
      activeTeamId: null,
    });
  });

  describe('createTeam', () => {
    it('should create a team with the owner as current user', () => {
      const team = useTeamStore.getState().createTeam('测试团队');
      expect(team.name).toBe('测试团队');
      expect(team.members.length).toBe(1);
      expect(team.members[0].role).toBe('owner');

      const state = useTeamStore.getState();
      expect(state.teams.length).toBe(1);
      expect(state.activeTeamId).toBe(team.id);
    });
  });

  describe('deleteTeam', () => {
    it('should remove the team', () => {
      const team = useTeamStore.getState().createTeam('待删除团队');
      expect(useTeamStore.getState().teams.length).toBe(1);

      useTeamStore.getState().deleteTeam(team.id);
      expect(useTeamStore.getState().teams.length).toBe(0);
      expect(useTeamStore.getState().activeTeamId).toBeNull();
    });
  });

  describe('addMember', () => {
    it('should add a member to the specified team', () => {
      const team = useTeamStore.getState().createTeam('团队A');
      useTeamStore.getState().addMember(team.id, {
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: '',
        role: 'editor',
      });

      const updatedTeam = useTeamStore.getState().teams.find((t) => t.id === team.id);
      expect(updatedTeam?.members.length).toBe(2);
      expect(updatedTeam?.members[1].name).toBe('张三');
      expect(updatedTeam?.members[1].role).toBe('editor');
    });
  });

  describe('removeMember', () => {
    it('should remove the specified member', () => {
      const team = useTeamStore.getState().createTeam('团队B');
      useTeamStore.getState().addMember(team.id, {
        name: '李四',
        email: 'lisi@example.com',
        avatar: '',
        role: 'editor',
      });

      const addedMember = useTeamStore.getState().teams.find((t) => t.id === team.id)?.members[1];
      useTeamStore.getState().removeMember(team.id, addedMember!.id);

      const updatedTeam = useTeamStore.getState().teams.find((t) => t.id === team.id);
      expect(updatedTeam?.members.length).toBe(1);
    });
  });

  describe('shareTemplate', () => {
    it('should add template id to shared list', () => {
      const team = useTeamStore.getState().createTeam('团队C');
      useTeamStore.getState().shareTemplate(team.id, 'template-1');

      const updatedTeam = useTeamStore.getState().teams.find((t) => t.id === team.id);
      expect(updatedTeam?.sharedTemplateIds).toContain('template-1');
    });

    it('should not duplicate template id if already shared', () => {
      const team = useTeamStore.getState().createTeam('团队D');
      useTeamStore.getState().shareTemplate(team.id, 'template-1');
      useTeamStore.getState().shareTemplate(team.id, 'template-1');

      const updatedTeam = useTeamStore.getState().teams.find((t) => t.id === team.id);
      expect(updatedTeam?.sharedTemplateIds.filter((id) => id === 'template-1').length).toBe(1);
    });
  });

  describe('unshareTemplate', () => {
    it('should remove template id from shared list', () => {
      const team = useTeamStore.getState().createTeam('团队E');
      useTeamStore.getState().shareTemplate(team.id, 'template-1');
      useTeamStore.getState().unshareTemplate(team.id, 'template-1');

      const updatedTeam = useTeamStore.getState().teams.find((t) => t.id === team.id);
      expect(updatedTeam?.sharedTemplateIds).not.toContain('template-1');
    });
  });

  describe('getActiveTeam', () => {
    it('should return undefined when no team is active', () => {
      expect(useTeamStore.getState().getActiveTeam()).toBeUndefined();
    });

    it('should return the active team', () => {
      const team = useTeamStore.getState().createTeam('活跃团队');
      expect(useTeamStore.getState().getActiveTeam()?.id).toBe(team.id);
    });
  });
});
