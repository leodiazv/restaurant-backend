// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// ===== MODELS =====

const { Meal } = require('./mealModel');
const { Restaurant } = require('../restaurants/restaurantModel');

// ===== FUNCTIONS =====

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurant } = req;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: restaurant.id,
  });

  res.status(201).json({ newMeal });
});

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: 'active' },
    include: [{ model: Restaurant }],
  });

  res.status(200).json({ meals });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  if (meal.status !== 'active') {
    return next(new AppError('Meal not active'), 400);
  }

  res.status(200).json({ meal });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  res.status(200).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'disabled' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllMeals,
  createMeal,
  getMealById,
  updateMeal,
  deleteMeal,
};
