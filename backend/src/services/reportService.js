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
    async getDailyReport(userId, selectedDate, page, limit) {
        // Daily is at most 4 readings — still paginate for consistency
        const offset = (page - 1) * limit;
        const allReadings = await readingRepository.findByUserAndDate(userId, selectedDate);
        const stats = this.computeStats(allReadings);
        const totalCount = allReadings.length;
        const totalPages = Math.ceil(totalCount / limit) || 1;
        const readings = allReadings.slice(offset, offset + limit);

        return {
            type: 'Daily',
            dateRange: { start: selectedDate, end: selectedDate },
            stats,
            readings,
            pagination: { totalCount, totalPages, currentPage: page, limit },
        };
    }

    async getMonthToDateReport(userId, selectedDate, page, limit) {
        const parts = selectedDate.split('-');
        const startDate = `${parts[0]}-${parts[1]}-01`;
        const endDate = selectedDate;
        const offset = (page - 1) * limit;

        const [allReadings, totalCount] = await Promise.all([
            readingRepository.findByUserAndDateRange(userId, startDate, endDate),
            readingRepository.countByUserAndDateRange(userId, startDate, endDate),
        ]);

        const stats = this.computeStats(allReadings);
        const totalPages = Math.ceil(totalCount / limit) || 1;
        const readings = await readingRepository.findByUserAndDateRangePaginated(
            userId, startDate, endDate, limit, offset
        );

        return {
            type: 'Month-to-date',
            dateRange: { start: startDate, end: endDate },
            stats,
            readings,
            pagination: { totalCount, totalPages, currentPage: page, limit },
        };
    }

    async getMonthlyPreviousReport(userId, selectedDate, page, limit) {
        const [yearStr, monthStr] = selectedDate.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);

        let prevYear = year;
        let prevMonth = month - 1;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
        }

        const startDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(prevYear, prevMonth, 0).getDate();
        const endDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        const offset = (page - 1) * limit;

        const [allReadings, totalCount] = await Promise.all([
            readingRepository.findByUserAndDateRange(userId, startDate, endDate),
            readingRepository.countByUserAndDateRange(userId, startDate, endDate),
        ]);

        const stats = this.computeStats(allReadings);
        const totalPages = Math.ceil(totalCount / limit) || 1;
        const readings = await readingRepository.findByUserAndDateRangePaginated(
            userId, startDate, endDate, limit, offset
        );

        return {
            type: 'Monthly (Previous Month)',
            dateRange: { start: startDate, end: endDate },
            stats,
            readings,
            pagination: { totalCount, totalPages, currentPage: page, limit },
        };
    }
}

module.exports = new ReportService();