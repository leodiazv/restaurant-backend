const express = require('express');
const router = express.Router();

// ===== MIDDLEWARES =====

const { protectToken } = require('../users/usersMiddlewares');
const { orderExists } = require('./ordersMiddlewares');

// ===== CONTROLLERS =====

const {
  getAllOrders,
  createOrder,
  getUserOrders,
  completeOrder,
  cancelOrder,
} = require('./ordersController');

// ===== HTTP REQUEST =====

// ----- APPLY PROTECT TOKEN MIDDLEWARE -----

router.use(protectToken);

router.get('/', getAllOrders);

router.post('/', createOrder);
router.get('/me', getUserOrders);
router
  .route('/:orderId')
  .patch(orderExists, completeOrder)
  .delete(orderExists, cancelOrder);

module.exports = { ordersRouter: router };
