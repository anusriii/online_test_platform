const express = require('express');
const router = express.Router();
const { createQuestion, getAllQuestions, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').get(protect, getAllQuestions).post(protect, admin, createQuestion);
router.route('/:id').put(protect, admin, updateQuestion).delete(protect, admin, deleteQuestion);

module.exports = router;