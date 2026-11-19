const readingService = require('../services/readingService');

class ReadingController {
    async getDailyReadings(req, res, next) {
        try {
            const { date, page, limit } = req.query;
            const targetDate = date || new Date().toISOString().split('T')[0];

            let readings = await readingService.getDailyReadings(req.user.id, targetDate);

            if (page || limit) {
                const pageNum = parseInt(page, 10) || 1;
                const pageLimit = parseInt(limit, 10) || 10;
                const totalCount = readings.length;
                const totalPages = Math.ceil(totalCount / pageLimit) || 1;
                const paginated = readings.slice((pageNum - 1) * pageLimit, pageNum * pageLimit);

                return res.status(200).json({
                    date: targetDate,
                    readings: paginated,
                    pagination: { totalCount, totalPages, currentPage: pageNum, limit: pageLimit }
                });
            }

            res.status(200).json({ date: targetDate, readings });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { date, slot, value } = req.body;
            const reading = await readingService.createReading(req.user.id, { date, slot, value });
            res.status(201).json(reading);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { date, slot, value } = req.body;
            const reading = await readingService.updateReading(id, req.user.id, { date, slot, value });
            res.status(200).json(reading);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await readingService.deleteReading(id, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReadingController();