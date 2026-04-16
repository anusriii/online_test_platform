const express = require('express');
const router = express.Router();
const { createTest, getAllTests, getTestById, updateTest, deleteTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').get(protect, getAllTests).post(protect, admin, createTest);
router.route('/:id').get(protect, getTestById).put(protect, admin, updateTest).delete(protect, admin, deleteTest);

module.exports = router;