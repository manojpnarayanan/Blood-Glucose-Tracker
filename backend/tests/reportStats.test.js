const reportService = require('../src/services/reportService');

describe('Report Service Statistics', () => {
  test('Computes highest, lowest, count, and average rounded to 1 decimal', () => {
    const mockReadings = [
      { value: 110 },
      { value: 145 },
      { value: 95 },
      { value: 130 },
    ];

    const stats = reportService.computeStats(mockReadings);

    expect(stats.highest).toBe(145);
    expect(stats.lowest).toBe(95);
    expect(stats.count).toBe(4);
    expect(stats.average).toBe(120.0);
  });

  test('Correctly rounds decimal average to 1 decimal place', () => {
    const mockDecimalReadings = [
      { value: 100 },
      { value: 101 },
    ];
    const statsDecimal = reportService.computeStats(mockDecimalReadings);
    expect(statsDecimal.average).toBe(100.5);
  });

  test('Returns empty state stats when no readings are present', () => {
    const stats = reportService.computeStats([]);
    expect(stats.count).toBe(0);
    expect(stats.highest).toBeNull();
    expect(stats.lowest).toBeNull();
    expect(stats.average).toBeNull();
  });
});