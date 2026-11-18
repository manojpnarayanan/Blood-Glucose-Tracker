const readingRepository = require('../repositories/readingRepository');

class ReportService {
  computeStats(readings) {
    if (!readings || readings.length === 0) {
      return {
        highest: null,
        lowest: null,
        average: null,
        count: 0,
      };
    }

    const values = readings.map((r) => r.value);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    // Rounded to 1 decimal place
    const average = Number((sum / values.length).toFixed(1));

    return {
      highest,
      lowest,
      average,
      count: readings.length,
    };
  }

  formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getDailyReport(userId, selectedDate) {
    const readings = await readingRepository.findByUserAndDate(userId, selectedDate);
    const stats = this.computeStats(readings);

    return {
      type: 'Daily',
      dateRange: { start: selectedDate, end: selectedDate },
      stats,
      readings,
    };
  }

  async getMonthToDateReport(userId, selectedDate) {
    const parts = selectedDate.split('-');
    const startDate = `${parts[0]}-${parts[1]}-01`;
    const endDate = selectedDate;

    const readings = await readingRepository.findByUserAndDateRange(userId, startDate, endDate);
    const stats = this.computeStats(readings);

    return {
      type: 'Month-to-date',
      dateRange: { start: startDate, end: endDate },
      stats,
      readings,
    };
  }

  async getMonthlyPreviousReport(userId, selectedDate) {
    const [yearStr, monthStr] = selectedDate.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-12

    // Calculate previous month and year
    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }

    const startDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
    // Day 0 of the current month gives the last day of the previous month
    const lastDay = new Date(prevYear, prevMonth, 0).getDate();
    const endDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const readings = await readingRepository.findByUserAndDateRange(userId, startDate, endDate);
    const stats = this.computeStats(readings);

    return {
      type: 'Monthly (Previous Month)',
      dateRange: { start: startDate, end: endDate },
      stats,
      readings,
    };
  }
}

module.exports = new ReportService();