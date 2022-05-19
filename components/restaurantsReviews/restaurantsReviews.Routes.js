const express = require('express');
const router = express.Router();

// ===== CONTROLLERS =====

const { getAllReviews } = require('./restaurantsReviewsController');

// ===== HTTP REQUEST =====

router.get('/', getAllReviews);

module.exports = { restaurantsReviewsRouter: router };
