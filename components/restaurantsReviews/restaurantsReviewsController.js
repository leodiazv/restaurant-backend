// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// ===== MODELS =====

const {
  RestaurantReview,
} = require('../restaurantsReviews/restaurantReviewModel');

// ===== FUNCTIONS =====

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await RestaurantReview.findAll();

  res.status(200).json({ reviews });
});

module.exports = { getAllReviews };
