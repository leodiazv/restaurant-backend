const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// ===== MODELS =====

const { User } = require('./userModel');
const { Order } = require('../orders/orderModel');
const { Meal } = require('../meals/mealModel');
const { Restaurant } = require('../restaurants/restaurantModel');

// ===== FUNCTIONS =====
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll();

  res.status(200).json({ users });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'available' } });

  if (!user) {
    return next(new AppError('Email or password invalid', 400));
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return next(new AppError('Email or password invalid', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_INT,
  });

  user.password = undefined;

  res.status(200).json({ user, token });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({ status: 'success' });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [{ model: Meal }],
  });

  res.status(200).json({ orders });
});

const getUserOrderDetails = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { orderId } = req.params;

  const userOrder = await Order.findOne({
    where: { userId: sessionUser.id, id: orderId },
    include: [{ model: Meal, include: { model: Restaurant } }],
  });

  if (!userOrder) {
    return next(new AppError('User order does not exist with given Id', 404));
  }

  res.status(200).json({ userOrder });
});

module.exports = {
  createUser,
  login,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserOrders,
  getUserOrderDetails,
};
