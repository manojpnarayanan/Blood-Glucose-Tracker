const readingService = require('../src/services/readingService');

describe('Reading Validation Rules', () => {
  test('Rule 1: Fails when glucose value is missing', () => {
    expect(() => {
      readingService.validateGlucoseValue(null);
    }).toThrow('Please enter a glucose value.');

    expect(() => {
      readingService.validateGlucoseValue('');
    }).toThrow('Please enter a glucose value.');
  });

  test('Rule 2: Fails when value is not a whole number between 40 and 600', () => {
    expect(() => {
      readingService.validateGlucoseValue(39);
    }).toThrow('Value must be between 40 and 600 mg/dl.');

    expect(() => {
      readingService.validateGlucoseValue(601);
    }).toThrow('Value must be between 40 and 600 mg/dl.');

    expect(() => {
      readingService.validateGlucoseValue(120.5);
    }).toThrow('Value must be between 40 and 600 mg/dl.');
  });

  test('Rule 2: Accepts valid values between 40 and 600', () => {
    expect(readingService.validateGlucoseValue(100)).toBe(100);
    expect(readingService.validateGlucoseValue(40)).toBe(40);
    expect(readingService.validateGlucoseValue(600)).toBe(600);
  });

  test('Rule 5: Fails when date is in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureDateStr = tomorrow.toISOString().split('T')[0];

    expect(() => {
      readingService.validateFutureDate(futureDateStr);
    }).toThrow('Date cannot be in the future.');
  });
});