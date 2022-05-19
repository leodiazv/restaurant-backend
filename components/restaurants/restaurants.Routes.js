const express = require('express');
const router = express.Router();

// ===== MIDDLEWARES =====

const {
  protectToken,
  adminAccess,
  userExists,
} = require('../users/usersMiddlewares');
const { restaurantExists } = require('./restaurantsMiddlewares');
const {
  createRestaurantValidations,
  checkValidations,
} = require('./restaurantsValidators');

// ===== CONTROLLERS =====

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createRestReview,
  updateRestReview,
  deleteReview,
} = require('./restaurantsController');

// ===== HTTP REQUEST =====

router.get('/', getAllRestaurants);
router.get('/:restId', restaurantExists, getRestaurantById);

// ----- APPLY PROTECT TOKEN MIDDLEWARE -----

router.use(protectToken);

router.post(
  '/',
  createRestaurantValidations,
  checkValidations,
  createRestaurant
);
router
  .route('/:restId')
  .patch(adminAccess, restaurantExists, updateRestaurant)
  .delete(adminAccess, restaurantExists, deleteRestaurant);
router
  .route('/reviews/:restId')
  .post(restaurantExists, createRestReview)
  .patch(restaurantExists, updateRestReview)
  .delete(restaurantExists, deleteReview);

module.exports = { restaurantsRouter: router };
