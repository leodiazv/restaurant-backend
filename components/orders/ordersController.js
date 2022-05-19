// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// ===== MODELS =====

const { Order } = require('./orderModel');
const { Meal } = require('../meals/mealModel');
const { Restaurant } = require('../restaurants/restaurantModel');

// ===== FUNCTIONS =====

const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll();

  res.status(200).json({ orders });
});

const createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId, restId } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({ where: { id: mealId } });

  if (!meal) {
    return next(new AppError('Meal does not exist with given Id', 404));
  }

  const orderPrice = meal.price * quantity;

  const order = await Order.create({
    mealId,
    userId: sessionUser.id,
    price: orderPrice,
    quantity,
  });

  res.status(201).json({ order });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const userOrders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [{ model: Meal, include: { model: Restaurant } }],
  });

  res.status(200).json({ userOrders });
});

const completeOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({ status: 'success' });
});

const cancelOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: 'canceled' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllOrders,
  createOrder,
  getUserOrders,
  completeOrder,
  cancelOrder,
};
