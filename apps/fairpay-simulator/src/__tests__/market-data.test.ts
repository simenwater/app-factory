import { getMarketSalary, matchRole, AVAILABLE_ROLES } from '@/lib/market-data';

describe('matchRole', () => {
  it('should match engineer variants', () => {
    expect(matchRole('Software Engineer')).toBe('Software Engineer');
    expect(matchRole('Frontend Developer')).toBe('Software Engineer');
    expect(matchRole('Junior Programmer')).toBe('Software Engineer');
  });

  it('should match product manager', () => {
    expect(matchRole('Product Manager')).toBe('Product Manager');
    expect(matchRole('Senior Product Manager')).toBe('Product Manager');
  });

  it('should match designer', () => {
    expect(matchRole('UX Designer')).toBe('Designer');
    expect(matchRole('Graphic Design Lead')).toBe('Designer');
  });

  it('should match sales', () => {
    expect(matchRole('Sales Representative')).toBe('Sales Representative');
    expect(matchRole('Inside Sales')).toBe('Sales Representative');
  });

  it('should fall back to General for unknown titles', () => {
    expect(matchRole('Chief Happiness Officer')).toBe('General');
    expect(matchRole('Janitor')).toBe('General');
  });
});

describe('getMarketSalary', () => {
  it('should return all four percentiles', () => {
    const data = getMarketSalary('Software Engineer', 'mid', 'technology', 'us_west');
    expect(data.p25).toBeGreaterThan(0);
    expect(data.p50).toBeGreaterThan(data.p25);
    expect(data.p75).toBeGreaterThan(data.p50);
    expect(data.p90).toBeGreaterThan(data.p75);
  });

  it('should adjust for region', () => {
    const west = getMarketSalary('Software Engineer', 'mid', 'technology', 'us_west');
    const east_europe = getMarketSalary('Software Engineer', 'mid', 'technology', 'europe_east');
    expect(west.p50).toBeGreaterThan(east_europe.p50);
  });

  it('should adjust for industry', () => {
    const tech = getMarketSalary('Software Engineer', 'mid', 'technology', 'us_west');
    const retail = getMarketSalary('Software Engineer', 'mid', 'retail', 'us_west');
    expect(tech.p50).toBeGreaterThan(retail.p50);
  });

  it('should handle all available roles', () => {
    for (const role of AVAILABLE_ROLES) {
      const data = getMarketSalary(role, 'mid', 'technology', 'us_west');
      expect(data.p50).toBeGreaterThan(0);
    }
  });
});
