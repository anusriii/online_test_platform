const express = require('express');
const router = express.Router();
const { submitTest, getMyResults, getResultById } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitTest);
router.get('/my', protect, getMyResults);
router.get('/:id', protect, getResultById);

module.exports = router;