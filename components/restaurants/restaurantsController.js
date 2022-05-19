const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// ===== MODELS =====

const { Restaurant } = require('./restaurantModel');
const {
  RestaurantReview,
} = require('../restaurantsReviews/restaurantReviewModel');

// ===== FUNCTIONS =====

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  newRestaurant = await Restaurant.create({ name, address, rating });

  res.status(201).json({ newRestaurant });
});

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    include: [{ model: RestaurantReview }],
  });

  res.status(200).json({ restaurants });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({ restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({ name, address });

  res.status(200).json({ status: 'success' });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'disabled' });

  res.status(200).json({ status: 'success' });
});

const createRestReview = catchAsync(async (req, res, next) => {
  const { restaurant, sessionUser } = req;
  const { comment, rating } = req.body;

  const review = await RestaurantReview.create({
    userId: sessionUser.id,
    restaurantId: restaurant.id,
    comment,
    rating,
  });

  res.status(201).json({ review });
});

const updateRestReview = catchAsync(async (req, res, next) => {
  const { comment, rating, reviewId } = req.body;

  const { sessionUser } = req;

  const review = await RestaurantReview.findOne({ where: { id: reviewId } });
  if (sessionUser.id !== review.userId) {
    return next(new AppError('You do not own this review', 404));
  }

  await review.update({ comment, rating });

  res.status(200).json({ review });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.body;

  const { sessionUser } = req;

  const review = await RestaurantReview.findOne({ where: { id: reviewId } });
  if (sessionUser.id !== review.userId) {
    return next(new AppError('You do not own this review', 404));
  }

  await review.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createRestReview,
  updateRestReview,
  deleteReview,
};
