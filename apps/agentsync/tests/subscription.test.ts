/**
 * @fileoverview 订阅系统单元测试
 */

import { SubscriptionManager } from '../src/utils/subscription';
import { SubscriptionPlan } from '../src/core/types';

describe('SubscriptionManager', () => {
  it('should default to free plan', () => {
    const manager = new SubscriptionManager();
    expect(manager.getPlan()).toBe(SubscriptionPlan.FREE);
  });

  it('should limit sources in free plan', () => {
    const manager = new SubscriptionManager(SubscriptionPlan.FREE);
    const limits = manager.getLimits();

    expect(limits.maxSources).toBe(3);
    expect(limits.teamSync).toBe(false);
    expect(limits.customTemplates).toBe(false);
  });

  it('should allow unlimited sources in pro plan', () => {
    const manager = new SubscriptionManager(SubscriptionPlan.PRO_MONTHLY);
    const limits = manager.getLimits();

    expect(limits.maxSources).toBe(Infinity);
    expect(limits.teamSync).toBe(true);
    expect(limits.customTemplates).toBe(true);
  });

  it('should check feature availability', () => {
    const freeManager = new SubscriptionManager(SubscriptionPlan.FREE);
    expect(freeManager.hasFeature('teamSync')).toBe(false);
    expect(freeManager.hasFeature('watchMode')).toBe(false);

    const proManager = new SubscriptionManager(SubscriptionPlan.PRO_MONTHLY);
    expect(proManager.hasFeature('teamSync')).toBe(true);
    expect(proManager.hasFeature('watchMode')).toBe(true);
  });

  it('should check source limit correctly', () => {
    const manager = new SubscriptionManager(SubscriptionPlan.FREE);

    expect(manager.checkSourceLimit(2).allowed).toBe(true);
    expect(manager.checkSourceLimit(3).allowed).toBe(true);
    expect(manager.checkSourceLimit(4).allowed).toBe(false);
  });

  it('should handle plan upgrade', () => {
    const manager = new SubscriptionManager(SubscriptionPlan.FREE);
    expect(manager.hasFeature('teamSync')).toBe(false);

    manager.upgrade(SubscriptionPlan.PRO_YEARLY);
    expect(manager.hasFeature('teamSync')).toBe(true);
    expect(manager.getPlan()).toBe(SubscriptionPlan.PRO_YEARLY);
  });

  it('should generate upgrade prompt', () => {
    const manager = new SubscriptionManager(SubscriptionPlan.FREE);
    const prompt = manager.getUpgradePrompt('Team Sync');

    expect(prompt).toContain('Pro feature');
    expect(prompt).toContain('$5/month');
    expect(prompt).toContain('$50/year');
  });

  it('should generate plan comparison table', () => {
    const manager = new SubscriptionManager();
    const table = manager.getPlanComparison();

    expect(table).toContain('Free');
    expect(table).toContain('Pro');
    expect(table).toContain('Team sync');
  });
});
