const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', (req, res, next) => readingController.getDailyReadings(req, res, next));
router.post('/', (req, res, next) => readingController.create(req, res, next));
router.put('/:id', (req, res, next) => readingController.update(req, res, next));
router.delete('/:id', (req, res, next) => readingController.delete(req, res, next));

module.exports = router;