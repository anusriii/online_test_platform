const express = require('express');
const router = express.Router();
const { getAllUsers, getAllResults } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/users', protect, admin, getAllUsers);
router.get('/results', protect, admin, getAllResults);

module.exports = router;