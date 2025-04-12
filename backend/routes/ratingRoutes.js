const express = require('express');
const { submitRating } = require('../controllers/ratingController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ratings/submit', isAuthenticated, submitRating);

module.exports = router;
