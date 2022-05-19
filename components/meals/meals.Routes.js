const express = require('express');
const router = express.Router();

// ===== MIDDLEWARES =====

const { protectToken, adminAccess } = require('../users/usersMiddlewares');
const { restaurantExists } = require('../restaurants/restaurantsMiddlewares');
const { mealExists } = require('./mealsMiddlewares');
const { createMealValidations, checkValidations } = require('./mealValidators');

// ===== CONTROLLERS =====

const {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('./mealsController');

// ===== HTTP REQUEST =====

router.get('/', getAllMeals);
router.route('/:mealId').get(mealExists, getMealById);

// ----- APPLY PROTECT TOKEN MIDDLEWARE -----

router.use(protectToken);

router.post(
  '/:restId',
  createMealValidations,
  checkValidations,
  restaurantExists,
  createMeal
);
router
  .route('/:mealId')
  .patch(adminAccess, mealExists, updateMeal)
  .delete(adminAccess, mealExists, deleteMeal);

module.exports = { mealsRouter: router };
