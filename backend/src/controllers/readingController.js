const readingService = require('../services/readingService');

class ReadingController {
  async getDailyReadings(req, res, next) {
    try {
      const { date } = req.query;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const readings = await readingService.getDailyReadings(req.user.id, targetDate);
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