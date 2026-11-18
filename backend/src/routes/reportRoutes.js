const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/daily', (req, res, next) => reportController.getDaily(req, res, next));
router.get('/month-to-date', (req, res, next) => reportController.getMonthToDate(req, res, next));
router.get('/monthly', (req, res, next) => reportController.getMonthlyPrevious(req, res, next));

module.exports = router;