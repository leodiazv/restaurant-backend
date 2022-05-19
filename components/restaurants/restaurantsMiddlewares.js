// ===== MODELS =====

const { Restaurant } = require('./restaurantModel');
const {
  RestaurantReview,
} = require('../restaurantsReviews/restaurantReviewModel');

// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// =================

const restaurantExists = catchAsync(async (req, res, next) => {
  const { restId } = req.params;
  const restaurant = await Restaurant.findOne({
    where: { id: restId },
    include: [{ model: RestaurantReview }],
  });

  if (!restaurant) {
    return next(new AppError('Restaurant does not exist with given Id', 404));
  }

  // Add user data to the req object

  req.restaurant = restaurant;

  next();
});

module.exports = { restaurantExists };
