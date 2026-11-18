const reportService = require('../services/reportService');

class ReportController {
  async getDaily(req, res, next) {
    try {
      const { date } = req.query;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const report = await reportService.getDailyReport(req.user.id, targetDate);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getMonthToDate(req, res, next) {
    try {
      const { date } = req.query;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const report = await reportService.getMonthToDateReport(req.user.id, targetDate);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyPrevious(req, res, next) {
    try {
      const { date } = req.query;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const report = await reportService.getMonthlyPreviousReport(req.user.id, targetDate);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();